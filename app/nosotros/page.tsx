import type { Metadata } from "next"
import { pageMetadata } from "@/lib/seo"
import { AboutPageContent } from "./about-content"

export const metadata: Metadata = pageMetadata({
  title: "Nosotros",
  description:
    "Conoce al equipo detrás de Start By Global, agencia de marketing digital y desarrollo web con presencia en Rep. Dominicana, España, Latinoamérica y EE.UU.",
  path: "/nosotros",
})

export default function NosotrosPage() {
  return <AboutPageContent />
}
