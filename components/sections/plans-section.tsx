import type { ReactNode } from "react"
import Link from "next/link"
import { Check } from "lucide-react"
import { WhatsAppLink } from "@/components/whatsapp-link"
import { cn } from "@/lib/utils"

export interface Plan {
  name: string
  /** Precio destacado ("$900", "A medida"). */
  price?: string
  /** Texto pequeño antes del precio ("Desde"). */
  pricePrefix?: string
  /** Texto pequeño tras el precio ("/ mes"). */
  period?: string
  /** Línea corta en mayúsculas bajo el nombre ("3+ proyectos / mes"). */
  tagline?: string
  desc?: string
  points: string[]
  featured?: boolean
  cta: string
}

const slug = (s: string) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "_")

/**
 * Planes con precio de partida y un CTA por plan: WhatsApp (con el servicio
 * preseleccionado y un segmento por plan) o, en inglés, enlace al formulario.
 */
export function PlansSection({
  id = "precios",
  title,
  subtitle,
  plans,
  featuredLabel = "Más popular",
  whatsapp,
  href,
  note,
}: {
  id?: string
  title: string
  subtitle?: ReactNode
  plans: Plan[]
  featuredLabel?: string
  /** CTA por WhatsApp: servicio del modal y prefijo del segmento de tracking. */
  whatsapp?: { service: string; segment: string }
  /** CTA por enlace (si no hay WhatsApp). */
  href?: string
  note?: ReactNode
}) {
  return (
    <section id={id} className="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-20 scroll-mt-20">
      <div className="max-w-2xl">
        <h2 className="font-display text-3xl sm:text-5xl font-bold tracking-tight leading-[1.05] text-balance">{title}</h2>
        {subtitle && <p className="text-lg text-muted-foreground mt-3">{subtitle}</p>}
      </div>
      <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-4">
        {plans.map((p) => {
          const ctaClass = p.featured
            ? cn(
                "mt-auto rounded-xl px-5 py-3.5 text-center text-base font-bold transition-shadow",
                whatsapp
                  ? "bg-[#25D366] text-white hover:shadow-lg hover:shadow-[#25D366]/25"
                  : "bg-primary text-primary-foreground hover:shadow-lg hover:shadow-primary/25"
              )
            : "mt-auto rounded-xl border border-border px-5 py-3.5 text-center text-base font-semibold text-foreground hover:bg-secondary/60 transition-colors"
          return (
            <div
              key={p.name}
              className={
                p.featured
                  ? "relative flex flex-col rounded-3xl border-2 border-primary/50 bg-primary/[0.06] p-7 shadow-xl shadow-primary/10"
                  : "flex flex-col rounded-3xl border border-border/60 bg-card/60 p-7"
              }
            >
              {p.featured && (
                <span className="absolute -top-3 left-7 rounded-full bg-primary px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-primary-foreground">
                  {featuredLabel}
                </span>
              )}
              <h3 className="font-display text-xl font-bold">{p.name}</h3>
              {p.tagline && <p className="mt-1 text-xs font-semibold uppercase tracking-widest text-muted-foreground">{p.tagline}</p>}
              {p.price && (
                <p className="mt-3 flex flex-wrap items-baseline gap-x-2">
                  {p.pricePrefix && <span className="text-sm text-muted-foreground">{p.pricePrefix}</span>}
                  <span className="font-display text-5xl font-bold tracking-tight">{p.price}</span>
                  {p.period && <span className="text-sm text-muted-foreground">{p.period}</span>}
                </p>
              )}
              {p.desc && <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{p.desc}</p>}
              <ul className="mt-6 mb-7 flex flex-col gap-3">
                {p.points.map((pt) => (
                  <li key={pt} className="flex items-start gap-2.5 text-base text-foreground/85">
                    <Check className="h-5 w-5 mt-0.5 shrink-0 text-primary" /> {pt}
                  </li>
                ))}
              </ul>
              {whatsapp ? (
                <WhatsAppLink segment={`${whatsapp.segment}_${slug(p.name)}`} defaultService={whatsapp.service} className={ctaClass}>
                  {p.cta}
                </WhatsAppLink>
              ) : (
                <Link href={href ?? "#contact"} className={ctaClass}>
                  {p.cta}
                </Link>
              )}
            </div>
          )
        })}
      </div>
      {note && <p className="mt-6 text-sm text-muted-foreground">{note}</p>}
    </section>
  )
}
