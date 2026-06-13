import { NextResponse } from "next/server"
import { clientIp } from "@/lib/request-guards"

// Rate limiter en memoria (ventana fija por IP+ruta). En serverless protege
// dentro de cada instancia caliente: frena ráfagas de abuso sin infraestructura
// extra. Para un límite global y persistente conviene Upstash/Redis o Supabase.

interface Entry {
  count: number
  resetAt: number
}

const store = new Map<string, Entry>()
let lastCleanup = 0

function cleanup(now: number) {
  if (now - lastCleanup < 60_000) return
  lastCleanup = now
  for (const [key, entry] of store) {
    if (entry.resetAt <= now) store.delete(key)
  }
}

export function rateLimit(
  key: string,
  limit: number,
  windowMs: number
): { ok: boolean; retryAfter: number } {
  const now = Date.now()
  cleanup(now)

  const entry = store.get(key)
  if (!entry || entry.resetAt <= now) {
    store.set(key, { count: 1, resetAt: now + windowMs })
    return { ok: true, retryAfter: 0 }
  }

  entry.count++
  if (entry.count > limit) {
    return { ok: false, retryAfter: Math.max(1, Math.ceil((entry.resetAt - now) / 1000)) }
  }
  return { ok: true, retryAfter: 0 }
}

/**
 * Aplica rate limiting por IP a una request. Devuelve una respuesta 429 si se
 * supera el límite, o null si puede continuar.
 */
export function enforceRateLimit(
  request: Request,
  name: string,
  limit: number,
  windowMs: number
): NextResponse | null {
  const ip = clientIp(request.headers)
  const { ok, retryAfter } = rateLimit(`${name}:${ip}`, limit, windowMs)
  if (ok) return null
  return NextResponse.json(
    { error: "Demasiadas solicitudes. Por favor, espera un momento e intenta de nuevo." },
    { status: 429, headers: { "Retry-After": String(retryAfter) } }
  )
}
