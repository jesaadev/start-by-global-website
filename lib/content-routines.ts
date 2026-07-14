import {
  getRowBySlug, getPostById, createPost, updatePost, deletePost,
  getUsedPrimaryKeywords, listPosts, type BlogPostRow, type PostLocale,
} from "@/lib/blog-posts"
import { getBlogStats } from "@/lib/blog-events"
import { getArticleQueries } from "@/lib/gsc"
import { buildContentMap, contentMapToPrompt } from "@/lib/content-map"
import { anyProviderConfigured, aiJson } from "@/lib/ai"
import { sanitizeArticleHtml } from "@/lib/sanitize-html"
import { getSiteSettings } from "@/lib/site-settings"

// Añade las directrices editables (settings) al prompt base de la rutina.
function withCustom(base: string, extra: string | undefined): string {
  const trimmed = (extra ?? "").trim()
  return trimmed ? `${base}\n\nDIRECTRICES DE ESTILO Y SEO (personalizables):\n${trimmed}` : base
}

const IMPROVE_SYSTEM = `Eres un editor SEO senior de Start By Global, una agencia de marketing y desarrollo web. Mejoras y amplías artículos existentes para reforzar su posicionamiento orgánico, manteniendo la voz de marca (cercana, profesional, orientada a resultados) y en español.

Reglas de contenido:
- Devuelve el artículo COMPLETO mejorado, no solo los cambios.
- Usa SOLO este subset de HTML: <h2>, <h3>, <p>, <ul>, <ol>, <li>, <blockquote>, <strong>, <em>, <a>, <code>. Nada de <script>, <style>, <img>, ni atributos salvo href en <a>.
- Amplía con secciones nuevas que cubran las consultas reales de Google aportadas, refuerza E-E-A-T, mejora encabezados y añade una sección de preguntas frecuentes si aporta valor.
- Añade enlaces internos relevantes (href relativos como /insights/otro-articulo o /diseno-paginas-web) usando el mapa de contenido; no inventes URLs que no estén en el mapa o en money pages conocidas (/diseno-paginas-web, /publicidad-ads, /servicios, /contacto).
- No repitas el tema de otro artículo del mapa (evita canibalización); profundiza en el ángulo propio de este.
- Cuando recomiendes explícitamente otro artículo del blog, ponlo en un párrafo propio que contenga el enlace a /insights/… (se renderiza como bloque destacado "Leer también").`

const IMPROVE_SYSTEM_EN = `You are a senior SEO editor at Start By Global, a marketing and web development agency targeting U.S. businesses. You improve and expand existing articles to strengthen their organic rankings in Google US, keeping the brand voice (approachable, professional, results-oriented) and writing in English.

Content rules:
- Return the COMPLETE improved article, not just the changes.
- Use ONLY this HTML subset: <h2>, <h3>, <p>, <ul>, <ol>, <li>, <blockquote>, <strong>, <em>, <a>, <code>. No <script>, <style>, <img>, and no attributes except href on <a>.
- Expand with new sections that cover the real Google queries provided, strengthen E-E-A-T, improve headings and add an FAQ section if it adds value.
- Add relevant internal links (relative hrefs like /us/insights/another-article or /us/website-design) using the content map; never invent URLs that aren't in the map or the known money pages (/us/website-design, /us/google-ads, /us/contact).
- Do not overlap the topic of another article in the map (avoid cannibalization); go deeper on this article's own angle.
- When you explicitly recommend another blog article, put it in its own paragraph containing the /us/insights/… link (it renders as a highlighted "Read next" block).`

interface ImproveResult {
  title?: string
  excerpt?: string
  content: string
  summary: string
  added_sections?: string[]
  internal_links_added?: string[]
  keywords?: string[]
}

export interface ImproveOutcome {
  draft: BlogPostRow
  summary: string
  added_sections: string[]
  internal_links_added: string[]
}

const DRAFT_SUFFIX = "--mejora-ia"

/** Genera un borrador de mejora (no toca el artículo en vivo) para un slug publicado. */
export async function improveArticle(slug: string): Promise<ImproveOutcome> {
  if (!anyProviderConfigured()) {
    throw new Error("No hay proveedor de IA configurado (ANTHROPIC_API_KEY o GEMINI_API_KEY): no se puede generar la mejora.")
  }

  const row = await getRowBySlug(slug)
  if (!row) throw new Error(`No existe el artículo "${slug}".`)
  if (row.status !== "published") throw new Error("Solo se pueden mejorar artículos publicados.")
  const locale = (row.locale ?? "es") as PostLocale
  const gscPath = locale === "en" ? `/us/insights/${slug}` : `/insights/${slug}`

  // Señales: métricas de lectura + consultas reales de Google + mapa de contenido.
  const stats = await getBlogStats(90).catch(() => null)
  const metrics = stats?.articles.find((a) => a.slug === slug) ?? null
  const gsc = await getArticleQueries(gscPath, 28).catch(() => ({ configured: false, rows: [] as never[] }))
  const map = await buildContentMap(slug, locale)

  const gscBlock = gsc.configured && gsc.rows.length
    ? gsc.rows
        .slice(0, 20)
        .map((r) => `- "${r.query}" — posición ${r.position.toFixed(1)}, CTR ${(r.ctr * 100).toFixed(1)}%, ${r.impressions} impresiones`)
        .join("\n")
    : "(sin datos de Search Console)"

  const metricsBlock = metrics
    ? `vistas ${metrics.views}, sesiones ${metrics.sessions}, lectura completa ${metrics.read_complete}, tiempo medio ${metrics.avg_engaged}s, conversiones ${metrics.conversions}`
    : "(sin métricas de tráfico todavía)"

  const prompt = `Mejora y amplía este artículo.

TÍTULO ACTUAL: ${row.title}
KEYWORD PRINCIPAL: ${row.primary_keyword ?? "—"}
KEYWORDS: ${(row.keywords ?? []).join(", ") || "—"}
CATEGORÍA: ${row.category}

MÉTRICAS DE LECTURA (90 días): ${metricsBlock}

CONSULTAS REALES EN GOOGLE (Search Console):
${gscBlock}

MAPA DE CONTENIDO (para enlaces internos, NO repetir estos temas):
${contentMapToPrompt(map, locale)}

CONTENIDO ACTUAL (HTML):
${row.content}

Devuelve un JSON con esta forma exacta:
{
  "title": "título mejorado (o el mismo)",
  "excerpt": "extracto mejorado (1-2 frases)",
  "content": "<artículo completo en el subset HTML permitido>",
  "summary": "resumen en 1-2 frases de qué mejoraste",
  "added_sections": ["títulos de las secciones nuevas"],
  "internal_links_added": ["/insights/...", "/diseno-paginas-web"],
  "keywords": ["keyword1", "keyword2", "..."]
}`

  const settings = await getSiteSettings()
  const baseSystem = locale === "en" ? IMPROVE_SYSTEM_EN : IMPROVE_SYSTEM
  const system = withCustom(baseSystem, settings.ai.improvePrompt)
  const result = await aiJson<ImproveResult>({ system, prompt, maxTokens: 8000 })
  if (!result || typeof result !== "object") {
    throw new Error("La respuesta de la IA no tiene el formato esperado.")
  }
  const content = sanitizeArticleHtml(result.content || "")
  if (!content) throw new Error("La mejora generada quedó vacía tras sanitizar.")

  // Un único borrador de mejora pendiente por artículo: si ya hay uno, lo reemplazamos.
  const draftSlug = `${slug}${DRAFT_SUFFIX}`
  const existing = await getRowBySlug(draftSlug)
  if (existing) await deletePost(existing.id)

  const draft = await createPost({
    slug: draftSlug,
    title: result.title?.trim() || row.title,
    excerpt: result.excerpt?.trim() || row.excerpt,
    author: row.author,
    author_role: row.author_role,
    category: row.category,
    image: row.image,
    read_time: row.read_time,
    date_iso: row.date_iso,
    keywords: result.keywords?.length ? result.keywords : row.keywords,
    primary_keyword: row.primary_keyword,
    content,
    status: "draft",
    origin: "ai_improved",
    locale,
    improves_post_id: row.id,
  })

  if (!draft) throw new Error("No se pudo guardar el borrador de mejora.")

  return {
    draft,
    summary: result.summary || "Artículo ampliado y optimizado.",
    added_sections: result.added_sections ?? [],
    internal_links_added: result.internal_links_added ?? [],
  }
}

/** Aplica un borrador de mejora al artículo publicado de origen y borra el borrador. */
export async function applyImprovement(draftId: string): Promise<{ slug: string } | null> {
  const draft = await getPostById(draftId)
  if (!draft || draft.origin !== "ai_improved" || !draft.improves_post_id) {
    throw new Error("El borrador no es una mejora válida.")
  }
  const target = await getPostById(draft.improves_post_id)
  if (!target) throw new Error("El artículo de origen ya no existe.")

  // Copiamos todos los campos editables del borrador (el admin pudo ajustarlos)
  // excepto el slug del publicado, que no cambia.
  await updatePost(target.id, {
    title: draft.title,
    excerpt: draft.excerpt,
    content: draft.content,
    keywords: draft.keywords,
    primary_keyword: draft.primary_keyword,
    category: draft.category,
    read_time: draft.read_time,
    image: draft.image,
    last_modified_iso: new Date().toISOString().slice(0, 10),
  })
  await deletePost(draft.id)
  return { slug: target.slug }
}

// ─── Fase 4: crear artículos nuevos ──────────────────────────────────────────

const POST_CATEGORIES = ["Marketing Digital", "Desarrollo Web", "Tendencias Tech"]

// CTA contextual por categoría (alineado con blog-post-content.tsx).
const CATEGORY_CTA: Record<string, string> = {
  "Marketing Digital": "/publicidad-ads",
  "Desarrollo Web": "/diseno-paginas-web",
  "Tendencias Tech": "/contacto",
}

// Imagen por defecto para borradores generados (el admin la puede cambiar).
const DEFAULT_ARTICLE_IMAGE = "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&q=80"

const PROPOSE_SYSTEM = `Eres un estratega de contenidos SEO de Start By Global, una agencia de marketing y desarrollo web que opera en República Dominicana, España y Latinoamérica. Propones temas de artículos nuevos que amplíen la cobertura orgánica en cuatro verticales: diseño y desarrollo web, publicidad (Google/Meta/TikTok Ads), marketing digital y automatización/IA.

Reglas:
- Español. Orientado a captar clientes (intención comercial/transaccional o informativa cercana a la conversión), con palabras clave técnicas y de conversión reales del sector.
- NO propongas temas que solapen (canibalicen) los artículos o keywords ya existentes que se te entregan. Cada tema debe tener una keyword principal distinta y un ángulo propio.
- La categoría debe ser exactamente una de: "Marketing Digital", "Desarrollo Web", "Tendencias Tech".`

const GENERATE_SYSTEM = `Eres un redactor SEO senior de Start By Global (agencia de marketing y desarrollo web en RD, España y LatAm). Escribes artículos completos, útiles y orientados a captar clientes, en español, con la voz de marca (cercana, profesional, orientada a resultados).

Reglas de contenido:
- Usa SOLO este subset de HTML: <h2>, <h3>, <p>, <ul>, <ol>, <li>, <blockquote>, <strong>, <em>, <a>, <code>. Nada de <script>, <style>, <img>, ni atributos salvo href en <a>.
- 1200-1800 palabras, con introducción, estructura H2/H3 clara, ejemplos concretos y una sección de preguntas frecuentes.
- Añade enlaces internos relevantes (href relativos) usando el mapa de contenido entregado; no inventes URLs que no estén en el mapa o en las money pages conocidas (/diseno-paginas-web, /publicidad-ads, /servicios, /contacto, /ia-automatizacion).
- Incluye al final un CTA claro hacia la money page indicada.
- E-E-A-T: aporta valor real, no relleno; evita promesas exageradas.
- Cuando recomiendes explícitamente otro artículo del blog, ponlo en un párrafo propio que contenga el enlace a /insights/… (se renderiza como bloque destacado "Leer también").`

const PROPOSE_SYSTEM_EN = `You are an SEO content strategist at Start By Global, a marketing and web development agency targeting U.S. small and mid-size businesses. You propose new article topics to expand organic coverage in Google US across four verticals: website design & development, paid advertising (Google/Meta/TikTok Ads), digital marketing, and automation/AI.

Rules:
- English (US). Focused on winning clients (commercial/transactional intent or conversion-adjacent informational), using real technical and conversion keywords U.S. businesses search for.
- Do NOT propose topics that overlap (cannibalize) the existing articles or keywords provided. Each topic must have a distinct primary keyword and its own angle.
- The category must be exactly one of these internal codes: "Marketing Digital", "Desarrollo Web", "Tendencias Tech" (they render as Digital Marketing / Web Development / Tech Trends).`

const GENERATE_SYSTEM_EN = `You are a senior SEO writer at Start By Global (marketing and web development agency serving U.S. businesses). You write complete, genuinely useful, client-winning articles in English (US) with the brand voice (approachable, professional, results-oriented).

Content rules:
- Use ONLY this HTML subset: <h2>, <h3>, <p>, <ul>, <ol>, <li>, <blockquote>, <strong>, <em>, <a>, <code>. No <script>, <style>, <img>, and no attributes except href on <a>.
- 1200-1800 words, with an introduction, clear H2/H3 structure, concrete examples and an FAQ section.
- Add relevant internal links (relative hrefs) using the provided content map; never invent URLs that aren't in the map or the known money pages (/us/website-design, /us/google-ads, /us/contact).
- End with a clear CTA to the indicated money page.
- E-E-A-T: real value, no filler; avoid exaggerated promises.
- When you explicitly recommend another blog article, put it in its own paragraph containing the /us/insights/… link (it renders as a highlighted "Read next" block).`

// Money pages del CTA final por categoría, para artículos EN.
const CATEGORY_CTA_EN: Record<string, string> = {
  "Marketing Digital": "/us/google-ads",
  "Desarrollo Web": "/us/website-design",
  "Tendencias Tech": "/us/contact",
}

export interface ProposedTopic {
  working_title: string
  slug: string
  primary_keyword: string
  secondary_keywords: string[]
  category: string
  search_intent: string
  why_not_cannibalizing: string
  suggested_internal_links: string[]
}

function slugify(input: string): string {
  return input
    .toLowerCase().trim()
    .normalize("NFD").replace(new RegExp("[\\u0300-\\u036f]", "g"), "")
    .replace(/\s+/g, "-").replace(/[^a-z0-9-_]/g, "").replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
}

/** La IA propone temas nuevos no canibalizadores a partir del mapa de contenido. */
export async function proposeTopics(count = 5, locale: PostLocale = "es"): Promise<ProposedTopic[]> {
  if (!anyProviderConfigured()) {
    throw new Error("No hay proveedor de IA configurado (ANTHROPIC_API_KEY o GEMINI_API_KEY): no se pueden proponer temas.")
  }
  const map = await buildContentMap(undefined, locale)
  const used = await getUsedPrimaryKeywords(undefined, locale)

  const prompt = `Propón ${count} temas de artículos nuevos.

MAPA DE CONTENIDO ACTUAL (no repitas estos temas ni sus keywords):
${contentMapToPrompt(map, locale)}

KEYWORDS PRINCIPALES YA OCUPADAS (no las repitas):
${used.length ? used.join(", ") : "(ninguna)"}

Devuelve un JSON con esta forma exacta:
{
  "topics": [
    {
      "working_title": "título de trabajo",
      "slug": "slug-sugerido-en-kebab-case",
      "primary_keyword": "keyword principal única",
      "secondary_keywords": ["kw2", "kw3"],
      "category": "Marketing Digital | Desarrollo Web | Tendencias Tech",
      "search_intent": "informacional | comercial | transaccional",
      "why_not_cannibalizing": "por qué no solapa con lo existente",
      "suggested_internal_links": ["/insights/...", "/diseno-paginas-web"]
    }
  ]
}`

  const res = await aiJson<{ topics: ProposedTopic[] }>({
    system: locale === "en" ? PROPOSE_SYSTEM_EN : PROPOSE_SYSTEM,
    prompt,
    maxTokens: 3000,
  })
  const topics = Array.isArray(res?.topics) ? res.topics : []
  const usedSet = new Set(used)
  return topics.filter((t) => t?.primary_keyword && !usedSet.has(t.primary_keyword.toLowerCase().trim()))
}

interface GenerateResult {
  title: string
  excerpt: string
  content: string
  keywords?: string[]
  read_time?: string
}

/** Genera un artículo completo (borrador ai_generated) a partir de un tema. */
export async function generateArticle(topic: ProposedTopic, locale: PostLocale = "es"): Promise<BlogPostRow> {
  if (!anyProviderConfigured()) {
    throw new Error("No hay proveedor de IA configurado (ANTHROPIC_API_KEY o GEMINI_API_KEY): no se puede generar el artículo.")
  }
  const primary = (topic.primary_keyword || "").trim()
  if (!primary) throw new Error("El tema no tiene palabra clave principal.")

  // Chequeo final anti-canibalización (por idioma).
  const used = await getUsedPrimaryKeywords(undefined, locale)
  if (used.includes(primary.toLowerCase())) {
    throw new Error("Ese tema canibaliza un artículo publicado (misma keyword principal).")
  }

  const category = POST_CATEGORIES.includes(topic.category) ? topic.category : "Marketing Digital"
  const cta =
    locale === "en"
      ? (CATEGORY_CTA_EN[category] ?? "/us/contact")
      : (CATEGORY_CTA[category] ?? "/contacto")
  const map = await buildContentMap(undefined, locale)

  const prompt = `Escribe el artículo completo para este tema.

TÍTULO DE TRABAJO: ${topic.working_title}
KEYWORD PRINCIPAL: ${primary}
KEYWORDS SECUNDARIAS: ${(topic.secondary_keywords || []).join(", ") || "—"}
CATEGORÍA: ${category}
INTENCIÓN DE BÚSQUEDA: ${topic.search_intent || "—"}
CTA FINAL (money page): ${cta}

MAPA DE CONTENIDO (para enlaces internos):
${contentMapToPrompt(map, locale)}

Devuelve un JSON con esta forma exacta:
{
  "title": "título SEO final",
  "excerpt": "extracto de 1-2 frases",
  "content": "<artículo completo en el subset HTML permitido>",
  "keywords": ["keyword1", "keyword2", "..."],
  "read_time": "X min"
}`

  const settings = await getSiteSettings()
  const system = withCustom(locale === "en" ? GENERATE_SYSTEM_EN : GENERATE_SYSTEM, settings.ai.createPrompt)
  const result = await aiJson<GenerateResult>({ system, prompt, maxTokens: 8000 })
  if (!result || typeof result !== "object") {
    throw new Error("La respuesta de la IA no tiene el formato esperado.")
  }
  const content = sanitizeArticleHtml(result.content || "")
  if (!content) throw new Error("El artículo generado quedó vacío tras sanitizar.")

  // Slug único.
  let slug = slugify(topic.slug || result.title || topic.working_title)
  if (!slug) slug = `articulo-${Date.now().toString(36)}`
  if (await getRowBySlug(slug)) slug = `${slug}-${Date.now().toString(36).slice(-4)}`

  const keywords = result.keywords?.length
    ? result.keywords
    : [primary, ...(topic.secondary_keywords || [])]

  const draft = await createPost({
    slug,
    title: result.title?.trim() || topic.working_title,
    excerpt: result.excerpt?.trim() || "",
    author: "Jhon Alejandro Esáa",
    author_role: "Founder & Lead Developer",
    category,
    image: DEFAULT_ARTICLE_IMAGE,
    read_time: result.read_time?.trim() || "7 min",
    date_iso: new Date().toISOString().slice(0, 10),
    keywords,
    primary_keyword: primary,
    content,
    status: "draft",
    origin: "ai_generated",
    locale,
  })

  if (!draft) throw new Error("No se pudo guardar el borrador generado.")
  return draft
}

// ─── Rutinas programadas (crons) ─────────────────────────────────────────────
// Generan SOLO borradores: el gate de aprobación humana en el admin se mantiene.

export interface ImproveRoutineResult {
  improved: string[]
  errors: string[]
  skipped?: string
}

/** Mejora los N artículos publicados más antiguos que no tengan ya una mejora pendiente. */
export async function runImproveRoutine(limit = 1, locale: PostLocale = "es"): Promise<ImproveRoutineResult> {
  if (!anyProviderConfigured()) return { improved: [], errors: [], skipped: "sin proveedor de IA" }

  const all = await listPosts({ locale })
  const pendingTargets = new Set(
    all
      .filter((p) => p.origin === "ai_improved" && p.improves_post_id !== null)
      .map((p) => p.improves_post_id as string)
  )
  const candidates = all
    .filter((p) => p.status === "published" && !pendingTargets.has(p.id))
    .sort((a, b) =>
      (a.last_modified_iso || a.date_iso || "").localeCompare(b.last_modified_iso || b.date_iso || "")
    )
    .slice(0, limit)

  if (!candidates.length) return { improved: [], errors: [], skipped: "no hay candidatos sin mejora pendiente" }

  const improved: string[] = []
  const errors: string[] = []
  for (const c of candidates) {
    try {
      await improveArticle(c.slug)
      improved.push(c.slug)
    } catch (e) {
      errors.push(`${c.slug}: ${e instanceof Error ? e.message : String(e)}`)
    }
  }
  return { improved, errors }
}

export interface CreateRoutineResult {
  created: string[]
  errors: string[]
  skipped?: string
}

/** Propone temas y genera hasta `count` borradores de temas viables (no canibalizadores). */
export async function runCreateRoutine(count = 1, locale: PostLocale = "es"): Promise<CreateRoutineResult> {
  if (!anyProviderConfigured()) return { created: [], errors: [], skipped: "sin proveedor de IA" }

  const n = Math.max(1, count)
  const topics = await proposeTopics(Math.max(3, n + 2), locale)
  if (!topics.length) return { created: [], errors: [], skipped: "la IA no propuso temas nuevos" }

  const created: string[] = []
  const errors: string[] = []
  for (const t of topics) {
    if (created.length >= n) break
    try {
      const draft = await generateArticle(t, locale)
      created.push(draft.slug)
    } catch (e) {
      errors.push(`${t.primary_keyword}: ${e instanceof Error ? e.message : String(e)}`)
    }
  }
  return { created, errors }
}
