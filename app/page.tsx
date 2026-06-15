import { cookies } from "next/headers"
import { SidebarNav } from "@/components/sidebar-nav"
import { TopNav } from "@/components/top-nav"
import { HeroSegmented } from "@/components/home/hero-segmented"
import { ProblemSection } from "@/components/home/problem-section"
import { FunnelMethod } from "@/components/home/funnel-method"
import { ProcessSteps } from "@/components/home/process-steps"
import { OutsourcingBlock } from "@/components/home/outsourcing-block"
import { GuaranteeFaq } from "@/components/home/guarantee-faq"
import { MetricsSection } from "@/components/metrics-section"
import { ServicesSection } from "@/components/services-section"
import { PortfolioSection } from "@/components/portfolio-section"
import { TestimonialsSection } from "@/components/testimonials-section"
import { ContactSection } from "@/components/contact-section"
import { CtaBanner } from "@/components/cta-banner"
import { Footer } from "@/components/footer"

export default async function Page() {
  // A/B de navegación (cookie asignada en proxy.ts): 'b' = nav horizontal.
  const navVariant = (await cookies()).get("sbg_nav")?.value === "b" ? "b" : "a"

  const content = (
    <div className="flex flex-col gap-10 sm:gap-12 p-4 sm:p-6 lg:p-8 max-w-[1400px] mx-auto w-full">
      <HeroSegmented />
      <ProblemSection />
      <FunnelMethod />
      <ServicesSection />
      <MetricsSection />
      <ProcessSteps />
      <PortfolioSection />
      <OutsourcingBlock />
      <TestimonialsSection />
      <GuaranteeFaq />
      <ContactSection />
      <CtaBanner />
      <Footer />
    </div>
  )

  // Variante B: navegación horizontal de agencia.
  if (navVariant === "b") {
    return (
      <div className="min-h-screen bg-background overflow-x-hidden">
        <TopNav />
        <main className="overflow-x-hidden">{content}</main>
      </div>
    )
  }

  // Variante A: sidebar (actual).
  return (
    <div className="flex min-h-screen bg-background overflow-x-hidden">
      <SidebarNav />
      <main className="flex-1 min-w-0 lg:ml-[240px] transition-all duration-300 overflow-x-hidden">
        {content}
      </main>
    </div>
  )
}
