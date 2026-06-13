// Utilidades de protección para rutas API (anti-abuso).

/**
 * Extrae la IP del cliente priorizando headers fijados por el proxy de confianza
 * (no falsificables por el cliente) antes que X-Forwarded-For, cuyo primer
 * elemento sí puede manipularse para evadir el rate limit.
 * Orden: CF-Connecting-IP (Cloudflare) → X-Real-IP (Vercel) → X-Forwarded-For.
 */
export function clientIp(headers: Headers): string {
  const cf = headers.get("cf-connecting-ip")
  if (cf) return cf.trim()

  const real = headers.get("x-real-ip")
  if (real) return real.trim()

  const fwd = headers.get("x-forwarded-for")
  if (fwd) return fwd.split(",")[0].trim()

  return "unknown"
}

/**
 * Valida que la petición provenga del mismo origen. Bloquea llamadas desde
 * otros sitios (CSRF / abuso entre dominios). Si no hay header Origin (clientes
 * no-navegador), se permite para no romper integraciones legítimas.
 */
export function sameOriginOk(request: Request): boolean {
  const origin = request.headers.get("origin")
  if (!origin) return true
  try {
    const originHost = new URL(origin).host
    const host = request.headers.get("host")
    return !!host && originHost === host
  } catch {
    return false
  }
}

/**
 * Honeypot: si el campo trampa (oculto a usuarios reales) viene relleno, es un
 * bot. El campo por defecto es "company_website".
 */
export function isBot(body: Record<string, unknown>, field = "company_website"): boolean {
  const v = body?.[field]
  return typeof v === "string" && v.trim().length > 0
}
