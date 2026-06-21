import type { Metadata } from "next"
import { pageMetadata } from "@/lib/seo"
import { ServiceJsonLd, BreadcrumbJsonLd } from "@/components/seo-jsonld"
import { ServicesPageContent } from "./services-content"

export const metadata: Metadata = pageMetadata({
  title: "Servicios: Desarrollo Web, SEO y Marketing Digital",
  description:
    "Servicios de desarrollo web, SEO, publicidad digital (Google y Meta Ads), branding, analítica y automatización para empresas en Rep. Dominicana, España, Latinoamérica y EE.UU.",
  path: "/servicios",
  keywords: [
    "servicios de marketing digital",
    "desarrollo web",
    "SEO República Dominicana",
    "agencia digital",
    "publicidad digital",
  ],
})

export default function ServiciosPage() {
  return (
    <>
      <ServiceJsonLd
        name="Servicios de marketing digital y desarrollo web"
        serviceType="Marketing digital / Desarrollo web"
        description="Desarrollo web, SEO, publicidad digital, branding, analítica y automatización para empresas."
        path="/servicios"
      />
      <BreadcrumbJsonLd
        items={[
          { name: "Inicio", path: "/" },
          { name: "Servicios", path: "/servicios" },
        ]}
      />
      <ServicesPageContent />
    </>
  )
}
