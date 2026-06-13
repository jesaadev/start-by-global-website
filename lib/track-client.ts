// Helpers de tracking del lado cliente. Generan un event_id compartido con la
// Conversions API (server) para que Meta deduplique el pixel del navegador y el
// evento server-side.

import { getStoredAttribution, getMetaCookies, type Attribution } from "@/lib/attribution"
import { getConsent } from "@/lib/consent"

function newEventId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID()
  return `evt-${Date.now()}-${Math.random().toString(36).slice(2)}`
}

function fbqTrack(event: string, eventId: string) {
  const fbq = (window as unknown as { fbq?: (...a: unknown[]) => void }).fbq
  if (typeof fbq === "function") fbq("track", event, {}, { eventID: eventId })
}

export interface LeadTrackingPayload {
  source_type: "contact_form" | "chat_email"
  eventId?: string
  attribution: Attribution | null
  fbp?: string
  fbc?: string
  page_url: string
}

/**
 * Dispara el evento Lead en el pixel del navegador (solo con consentimiento de
 * marketing) y devuelve los datos de tracking para adjuntarlos al POST de
 * /api/contact, que enviará el mismo evento por CAPI con idéntico event_id.
 * Sin consentimiento: no se dispara el pixel ni se envía event_id (el servidor
 * omite CAPI), pero el lead se sigue registrando.
 */
export function fireLead(sourceType: "contact_form" | "chat_email"): LeadTrackingPayload {
  const page_url = typeof window !== "undefined" ? window.location.href : ""
  if (!getConsent().marketing) {
    return { source_type: sourceType, attribution: null, page_url }
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
  }
}

/**
 * Dispara el evento Contact (p. ej. clic en WhatsApp) en el pixel del navegador
 * y lo envía por CAPI (fire-and-forget) con el mismo event_id. Requiere
 * consentimiento de marketing.
 */
export function fireContact(): void {
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
    }),
  }).catch(() => {})
}
