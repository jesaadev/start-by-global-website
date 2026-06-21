import type { Metadata } from "next"
import { AdsContent } from "./ads-content"

export const metadata: Metadata = {
  title: "Publicidad Digital & Ads | Start By Global",
  description:
    "Campañas de Meta Ads, Google Ads, TikTok y LinkedIn que generan clientes, no solo clics. Deja de quemar presupuesto: pauta con estrategia y medición real.",
  alternates: { canonical: "/publicidad-ads" },
}

export default function AdsPage() {
  return <AdsContent />
}
