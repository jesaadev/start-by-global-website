import type { MetadataRoute } from "next"
import { getSiteSettings, safeBaseUrl } from "@/lib/site-settings"
import { getAllPublished } from "@/lib/blog-posts"
import { HREFLANG_PAIRS } from "@/lib/seo"
import { PERSONA_LANDINGS } from "@/lib/persona-landings"

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

// Embudo US en inglés (mismo dominio, subruta /us).
const US_ROUTES: Array<{ path: string; priority: number; changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"] }> = [
  { path: "/us", priority: 0.9, changeFrequency: "weekly" },
  { path: "/us/website-design", priority: 0.9, changeFrequency: "monthly" },
  { path: "/us/google-ads", priority: 0.9, changeFrequency: "monthly" },
  { path: "/us/insights", priority: 0.7, changeFrequency: "weekly" },
  { path: "/us/contact", priority: 0.6, changeFrequency: "yearly" },
]

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { seo } = await getSiteSettings()
  const base = safeBaseUrl(seo.canonicalBase)
  const now = new Date()

  // hreflang en el sitemap para los pares traducidos ES↔EN.
  const langsFor = (path: string) => {
    const esPath = Object.keys(HREFLANG_PAIRS).find(
      (es) => es === path || HREFLANG_PAIRS[es] === path
    )
    if (!esPath) return undefined
    return {
      languages: {
        es: `${base}${esPath}`,
        "en-US": `${base}${HREFLANG_PAIRS[esPath]}`,
      },
    }
  }

  // Landings por buyer persona (indexables, tráfico pago + orgánico).
  const landingRoutes = Object.values(PERSONA_LANDINGS).map((l) => ({
    path: `/${l.slug}`,
    priority: 0.85,
    changeFrequency: "monthly" as MetadataRoute.Sitemap[number]["changeFrequency"],
  }))

  const staticEntries: MetadataRoute.Sitemap = [...STATIC_ROUTES, ...US_ROUTES, ...landingRoutes].map((r) => ({
    url: `${base}${r.path || "/"}` ,
    lastModified: now,
    changeFrequency: r.changeFrequency,
    priority: r.priority,
    ...(langsFor(r.path || "/") ? { alternates: langsFor(r.path || "/") } : {}),
  }))

  const [postsEs, postsEn] = await Promise.all([getAllPublished("es"), getAllPublished("en")])
  const blogEntries: MetadataRoute.Sitemap = [
    ...postsEs.map((post) => ({ post, base: "/insights" })),
    ...postsEn.map((post) => ({ post, base: "/us/insights" })),
  ].map(({ post, base: pathBase }) => {
    const lastIso = post.lastModifiedISO || post.dateISO
    return {
      url: `${base}${pathBase}/${post.slug}`,
      lastModified: lastIso ? new Date(lastIso) : now,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    }
  })

  return [...staticEntries, ...blogEntries]
}
