import type { ReactNode } from "react"
import { MarketingLayout } from "@/components/layout/marketing-layout"

/** Páginas legales: mismo chrome que el sitio, cabecera sobria y texto a ancho de lectura. */
export function LegalPage({ title, subtitle, children }: { title: string; subtitle?: string; children: ReactNode }) {
  return (
    <MarketingLayout ctaSegment="legal_sticky">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-10 sm:pt-16 pb-10 flex flex-col gap-8">
        <header>
          <h1 className="font-display text-4xl sm:text-5xl font-bold tracking-tight text-balance">{title}</h1>
          {subtitle && <p className="text-sm text-muted-foreground mt-3">{subtitle}</p>}
        </header>
        {children}
      </div>
    </MarketingLayout>
  )
}
