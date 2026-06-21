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
}): Metadata {
  const { title, description, path, keywords } = opts
  const ogTitle = `${title} | ${BRAND}`
  return {
    title,
    description,
    ...(keywords ? { keywords } : {}),
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      title: ogTitle,
      description,
      url: path,
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle,
      description,
    },
  }
}
