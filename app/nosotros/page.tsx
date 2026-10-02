import type { Metadata } from "next"
import { pageMetadata } from "@/lib/seo"
import { MarketingLayout } from "@/components/layout/marketing-layout"
import { AboutPageContent } from "./about-content"

export const metadata: Metadata = pageMetadata({
  title: "Nosotros",
  description:
    "Conoce al equipo detrás de Start By Global, agencia de marketing digital y desarrollo web que trabaja con negocios de Rep. Dominicana, España, Latinoamérica y EE.UU.",
  path: "/nosotros",
})

export default function NosotrosPage() {
  return (
    <MarketingLayout ctaSegment="nosotros_sticky">
      <AboutPageContent />
    </MarketingLayout>
  )
}
