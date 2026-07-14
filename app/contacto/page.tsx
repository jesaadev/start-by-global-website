import type { Metadata } from "next"
import { pageMetadata, hreflangFor } from "@/lib/seo"
import { ContactPageContent } from "./contact-content"

export const metadata: Metadata = pageMetadata({
  title: "Contacto",
  description:
    "Contacta con Start By Global para tu proyecto de desarrollo web o publicidad digital. Presencia en Santo Domingo, Madrid, Ciudad de México y Miami.",
  path: "/contacto",
  languages: hreflangFor("/contacto"),
})

export default function ContactoPage() {
  return <ContactPageContent />
}
