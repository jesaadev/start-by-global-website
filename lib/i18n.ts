"use client"

import { usePathname } from "next/navigation"

// i18n mínimo del sitio: el español vive en la raíz (intacto) y el inglés para
// EE.UU. bajo /us. No hay diccionarios globales: el chrome compartido decide
// sus textos por locale y los cuerpos de página US son componentes propios.

export type Locale = "es" | "en"

export const US_PREFIX = "/us"

export function localeFromPath(path: string | null | undefined): Locale {
  if (!path) return "es"
  return path === US_PREFIX || path.startsWith(`${US_PREFIX}/`) ? "en" : "es"
}

/** Hook de cliente: locale según la URL actual. */
export function useLocale(): Locale {
  return localeFromPath(usePathname())
}

/**
 * Devuelve el href correcto para el locale: en inglés antepone /us a rutas
 * internas (y mapea las conocidas con slug propio). Externas/anclas intactas.
 */
const EN_ROUTE_MAP: Record<string, string> = {
  "/": "/us",
  "/diseno-paginas-web": "/us/website-design",
  "/publicidad-ads": "/us/google-ads",
  "/contacto": "/us/contact",
  "/insights": "/us/insights",
}

export function localizedHref(path: string, locale: Locale): string {
  if (locale === "es") return path
  if (!path.startsWith("/") || path.startsWith(US_PREFIX)) return path
  return EN_ROUTE_MAP[path] ?? path
}
