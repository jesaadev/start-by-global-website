import type { Metadata } from "next"
import { pageMetadata } from "@/lib/seo"
import { IaContent } from "./ia-content"

export const metadata: Metadata = pageMetadata({
  title: "IA & Automatización para Empresas",
  description:
    "Implementamos inteligencia artificial y automatización de procesos: chatbots, agentes IA y flujos para que tu empresa trabaje más rápido, con menos errores y mayor rentabilidad.",
  path: "/ia-automatizacion",
  keywords: [
    "automatización de procesos",
    "inteligencia artificial para empresas",
    "chatbots",
    "agentes IA",
    "automatización con IA",
  ],
})

export default function IaPage() {
  return <IaContent />
}
