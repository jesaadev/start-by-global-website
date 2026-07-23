import { NextResponse } from "next/server"
import { revalidatePath } from "next/cache"
import { supabaseAdmin } from "@/lib/supabase"
import { enforceRateLimit } from "@/lib/rate-limit"
import { safeEqual } from "@/lib/request-guards"
import { readSiteSettings, saveSiteSettings } from "@/lib/site-settings"
import { getAttributionStats } from "@/lib/lead-events"
import { getBlogStats } from "@/lib/blog-events"
import { getArticleQueries, gscConfigured } from "@/lib/gsc"
import {
  listPosts, getPostById, createPost, updatePost, publishPost, archivePost, deletePost,
  type BlogPostRow,
} from "@/lib/blog-posts"
import { sanitizeArticleHtml } from "@/lib/sanitize-html"
import { blogPostsData } from "@/app/insights/[slug]/blog-data"
import { improveArticle, applyImprovement, proposeTopics, generateArticle, type ProposedTopic } from "@/lib/content-routines"
import { configuredProviders, getActiveProvider, type AiProvider } from "@/lib/ai"
import { generateArticleImage, imageProviderConfigured } from "@/lib/ai-image"
import { testCapiEvent } from "@/lib/meta-capi"

// Columnas escribibles de blog_posts vía API (allowlist).
const POST_FIELDS = [
  "slug", "title", "excerpt", "author", "author_role", "category", "image", "read_time",
  "date_iso", "last_modified_iso", "keywords", "primary_keyword", "content", "status",
  "origin", "locale", "improves_post_id", "published_at",
] as const

// Columnas opcionales DATE/UUID: una cadena vacía rompe el INSERT/UPDATE en
// Postgres, así que las normalizamos a null.
const NULLABLE_EMPTY = new Set(["date_iso", "last_modified_iso", "published_at", "improves_post_id", "primary_keyword"])

function pickPostFields(obj: Record<string, unknown>): Partial<BlogPostRow> {
  const out: Record<string, unknown> = {}
  for (const k of POST_FIELDS) {
    if (obj[k] === undefined) continue
    out[k] = obj[k] === "" && NULLABLE_EMPTY.has(k) ? null : obj[k]
  }
  if (typeof out.content === "string") out.content = sanitizeArticleHtml(out.content)
  return out as Partial<BlogPostRow>
}

function revalidateBlog(slug?: string) {
  revalidatePath("/insights")
  revalidatePath("/us/insights")
  revalidatePath("/sitemap.xml")
  if (slug) {
    revalidatePath(`/insights/${slug}`)
    revalidatePath(`/us/insights/${slug}`)
  }
}

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD

function checkAuth(request: Request): boolean {
  // Falla de forma segura: sin ADMIN_PASSWORD configurado, nadie entra.
  if (!ADMIN_PASSWORD) {
    console.error("[Admin API] ADMIN_PASSWORD no está configurado en el entorno.")
    return false
  }
  // Comparación en tiempo constante (evita timing attacks sobre la contraseña).
  return safeEqual(request.headers.get("x-admin-password"), ADMIN_PASSWORD)
}

/**
 * Respuesta ante auth fallida, con rate limit por IP sobre los INTENTOS
 * fallidos (anti fuerza bruta): 10 fallos / 10 min → 429.
 */
function unauthorized(request: Request) {
  const limited = enforceRateLimit(request, "admin-auth-fail", 10, 10 * 60 * 1000)
  if (limited) return limited
  return NextResponse.json({ error: "No autorizado." }, { status: 401 })
}

// GET /api/admin?resource=conversations|insights|overrides&page=1
export async function GET(request: Request) {
  if (!checkAuth(request)) {
    return unauthorized(request)
  }

  const { searchParams } = new URL(request.url)
  const resource = searchParams.get("resource")
  const page = parseInt(searchParams.get("page") ?? "1")
  const limit = 20
  const offset = (page - 1) * limit

  try {
    if (resource === "conversations") {
      const { data, error, count } = await supabaseAdmin
        .from("conversations")
        .select("id, session_id, email, name, intent_final, converted, summary, created_at, analysis", { count: "exact" })
        .order("created_at", { ascending: false })
        .range(offset, offset + limit - 1)

      if (error) throw error
      return NextResponse.json({ data, total: count, page, limit })
    }

    if (resource === "conversation") {
      const id = searchParams.get("id")
      if (!id) return NextResponse.json({ error: "ID requerido." }, { status: 400 })

      const { data, error } = await supabaseAdmin
        .from("conversations")
        .select("*")
        .eq("id", id)
        .single()

      if (error) throw error
      return NextResponse.json({ data })
    }

    if (resource === "insights") {
      const type = searchParams.get("type")
      let query = supabaseAdmin
        .from("sales_insights")
        .select("*", { count: "exact" })
        .order("success_rate", { ascending: false })
        .range(offset, offset + limit - 1)

      if (type) query = query.eq("type", type)

      const { data, error, count } = await query
      if (error) throw error
      return NextResponse.json({ data, total: count, page, limit })
    }

    if (resource === "seo") {
      const data = await readSiteSettings()
      return NextResponse.json({ data })
    }

    if (resource === "attribution") {
      const days = parseInt(searchParams.get("days") ?? "30")
      const data = await getAttributionStats(Number.isFinite(days) ? days : 30)
      return NextResponse.json({ data })
    }

    if (resource === "blog") {
      const days = parseInt(searchParams.get("days") ?? "30")
      const data = await getBlogStats(Number.isFinite(days) ? days : 30)
      return NextResponse.json({ data, gsc: gscConfigured() })
    }

    if (resource === "gsc") {
      const slug = searchParams.get("slug")
      if (!slug) return NextResponse.json({ error: "slug requerido." }, { status: 400 })
      const days = parseInt(searchParams.get("days") ?? "28")
      const data = await getArticleQueries(`/insights/${slug}`, Number.isFinite(days) ? days : 28)
      return NextResponse.json({ data })
    }

    if (resource === "posts") {
      const status = searchParams.get("status") as BlogPostRow["status"] | null
      const locale = searchParams.get("locale") === "en" ? ("en" as const) : ("es" as const)
      const data = await listPosts({ ...(status ? { status } : {}), locale })
      const settings = await readSiteSettings()
      const ai = {
        providers: configuredProviders(),
        active: await getActiveProvider(),
        schedule: settings.ai.schedule,
        improvePrompt: settings.ai.improvePrompt,
        createPrompt: settings.ai.createPrompt,
      }
      return NextResponse.json({ data, ai })
    }

    if (resource === "post") {
      const id = searchParams.get("id")
      if (!id) return NextResponse.json({ error: "ID requerido." }, { status: 400 })
      const data = await getPostById(id)
      return NextResponse.json({ data })
    }

    if (resource === "overrides") {
      const { data, error } = await supabaseAdmin
        .from("prompt_overrides")
        .select("*")
        .order("priority", { ascending: false })

      if (error) throw error
      return NextResponse.json({ data })
    }

    if (resource === "stats") {
      const [totalRes, convertedRes, emailsRes, intentRes] = await Promise.all([
        supabaseAdmin.from("conversations").select("id", { count: "exact", head: true }),
        supabaseAdmin.from("conversations").select("id", { count: "exact", head: true }).eq("converted", true),
        supabaseAdmin.from("conversations").select("id", { count: "exact", head: true }).not("email", "is", null),
        supabaseAdmin.from("conversations").select("intent_final"),
      ])

      const intentCounts = { low: 0, medium: 0, high: 0 }
      intentRes.data?.forEach((r) => {
        if (r.intent_final in intentCounts) intentCounts[r.intent_final as keyof typeof intentCounts]++
      })

      return NextResponse.json({
        total_conversations: totalRes.count ?? 0,
        total_converted: convertedRes.count ?? 0,
        total_emails: emailsRes.count ?? 0,
        conversion_rate: totalRes.count
          ? ((convertedRes.count ?? 0) / totalRes.count * 100).toFixed(1)
          : "0",
        intent_distribution: intentCounts,
      })
    }

    return NextResponse.json({ error: "Recurso no válido." }, { status: 400 })
  } catch (error) {
    console.error("[Admin API] GET error:", error)
    return NextResponse.json({ error: "Error del servidor." }, { status: 500 })
  }
}

// PATCH /api/admin — actualizar insight u override
export async function PATCH(request: Request) {
  if (!checkAuth(request)) {
    return unauthorized(request)
  }

  try {
    const body = await request.json()
    const { resource, id, ...updates } = body

    if (resource === "seo") {
      const saved = await saveSiteSettings(updates.data)
      return NextResponse.json({ data: saved })
    }

    // Cambiar el proveedor de IA activo (claude | gemini) sin tocar el resto
    // de settings: leemos los actuales y solo sustituimos ai.provider.
    if (resource === "ai-provider") {
      const provider = updates.provider as AiProvider
      if (provider !== "claude" && provider !== "gemini") {
        return NextResponse.json({ error: "Proveedor no válido." }, { status: 400 })
      }
      const current = await readSiteSettings()
      const saved = await saveSiteSettings({ ...current, ai: { ...current.ai, provider } })
      return NextResponse.json({ data: { provider: saved.ai.provider } })
    }

    // Programación de las rutinas de IA (días y cantidad por ejecución).
    if (resource === "ai-schedule") {
      const s = (updates.schedule ?? {}) as Record<string, unknown>
      const current = await readSiteSettings()
      const cur = current.ai.schedule
      const days = (v: unknown, fallback: number[]) =>
        Array.isArray(v)
          ? [...new Set(v.map(Number).filter((n) => Number.isInteger(n) && n >= 0 && n <= 6))].sort()
          : fallback
      const count = (v: unknown, fallback: number) => {
        const n = Number(v)
        return Number.isFinite(n) ? Math.min(5, Math.max(1, Math.round(n))) : fallback
      }
      const schedule = {
        improveDays: days(s.improveDays, cur.improveDays),
        improveCount: count(s.improveCount, cur.improveCount),
        createDays: days(s.createDays, cur.createDays),
        createCount: count(s.createCount, cur.createCount),
      }
      const saved = await saveSiteSettings({ ...current, ai: { ...current.ai, schedule } })
      return NextResponse.json({ data: saved.ai.schedule })
    }

    // Prompts personalizables de las rutinas de IA.
    if (resource === "ai-prompts") {
      const current = await readSiteSettings()
      const str = (v: unknown, fallback: string) =>
        typeof v === "string" ? v.slice(0, 4000) : fallback
      const ai = {
        ...current.ai,
        improvePrompt: str(updates.improvePrompt, current.ai.improvePrompt),
        createPrompt: str(updates.createPrompt, current.ai.createPrompt),
      }
      const saved = await saveSiteSettings({ ...current, ai })
      return NextResponse.json({ data: { improvePrompt: saved.ai.improvePrompt, createPrompt: saved.ai.createPrompt } })
    }

    if (resource === "post") {
      if (!id) return NextResponse.json({ error: "ID requerido." }, { status: 400 })
      const action = updates.action as string | undefined
      if (action === "apply-improvement") {
        try {
          const applied = await applyImprovement(id)
          if (applied) revalidateBlog(applied.slug)
          return NextResponse.json({ data: applied })
        } catch (e) {
          const message = e instanceof Error ? e.message : "Error al aplicar la mejora."
          return NextResponse.json({ error: message }, { status: 400 })
        }
      }
      let row: BlogPostRow | null
      if (action === "publish") {
        row = await publishPost(id)
      } else if (action === "archive") {
        row = await archivePost(id)
      } else {
        const patch = pickPostFields(updates)
        // Editar el contenido de un publicado actualiza la fecha de modificación.
        if (typeof patch.content === "string") patch.last_modified_iso = new Date().toISOString().slice(0, 10)
        row = await updatePost(id, patch)
      }
      if (row) revalidateBlog(row.slug)
      return NextResponse.json({ data: row })
    }

    if (resource === "insight") {
      const { data, error } = await supabaseAdmin
        .from("sales_insights")
        .update(updates)
        .eq("id", id)
        .select()
        .single()

      if (error) throw error
      return NextResponse.json({ data })
    }

    if (resource === "override") {
      const { data, error } = await supabaseAdmin
        .from("prompt_overrides")
        .update(updates)
        .eq("id", id)
        .select()
        .single()

      if (error) throw error
      return NextResponse.json({ data })
    }

    if (resource === "conversation") {
      const { data, error } = await supabaseAdmin
        .from("conversations")
        .update(updates)
        .eq("id", id)
        .select()
        .single()

      if (error) throw error
      return NextResponse.json({ data })
    }

    return NextResponse.json({ error: "Recurso no válido." }, { status: 400 })
  } catch (error) {
    console.error("[Admin API] PATCH error:", error)
    return NextResponse.json({ error: "Error del servidor." }, { status: 500 })
  }
}

// POST /api/admin — crear insight u override
export async function POST(request: Request) {
  if (!checkAuth(request)) {
    return unauthorized(request)
  }

  try {
    const body = await request.json()
    const { resource, ...payload } = body

    if (resource === "post") {
      const fields = pickPostFields(payload)
      if (!fields.slug || !fields.title) {
        return NextResponse.json({ error: "slug y title son obligatorios." }, { status: 400 })
      }
      const row = await createPost({ ...fields, slug: fields.slug, title: fields.title })
      if (row?.status === "published") revalidateBlog(row.slug)
      return NextResponse.json({ data: row })
    }

    // Genera un borrador de mejora con IA para un artículo publicado.
    if (resource === "improve-article") {
      const slug = payload.slug as string | undefined
      if (!slug) return NextResponse.json({ error: "slug requerido." }, { status: 400 })
      try {
        const outcome = await improveArticle(slug)
        revalidateBlog()
        return NextResponse.json({
          data: outcome.draft,
          summary: outcome.summary,
          added_sections: outcome.added_sections,
          internal_links_added: outcome.internal_links_added,
        })
      } catch (e) {
        const message = e instanceof Error ? e.message : "Error al generar la mejora."
        return NextResponse.json({ error: message }, { status: 502 })
      }
    }

    // Envía un evento Lead de prueba a Meta CAPI y devuelve su respuesta cruda
    // (diagnóstico del par pixel + token). Usa test_event_code, no contamina.
    if (resource === "test-capi") {
      const result = await testCapiEvent(payload.sourceUrl as string | undefined)
      return NextResponse.json({ result })
    }

    // Genera (o regenera) la imagen destacada de un artículo con IA. Si viene
    // postId, persiste la nueva URL y revalida; si no, solo devuelve la URL
    // para que el editor la use en un borrador aún sin guardar.
    if (resource === "generate-image") {
      if (!imageProviderConfigured()) {
        return NextResponse.json(
          { error: "La generación de imágenes requiere GEMINI_API_KEY configurada." },
          { status: 400 },
        )
      }
      const title = (payload.title as string | undefined)?.trim()
      if (!title) return NextResponse.json({ error: "title requerido." }, { status: 400 })
      try {
        const keywords = Array.isArray(payload.keywords)
          ? (payload.keywords as string[])
          : typeof payload.keywords === "string"
            ? payload.keywords.split(",").map((s: string) => s.trim()).filter(Boolean)
            : []
        const url = await generateArticleImage({
          slug: (payload.slug as string) || "articulo",
          title,
          category: (payload.category as string) || "Marketing Digital",
          keywords,
          locale: payload.locale === "en" ? "en" : "es",
        })
        const postId = payload.postId as string | undefined
        if (postId) {
          const updated = await updatePost(postId, { image: url })
          if (updated?.status === "published") revalidateBlog(updated.slug)
        }
        return NextResponse.json({ url })
      } catch (e) {
        const message = e instanceof Error ? e.message : "Error al generar la imagen."
        return NextResponse.json({ error: message }, { status: 502 })
      }
    }

    // La IA propone temas nuevos no canibalizadores.
    if (resource === "propose-topics") {
      try {
        const count = Number(payload.count) || 5
        const locale = payload.locale === "en" ? ("en" as const) : ("es" as const)
        const topics = await proposeTopics(count, locale)
        return NextResponse.json({ topics })
      } catch (e) {
        const message = e instanceof Error ? e.message : "Error al proponer temas."
        return NextResponse.json({ error: message }, { status: 502 })
      }
    }

    // Genera un artículo completo (borrador) a partir de un tema propuesto.
    if (resource === "generate-article") {
      try {
        const topic = payload.topic as ProposedTopic | undefined
        if (!topic?.primary_keyword) {
          return NextResponse.json({ error: "tema inválido." }, { status: 400 })
        }
        const locale = payload.locale === "en" ? ("en" as const) : ("es" as const)
        const draft = await generateArticle(topic, locale)
        revalidateBlog()
        return NextResponse.json({ data: draft })
      } catch (e) {
        const message = e instanceof Error ? e.message : "Error al generar el artículo."
        return NextResponse.json({ error: message }, { status: 502 })
      }
    }

    // Seed idempotente: migra los artículos del archivo TS a la BD. No
    // sobreescribe los ya existentes (ignoreDuplicates), así es seguro re-correr.
    if (resource === "seed-blog") {
      const rows = Object.entries(blogPostsData).map(([slug, p]) => ({
        slug,
        title: p.title,
        excerpt: p.excerpt,
        author: p.author,
        author_role: p.authorRole,
        category: p.category,
        image: p.image,
        read_time: p.readTime,
        date_iso: p.dateISO || null,
        last_modified_iso: p.dateISO || null,
        keywords: p.keywords ?? [],
        primary_keyword: p.keywords?.[0] ?? null,
        content: sanitizeArticleHtml(p.content),
        status: "published",
        origin: "manual",
        published_at: p.dateISO ? new Date(p.dateISO).toISOString() : new Date().toISOString(),
      }))
      const { error } = await supabaseAdmin
        .from("blog_posts")
        .upsert(rows, { onConflict: "slug", ignoreDuplicates: true })
      if (error) throw error
      revalidateBlog()
      return NextResponse.json({ seeded: rows.length })
    }

    if (resource === "insight") {
      const { data, error } = await supabaseAdmin
        .from("sales_insights")
        .insert(payload)
        .select()
        .single()

      if (error) throw error
      return NextResponse.json({ data })
    }

    if (resource === "override") {
      const { data, error } = await supabaseAdmin
        .from("prompt_overrides")
        .insert(payload)
        .select()
        .single()

      if (error) throw error
      return NextResponse.json({ data })
    }

    return NextResponse.json({ error: "Recurso no válido." }, { status: 400 })
  } catch (error) {
    console.error("[Admin API] POST error:", error)
    return NextResponse.json({ error: "Error del servidor." }, { status: 500 })
  }
}

// DELETE /api/admin — eliminar insight u override
export async function DELETE(request: Request) {
  if (!checkAuth(request)) {
    return unauthorized(request)
  }

  try {
    const body = await request.json()
    const { resource, id } = body

    if (resource === "post") {
      if (!id) return NextResponse.json({ error: "ID requerido." }, { status: 400 })
      const existing = await getPostById(id)
      await deletePost(id)
      if (existing) revalidateBlog(existing.slug)
      return NextResponse.json({ success: true })
    }

    const table = resource === "insight" ? "sales_insights"
      : resource === "override" ? "prompt_overrides"
      : null

    if (!table) return NextResponse.json({ error: "Recurso no válido." }, { status: 400 })

    const { error } = await supabaseAdmin.from(table).delete().eq("id", id)
    if (error) throw error
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[Admin API] DELETE error:", error)
    return NextResponse.json({ error: "Error del servidor." }, { status: 500 })
  }
}