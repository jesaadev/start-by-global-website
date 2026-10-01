import { supabaseAdmin } from "@/lib/supabase"

export const IMAGE_MIME_TYPES = ["image/png", "image/jpeg", "image/webp"] as const

/**
 * Crea un bucket público de Supabase Storage la primera vez que se usa y lo deja
 * listo. Ignora la carrera en la que otra invocación lo creó entre el get y el
 * create. Si ya existe, no toca su configuración.
 */
export async function ensurePublicBucket(
  name: string,
  opts: { fileSizeLimit?: string; allowedMimeTypes?: readonly string[] } = {}
): Promise<void> {
  const { data } = await supabaseAdmin.storage.getBucket(name)
  if (data) return
  const { error } = await supabaseAdmin.storage.createBucket(name, {
    public: true,
    fileSizeLimit: opts.fileSizeLimit ?? "5MB",
    allowedMimeTypes: [...(opts.allowedMimeTypes ?? IMAGE_MIME_TYPES)],
  })
  if (error && !/exists/i.test(error.message)) {
    throw new Error(`No se pudo preparar el almacenamiento: ${error.message}`)
  }
}

/** Extensión de archivo para un mime de imagen soportado. */
export function imageExt(mimeType: string): string {
  if (mimeType.includes("jpeg") || mimeType.includes("jpg")) return "jpg"
  if (mimeType.includes("webp")) return "webp"
  return "png"
}
