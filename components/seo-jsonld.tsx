// Datos estructurados reutilizables para páginas de servicio.
// Base de producción (coincide con canonicalBase por defecto).
const BASE = "https://startbyglobal.com"

const AREA_SERVED = ["DO", "ES", "MX", "US"].map((c) => ({ "@type": "Country", name: c }))

function JsonLdScript({ data }: { data: Record<string, unknown> }) {
  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />
  )
}

/** Schema de un servicio concreto (mejora rich results y SEO de servicio). */
export function ServiceJsonLd({
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
  return (
    <JsonLdScript
      data={{
        "@context": "https://schema.org",
        "@type": "Service",
        name,
        description,
        serviceType,
        url: `${BASE}${path}`,
        areaServed: AREA_SERVED,
        provider: {
          "@type": "Organization",
          name: "Start By Global",
          url: BASE,
        },
      }}
    />
  )
}

/** Migas de pan estructuradas (BreadcrumbList). */
export function BreadcrumbJsonLd({ items }: { items: Array<{ name: string; path: string }> }) {
  return (
    <JsonLdScript
      data={{
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: items.map((it, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: it.name,
          item: `${BASE}${it.path}`,
        })),
      }}
    />
  )
}

/** FAQPage a partir de una lista de preguntas/respuestas. */
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
