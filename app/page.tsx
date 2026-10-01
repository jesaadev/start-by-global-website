import { MarketingLayout } from "@/components/layout/marketing-layout"
import { PageFunnelTracker } from "@/components/analytics/page-funnel-tracker"
import { HomeHero } from "@/components/home-v2/hero"
import { PlatformsStrip } from "@/components/home-v2/platforms-strip"
import { PersonaRouter } from "@/components/home-v2/persona-router"
import { ShowcaseSection } from "@/components/showcase/showcase-section"
import { AdFlow } from "@/components/home-v2/ad-flow"
import { HomeProcess } from "@/components/home-v2/process"
import { HomeIncluded } from "@/components/home-v2/included"
import { HomeFaq } from "@/components/home-v2/faq"
import { HomeFinalCTA } from "@/components/home-v2/final-cta"

// Home v2 orientada a conversión: un CTA principal (WhatsApp), textos grandes,
// trabajo real en mockups, enrutado a las landings por persona y el recorrido
// animado de una campaña. Estática/ISR (sin cookies en el servidor).
export default function Page() {
  return (
    <MarketingLayout ctaSegment="home_sticky">
      <PageFunnelTracker landingKey="home" />
      <HomeHero />
      <PlatformsStrip />
      <PersonaRouter />
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Trabajo real del admin (Showcase); se oculta si no hay nada publicado */}
        <ShowcaseSection minItems={2} />
      </div>
      <AdFlow />
      <HomeProcess />
      <HomeIncluded />
      <HomeFaq />
      <HomeFinalCTA />
    </MarketingLayout>
  )
}
