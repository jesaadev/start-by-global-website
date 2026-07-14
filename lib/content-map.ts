import { listPosts, type PostLocale } from "@/lib/blog-posts"

// Mapa de contenido publicado (por idioma): la base para el enlazado interno y
// para evitar canibalización (que dos artículos compitan por la misma keyword).

export interface ContentMapEntry {
  slug: string
  title: string
  category: string
  primary_keyword: string | null
  keywords: string[]
}

export async function buildContentMap(excludeSlug?: string, locale: PostLocale = "es"): Promise<ContentMapEntry[]> {
  const rows = await listPosts({ status: "published", locale })
  return rows
    .filter((r) => r.slug !== excludeSlug)
    .map((r) => ({
      slug: r.slug,
      title: r.title,
      category: r.category,
      primary_keyword: r.primary_keyword,
      keywords: r.keywords ?? [],
    }))
}

/** Texto compacto del mapa para incluirlo en el prompt del LLM. */
export function contentMapToPrompt(entries: ContentMapEntry[], locale: PostLocale = "es"): string {
  const base = locale === "en" ? "/us/insights" : "/insights"
  if (!entries.length) {
    return locale === "en"
      ? "(no other published articles yet)"
      : "(no hay otros artículos publicados todavía)"
  }
  return entries
    .map((e) => `- ${base}/${e.slug} — "${e.title}" [${e.category}] primary kw: ${e.primary_keyword ?? "—"}`)
    .join("\n")
}
