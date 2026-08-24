import { supabaseAdmin } from "@/lib/supabase"
import type { Attribution } from "@/lib/attribution"

// Embudo de las landings por persona. Registra cada paso (view → scroll75 →
// lead / lead_magnet / contact) para la pestaña "Landings" del admin.

export type LandingEventType = "view" | "scroll75" | "lead" | "lead_magnet" | "contact"

export interface LandingEventInput {
  landing: string // clave (segment): landing_a…
  event_type: LandingEventType
  session_id?: string | null
  path?: string | null
  attribution?: Attribution | null
}

export async function logLandingEvent(input: LandingEventInput): Promise<void> {
  const a = input.attribution ?? null
  const { error } = await supabaseAdmin.from("landing_events").insert({
    landing: input.landing,
    event_type: input.event_type,
    session_id: input.session_id ?? null,
    path: input.path ?? null,
    channel: a?.channel ?? "unknown",
    utm_source: a?.utm_source ?? null,
    utm_medium: a?.utm_medium ?? null,
    utm_campaign: a?.utm_campaign ?? null,
  })
  if (error) console.error("[LandingEvents] insert error:", error.message)
}

export interface LandingFunnel {
  landing: string
  views: number
  visitors: number // sesiones únicas
  scroll75: number
  leads: number
  lead_magnets: number
  contacts: number
  lead_rate: number // leads / visitantes (%)
  scroll_rate: number // scroll75 / visitantes (%)
}

export interface LandingStats {
  days: number
  totals: {
    views: number
    visitors: number
    scroll75: number
    leads: number
    lead_magnets: number
    contacts: number
  }
  landings: LandingFunnel[]
  by_channel: Record<string, number> // leads por canal
}

/** Agrega el embudo por landing en una ventana de días. */
export async function getLandingStats(days = 30): Promise<LandingStats> {
  const since = new Date(Date.now() - days * 86400_000).toISOString()
  const { data, error } = await supabaseAdmin
    .from("landing_events")
    .select("landing, event_type, session_id, channel")
    .gte("created_at", since)
    .limit(100000)

  const empty: LandingStats = {
    days,
    totals: { views: 0, visitors: 0, scroll75: 0, leads: 0, lead_magnets: 0, contacts: 0 },
    landings: [],
    by_channel: {},
  }
  if (error || !data) {
    if (error) console.error("[LandingEvents] getLandingStats error:", error.message)
    return empty
  }

  interface Acc {
    views: number
    sessions: Set<string>
    scroll75: number
    leads: number
    lead_magnets: number
    contacts: number
  }
  const map = new Map<string, Acc>()
  const byChannel: Record<string, number> = {}

  for (const r of data as Array<{ landing: string; event_type: string; session_id: string | null; channel: string | null }>) {
    let a = map.get(r.landing)
    if (!a) {
      a = { views: 0, sessions: new Set(), scroll75: 0, leads: 0, lead_magnets: 0, contacts: 0 }
      map.set(r.landing, a)
    }
    if (r.session_id) a.sessions.add(r.session_id)
    switch (r.event_type) {
      case "view": a.views++; break
      case "scroll75": a.scroll75++; break
      case "lead": a.leads++; byChannel[r.channel ?? "unknown"] = (byChannel[r.channel ?? "unknown"] ?? 0) + 1; break
      case "lead_magnet": a.lead_magnets++; break
      case "contact": a.contacts++; break
    }
  }

  const landings: LandingFunnel[] = [...map.entries()]
    .map(([landing, a]) => {
      const visitors = a.sessions.size || a.views
      return {
        landing,
        views: a.views,
        visitors,
        scroll75: a.scroll75,
        leads: a.leads,
        lead_magnets: a.lead_magnets,
        contacts: a.contacts,
        lead_rate: visitors ? Math.round((a.leads / visitors) * 1000) / 10 : 0,
        scroll_rate: visitors ? Math.round((a.scroll75 / visitors) * 1000) / 10 : 0,
      }
    })
    .sort((x, y) => y.leads - x.leads || y.views - x.views)

  const totals = landings.reduce(
    (t, l) => ({
      views: t.views + l.views,
      visitors: t.visitors + l.visitors,
      scroll75: t.scroll75 + l.scroll75,
      leads: t.leads + l.leads,
      lead_magnets: t.lead_magnets + l.lead_magnets,
      contacts: t.contacts + l.contacts,
    }),
    empty.totals
  )

  return { days, totals, landings, by_channel: byChannel }
}
