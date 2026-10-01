import { PrimaryCTA } from "@/components/cta/primary-cta"
import { LeadForm } from "@/components/forms/lead-form"

/** Cierre: CTA principal gigante + formulario de 3 campos como alternativa. */
export function HomeFinalCTA() {
  return (
    <section id="contacto" className="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-24 scroll-mt-20">
      <div className="relative overflow-hidden rounded-[2rem] border border-primary/25 bg-gradient-to-br from-primary/20 via-primary/[0.06] to-transparent p-7 sm:p-12 lg:p-16">
        <div aria-hidden className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-primary/25 blur-[100px]" />
        <div className="relative grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] gap-10 items-center">
          <div className="flex flex-col gap-6">
            <h2 className="font-display text-4xl sm:text-6xl font-bold tracking-tight leading-[1.02] text-balance">
              Hablemos de tu próximo cliente
            </h2>
            <p className="text-lg sm:text-xl text-foreground/80 leading-relaxed max-w-lg">
              Escríbenos por WhatsApp y te decimos, sin compromiso, qué cambiarías primero en tu web y tus anuncios.
            </p>
            <div>
              <PrimaryCTA segment="final_cta" />
            </div>
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground mb-3">¿Prefieres que te contactemos?</p>
            <LeadForm landingKey="home" landingName="Home (página principal)" />
          </div>
        </div>
      </div>
    </section>
  )
}
