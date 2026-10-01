import type { ReactNode } from "react"
import { TopNav } from "@/components/top-nav"
import { Footer } from "@/components/footer"
import { StickyMobileCTA } from "@/components/cta/sticky-mobile-cta"

/**
 * Layout de las páginas de venta: navegación superior (sin sidebar), contenido a
 * ancho completo, footer y barra de CTA fija en móvil.
 */
export function MarketingLayout({
  children,
  ctaSegment = "sticky_mobile",
}: {
  children: ReactNode
  /** Segmento de tracking de la barra de CTA móvil. */
  ctaSegment?: string
}) {
  return (
    <div className="min-h-screen bg-background overflow-x-clip">
      <TopNav />
      <main id="contenido">{children}</main>
      {/* pb extra en móvil para que la barra fija no tape el footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 pb-24 md:pb-10">
        <Footer />
      </div>
      <StickyMobileCTA segment={ctaSegment} />
    </div>
  )
}
