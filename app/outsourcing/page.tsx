import type { Metadata } from "next"
import { pageMetadata } from "@/lib/seo"
import { MarketingLayout } from "@/components/layout/marketing-layout"
import { OutsourcingContent } from "./outsourcing-content"

export const metadata: Metadata = pageMetadata({
  title: "Outsourcing & Marca Blanca para Agencias",
  description:
    "Desarrollo web white-label bajo tu marca, con NDA. Tu departamento de desarrollo invisible: escalabilidad inmediata para agencias y consultores. Nosotros codificamos, tú te llevas el crédito.",
  path: "/outsourcing",
  keywords: [
    "outsourcing desarrollo web",
    "marca blanca web",
    "white label web development",
    "desarrollo web para agencias",
    "tercerizar desarrollo web",
  ],
})

export default function OutsourcingPage() {
  return (
    <MarketingLayout ctaSegment="outsourcing_sticky" ctaService="Outsourcing / Marca Blanca" ctaSecondary={{ href: "#contacto", label: "Formulario" }}>
      <OutsourcingContent />
    </MarketingLayout>
  )
}
