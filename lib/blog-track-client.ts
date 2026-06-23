// Tracking de blog del lado cliente. Gated por consentimiento analítico.

import { getConsent } from "@/lib/consent"
import { getStoredAttribution } from "@/lib/attribution"

const SRC_ARTICLE_COOKIE = "sbg_src_article"

function sessionId(): string {
  try {
    let id = sessionStorage.getItem("sbg_bsid")
    if (!id) {
      id =
        typeof crypto !== "undefined" && "randomUUID" in crypto
          ? crypto.randomUUID()
          : `b-${Date.now()}-${Math.random().toString(36).slice(2)}`
      sessionStorage.setItem("sbg_bsid", id)
    }
    return id
  } catch {
    return "anon"
  }
}

function payload(slug: string, event_type: string, opts?: { value?: number; target?: string }) {
  return JSON.stringify({
    slug,
    event_type,
    value: opts?.value ?? null,
    target: opts?.target ?? null,
    session_id: sessionId(),
    attribution: getStoredAttribution(),
  })
}

/** Registra un evento de blog (fetch keepalive). No hace nada sin consentimiento analítico. */
export function trackBlogEvent(slug: string, event_type: string, opts?: { value?: number; target?: string }) {
  if (typeof window === "undefined" || !getConsent().analytics) return
  fetch("/api/blog-track", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    keepalive: true,
    body: payload(slug, event_type, opts),
  }).catch(() => {})
}

/** Variante con sendBeacon, fiable al cerrar/ocultar la pestaña. */
export function beaconBlogEvent(slug: string, event_type: string, opts?: { value?: number; target?: string }) {
  if (typeof window === "undefined" || !getConsent().analytics) return
  const body = payload(slug, event_type, opts)
  try {
    if (navigator.sendBeacon) {
      navigator.sendBeacon("/api/blog-track", new Blob([body], { type: "application/json" }))
      return
    }
  } catch {
    /* cae a fetch */
  }
  fetch("/api/blog-track", { method: "POST", headers: { "Content-Type": "application/json" }, keepalive: true, body }).catch(() => {})
}

/** Marca el artículo de origen para atribuir una conversión futura (cookie 1 día). */
export function setSourceArticle(slug: string) {
  if (typeof document === "undefined" || !getConsent().analytics) return
  const expires = new Date(Date.now() + 864e5).toUTCString()
  document.cookie = `${SRC_ARTICLE_COOKIE}=${encodeURIComponent(slug)}; expires=${expires}; path=/; SameSite=Lax`
}

/** Lee el artículo de origen (para los helpers de lead). */
export function getSourceArticle(): string | undefined {
  if (typeof document === "undefined") return undefined
  const m = document.cookie.match(new RegExp(`(?:^|; )${SRC_ARTICLE_COOKIE}=([^;]*)`))
  return m ? decodeURIComponent(m[1]) : undefined
}
