import { supabaseAdmin } from "@/lib/supabase"
import { blogPostsData } from "@/app/insights/[slug]/blog-data"

// Capa de acceso a blog_posts (fuente de verdad de los artículos en BD).
// Las páginas públicas usan las funciones `*Published*`; el admin usa el resto.
//
// Fallback de transición: mientras la tabla no se haya sembrado (0 publicados),
// las lecturas públicas caen al archivo TS (blogPostsData) para que el blog
// nunca quede vacío. En cuanto hay ≥1 publicado, la BD manda en exclusiva.

export type PostStatus = "draft" | "published" | "archived"
export type PostOrigin = "manual" | "ai_generated" | "ai_improved"

/** Fila tal cual en la tabla (snake_case). */
export interface BlogPostRow {
  id: string
  slug: string
  title: string
  excerpt: string
  author: string
  author_role: string
  category: string
  image: string
  read_time: string
  date_iso: string | null
  last_modified_iso: string | null
  keywords: string[]
  primary_keyword: string | null
  content: string
  status: PostStatus
  origin: PostOrigin
  improves_post_id: string | null
  created_at: string
  updated_at: string
  published_at: string | null
}

/** Modelo que consumen las páginas (compatible con el antiguo BlogPost). */
export interface BlogPostView {
  slug: string
  title: string
  excerpt: string
  author: string
  authorRole: string
  date: string // legible en español, derivado de dateISO
  dateISO: string
  lastModifiedISO: string
  readTime: string
  category: string
  image: string
  keywords: string[]
  content: string
}

/** Tarjeta ligera para "artículos relacionados". */
export interface RelatedPost {
  slug: string
  title: string
  category: string
  readTime: string
}

const MESES = [
  "enero", "febrero", "marzo", "abril", "mayo", "junio",
  "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre",
]

export function longDateEs(iso: string | null | undefined): string {
  if (!iso) return ""
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ""
  return `${d.getUTCDate()} de ${MESES[d.getUTCMonth()]} de ${d.getUTCFullYear()}`
}

/** Mapea una entrada del archivo TS al modelo de vista (fallback). */
function viewFromTs(slug: string, p: (typeof blogPostsData)[string]): BlogPostView {
  return {
    slug,
    title: p.title,
    excerpt: p.excerpt,
    author: p.author,
    authorRole: p.authorRole,
    date: p.date || longDateEs(p.dateISO),
    dateISO: p.dateISO,
    lastModifiedISO: p.dateISO,
    readTime: p.readTime,
    category: p.category,
    image: p.image,
    keywords: p.keywords ?? [],
    content: p.content,
  }
}

// Una vez que la tabla tiene ≥1 publicado, ese estado no vuelve a false en la
// vida de la instancia: cacheamos el "true" para ahorrar viajes a la BD en 404s.
let hasPublishedCache = false

/** ¿La tabla ya tiene artículos publicados? (decide si usar BD o fallback TS). */
async function tableHasPublished(): Promise<boolean> {
  if (hasPublishedCache) return true
  const { count, error } = await supabaseAdmin
    .from("blog_posts")
    .select("id", { count: "exact", head: true })
    .eq("status", "published")
  if (error) return false
  const hasAny = (count ?? 0) > 0
  if (hasAny) hasPublishedCache = true
  return hasAny
}

function toView(r: BlogPostRow): BlogPostView {
  return {
    slug: r.slug,
    title: r.title,
    excerpt: r.excerpt,
    author: r.author,
    authorRole: r.author_role,
    date: longDateEs(r.date_iso),
    dateISO: r.date_iso ?? "",
    lastModifiedISO: r.last_modified_iso ?? r.date_iso ?? "",
    readTime: r.read_time,
    category: r.category,
    image: r.image,
    keywords: r.keywords ?? [],
    content: r.content,
  }
}

// ─── Lectura pública (published) ────────────────────────────────────────────

export async function getPublishedSlugs(): Promise<string[]> {
  const { data, error } = await supabaseAdmin
    .from("blog_posts")
    .select("slug")
    .eq("status", "published")
  if (error) {
    console.error("[blog_posts] getPublishedSlugs error:", error)
    return Object.keys(blogPostsData)
  }
  const slugs = (data ?? []).map((r) => r.slug as string)
  return slugs.length ? slugs : Object.keys(blogPostsData)
}

export async function getPublishedPostBySlug(slug: string): Promise<BlogPostView | null> {
  const { data, error } = await supabaseAdmin
    .from("blog_posts")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle()
  if (error) {
    console.error("[blog_posts] getPublishedPostBySlug error:", error)
  }
  if (data) return toView(data as BlogPostRow)
  // Miss: fallback al TS solo si la tabla aún no está sembrada.
  if (await tableHasPublished()) return null
  const p = blogPostsData[slug]
  return p ? viewFromTs(slug, p) : null
}

export async function getAllPublished(): Promise<BlogPostView[]> {
  const { data, error } = await supabaseAdmin
    .from("blog_posts")
    .select("*")
    .eq("status", "published")
    .order("date_iso", { ascending: false })
  if (error) {
    console.error("[blog_posts] getAllPublished error:", error)
  }
  const rows = (data ?? []) as BlogPostRow[]
  if (rows.length) return rows.map(toView)
  // Tabla sin sembrar: fallback al archivo TS (ordenado por fecha desc).
  return Object.entries(blogPostsData)
    .map(([slug, p]) => viewFromTs(slug, p))
    .sort((a, b) => b.dateISO.localeCompare(a.dateISO))
}

/** Relacionados: misma categoría primero, luego el resto, por fecha desc. */
export async function getRelatedPublished(slug: string, category: string, n = 3): Promise<RelatedPost[]> {
  const all = await getAllPublished()
  const others = all.filter((p) => p.slug !== slug)
  others.sort((a, b) => {
    const aSame = a.category === category
    const bSame = b.category === category
    if (aSame !== bSame) return aSame ? -1 : 1
    return b.dateISO.localeCompare(a.dateISO)
  })
  return others.slice(0, n).map((p) => ({
    slug: p.slug,
    title: p.title,
    category: p.category,
    readTime: p.readTime,
  }))
}

// ─── Admin (cualquier status) ───────────────────────────────────────────────

export async function listPosts(filter?: { status?: PostStatus }): Promise<BlogPostRow[]> {
  let q = supabaseAdmin.from("blog_posts").select("*").order("updated_at", { ascending: false })
  if (filter?.status) q = q.eq("status", filter.status)
  const { data, error } = await q
  if (error) {
    console.error("[blog_posts] listPosts error:", error)
    return []
  }
  return (data ?? []) as BlogPostRow[]
}

export async function getPostById(id: string): Promise<BlogPostRow | null> {
  const { data, error } = await supabaseAdmin.from("blog_posts").select("*").eq("id", id).maybeSingle()
  if (error) {
    console.error("[blog_posts] getPostById error:", error)
    return null
  }
  return (data as BlogPostRow) ?? null
}

export type BlogPostInput = Partial<Omit<BlogPostRow, "id" | "created_at" | "updated_at">> & {
  slug: string
  title: string
}

export async function createPost(input: BlogPostInput): Promise<BlogPostRow | null> {
  const { data, error } = await supabaseAdmin.from("blog_posts").insert(input).select("*").single()
  if (error) {
    console.error("[blog_posts] createPost error:", error)
    throw error
  }
  return data as BlogPostRow
}

export async function updatePost(id: string, patch: Partial<BlogPostRow>): Promise<BlogPostRow | null> {
  const { data, error } = await supabaseAdmin
    .from("blog_posts")
    .update(patch)
    .eq("id", id)
    .select("*")
    .single()
  if (error) {
    console.error("[blog_posts] updatePost error:", error)
    throw error
  }
  return data as BlogPostRow
}

const todayISO = () => new Date().toISOString().slice(0, 10)

export async function publishPost(id: string): Promise<BlogPostRow | null> {
  const existing = await getPostById(id)
  if (!existing) return null
  return updatePost(id, {
    status: "published",
    published_at: existing.published_at ?? new Date().toISOString(),
    last_modified_iso: todayISO(),
    date_iso: existing.date_iso ?? todayISO(),
  })
}

export async function archivePost(id: string): Promise<BlogPostRow | null> {
  return updatePost(id, { status: "archived" })
}

export async function deletePost(id: string): Promise<void> {
  const { error } = await supabaseAdmin.from("blog_posts").delete().eq("id", id)
  if (error) {
    console.error("[blog_posts] deletePost error:", error)
    throw error
  }
}

/** primary_keywords ya usados por posts publicados (anti-canibalización). */
export async function getUsedPrimaryKeywords(excludeId?: string): Promise<string[]> {
  const { data, error } = await supabaseAdmin
    .from("blog_posts")
    .select("id, primary_keyword")
    .eq("status", "published")
    .not("primary_keyword", "is", null)
  if (error) {
    console.error("[blog_posts] getUsedPrimaryKeywords error:", error)
    return []
  }
  return (data ?? [])
    .filter((r) => r.id !== excludeId && r.primary_keyword)
    .map((r) => (r.primary_keyword as string).toLowerCase().trim())
}
