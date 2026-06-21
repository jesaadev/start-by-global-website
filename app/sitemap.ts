import type { MetadataRoute } from "next"
import { getSiteSettings, safeBaseUrl } from "@/lib/site-settings"
import { blogPostsData } from "@/app/insights/[slug]/blog-data"

export const revalidate = 300

// Rutas estáticas públicas del sitio (sin /admin ni /api).
const STATIC_ROUTES: Array<{ path: string; priority: number; changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"] }> = [
  { path: "", priority: 1, changeFrequency: "weekly" },
  { path: "/diseno-paginas-web", priority: 0.95, changeFrequency: "monthly" },
  { path: "/publicidad-ads", priority: 0.95, changeFrequency: "monthly" },
  { path: "/servicios", priority: 0.9, changeFrequency: "monthly" },
  { path: "/ia-automatizacion", priority: 0.9, changeFrequency: "monthly" },
  { path: "/outsourcing", priority: 0.8, changeFrequency: "monthly" },
  { path: "/portafolio", priority: 0.8, changeFrequency: "monthly" },
  { path: "/nosotros", priority: 0.7, changeFrequency: "monthly" },
  { path: "/insights", priority: 0.7, changeFrequency: "weekly" },
  { path: "/contacto", priority: 0.6, changeFrequency: "yearly" },
  { path: "/privacidad", priority: 0.2, changeFrequency: "yearly" },
  { path: "/cookies", priority: 0.2, changeFrequency: "yearly" },
  { path: "/aviso-legal", priority: 0.2, changeFrequency: "yearly" },
]

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { seo } = await getSiteSettings()
  const base = safeBaseUrl(seo.canonicalBase)
  const now = new Date()

  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map((r) => ({
    url: `${base}${r.path}`,
    lastModified: now,
    changeFrequency: r.changeFrequency,
    priority: r.priority,
  }))

  const blogEntries: MetadataRoute.Sitemap = Object.entries(blogPostsData).map(([slug, post]) => ({
    url: `${base}/insights/${slug}`,
    lastModified: post.dateISO ? new Date(post.dateISO) : now,
    changeFrequency: "monthly",
    priority: 0.6,
  }))

  return [...staticEntries, ...blogEntries]
}
