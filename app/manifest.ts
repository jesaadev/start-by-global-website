import type { MetadataRoute } from "next"
import { getSiteSettings } from "@/lib/site-settings"

export const revalidate = 300

export default async function manifest(): Promise<MetadataRoute.Manifest> {
  const { seo } = await getSiteSettings()

  return {
    name: seo.siteName,
    short_name: "SBG",
    description: seo.description,
    start_url: "/",
    display: "standalone",
    background_color: "#0d1117",
    theme_color: "#0d1117",
    icons: [
      { src: "/logo-black.svg", sizes: "any", type: "image/svg+xml" },
    ],
  }
}
