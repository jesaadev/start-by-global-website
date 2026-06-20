import { supabaseAdmin } from "@/lib/supabase"
import type { Attribution } from "@/lib/attribution"

export interface LeadEventInput {
  event_name: "Lead" | "Contact"
  source_type: "contact_form" | "chat_email" | "whatsapp"
  email?: string | null
  name?: string | null
  attribution?: Attribution | null
  page_url?: string | null
  capi_status?: string | null
  nav_variant?: string | null
  segment?: string | null
}

/** Registra un evento de conversión con su atribución para el medidor de Insights. */
export async function logLeadEvent(input: LeadEventInput): Promise<void> {
  const a = input.attribution ?? null
  const { error } = await supabaseAdmin.from("lead_events").insert({
    event_name: input.event_name,
    source_type: input.source_type,
    channel: a?.channel ?? "unknown",
    email: input.email ?? null,
    name: input.name ?? null,
    utm_source: a?.utm_source ?? null,
    utm_medium: a?.utm_medium ?? null,
    utm_campaign: a?.utm_campaign ?? null,
    utm_term: a?.utm_term ?? null,
    utm_content: a?.utm_content ?? null,
    referrer: a?.referrer ?? null,
    landing_page: a?.landing_page ?? null,
    page_url: input.page_url ?? null,
    fbclid: a?.fbclid ?? null,
    gclid: a?.gclid ?? null,
    capi_status: input.capi_status ?? null,
    nav_variant: input.nav_variant ?? null,
    segment: input.segment ?? null,
  })
  if (error) console.error("[lead_events] insert error:", error)
}

// ─── Agregación para el panel ───────────────────────────────────────────────

interface LeadRow {
  event_name: string
  source_type: string
  channel: string
  email: string | null
  name: string | null
  utm_source: string | null
  utm_campaign: string | null
  capi_status: string | null
  nav_variant: string | null
  segment: string | null
  created_at: string
}

export interface AttributionStats {
  total: number
  total_leads: number
  total_contacts: number
  by_channel: Record<string, number>
  by_source: Record<string, number>
  by_variant: Record<string, number>
  by_segment: Record<string, number>
  top_campaigns: Array<{ campaign: string; count: number }>
  recent: LeadRow[]
  days: number
}

export async function getAttributionStats(days = 30): Promise<AttributionStats> {
  const since = new Date(Date.now() - days * 864e5).toISOString()

  const { data, error } = await supabaseAdmin
    .from("lead_events")
    .select("event_name, source_type, channel, email, name, utm_source, utm_campaign, capi_status, nav_variant, segment, created_at")
    .gte("created_at", since)
    .order("created_at", { ascending: false })
    .limit(2000)

  const rows = (data ?? []) as LeadRow[]
  if (error) console.error("[lead_events] stats error:", error)

  const by_channel: Record<string, number> = {}
  const by_source: Record<string, number> = {}
  const by_variant: Record<string, number> = {}
  const by_segment: Record<string, number> = {}
  const campaigns: Record<string, number> = {}
  let total_leads = 0
  let total_contacts = 0

  for (const r of rows) {
    by_channel[r.channel] = (by_channel[r.channel] ?? 0) + 1
    by_source[r.source_type] = (by_source[r.source_type] ?? 0) + 1
    if (r.nav_variant) by_variant[r.nav_variant] = (by_variant[r.nav_variant] ?? 0) + 1
    if (r.segment) by_segment[r.segment] = (by_segment[r.segment] ?? 0) + 1
    if (r.event_name === "Lead") total_leads++
    else if (r.event_name === "Contact") total_contacts++
    if (r.utm_campaign) campaigns[r.utm_campaign] = (campaigns[r.utm_campaign] ?? 0) + 1
  }

  const top_campaigns = Object.entries(campaigns)
    .map(([campaign, count]) => ({ campaign, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10)

  return {
    total: rows.length,
    total_leads,
    total_contacts,
    by_channel,
    by_source,
    by_variant,
    by_segment,
    top_campaigns,
    recent: rows.slice(0, 25),
    days,
  }
}
