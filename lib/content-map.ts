import { listPosts } from "@/lib/blog-posts"

// Mapa de contenido publicado: la base para el enlazado interno y para evitar
// canibalización (que dos artículos compitan por la misma keyword principal).

export interface ContentMapEntry {
  slug: string
  title: string
  category: string
  primary_keyword: string | null
  keywords: string[]
}

export async function buildContentMap(excludeSlug?: string): Promise<ContentMapEntry[]> {
  const rows = await listPosts({ status: "published" })
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
export function contentMapToPrompt(entries: ContentMapEntry[]): string {
  if (!entries.length) return "(no hay otros artículos publicados todavía)"
  return entries
    .map((e) => `- /insights/${e.slug} — "${e.title}" [${e.category}] kw principal: ${e.primary_keyword ?? "—"}`)
    .join("\n")
}
