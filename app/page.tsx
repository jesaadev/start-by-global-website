import { MarketingLayout } from "@/components/layout/marketing-layout"
import { HeroSegmented } from "@/components/home/hero-segmented"
import { ProblemSection } from "@/components/home/problem-section"
import { FunnelMethod } from "@/components/home/funnel-method"
import { ProcessSteps } from "@/components/home/process-steps"
import { OutsourcingBlock } from "@/components/home/outsourcing-block"
import { GuaranteeFaq } from "@/components/home/guarantee-faq"
import { ServicesSection } from "@/components/services-section"
import { ShowcaseSection } from "@/components/showcase/showcase-section"
import { ContactSection } from "@/components/contact-section"
import { CtaBanner } from "@/components/cta-banner"

// El A/B de navegación terminó: una sola versión con navegación superior.
// Sin lectura de cookies en el servidor, la home vuelve a ser estática/ISR.
export default function Page() {
  return (
    <MarketingLayout ctaSegment="home_sticky">
      <div className="flex flex-col gap-10 sm:gap-12 px-4 sm:px-6 lg:px-8 pt-4 pb-6 max-w-7xl mx-auto w-full">
        <HeroSegmented />
        <ProblemSection />
        <FunnelMethod />
        <ServicesSection />
        <ProcessSteps />
        {/* Trabajo real del admin (Showcase); reemplaza los proyectos ficticios */}
        <ShowcaseSection />
        <OutsourcingBlock />
        <GuaranteeFaq />
        <ContactSection />
        <CtaBanner />
      </div>
    </MarketingLayout>
  )
}
