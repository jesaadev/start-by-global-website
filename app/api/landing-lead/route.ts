import { NextResponse } from "next/server"
import { Resend } from "resend"
import { sendCapiEvent, getClientIp } from "@/lib/meta-capi"
import { logLeadEvent } from "@/lib/lead-events"
import { logLandingEvent } from "@/lib/landing-events"
import { enforceRateLimit } from "@/lib/rate-limit"
import { sameOriginOk, isBot } from "@/lib/request-guards"
import type { Attribution } from "@/lib/attribution"

// Endpoint dedicado a las landings por buyer persona. A diferencia de
// /api/contact (que exige email), aquí el visitante puede dejar WhatsApp O
// correo. Sirve dos conversiones: la agenda (Bloque 8) y el lead magnet
// (Bloque 9), distinguidas por `kind`.

interface Body {
  kind?: "agenda" | "lead_magnet"
  landing?: string // persona / slug, para contexto en la notificación
  landingKey?: string // clave de analítica (segment): landing_a…
  session_id?: string
  name?: string
  contact?: string // email o teléfono
  qualifier?: string // "a qué se dedica", "profesión", "URL tienda", "empresa"…
  qualifierLabel?: string
  asset?: string // nombre del descargable (lead magnet)
  company_website?: string // honeypot
  // tracking
  eventId?: string
  attribution?: Attribution | null
  fbp?: string
  fbc?: string
  page_url?: string
  nav_variant?: string | null
  segment?: string | null
  locale?: string | null
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;").replace(/'/g, "&#039;")
}

export async function POST(request: Request) {
  try {
    const limited = enforceRateLimit(request, "landing-lead", 5, 10 * 60 * 1000)
    if (limited) return limited
    if (!sameOriginOk(request)) {
      return NextResponse.json({ error: "Origen no permitido." }, { status: 403 })
    }

    const body = (await request.json()) as Body
    // Honeypot: si el bot rellenó el campo trampa, fingimos éxito.
    if (isBot(body as Record<string, unknown>)) {
      return NextResponse.json({ success: true })
    }

    const kind = body.kind === "lead_magnet" ? "lead_magnet" : "agenda"
    const name = (body.name ?? "").trim()
    const contact = (body.contact ?? "").trim()
    const qualifier = (body.qualifier ?? "").trim()

    // El lead magnet solo exige el contacto; la agenda además el nombre.
    if (!contact || (kind === "agenda" && !name)) {
      return NextResponse.json({ error: "Faltan datos obligatorios." }, { status: 400 })
    }

    const isEmail = EMAIL_RE.test(contact)
    const isPhone = !isEmail && contact.replace(/[^0-9]/g, "").length >= 7
    if (!isEmail && !isPhone) {
      return NextResponse.json({ error: "Deja un WhatsApp o un correo válido." }, { status: 400 })
    }
    const email = isEmail ? contact : null
    const phone = isPhone ? contact : null

    const landing = (body.landing ?? "landing").trim()
    const segment = (body.segment ?? (kind === "lead_magnet" ? `lead_magnet:${landing}` : `landing:${landing}`)) as string

    // ── Tracking: CAPI + medidor de atribución (aunque falle el email) ──
    let capiStatus: string | undefined
    try {
      if (body.eventId) {
        capiStatus = await sendCapiEvent({
          eventName: kind === "lead_magnet" ? "CompleteRegistration" : "Lead",
          eventId: body.eventId,
          eventSourceUrl: body.page_url,
          email,
          phone,
          firstName: name || null,
          clientIp: getClientIp(request.headers),
          userAgent: request.headers.get("user-agent") ?? undefined,
          fbp: body.fbp,
          fbc: body.fbc,
          fbclid: body.attribution?.fbclid,
        })
      }
      await logLeadEvent({
        // El medidor usa Lead/Contact; el lead magnet se distingue por segment.
        event_name: "Lead",
        source_type: isPhone ? "whatsapp" : "contact_form",
        email,
        name: name || null,
        attribution: body.attribution ?? null,
        page_url: body.page_url ?? null,
        capi_status: capiStatus,
        nav_variant: body.nav_variant ?? null,
        segment,
        locale: body.locale ?? "es",
      })
      // Embudo de la pestaña "Landings".
      await logLandingEvent({
        landing: (body.landingKey ?? landing).slice(0, 60),
        event_type: kind === "lead_magnet" ? "lead_magnet" : "lead",
        session_id: body.session_id ?? null,
        path: body.page_url ?? null,
        attribution: body.attribution ?? null,
      })
    } catch (e) {
      console.error("[Landing Lead] tracking error:", e)
    }

    // ── Notificación interna por email (Resend) ──
    const resendApiKey = process.env.RESEND_API_KEY
    if (resendApiKey) {
      try {
        const resend = new Resend(resendApiKey)
        const fromEmail = process.env.CONTACT_FROM_EMAIL ?? "Start By Global <onboarding@startbyglobal.com>"
        const parsedTo = (process.env.CONTACT_TO_EMAILS ?? "").split(",").map((s) => s.trim()).filter(Boolean)
        const toEmails = parsedTo.length > 0 ? parsedTo : ["info@startbyglobal.com"]
        const ccEmails = process.env.CONTACT_CC_EMAILS?.split(",").map((s) => s.trim()).filter(Boolean)

        const title = kind === "lead_magnet" ? "Descarga de lead magnet" : "Nueva solicitud de agenda"
        const rows: Array<[string, string]> = [
          ["Landing", landing],
          ["Tipo", kind === "lead_magnet" ? `Lead magnet: ${body.asset ?? "—"}` : "Agenda / diagnóstico"],
          ...(name ? [["Nombre", name] as [string, string]] : []),
          [isEmail ? "Correo" : "WhatsApp", contact],
          ...(qualifier ? [[(body.qualifierLabel ?? "Detalle"), qualifier] as [string, string]] : []),
        ]
        const html = `<div style="font-family:sans-serif;max-width:600px;margin:0 auto">
          <h2 style="color:#e05a2b">${escapeHtml(title)}</h2>
          <table style="border-collapse:collapse;width:100%">
          ${rows.map(([k, v]) => `<tr><td style="padding:6px 10px;color:#7d8590;font-size:12px;text-transform:uppercase">${escapeHtml(k)}</td><td style="padding:6px 10px;font-size:14px">${escapeHtml(v)}</td></tr>`).join("")}
          </table></div>`
        const text = rows.map(([k, v]) => `${k}: ${v}`).join("\n")

        await resend.emails.send({
          from: fromEmail,
          to: toEmails,
          ...(ccEmails?.length ? { cc: ccEmails } : {}),
          ...(email ? { replyTo: email } : {}),
          subject: `${title} — ${landing}${name ? ` — ${name}` : ""}`,
          html,
          text,
        })
      } catch (err) {
        console.error("[Landing Lead] Resend exception:", err)
        // No es fatal: el lead ya quedó registrado en el medidor.
      }
    } else {
      console.warn("[Landing Lead] RESEND_API_KEY no configurado: sin notificación por email.")
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[Landing Lead] Unexpected error:", error)
    return NextResponse.json({ error: "Error interno del servidor." }, { status: 500 })
  }
}
