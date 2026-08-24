import { NextResponse } from "next/server"
import { logLandingEvent, type LandingEventType } from "@/lib/landing-events"
import { enforceRateLimit } from "@/lib/rate-limit"
import { sameOriginOk } from "@/lib/request-guards"
import type { Attribution } from "@/lib/attribution"

// Señales ligeras del embudo de landings (view, scroll75, contact).
// Fire-and-forget desde el cliente. Las conversiones (lead / lead_magnet) se
// registran desde /api/landing-lead.

const LIGHT_EVENTS = new Set<LandingEventType>(["view", "scroll75", "contact"])

interface Body {
  landing?: string
  event_type?: string
  session_id?: string
  path?: string
  attribution?: Attribution | null
}

export async function POST(request: Request) {
  try {
    const limited = enforceRateLimit(request, "landing-event", 120, 60 * 1000)
    if (limited) return limited
    if (!sameOriginOk(request)) {
      return NextResponse.json({ error: "Origen no permitido." }, { status: 403 })
    }
    const body = (await request.json()) as Body
    const et = body.event_type as LandingEventType | undefined
    if (!body.landing || !et || !LIGHT_EVENTS.has(et)) {
      return NextResponse.json({ error: "Evento inválido." }, { status: 400 })
    }
    await logLandingEvent({
      landing: body.landing.slice(0, 60),
      event_type: et,
      session_id: body.session_id ?? null,
      path: body.path ?? null,
      attribution: body.attribution ?? null,
    })
    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error("[Landing Event] error:", error)
    return NextResponse.json({ error: "Error interno." }, { status: 500 })
  }
}
