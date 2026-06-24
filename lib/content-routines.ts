import {
  getRowBySlug, getPostById, createPost, updatePost, deletePost, type BlogPostRow,
} from "@/lib/blog-posts"
import { getBlogStats } from "@/lib/blog-events"
import { getArticleQueries } from "@/lib/gsc"
import { buildContentMap, contentMapToPrompt } from "@/lib/content-map"
import { claudeConfigured, claudeJson } from "@/lib/claude"
import { sanitizeArticleHtml } from "@/lib/sanitize-html"

const IMPROVE_SYSTEM = `Eres un editor SEO senior de Start By Global, una agencia de marketing y desarrollo web. Mejoras y amplías artículos existentes para reforzar su posicionamiento orgánico, manteniendo la voz de marca (cercana, profesional, orientada a resultados) y en español.

Reglas de contenido:
- Devuelve el artículo COMPLETO mejorado, no solo los cambios.
- Usa SOLO este subset de HTML: <h2>, <h3>, <p>, <ul>, <ol>, <li>, <blockquote>, <strong>, <em>, <a>, <code>. Nada de <script>, <style>, <img>, ni atributos salvo href en <a>.
- Amplía con secciones nuevas que cubran las consultas reales de Google aportadas, refuerza E-E-A-T, mejora encabezados y añade una sección de preguntas frecuentes si aporta valor.
- Añade enlaces internos relevantes (href relativos como /insights/otro-articulo o /diseno-paginas-web) usando el mapa de contenido; no inventes URLs que no estén en el mapa o en money pages conocidas (/diseno-paginas-web, /publicidad-ads, /servicios, /contacto).
- No repitas el tema de otro artículo del mapa (evita canibalización); profundiza en el ángulo propio de este.`

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
  if (!claudeConfigured()) {
    throw new Error("ANTHROPIC_API_KEY no está configurada: no se puede generar la mejora.")
  }

  const row = await getRowBySlug(slug)
  if (!row) throw new Error(`No existe el artículo "${slug}".`)
  if (row.status !== "published") throw new Error("Solo se pueden mejorar artículos publicados.")

  // Señales: métricas de lectura + consultas reales de Google + mapa de contenido.
  const stats = await getBlogStats(90).catch(() => null)
  const metrics = stats?.articles.find((a) => a.slug === slug) ?? null
  const gsc = await getArticleQueries(`/insights/${slug}`, 28).catch(() => ({ configured: false, rows: [] as never[] }))
  const map = await buildContentMap(slug)

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
${contentMapToPrompt(map)}

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

  const result = await claudeJson<ImproveResult>({ system: IMPROVE_SYSTEM, prompt, maxTokens: 8000 })
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

  await updatePost(target.id, {
    title: draft.title,
    excerpt: draft.excerpt,
    content: draft.content,
    keywords: draft.keywords,
    last_modified_iso: new Date().toISOString().slice(0, 10),
  })
  await deletePost(draft.id)
  return { slug: target.slug }
}
