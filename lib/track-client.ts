// Helpers de tracking del lado cliente. Generan un event_id compartido con la
// Conversions API (server) para que Meta deduplique el pixel del navegador y el
// evento server-side.

import { getStoredAttribution, getMetaCookies, type Attribution } from "@/lib/attribution"

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
  eventId: string
  attribution: Attribution | null
  fbp?: string
  fbc?: string
  page_url: string
}

/**
 * Dispara el evento Lead en el pixel del navegador y devuelve los datos de
 * tracking para adjuntarlos al POST de /api/contact (que enviará el mismo
 * evento por CAPI con idéntico event_id).
 */
export function fireLead(sourceType: "contact_form" | "chat_email"): LeadTrackingPayload {
  const eventId = newEventId()
  fbqTrack("Lead", eventId)
  const { fbp, fbc } = getMetaCookies()
  return {
    source_type: sourceType,
    eventId,
    attribution: getStoredAttribution(),
    fbp,
    fbc,
    page_url: typeof window !== "undefined" ? window.location.href : "",
  }
}

/**
 * Dispara el evento Contact (p. ej. clic en WhatsApp) en el pixel del navegador
 * y lo envía por CAPI (fire-and-forget) con el mismo event_id.
 */
export function fireContact(): void {
  if (typeof window === "undefined") return
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
