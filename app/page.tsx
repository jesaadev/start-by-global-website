import Link from "next/link"
import { SidebarNav } from "@/components/sidebar-nav"
import { WhatsAppLink } from "@/components/whatsapp-link"
import { HeroSection } from "@/components/hero-section"
import { MetricsSection } from "@/components/metrics-section"
import { ServicesSection } from "@/components/services-section"
import { PortfolioSection } from "@/components/portfolio-section"
import { TestimonialsSection } from "@/components/testimonials-section"
import { ContactSection } from "@/components/contact-section"
import { CtaBanner } from "@/components/cta-banner"
import { Footer } from "@/components/footer"

export default function Page() {
  return (
    <div className="flex min-h-screen bg-background overflow-x-hidden">
      <SidebarNav />

      {/* Main content area */}
      <main className="flex-1 min-w-0 lg:ml-[240px] transition-all duration-300 overflow-x-hidden">
        <div className="flex flex-col gap-6 p-4 sm:p-6 lg:p-8 max-w-[1400px] mx-auto w-full">
          {/* Top bar */}
          <header className="flex items-center justify-between gap-3 pl-12 lg:pl-0">
            <div>
              <h2 className="font-display text-lg font-bold text-foreground">Start By Global</h2>
              <p className="text-xs text-muted-foreground">Marketing digital y desarrollo web que genera clientes</p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <WhatsAppLink className="hidden sm:inline-flex items-center px-3 py-2 rounded-lg border border-border text-xs font-medium text-foreground hover:bg-secondary/60 transition-colors">
                WhatsApp
              </WhatsAppLink>
              <Link
                href="/contacto"
                className="inline-flex items-center px-4 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-semibold hover:shadow-lg hover:shadow-primary/25 transition-all"
              >
                Iniciar Proyecto
              </Link>
            </div>
          </header>

          <HeroSection />
          <MetricsSection />
          <ServicesSection />
          <PortfolioSection />
          <TestimonialsSection />
          <ContactSection />
          <CtaBanner />
          <Footer />
        </div>
      </main>
    </div>
  )
}
