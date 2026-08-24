import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { pageMetadata } from "@/lib/seo"
import { ServiceJsonLd, BreadcrumbJsonLd, FaqJsonLd } from "@/components/seo-jsonld"
import { PersonaLanding } from "@/components/landings/persona-landing"
import { getPersonaLanding } from "@/lib/persona-landings"

const SLUG = "marketing-para-empresas"

export const metadata: Metadata = (() => {
  const data = getPersonaLanding(SLUG)
  if (!data) return {}
  return pageMetadata({
    title: data.seo.title,
    description: data.seo.description,
    path: `/${SLUG}`,
    keywords: data.seo.keywords,
  })
})()

export default function Page() {
  const data = getPersonaLanding(SLUG)
  if (!data) notFound()
  return (
    <>
      <ServiceJsonLd
        name={data.serviceName}
        serviceType={data.serviceType}
        description={data.seo.description}
        path={`/${SLUG}`}
      />
      <BreadcrumbJsonLd
        items={[
          { name: "Inicio", path: "/" },
          { name: data.breadcrumb, path: `/${SLUG}` },
        ]}
      />
      <FaqJsonLd faqs={data.faqs} />
      <PersonaLanding data={data} />
    </>
  )
}
