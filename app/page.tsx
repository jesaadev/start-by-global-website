import { SidebarNav } from "@/components/sidebar-nav"
import { HeroSection } from "@/components/hero-section"
import { MetricsSection } from "@/components/metrics-section"
import { ServicesSection } from "@/components/services-section"
import { PortfolioSection } from "@/components/portfolio-section"
import { TestimonialsSection } from "@/components/testimonials-section"
import { ContactSection } from "@/components/contact-section"
import { Footer } from "@/components/footer"

export default function Page() {
  return (
    <div className="flex min-h-screen bg-background">
      <SidebarNav />

      {/* Main content area */}
      <main className="flex-1 lg:ml-[240px] transition-all duration-300">
        <div className="flex flex-col gap-6 p-4 sm:p-6 lg:p-8 max-w-[1400px] mx-auto">
          {/* Top bar */}
          <header className="flex items-center justify-between pl-12 lg:pl-0">
            <div>
              <h2 className="font-display text-lg font-bold text-foreground">Bienvenido</h2>
              <p className="text-xs text-muted-foreground">Panel de control - Start By Global</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-card border border-border/50">
                <div className="w-2 h-2 rounded-full bg-chart-3" />
                <span className="text-xs text-muted-foreground">Online</span>
              </div>
              <div className="flex items-center justify-center w-9 h-9 rounded-full bg-primary/10 text-primary font-display font-bold text-xs border border-primary/20">
                SG
              </div>
            </div>
          </header>

          <HeroSection />
          <MetricsSection />
          <ServicesSection />
          <PortfolioSection />
          <TestimonialsSection />
          <ContactSection />
          <Footer />
        </div>
      </main>
    </div>
  )
}
