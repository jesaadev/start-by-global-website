// Helpers de tracking del lado cliente. Generan un event_id compartido con la
// Conversions API (server) para que Meta deduplique el pixel del navegador y el
// evento server-side.

import { getStoredAttribution, getMetaCookies, type Attribution } from "@/lib/attribution"
import { getConsent } from "@/lib/consent"
import { getSourceArticle } from "@/lib/blog-track-client"

function newEventId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID()
  return `evt-${Date.now()}-${Math.random().toString(36).slice(2)}`
}

function fbqTrack(event: string, eventId: string) {
  const fbq = (window as unknown as { fbq?: (...a: unknown[]) => void }).fbq
  if (typeof fbq === "function") fbq("track", event, {}, { eventID: eventId })
}

/** Lee la variante A/B de navegación (cookie asignada en proxy.ts). */
function getNavVariant(): string | undefined {
  if (typeof document === "undefined") return undefined
  const m = document.cookie.match(/(?:^|; )sbg_nav=([^;]*)/)
  return m ? decodeURIComponent(m[1]) : undefined
}

export interface LeadTrackingPayload {
  source_type: "contact_form" | "chat_email"
  eventId?: string
  attribution: Attribution | null
  fbp?: string
  fbc?: string
  page_url: string
  nav_variant?: string
  segment?: string
  source_article?: string
}

/**
 * Dispara el evento Lead en el pixel del navegador (solo con consentimiento de
 * marketing) y devuelve los datos de tracking para adjuntarlos al POST de
 * /api/contact, que enviará el mismo evento por CAPI con idéntico event_id.
 * Sin consentimiento: no se dispara el pixel ni se envía event_id (el servidor
 * omite CAPI), pero el lead se sigue registrando.
 */
export function fireLead(
  sourceType: "contact_form" | "chat_email",
  segment?: string
): LeadTrackingPayload {
  const page_url = typeof window !== "undefined" ? window.location.href : ""
  const nav_variant = getNavVariant()
  const source_article = getSourceArticle()
  if (!getConsent().marketing) {
    return { source_type: sourceType, attribution: null, page_url, nav_variant, segment, source_article }
  }
  const eventId = newEventId()
  fbqTrack("Lead", eventId)
  const { fbp, fbc } = getMetaCookies()
  return {
    source_type: sourceType,
    eventId,
    attribution: getStoredAttribution(),
    fbp,
    fbc,
    page_url,
    nav_variant,
    segment,
    source_article,
  }
}

/**
 * Dispara el evento Contact (p. ej. clic en WhatsApp) en el pixel del navegador
 * y lo envía por CAPI (fire-and-forget) con el mismo event_id. Requiere
 * consentimiento de marketing.
 */
export function fireContact(segment?: string): void {
  if (typeof window === "undefined") return
  if (!getConsent().marketing) return
  const eventId = newEventId()
  fbqTrack("Contact", eventId)
  const { fbp, fbc } = getMetaCookies()
  fetch("/api/capi", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    keepalive: true,
    body: JSON.stringify({
      eventName: "Contact",
      source_type: "whatsapp",
      eventId,
      attribution: getStoredAttribution(),
      fbp,
      fbc,
      eventSourceUrl: window.location.href,
      nav_variant: getNavVariant(),
      segment,
      source_article: getSourceArticle(),
    }),
  }).catch(() => {})
}

/**
 * Registra un Lead enviado desde el modal de WhatsApp: siempre lo registra
 * server-side (aparece en el medidor de Atribución) y, solo con consentimiento
 * de marketing, dispara también el pixel del navegador y CAPI con event_id
 * compartido para deduplicar.
 */
export function fireWhatsAppLead(info: { name?: string; service?: string; segment?: string }): void {
  if (typeof window === "undefined") return
  const marketing = getConsent().marketing

  const payload: Record<string, unknown> = {
    eventName: "Lead",
    source_type: "whatsapp",
    name: info.name || null,
    service: info.service || null,
    eventSourceUrl: window.location.href,
    attribution: marketing ? getStoredAttribution() : null,
    nav_variant: getNavVariant(),
    segment: info.segment || null,
    source_article: getSourceArticle() || null,
  }

  if (marketing) {
    const eventId = newEventId()
    fbqTrack("Lead", eventId)
    const { fbp, fbc } = getMetaCookies()
    payload.eventId = eventId
    payload.fbp = fbp
    payload.fbc = fbc
  }

  fetch("/api/capi", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    keepalive: true,
    body: JSON.stringify(payload),
  }).catch(() => {})
}
