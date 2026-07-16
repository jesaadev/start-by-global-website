// Host de Supabase Storage (imágenes destacadas generadas con IA), derivado de
// la URL pública del proyecto para no hardcodear el ref.
let supabaseHost
try {
  if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
    supabaseHost = new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).hostname
  }
} catch {
  supabaseHost = undefined
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Optimización activada (AVIF/WebP, srcset responsive y lazy-load).
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "stage.startbyglobal.com" },
      { protocol: "https", hostname: "startbyglobal.com" },
      ...(supabaseHost
        ? [{ protocol: "https", hostname: supabaseHost, pathname: "/storage/v1/object/public/**" }]
        : []),
    ],
  },
}

export default nextConfig
