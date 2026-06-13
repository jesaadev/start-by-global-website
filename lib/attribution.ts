// Captura y clasificación de atribución de marketing (UTM / canal).
// Modelo first-touch: la primera visita define la fuente y se conserva 90 días.

export interface Attribution {
  channel: "organic" | "paid" | "direct" | "referral" | "unknown"
  utm_source?: string
  utm_medium?: string
  utm_campaign?: string
  utm_term?: string
  utm_content?: string
  referrer?: string
  landing_page?: string
  fbclid?: string
  gclid?: string
}

const COOKIE_NAME = "sbg_attribution"
const COOKIE_DAYS = 90

const SEARCH_ENGINES = /(google|bing|yahoo|duckduckgo|ecosia|yandex|baidu|brave)\./i
const PAID_MEDIUM = /(cpc|ppc|paid|paidsocial|paid_social|display|cpm|retargeting|remarketing)/i

/**
 * Clasifica el canal a partir de los parámetros UTM, los click IDs de anuncios
 * y el referrer. Prioridad: ads > orgánico > referral > directo.
 */
export function classifyChannel(a: Omit<Attribution, "channel">): Attribution["channel"] {
  const hasAdClick = Boolean(a.fbclid || a.gclid)
  const paidMedium = a.utm_medium ? PAID_MEDIUM.test(a.utm_medium) : false
  if (hasAdClick || paidMedium) return "paid"

  if (a.utm_medium === "organic") return "organic"
  if (a.referrer && SEARCH_ENGINES.test(a.referrer) && !a.utm_medium) return "organic"

  if (a.utm_source || a.utm_campaign) return "referral" // tráfico etiquetado no-pago
  if (a.referrer) return "referral"
  return "direct"
}

/** Construye la atribución a partir de la URL actual y el referrer (lado cliente). */
export function buildAttribution(href: string, referrer: string): Attribution {
  const url = new URL(href)
  const p = url.searchParams
  const val = (k: string) => p.get(k)?.trim() || undefined

  const base: Omit<Attribution, "channel"> = {
    utm_source: val("utm_source"),
    utm_medium: val("utm_medium"),
    utm_campaign: val("utm_campaign"),
    utm_term: val("utm_term"),
    utm_content: val("utm_content"),
    fbclid: val("fbclid"),
    gclid: val("gclid"),
    referrer: referrer && !referrer.includes(url.host) ? referrer : undefined,
    landing_page: url.pathname,
  }
  return { ...base, channel: classifyChannel(base) }
}

// ─── Cookies (cliente) ──────────────────────────────────────────────────────

function readCookie(name: string): string | null {
  if (typeof document === "undefined") return null
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`))
  return match ? decodeURIComponent(match[1]) : null
}

function writeCookie(name: string, value: string, days: number) {
  if (typeof document === "undefined") return
  const expires = new Date(Date.now() + days * 864e5).toUTCString()
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax`
}

/**
 * Captura la atribución first-touch: solo escribe la cookie si aún no existe,
 * preservando la fuente de la primera visita. Devuelve la atribución vigente.
 */
export function captureAttribution(): Attribution | null {
  if (typeof window === "undefined") return null

  const existing = readCookie(COOKIE_NAME)
  if (existing) {
    try {
      return JSON.parse(existing) as Attribution
    } catch {
      /* cookie corrupta: se reescribe abajo */
    }
  }

  const attr = buildAttribution(window.location.href, document.referrer)
  writeCookie(COOKIE_NAME, JSON.stringify(attr), COOKIE_DAYS)
  return attr
}

/** Lee la atribución guardada sin modificarla. */
export function getStoredAttribution(): Attribution | null {
  const raw = readCookie(COOKIE_NAME)
  if (!raw) return null
  try {
    return JSON.parse(raw) as Attribution
  } catch {
    return null
  }
}

/** Lee las cookies de Meta (_fbp / _fbc) para deduplicación en CAPI. */
export function getMetaCookies(): { fbp?: string; fbc?: string } {
  return {
    fbp: readCookie("_fbp") ?? undefined,
    fbc: readCookie("_fbc") ?? undefined,
  }
}
