/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    // Optimización activada (AVIF/WebP, srcset responsive y lazy-load).
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "stage.startbyglobal.com" },
      { protocol: "https", hostname: "startbyglobal.com" },
    ],
  },
}

export default nextConfig
