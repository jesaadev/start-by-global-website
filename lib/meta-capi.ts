import crypto from "node:crypto"
import { getSiteSettings } from "@/lib/site-settings"
import { clientIp } from "@/lib/request-guards"

// Meta Conversions API (server-side). Envía eventos a Meta con los datos del
// usuario hasheados (SHA-256) y un event_id compartido con el pixel del
// navegador para que Meta deduplique browser + server.

const GRAPH_VERSION = "v21.0"

function sha256(value?: string | null): string | undefined {
  const v = value?.trim().toLowerCase()
  if (!v) return undefined
  return crypto.createHash("sha256").update(v).digest("hex")
}

export interface CapiEvent {
  eventName: "Lead" | "Contact" | "PageView"
  eventId: string
  eventSourceUrl?: string
  email?: string | null
  phone?: string | null
  firstName?: string | null
  clientIp?: string
  userAgent?: string
  fbp?: string
  fbc?: string
  fbclid?: string
  customData?: Record<string, unknown>
}

export type CapiStatus = "sent" | "skipped" | "error"

/**
 * Construye el parámetro fbc a partir de fbclid si no llega la cookie _fbc.
 * Formato requerido por Meta: fb.1.<timestamp_ms>.<fbclid>
 */
function deriveFbc(fbc?: string, fbclid?: string): string | undefined {
  if (fbc) return fbc
  if (fbclid) return `fb.1.${Date.now()}.${fbclid}`
  return undefined
}

export async function sendCapiEvent(ev: CapiEvent): Promise<CapiStatus> {
  const token = process.env.META_CAPI_ACCESS_TOKEN
  const { pixels } = await getSiteSettings()
  const pixelId = pixels.metaPixelId

  // Sin token o sin pixel configurado, no se envía (no es un error).
  if (!token || !pixelId) return "skipped"

  const userData: Record<string, unknown> = {}
  const em = sha256(ev.email)
  if (em) userData.em = [em]
  const ph = sha256(ev.phone?.replace(/[^0-9]/g, ""))
  if (ph) userData.ph = [ph]
  const fn = sha256(ev.firstName)
  if (fn) userData.fn = [fn]
  if (ev.clientIp) userData.client_ip_address = ev.clientIp
  if (ev.userAgent) userData.client_user_agent = ev.userAgent
  if (ev.fbp) userData.fbp = ev.fbp
  const fbc = deriveFbc(ev.fbc, ev.fbclid)
  if (fbc) userData.fbc = fbc

  const payload: Record<string, unknown> = {
    data: [
      {
        event_name: ev.eventName,
        event_time: Math.floor(Date.now() / 1000),
        event_id: ev.eventId,
        action_source: "website",
        ...(ev.eventSourceUrl ? { event_source_url: ev.eventSourceUrl } : {}),
        user_data: userData,
        ...(ev.customData ? { custom_data: ev.customData } : {}),
      },
    ],
  }

  // Código de prueba opcional para validar en el Events Manager de Meta.
  const testCode = process.env.META_CAPI_TEST_CODE
  if (testCode) payload.test_event_code = testCode

  try {
    const res = await fetch(
      `https://graph.facebook.com/${GRAPH_VERSION}/${pixelId}/events?access_token=${token}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }
    )
    if (!res.ok) {
      console.error("[CAPI] Meta respondió", res.status, await res.text().catch(() => ""))
      return "error"
    }
    return "sent"
  } catch (e) {
    console.error("[CAPI] excepción al enviar evento:", e)
    return "error"
  }
}

/** IP del cliente para CAPI (usa la extracción centralizada con headers de confianza). */
export function getClientIp(headers: Headers): string | undefined {
  const ip = clientIp(headers)
  return ip === "unknown" ? undefined : ip
}
