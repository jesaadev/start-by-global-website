import type { Metadata } from "next"
import { pageMetadata } from "@/lib/seo"
import { PortfolioPageContent } from "./portfolio-content"

export const metadata: Metadata = pageMetadata({
  title: "Portafolio de Proyectos Web y Marketing",
  description:
    "Explora nuestros proyectos de desarrollo web y marketing digital en Rep. Dominicana, España, Latinoamérica y EE.UU.",
  path: "/portafolio",
})

export default function PortafolioPage() {
  return <PortfolioPageContent />
}
