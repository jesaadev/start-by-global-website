import crypto from "node:crypto"

// Integración con Google Search Console (Search Analytics API) vía Service
// Account. Requiere dos variables de entorno:
//   GSC_SERVICE_ACCOUNT_JSON  → el JSON del service account (con permiso de
//                               lectura sobre la propiedad en Search Console).
//   GSC_SITE_URL              → la propiedad: "sc-domain:startbyglobal.com" o
//                               "https://www.startbyglobal.com/".
// Si faltan, las funciones devuelven { configured:false } sin romper nada.

interface ServiceAccount {
  client_email: string
  private_key: string
}

export interface GscQueryRow {
  query: string
  clicks: number
  impressions: number
  ctr: number
  position: number
}

export interface GscResult {
  configured: boolean
  rows: GscQueryRow[]
  error?: string
}

function loadServiceAccount(): ServiceAccount | null {
  const raw = process.env.GSC_SERVICE_ACCOUNT_JSON
  if (!raw) return null
  try {
    const sa = JSON.parse(raw) as ServiceAccount
    return sa.client_email && sa.private_key ? sa : null
  } catch {
    console.error("[GSC] GSC_SERVICE_ACCOUNT_JSON inválido")
    return null
  }
}

// Cache del access token en memoria durante su vida (~1h) para evitar
// pedir uno nuevo en cada consulta y no chocar con los límites de OAuth.
let cachedToken: string | null = null
let tokenExpiry = 0

async function getAccessToken(sa: ServiceAccount): Promise<string | null> {
  if (cachedToken && Date.now() < tokenExpiry - 10000) {
    return cachedToken
  }
  const now = Math.floor(Date.now() / 1000)
  const header = Buffer.from(JSON.stringify({ alg: "RS256", typ: "JWT" })).toString("base64url")
  const claim = Buffer.from(
    JSON.stringify({
      iss: sa.client_email,
      scope: "https://www.googleapis.com/auth/webmasters.readonly",
      aud: "https://oauth2.googleapis.com/token",
      iat: now,
      exp: now + 3600,
    })
  ).toString("base64url")

  let signature: string
  try {
    const signer = crypto.createSign("RSA-SHA256")
    signer.update(`${header}.${claim}`)
    signature = signer.sign(sa.private_key).toString("base64url")
  } catch (e) {
    console.error("[GSC] error firmando JWT:", e)
    return null
  }

  const jwt = `${header}.${claim}.${signature}`
  try {
    const res = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
        assertion: jwt,
      }),
    })
    if (!res.ok) {
      console.error("[GSC] token error", res.status, await res.text().catch(() => ""))
      return null
    }
    const j = (await res.json()) as { access_token?: string; expires_in?: number }
    if (j.access_token) {
      cachedToken = j.access_token
      tokenExpiry = Date.now() + (j.expires_in ?? 3600) * 1000
    }
    return j.access_token ?? null
  } catch (e) {
    console.error("[GSC] token exception:", e)
    return null
  }
}

export function gscConfigured(): boolean {
  return Boolean(process.env.GSC_SERVICE_ACCOUNT_JSON && process.env.GSC_SITE_URL)
}

/** Top queries (keywords) de una página por su path, según Search Console. */
export async function getArticleQueries(pagePath: string, days = 28): Promise<GscResult> {
  const sa = loadServiceAccount()
  const siteUrl = process.env.GSC_SITE_URL
  if (!sa || !siteUrl) return { configured: false, rows: [] }

  const token = await getAccessToken(sa)
  if (!token) return { configured: false, rows: [], error: "auth" }

  const end = new Date()
  const start = new Date(Date.now() - days * 864e5)
  const fmt = (d: Date) => d.toISOString().slice(0, 10)

  try {
    const res = await fetch(
      `https://searchconsole.googleapis.com/webmasters/v3/sites/${encodeURIComponent(siteUrl)}/searchAnalytics/query`,
      {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          startDate: fmt(start),
          endDate: fmt(end),
          dimensions: ["query"],
          dimensionFilterGroups: [
            { filters: [{ dimension: "page", operator: "contains", expression: pagePath }] },
          ],
          rowLimit: 25,
        }),
      }
    )
    if (!res.ok) {
      const text = await res.text().catch(() => "")
      console.error("[GSC] query error", res.status, text)
      return { configured: true, rows: [], error: `${res.status}` }
    }
    const data = (await res.json()) as {
      rows?: Array<{ keys: string[]; clicks: number; impressions: number; ctr: number; position: number }>
    }
    const rows: GscQueryRow[] = (data.rows ?? []).map((r) => ({
      query: r.keys[0],
      clicks: r.clicks,
      impressions: r.impressions,
      ctr: r.ctr,
      position: r.position,
    }))
    return { configured: true, rows }
  } catch (e) {
    console.error("[GSC] query exception:", e)
    return { configured: true, rows: [], error: "exception" }
  }
}
