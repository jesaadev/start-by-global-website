import type { MetadataRoute } from "next"
import { getSiteSettings, safeBaseUrl } from "@/lib/site-settings"

export const revalidate = 300

export default async function robots(): Promise<MetadataRoute.Robots> {
  const { seo } = await getSiteSettings()
  const base = safeBaseUrl(seo.canonicalBase)

  // Si el sitio está marcado como no indexable, se bloquea todo.
  if (!seo.indexable) {
    return { rules: { userAgent: "*", disallow: "/" } }
  }

  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/admin", "/api/"] },
    sitemap: `${base}/sitemap.xml`,
    host: base,
  }
}
