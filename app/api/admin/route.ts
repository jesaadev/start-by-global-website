import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase"
import { readSiteSettings, saveSiteSettings } from "@/lib/site-settings"
import { getAttributionStats } from "@/lib/lead-events"
import { getBlogStats } from "@/lib/blog-events"
import { getArticleQueries, gscConfigured } from "@/lib/gsc"

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD

function checkAuth(request: Request): boolean {
  // Falla de forma segura: sin ADMIN_PASSWORD configurado, nadie entra.
  if (!ADMIN_PASSWORD) {
    console.error("[Admin API] ADMIN_PASSWORD no está configurado en el entorno.")
    return false
  }
  const auth = request.headers.get("x-admin-password")
  return auth === ADMIN_PASSWORD
}

// GET /api/admin?resource=conversations|insights|overrides&page=1
export async function GET(request: Request) {
  if (!checkAuth(request)) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 })
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
    return NextResponse.json({ error: "No autorizado." }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { resource, id, ...updates } = body

    if (resource === "seo") {
      const saved = await saveSiteSettings(updates.data)
      return NextResponse.json({ data: saved })
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
    return NextResponse.json({ error: "No autorizado." }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { resource, ...payload } = body

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
    return NextResponse.json({ error: "No autorizado." }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { resource, id } = body

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