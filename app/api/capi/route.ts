import { NextResponse } from "next/server"
import { sendCapiEvent, getClientIp, type CapiStatus } from "@/lib/meta-capi"
import { logLeadEvent } from "@/lib/lead-events"
import { enforceRateLimit } from "@/lib/rate-limit"
import { sameOriginOk } from "@/lib/request-guards"
import type { Attribution } from "@/lib/attribution"

interface CapiBody {
  eventName: "Lead" | "Contact" | "PageView"
  eventId?: string
  source_type?: "whatsapp"
  email?: string | null
  name?: string | null
  service?: string | null
  attribution?: Attribution | null
  fbp?: string
  fbc?: string
  eventSourceUrl?: string
  nav_variant?: string | null
  segment?: string | null
}

export async function POST(request: Request) {
  try {
    const limited = enforceRateLimit(request, "capi", 60, 60 * 1000)
    if (limited) return limited
    if (!sameOriginOk(request)) {
      return NextResponse.json({ error: "Origen no permitido." }, { status: 403 })
    }

    const body = (await request.json()) as CapiBody

    if (!body?.eventName) {
      return NextResponse.json({ error: "Datos inválidos." }, { status: 400 })
    }

    // Envío a Meta (CAPI) solo si llega event_id, que el cliente incluye
    // únicamente cuando hay consentimiento de marketing.
    let status: CapiStatus = "skipped"
    if (body.eventId) {
      status = await sendCapiEvent({
        eventName: body.eventName,
        eventId: body.eventId,
        eventSourceUrl: body.eventSourceUrl,
        email: body.email,
        firstName: body.name,
        clientIp: getClientIp(request.headers),
        userAgent: request.headers.get("user-agent") ?? undefined,
        fbp: body.fbp,
        fbc: body.fbc,
        fbclid: body.attribution?.fbclid,
        customData: body.service ? { content_name: body.service } : undefined,
      })
    }

    // Registramos eventos significativos (Lead, Contact) siempre — alimentan el
    // medidor de atribución aunque no haya consentimiento de marketing.
    // PageView no se almacena.
    if (body.eventName === "Lead" || body.eventName === "Contact") {
      await logLeadEvent({
        event_name: body.eventName,
        source_type: body.source_type ?? "whatsapp",
        email: body.email,
        name: body.name,
        attribution: body.attribution,
        page_url: body.eventSourceUrl,
        capi_status: status,
        nav_variant: body.nav_variant,
        segment: body.segment,
      })
    }

    return NextResponse.json({ ok: true, capi: status })
  } catch (error) {
    console.error("[CAPI route] error:", error)
    return NextResponse.json({ error: "Error interno." }, { status: 500 })
  }
}
