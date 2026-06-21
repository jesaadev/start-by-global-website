import type { Metadata } from "next"
import { pageMetadata } from "@/lib/seo"
import { ServiceJsonLd, BreadcrumbJsonLd, FaqJsonLd } from "@/components/seo-jsonld"
import { WebContent } from "./web-content"
import { WEB_FAQS } from "./faqs"

export const metadata: Metadata = pageMetadata({
  title: "Diseño de Páginas Web en República Dominicana",
  description:
    "Diseño y desarrollo de páginas web profesionales en República Dominicana: webs corporativas, tiendas online y landing pages optimizadas para SEO y conversión. Proyectos desde $400.",
  path: "/diseno-paginas-web",
  keywords: [
    "diseño de páginas web República Dominicana",
    "desarrollo web Santo Domingo",
    "diseño web para empresas",
    "diseño de tiendas online",
    "cuánto cuesta una página web",
    "agencia de diseño web",
  ],
})

export default function DisenoPaginasWebPage() {
  return (
    <>
      <ServiceJsonLd
        name="Diseño y desarrollo de páginas web"
        serviceType="Diseño web / Desarrollo web"
        description="Webs corporativas, tiendas online y landing pages optimizadas para SEO y conversión."
        path="/diseno-paginas-web"
      />
      <BreadcrumbJsonLd
        items={[
          { name: "Inicio", path: "/" },
          { name: "Diseño de Páginas Web", path: "/diseno-paginas-web" },
        ]}
      />
      <FaqJsonLd faqs={WEB_FAQS} />
      <WebContent />
    </>
  )
}
