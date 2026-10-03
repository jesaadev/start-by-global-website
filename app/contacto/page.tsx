import type { Metadata } from "next"
import { pageMetadata, hreflangFor } from "@/lib/seo"
import { MarketingLayout } from "@/components/layout/marketing-layout"
import { ContactPageContent } from "./contact-content"

export const metadata: Metadata = pageMetadata({
  title: "Contacto",
  description:
    "Contacta con Start By Global para tu proyecto de desarrollo web o publicidad digital. Respuesta por WhatsApp, email o llamada. Base en Santo Domingo, en remoto con España, Latinoamérica y EE.UU.",
  path: "/contacto",
  languages: hreflangFor("/contacto"),
})

export default function ContactoPage() {
  return (
    <MarketingLayout ctaSegment="contacto_sticky" ctaSecondary={{ href: "#formulario", label: "Formulario" }}>
      <ContactPageContent />
    </MarketingLayout>
  )
}
