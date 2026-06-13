import type { SiteSettings } from "@/lib/site-settings"

/**
 * Datos estructurados (JSON-LD) globales: Organization + WebSite.
 * Habilita rich snippets y mejora el SEO local de la agencia.
 * Se renderiza en el servidor desde la configuración editable en el admin.
 */
export function JsonLd({ settings }: { settings: SiteSettings }) {
  const { seo, organization } = settings
  const base = seo.canonicalBase.replace(/\/$/, "")
  const abs = (path: string) =>
    path?.startsWith("http") ? path : `${base}${path?.startsWith("/") ? "" : "/"}${path ?? ""}`

  const hasAddress =
    organization.streetAddress || organization.city || organization.region || organization.postalCode

  const graph: Record<string, unknown>[] = [
    {
      "@type": "Organization",
      "@id": `${base}/#organization`,
      name: organization.name,
      legalName: organization.legalName || organization.name,
      url: base,
      logo: abs(organization.logo),
      ...(organization.email ? { email: organization.email } : {}),
      ...(organization.telephone ? { telephone: organization.telephone } : {}),
      ...(organization.sameAs?.filter(Boolean).length
        ? { sameAs: organization.sameAs.filter(Boolean) }
        : {}),
      ...(hasAddress
        ? {
            address: {
              "@type": "PostalAddress",
              ...(organization.streetAddress ? { streetAddress: organization.streetAddress } : {}),
              ...(organization.city ? { addressLocality: organization.city } : {}),
              ...(organization.region ? { addressRegion: organization.region } : {}),
              ...(organization.postalCode ? { postalCode: organization.postalCode } : {}),
              ...(organization.country ? { addressCountry: organization.country } : {}),
            },
          }
        : {}),
    },
    {
      "@type": "WebSite",
      "@id": `${base}/#website`,
      url: base,
      name: seo.siteName,
      description: seo.description,
      publisher: { "@id": `${base}/#organization` },
      inLanguage: seo.locale?.replace("_", "-") || "es",
    },
  ]

  const jsonLd = { "@context": "https://schema.org", "@graph": graph }

  return (
    <script
      type="application/ld+json"
      // El contenido es controlado (no input de usuario libre sin escapar).
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}
