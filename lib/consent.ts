// Gestión de consentimiento de cookies (RGPD/ePrivacy), geo-condicional.
// - Región "eu": bloqueo previo — nada de tracking hasta que el usuario acepta.
// - Región "row": cookies abiertas por defecto (salvo que el usuario rechace).

export interface ConsentCategories {
  analytics: boolean
  marketing: boolean
}
export interface ConsentState extends ConsentCategories {
  set: boolean // ¿el usuario tomó una decisión explícita?
}

const CONSENT_COOKIE = "sbg_consent"
const REGION_COOKIE = "sbg_region"
const CONSENT_DAYS = 180

export const CONSENT_CHANGE_EVENT = "sbg-consent-change"
export const OPEN_CONSENT_EVENT = "sbg-open-consent"

const SERVER_SNAPSHOT: ConsentState = { analytics: false, marketing: false, set: false }

function readCookie(name: string): string | null {
  if (typeof document === "undefined") return null
  const m = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`))
  return m ? decodeURIComponent(m[1]) : null
}

function writeCookie(name: string, value: string, days: number) {
  if (typeof document === "undefined") return
  const expires = new Date(Date.now() + days * 864e5).toUTCString()
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax`
}

export function getRegion(): "eu" | "row" {
  return readCookie(REGION_COOKIE) === "row" ? "row" : "eu"
}

function readStored(): ConsentState | null {
  const raw = readCookie(CONSENT_COOKIE)
  if (!raw) return null
  try {
    const p = JSON.parse(raw) as Partial<ConsentState>
    return { analytics: !!p.analytics, marketing: !!p.marketing, set: true }
  } catch {
    return null
  }
}

function compute(): ConsentState {
  const stored = readStored()
  if (stored) return stored
  // Sin decisión previa: en la UE todo denegado; fuera, abierto por defecto.
  return getRegion() === "row"
    ? { analytics: true, marketing: true, set: false }
    : { analytics: false, marketing: false, set: false }
}

// ─── Snapshot cacheado (para useSyncExternalStore) ──────────────────────────

let snapshot: ConsentState = SERVER_SNAPSHOT

function refresh() {
  if (typeof document === "undefined") return
  snapshot = compute()
}
// Inicializa en cliente al cargar el módulo.
refresh()

export function getSnapshot(): ConsentState {
  return snapshot
}
export function getServerSnapshot(): ConsentState {
  return SERVER_SNAPSHOT
}

export function subscribe(callback: () => void): () => void {
  if (typeof window === "undefined") return () => {}
  const handler = () => {
    refresh()
    callback()
  }
  window.addEventListener(CONSENT_CHANGE_EVENT, handler)
  return () => window.removeEventListener(CONSENT_CHANGE_EVENT, handler)
}

// ─── Lectura puntual y escritura ────────────────────────────────────────────

/** Lee el consentimiento efectivo sin hook (para helpers no-React). */
export function getConsent(): ConsentState {
  return typeof document === "undefined" ? SERVER_SNAPSHOT : compute()
}

export function setConsent(categories: ConsentCategories) {
  writeCookie(CONSENT_COOKIE, JSON.stringify({ ...categories, set: true }), CONSENT_DAYS)
  refresh()
  if (typeof window !== "undefined") window.dispatchEvent(new Event(CONSENT_CHANGE_EVENT))
}

/** ¿Debe mostrarse el banner? Solo en la UE y sin decisión previa. */
export function shouldShowBanner(): boolean {
  return getRegion() === "eu" && !readStored()
}

/** Abre el panel de preferencias desde cualquier parte (p. ej. footer). */
export function openConsentPreferences() {
  if (typeof window !== "undefined") window.dispatchEvent(new Event(OPEN_CONSENT_EVENT))
}
