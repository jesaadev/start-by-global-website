import { supabaseAdmin } from "@/lib/supabase"
import type { PostLocale } from "@/lib/blog-posts"

// Generación de la imagen destacada de cada artículo con Gemini (modelo de
// imagen, "Nano Banana") y almacenamiento en Supabase Storage. Reutiliza la
// GEMINI_API_KEY ya configurada; Claude/Anthropic no genera imágenes, así que
// esta capacidad depende específicamente de Gemini.

const GEMINI_IMAGE_MODEL = process.env.GEMINI_IMAGE_MODEL || "gemini-2.5-flash-image"
const BUCKET = "blog-images"

/** La generación de imágenes requiere Gemini (Claude no produce imágenes). */
export function imageProviderConfigured(): boolean {
  return Boolean(process.env.GEMINI_API_KEY)
}

// Pistas visuales por categoría para dirigir la composición sin texto.
const CATEGORY_MOTIF: Record<string, string> = {
  "Desarrollo Web":
    "responsive website mockups, browser windows, clean code, layout grids and modern devices",
  "Marketing Digital":
    "rising performance charts, conversion funnels, search and social engagement, analytics dashboards",
  "Tendencias Tech":
    "abstract AI and automation motifs, connected nodes, futuristic yet clean tech shapes",
}

/** Construye un prompt visual editorial (sin texto) a partir de los metadatos. */
export function buildImagePrompt(opts: {
  title: string
  category: string
  keywords?: string[]
  locale?: PostLocale
}): string {
  const motif = CATEGORY_MOTIF[opts.category] ?? "modern business and technology motifs"
  const kws = (opts.keywords ?? []).filter(Boolean).slice(0, 4).join(", ")
  return [
    `A modern, professional editorial hero image for a blog article titled "${opts.title}"`,
    `about ${opts.category} for a digital marketing and web development agency.`,
    `Visual concept: ${motif}${kws ? ` (theme: ${kws})` : ""}.`,
    "Style: clean, minimal, contemporary flat/3D illustration with soft gradients and depth,",
    "warm accent palette of orange and coral over a light neutral background.",
    "Wide 16:9 landscape composition with generous negative space.",
    "Absolutely no text, no words, no letters, no numbers, no logos and no watermarks.",
    "High quality, crisp, suitable as a website article cover image.",
  ].join(" ")
}

interface GeneratedImage {
  buffer: Buffer
  mimeType: string
}

/** Llama al modelo de imagen de Gemini y devuelve los bytes de la imagen. */
async function generateImageBytes(prompt: string): Promise<GeneratedImage> {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) throw new Error("GEMINI_API_KEY no está configurada: no se puede generar la imagen.")
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_IMAGE_MODEL}:generateContent?key=${apiKey}`

  const call = (): Promise<Response> =>
    fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: { responseModalities: ["TEXT", "IMAGE"] },
      }),
    }).catch((err) => new Response(err instanceof Error ? err.message : "Network Error", { status: 500 }))

  // Reintento único ante errores transitorios (429/5xx).
  let res = await call()
  if (res.status === 429 || res.status >= 500) {
    await new Promise((r) => setTimeout(r, 1000))
    res = await call()
  }
  if (!res.ok) {
    const body = await res.text().catch(() => "")
    console.error("[AI-Image] Gemini error", res.status, body.slice(0, 500))
    throw new Error(`Gemini image ${res.status}: ${body.slice(0, 200)}`)
  }

  const data = (await res.json().catch(() => ({}))) as {
    candidates?: Array<{
      content?: {
        parts?: Array<{
          inlineData?: { mimeType?: string; data?: string }
          inline_data?: { mime_type?: string; data?: string }
        }>
      }
      finishReason?: string
    }>
    promptFeedback?: { blockReason?: string }
  }

  const parts = data?.candidates?.[0]?.content?.parts ?? []
  for (const p of parts) {
    const inline = p.inlineData ?? p.inline_data
    const b64 = inline?.data
    if (b64) {
      const mimeType =
        (p.inlineData?.mimeType ?? p.inline_data?.mime_type ?? "image/png") || "image/png"
      return { buffer: Buffer.from(b64, "base64"), mimeType }
    }
  }
  const reason =
    data?.candidates?.[0]?.finishReason || data?.promptFeedback?.blockReason || "desconocido"
  console.error("[AI-Image] Gemini sin imagen, motivo:", reason)
  throw new Error(`Gemini no devolvió una imagen (motivo: ${reason}).`)
}

/** Crea el bucket público la primera vez; ignora el error si ya existe. */
async function ensureBucket(): Promise<void> {
  const { data } = await supabaseAdmin.storage.getBucket(BUCKET)
  if (data) return
  const { error } = await supabaseAdmin.storage.createBucket(BUCKET, {
    public: true,
    fileSizeLimit: "5MB",
    allowedMimeTypes: ["image/png", "image/jpeg", "image/webp"],
  })
  // Otra invocación concurrente pudo crearlo entre el get y el create.
  if (error && !/exists/i.test(error.message)) {
    throw new Error(`No se pudo preparar el almacenamiento: ${error.message}`)
  }
}

function extFor(mimeType: string): string {
  if (mimeType.includes("jpeg") || mimeType.includes("jpg")) return "jpg"
  if (mimeType.includes("webp")) return "webp"
  return "png"
}

/** Sube la imagen y devuelve su URL pública (versionada por timestamp). */
async function uploadImage(slug: string, img: GeneratedImage): Promise<string> {
  await ensureBucket()
  const path = `${slug || "articulo"}/${Date.now().toString(36)}.${extFor(img.mimeType)}`
  const { error } = await supabaseAdmin.storage
    .from(BUCKET)
    .upload(path, img.buffer, { contentType: img.mimeType, upsert: true })
  if (error) throw new Error(`No se pudo subir la imagen: ${error.message}`)
  const { data } = supabaseAdmin.storage.from(BUCKET).getPublicUrl(path)
  if (!data?.publicUrl) throw new Error("No se pudo obtener la URL pública de la imagen.")
  return data.publicUrl
}

/**
 * Genera la imagen destacada de un artículo y la almacena en Supabase Storage.
 * Devuelve la URL pública. Lanza si Gemini no está configurado o falla.
 */
export async function generateArticleImage(opts: {
  slug: string
  title: string
  category: string
  keywords?: string[]
  locale?: PostLocale
}): Promise<string> {
  const prompt = buildImagePrompt(opts)
  const img = await generateImageBytes(prompt)
  return uploadImage(opts.slug, img)
}
