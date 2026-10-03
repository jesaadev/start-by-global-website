import type { ComponentProps, ReactNode } from "react"
import { PrimaryCTA } from "@/components/cta/primary-cta"
import { LeadForm } from "@/components/forms/lead-form"

interface ClosingCTAProps {
  title: string
  text: ReactNode
  /** Segmento de tracking del botón de WhatsApp. */
  segment: string
  service?: string
  ctaLabel?: string
  /** Formulario de 3 campos como alternativa a WhatsApp (omitido = sin formulario). */
  form?: ComponentProps<typeof LeadForm>
  /** Contenido bajo el CTA cuando no hay formulario (p. ej. enlaces secundarios). */
  extra?: ReactNode
  id?: string
}

/** Cierre de página: titular gigante + CTA de WhatsApp (+ formulario opcional). */
export function ClosingCTA({ title, text, segment, service, ctaLabel, form, extra, id = "contacto" }: ClosingCTAProps) {
  return (
    <section id={id} className="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-24 scroll-mt-20">
      <div className="relative overflow-hidden rounded-[2rem] border border-primary/25 bg-gradient-to-br from-primary/20 via-primary/[0.06] to-transparent p-7 sm:p-12 lg:p-16">
        <div aria-hidden className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-primary/25 blur-[100px]" />
        <div className={form ? "relative grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] gap-10 items-center" : "relative max-w-3xl"}>
          <div className="flex flex-col gap-6">
            <h2 className="font-display text-4xl sm:text-6xl font-bold tracking-tight leading-[1.02] text-balance">{title}</h2>
            <p className="text-lg sm:text-xl text-foreground/80 leading-relaxed max-w-lg">{text}</p>
            <div>
              <PrimaryCTA segment={segment} service={service} label={ctaLabel} />
            </div>
            {extra}
          </div>
          {form && (
            <div>
              <p className="text-sm font-semibold text-foreground mb-3">¿Prefieres que te contactemos?</p>
              <LeadForm {...form} />
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
