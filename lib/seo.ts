import type { Metadata } from "next"

const BRAND = "Start By Global"

/**
 * Construye metadata por página de forma consistente:
 * - title SIN la marca (la plantilla del layout añade "| Start By Global" una sola vez)
 * - Open Graph y Twitter propios de la página (no heredan el genérico de la home)
 * - canonical relativa (se resuelve contra metadataBase)
 */
export function pageMetadata(opts: {
  title: string
  description: string
  path: string
  keywords?: string[]
  /** Mapa hreflang → ruta ("es" | "en-US" | "x-default") para páginas con par traducido. */
  languages?: Record<string, string>
  /** Locale de Open Graph (default es_DO, heredado del layout). */
  ogLocale?: string
}): Metadata {
  const { title, description, path, keywords, languages, ogLocale } = opts
  const ogTitle = `${title} | ${BRAND}`
  return {
    title,
    description,
    ...(keywords ? { keywords } : {}),
    alternates: { canonical: path, ...(languages ? { languages } : {}) },
    openGraph: {
      type: "website",
      title: ogTitle,
      description,
      url: path,
      ...(ogLocale ? { locale: ogLocale } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle,
      description,
    },
  }
}

/** Pares hreflang ES↔EN del embudo US (ruta ES → ruta EN). */
export const HREFLANG_PAIRS: Record<string, string> = {
  "/": "/us",
  "/diseno-paginas-web": "/us/website-design",
  "/publicidad-ads": "/us/google-ads",
  "/contacto": "/us/contact",
  "/insights": "/us/insights",
}

/** Construye el mapa `languages` de hreflang para una ruta de cualquiera de los dos lados. */
export function hreflangFor(path: string): Record<string, string> | undefined {
  const esPath = Object.keys(HREFLANG_PAIRS).find(
    (es) => es === path || HREFLANG_PAIRS[es] === path
  )
  if (!esPath) return undefined
  return {
    es: esPath,
    "en-US": HREFLANG_PAIRS[esPath],
    "x-default": esPath, // el español es la versión principal del sitio
  }
}
