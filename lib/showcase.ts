import { randomUUID } from "node:crypto"
import { supabaseAdmin } from "@/lib/supabase"
import { ensurePublicBucket, imageExt, IMAGE_MIME_TYPES } from "@/lib/storage"

// Showcase: trabajo real (webs de clientes y creativos de anuncios) que se
// muestra en los mockups del sitio. Regla de dato real: solo se publica con la
// autorización del cliente (la BD lo fuerza con un CHECK; aquí también).

export const SHOWCASE_BUCKET = "showcase"
export const SHOWCASE_MAX_BYTES = 8 * 1024 * 1024 // 8 MB

export type ShowcaseKind = "web" | "ad"

export interface ShowcaseItem {
  id: string
  kind: ShowcaseKind
  title: string
  client_name: string | null
  domain: string | null
  persona: string | null
  desktop_image: string | null
  mobile_image: string | null
  authorized: boolean
  published: boolean
  sort_order: number
  created_at: string
  updated_at: string
}

/** Prefijo público de nuestro bucket: únicas imágenes válidas para next/image. */
function bucketPublicPrefix(): string {
  const base = (process.env.NEXT_PUBLIC_SUPABASE_URL ?? "").replace(/\/$/, "")
  return `${base}/storage/v1/object/public/${SHOWCASE_BUCKET}/`
}

function cleanImage(v: unknown): string | null | undefined {
  if (v === undefined) return undefined
  if (v === null || v === "") return null
  if (typeof v !== "string") return undefined
  const url = v.trim()
  // Solo URLs de nuestro Storage o rutas locales (/public): una URL externa
  // rompería next/image en la página pública.
  return url.startsWith(bucketPublicPrefix()) || url.startsWith("/") ? url : undefined
}

/** "https://www.cliente.com/inicio" → "www.cliente.com" (lo que va en la barra). */
function normalizeDomain(raw: string): string {
  const s = raw.trim()
  try {
    return new URL(/^https?:\/\//i.test(s) ? s : `https://${s}`).host.slice(0, 80)
  } catch {
    return s.replace(/^https?:\/\//i, "").replace(/\/.*$/, "").slice(0, 80)
  }
}

const str = (v: unknown, max: number) =>
  v === undefined ? undefined : v === null ? null : typeof v === "string" ? v.trim().slice(0, max) || null : undefined

/** Allowlist + saneo de los campos editables desde el admin. */
export function pickShowcaseFields(obj: Record<string, unknown>): Partial<ShowcaseItem> {
  const out: Partial<ShowcaseItem> = {}
  if (obj.kind === "web" || obj.kind === "ad") out.kind = obj.kind
  const title = str(obj.title, 120)
  if (title) out.title = title
  for (const k of ["client_name", "domain", "persona"] as const) {
    const v = str(obj[k], k === "domain" ? 200 : 120)
    if (v !== undefined) out[k] = k === "domain" && v ? normalizeDomain(v) : v
  }
  for (const k of ["desktop_image", "mobile_image"] as const) {
    const v = cleanImage(obj[k])
    if (v !== undefined) out[k] = v
  }
  if (typeof obj.authorized === "boolean") out.authorized = obj.authorized
  if (typeof obj.published === "boolean") out.published = obj.published
  if (obj.sort_order !== undefined && Number.isFinite(Number(obj.sort_order))) {
    out.sort_order = Math.trunc(Number(obj.sort_order))
  }
  // Sin autorización no se publica.
  if (out.authorized === false) out.published = false
  return out
}

/** Público: solo lo autorizado, publicado y con imagen principal. */
export async function listPublishedShowcase(kind: ShowcaseKind = "web", limit = 8): Promise<ShowcaseItem[]> {
  try {
    const { data, error } = await supabaseAdmin
      .from("showcase_items")
      .select("*")
      .eq("kind", kind)
      .eq("published", true)
      .eq("authorized", true)
      .not("desktop_image", "is", null)
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false })
      .limit(limit)
    if (error) throw error
    return (data ?? []) as ShowcaseItem[]
  } catch (e) {
    console.error("[Showcase] listPublished error:", e instanceof Error ? e.message : e)
    return []
  }
}

/** Admin: todo, en el orden de visualización. */
export async function listShowcase(): Promise<ShowcaseItem[]> {
  const { data, error } = await supabaseAdmin
    .from("showcase_items")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false })
  if (error) throw error
  return (data ?? []) as ShowcaseItem[]
}

export async function createShowcaseItem(fields: Partial<ShowcaseItem>): Promise<ShowcaseItem> {
  if (!fields.title) throw new Error("El título es obligatorio.")
  const { data, error } = await supabaseAdmin.from("showcase_items").insert(fields).select().single()
  if (error) throw error
  return data as ShowcaseItem
}

export async function updateShowcaseItem(id: string, fields: Partial<ShowcaseItem>): Promise<ShowcaseItem> {
  // Publicar exige autorización: se valida contra el estado resultante.
  if (fields.published === true && fields.authorized === undefined) {
    const { data } = await supabaseAdmin.from("showcase_items").select("authorized").eq("id", id).single()
    if (!data?.authorized) throw new Error("No se puede publicar sin la autorización del cliente.")
  }
  const { data, error } = await supabaseAdmin
    .from("showcase_items")
    .update({ ...fields, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single()
  if (error) throw error
  return data as ShowcaseItem
}

/** Borra el item y, best-effort, sus imágenes del bucket. */
export async function deleteShowcaseItem(id: string): Promise<void> {
  const { data } = await supabaseAdmin
    .from("showcase_items")
    .select("desktop_image, mobile_image")
    .eq("id", id)
    .single()
  const { error } = await supabaseAdmin.from("showcase_items").delete().eq("id", id)
  if (error) throw error
  const prefix = bucketPublicPrefix()
  const paths = [data?.desktop_image, data?.mobile_image]
    .filter((u): u is string => typeof u === "string" && u.startsWith(prefix))
    .map((u) => u.slice(prefix.length))
  if (paths.length) {
    await supabaseAdmin.storage.from(SHOWCASE_BUCKET).remove(paths).catch(() => {})
  }
}

/**
 * URL firmada para que el navegador suba la imagen DIRECTO a Storage (PUT),
 * sin pasar por nuestra función: evita el límite de 4.5 MB del body en Vercel
 * y no expone claves. Devuelve también la URL pública final.
 */
export async function createShowcaseUploadUrl(contentType: string, size: number) {
  if (!(IMAGE_MIME_TYPES as readonly string[]).includes(contentType)) {
    throw new Error("Formato no permitido (usa PNG, JPG o WebP).")
  }
  if (!Number.isFinite(size) || size <= 0 || size > SHOWCASE_MAX_BYTES) {
    throw new Error("La imagen supera el máximo de 8 MB.")
  }
  await ensurePublicBucket(SHOWCASE_BUCKET, { fileSizeLimit: "8MB" })
  const month = new Date().toISOString().slice(0, 7)
  const path = `${month}/${randomUUID()}.${imageExt(contentType)}`
  const { data, error } = await supabaseAdmin.storage.from(SHOWCASE_BUCKET).createSignedUploadUrl(path)
  if (error || !data) throw new Error(`No se pudo preparar la subida: ${error?.message ?? "sin datos"}`)
  const { data: pub } = supabaseAdmin.storage.from(SHOWCASE_BUCKET).getPublicUrl(path)
  return { signedUrl: data.signedUrl, path, publicUrl: pub.publicUrl }
}
