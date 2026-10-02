import type { Metadata } from "next"
import { pageMetadata } from "@/lib/seo"
import { listPublishedShowcase } from "@/lib/showcase"
import { MarketingLayout } from "@/components/layout/marketing-layout"
import { PortfolioPageContent } from "./portfolio-content"

export const metadata: Metadata = pageMetadata({
  title: "Portafolio de Proyectos Web y Marketing",
  description:
    "Webs reales que diseñamos y desarrollamos, publicadas con permiso de cada cliente. Recórrelas en escritorio y móvil.",
  path: "/portafolio",
})

export default async function PortafolioPage() {
  const [webs, ads] = await Promise.all([listPublishedShowcase("web", 24), listPublishedShowcase("ad", 12)])
  return (
    <MarketingLayout ctaSegment="portafolio_sticky" ctaService="Desarrollo Web">
      <PortfolioPageContent webs={webs} ads={ads} />
    </MarketingLayout>
  )
}
