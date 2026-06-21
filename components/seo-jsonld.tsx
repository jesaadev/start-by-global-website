import { getSiteSettings, safeBaseUrl } from "@/lib/site-settings"

// Datos estructurados reutilizables para páginas de servicio.
// La base se toma de la configuración (admin) para mantener paridad entre
// entornos (producción, preview, local).

const AREA_SERVED = ["DO", "ES", "MX", "US"].map((c) => ({ "@type": "Country", name: c }))

async function getBase() {
  const { seo } = await getSiteSettings()
  return safeBaseUrl(seo.canonicalBase)
}

function JsonLdScript({ data }: { data: Record<string, unknown> }) {
  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />
  )
}

/** Schema de un servicio concreto (mejora rich results y SEO de servicio). */
export async function ServiceJsonLd({
  name,
  description,
  path,
  serviceType,
}: {
  name: string
  description: string
  path: string
  serviceType: string
}) {
  const base = await getBase()
  return (
    <JsonLdScript
      data={{
        "@context": "https://schema.org",
        "@type": "Service",
        name,
        description,
        serviceType,
        url: `${base}${path}`,
        areaServed: AREA_SERVED,
        provider: {
          "@type": "Organization",
          name: "Start By Global",
          url: base,
        },
      }}
    />
  )
}

/** Migas de pan estructuradas (BreadcrumbList). */
export async function BreadcrumbJsonLd({ items }: { items: Array<{ name: string; path: string }> }) {
  const base = await getBase()
  return (
    <JsonLdScript
      data={{
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: items.map((it, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: it.name,
          item: `${base}${it.path}`,
        })),
      }}
    />
  )
}

/** FAQPage a partir de una lista de preguntas/respuestas (no necesita base). */
export function FaqJsonLd({ faqs }: { faqs: Array<{ q: string; a: string }> }) {
  return (
    <JsonLdScript
      data={{
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: faqs.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      }}
    />
  )
}
