import type { Metadata } from "next"
import { pageMetadata, hreflangFor } from "@/lib/seo"
import { BreadcrumbJsonLd } from "@/components/seo-jsonld"
import { UsContactContent } from "./us-contact-content"

export const metadata: Metadata = pageMetadata({
  title: "Contact Us — Free Consultation",
  description:
    "Talk to Start By Global about your website or advertising project. U.S. time zones, English-speaking team, response within 24 hours.",
  path: "/us/contact",
  languages: hreflangFor("/us/contact"),
  ogLocale: "en_US",
})

export default function UsContactPage() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "US Home", path: "/us" },
          { name: "Contact", path: "/us/contact" },
        ]}
      />
      <UsContactContent />
    </>
  )
}
