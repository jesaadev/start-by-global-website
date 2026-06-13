import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// Países donde aplica el bloqueo previo de cookies (RGPD/ePrivacy):
// UE-27 + EEE (Islandia, Liechtenstein, Noruega) + Reino Unido + Suiza.
const CONSENT_REQUIRED_COUNTRIES = new Set([
  "AT", "BE", "BG", "HR", "CY", "CZ", "DK", "EE", "FI", "FR", "DE", "GR",
  "HU", "IE", "IT", "LV", "LT", "LU", "MT", "NL", "PL", "PT", "RO", "SK",
  "SI", "ES", "SE", "IS", "LI", "NO", "GB", "CH",
])

const REGION_COOKIE = "sbg_region"

export function proxy(request: NextRequest) {
  const response = NextResponse.next()

  // Vercel expone el país del visitante en este header.
  const country = (request.headers.get("x-vercel-ip-country") || "").toUpperCase()

  // Si hay país y NO está en la lista → 'row' (resto del mundo, cookies abiertas).
  // Si no se puede determinar (dev local, proxies) → 'eu' por seguridad legal.
  const region = country
    ? CONSENT_REQUIRED_COUNTRIES.has(country) ? "eu" : "row"
    : "eu"

  response.cookies.set(REGION_COOKIE, region, {
    path: "/",
    maxAge: 60 * 60 * 24, // 1 día
    sameSite: "lax",
  })

  return response
}

export const config = {
  // Excluye estáticos y assets; se ejecuta en páginas y rutas de navegación.
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)"],
}
