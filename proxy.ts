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
const NAV_COOKIE = "sbg_nav" // A/B de navegación de la home: 'a' (sidebar) | 'b' (top nav)
const GEO_SUGGEST_COOKIE = "sbg_geo_us" // visitante de EE.UU. en la versión ES → sugerir /us

export function proxy(request: NextRequest) {
  // Vercel expone el país del visitante en este header.
  const country = (request.headers.get("x-vercel-ip-country") || "").toUpperCase()
  const { pathname } = request.nextUrl
  const isUsSection = pathname === "/us" || pathname.startsWith("/us/")

  // Si hay país y NO está en la lista → 'row' (resto del mundo, cookies abiertas).
  // Si no se puede determinar (dev local, proxies) → 'eu' por seguridad legal.
  const region = country
    ? CONSENT_REQUIRED_COUNTRIES.has(country) ? "eu" : "row"
    : "eu"

  // Asignación A/B sticky: una sola vez por visitante (50/50).
  const existingNav = request.cookies.get(NAV_COOKIE)?.value
  const navVariant = existingNav ?? (Math.random() < 0.5 ? "a" : "b")

  // Si la variante es nueva, inyectarla en los headers de la PETICIÓN para que
  // los Server Components la lean en este mismo render. Las cookies de la
  // respuesta no se reflejan en la request inicial, lo que provocaría un flash
  // de variante 'a' y datos A/B corruptos en la primera visita.
  const requestHeaders = new Headers(request.headers)
  if (!existingNav) {
    const existing = requestHeaders.get("cookie") || ""
    requestHeaders.set("cookie", `${existing}${existing ? "; " : ""}${NAV_COOKIE}=${navVariant}`)
  }
  // Locale de la petición (lo pueden leer Server Components sin re-derivarlo).
  requestHeaders.set("x-locale", isUsSection ? "en" : "es")

  const response = NextResponse.next({ request: { headers: requestHeaders } })

  response.cookies.set(REGION_COOKIE, region, {
    path: "/",
    maxAge: 60 * 60 * 24, // 1 día
    sameSite: "lax",
  })

  // Señal para el banner "View US site": visitante de EE.UU. navegando la
  // versión en español. Sin redirección automática (SEO-safe); el banner en
  // cliente decide mostrarse y se puede descartar.
  if (country === "US" && !isUsSection) {
    response.cookies.set(GEO_SUGGEST_COOKIE, "1", {
      path: "/",
      maxAge: 60 * 60 * 24, // 1 día
      sameSite: "lax",
    })
  }

  if (!existingNav) {
    response.cookies.set(NAV_COOKIE, navVariant, {
      path: "/",
      maxAge: 60 * 60 * 24 * 30, // 30 días
      sameSite: "lax",
    })
  }

  return response
}

export const config = {
  // Excluye estáticos y assets; se ejecuta en páginas y rutas de navegación.
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)"],
}
