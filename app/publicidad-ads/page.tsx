import type { Metadata } from "next"
import { pageMetadata } from "@/lib/seo"
import { ServiceJsonLd, BreadcrumbJsonLd } from "@/components/seo-jsonld"
import { AdsContent } from "./ads-content"

export const metadata: Metadata = pageMetadata({
  title: "Agencia de Publicidad Digital: Google Ads & Meta Ads",
  description:
    "Agencia de publicidad digital en República Dominicana: campañas de Google Ads, Meta (Facebook/Instagram), TikTok y LinkedIn que generan clientes, no solo clics. Medición real con pixel + CAPI.",
  path: "/publicidad-ads",
  keywords: [
    "agencia de google ads",
    "agencia de meta ads",
    "publicidad en redes sociales República Dominicana",
    "agencia de marketing digital",
    "campañas facebook ads",
    "publicidad digital Santo Domingo",
  ],
})

export default function AdsPage() {
  return (
    <>
      <ServiceJsonLd
        name="Publicidad Digital y Gestión de Ads"
        serviceType="Publicidad digital / SEM"
        description="Campañas de Google Ads, Meta (Facebook/Instagram), TikTok y LinkedIn con estrategia y medición real."
        path="/publicidad-ads"
      />
      <BreadcrumbJsonLd
        items={[
          { name: "Inicio", path: "/" },
          { name: "Publicidad Digital & Ads", path: "/publicidad-ads" },
        ]}
      />
      <AdsContent />
    </>
  )
}
