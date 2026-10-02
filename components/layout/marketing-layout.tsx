import type { ReactNode } from "react"
import type { Locale } from "@/lib/i18n"
import { TopNav } from "@/components/top-nav"
import { Footer } from "@/components/footer"
import { StickyMobileCTA } from "@/components/cta/sticky-mobile-cta"

/**
 * Layout de todas las páginas públicas: navegación superior (sin sidebar),
 * contenido a ancho completo, footer y barra de CTA fija en móvil.
 */
export function MarketingLayout({
  children,
  ctaSegment = "sticky_mobile",
  ctaService,
  ctaSecondary,
  locale = "es",
}: {
  children: ReactNode
  /** Segmento de tracking de la barra de CTA móvil. */
  ctaSegment?: string
  /** Servicio preseleccionado en el modal de WhatsApp de la barra móvil. */
  ctaService?: string
  /** Botón secundario de la barra móvil (p. ej. el formulario de la propia página). */
  ctaSecondary?: { href: string; label: string }
  locale?: Locale
}) {
  return (
    <div className="min-h-screen bg-background overflow-x-clip">
      <TopNav locale={locale} />
      <main id="contenido">{children}</main>
      {/* pb extra en móvil para que la barra fija no tape el footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 pb-24 md:pb-10">
        <Footer locale={locale} />
      </div>
      <StickyMobileCTA
        segment={ctaSegment}
        service={ctaService}
        secondaryHref={ctaSecondary?.href}
        secondaryLabel={ctaSecondary?.label}
        locale={locale}
      />
    </div>
  )
}
