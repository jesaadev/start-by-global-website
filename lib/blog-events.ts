import { supabaseAdmin } from "@/lib/supabase"
import type { Attribution } from "@/lib/attribution"

export type BlogEventType = "view" | "scroll" | "engaged" | "cta_click" | "share" | "read_complete"

export interface BlogEventInput {
  slug: string
  event_type: BlogEventType
  value?: number | null
  target?: string | null
  session_id?: string | null
  attribution?: Attribution | null
}

export async function logBlogEvent(input: BlogEventInput): Promise<void> {
  const a = input.attribution ?? null
  const { error } = await supabaseAdmin.from("blog_events").insert({
    slug: input.slug,
    event_type: input.event_type,
    value: input.value ?? null,
    target: input.target ?? null,
    session_id: input.session_id ?? null,
    channel: a?.channel ?? null,
    utm_source: a?.utm_source ?? null,
    utm_medium: a?.utm_medium ?? null,
    utm_campaign: a?.utm_campaign ?? null,
    referrer: a?.referrer ?? null,
  })
  if (error) console.error("[blog_events] insert error:", error)
}

// ─── Aggregation ──────────────────────────────────────────────────────────────

interface BlogRow {
  slug: string
  event_type: string
  value: number | null
  session_id: string | null
  channel: string | null
}

export interface ArticleStat {
  slug: string
  views: number
  sessions: number
  read_complete: number
  avg_engaged: number // segundos
  cta_clicks: number
  shares: number
  conversions: number
  top_channel: string
}

export interface BlogStats {
  total_views: number
  total_cta: number
  total_shares: number
  total_conversions: number
  articles: ArticleStat[]
  days: number
}

export async function getBlogStats(days = 30): Promise<BlogStats> {
  const since = new Date(Date.now() - days * 864e5).toISOString()

  const [{ data: events }, { data: leads }] = await Promise.all([
    supabaseAdmin
      .from("blog_events")
      .select("slug, event_type, value, session_id, channel")
      .gte("created_at", since)
      .limit(50000),
    supabaseAdmin
      .from("lead_events")
      .select("source_article")
      .gte("created_at", since)
      .not("source_article", "is", null),
  ])

  const rows = (events ?? []) as BlogRow[]

  // Conversiones por artículo (desde lead_events.source_article).
  const conv: Record<string, number> = {}
  for (const l of (leads ?? []) as { source_article: string | null }[]) {
    if (l.source_article) conv[l.source_article] = (conv[l.source_article] ?? 0) + 1
  }

  type Acc = {
    views: number
    sessions: Set<string>
    read_complete: number
    engagedSum: number
    engagedCount: number
    cta_clicks: number
    shares: number
    channels: Record<string, number>
  }
  const map = new Map<string, Acc>()
  const get = (slug: string): Acc => {
    let a = map.get(slug)
    if (!a) {
      a = { views: 0, sessions: new Set(), read_complete: 0, engagedSum: 0, engagedCount: 0, cta_clicks: 0, shares: 0, channels: {} }
      map.set(slug, a)
    }
    return a
  }

  for (const r of rows) {
    const a = get(r.slug)
    switch (r.event_type) {
      case "view":
        a.views++
        if (r.session_id) a.sessions.add(r.session_id)
        if (r.channel) a.channels[r.channel] = (a.channels[r.channel] ?? 0) + 1
        break
      case "read_complete":
        a.read_complete++
        break
      case "engaged":
        if (typeof r.value === "number") {
          a.engagedSum += r.value
          a.engagedCount++
        }
        break
      case "cta_click":
        a.cta_clicks++
        break
      case "share":
        a.shares++
        break
    }
  }

  // Incluir artículos que solo tienen conversiones (sin eventos en rango).
  for (const slug of Object.keys(conv)) get(slug)

  const articles: ArticleStat[] = [...map.entries()].map(([slug, a]) => ({
    slug,
    views: a.views,
    sessions: a.sessions.size,
    read_complete: a.read_complete,
    avg_engaged: a.engagedCount ? Math.round(a.engagedSum / a.engagedCount) : 0,
    cta_clicks: a.cta_clicks,
    shares: a.shares,
    conversions: conv[slug] ?? 0,
    top_channel: Object.entries(a.channels).sort((x, y) => y[1] - x[1])[0]?.[0] ?? "—",
  }))
  articles.sort((x, y) => y.views - x.views || y.conversions - x.conversions)

  return {
    total_views: articles.reduce((s, a) => s + a.views, 0),
    total_cta: articles.reduce((s, a) => s + a.cta_clicks, 0),
    total_shares: articles.reduce((s, a) => s + a.shares, 0),
    total_conversions: articles.reduce((s, a) => s + a.conversions, 0),
    articles,
    days,
  }
}
