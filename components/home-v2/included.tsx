import { Check, ShieldCheck } from "lucide-react"
import type { Locale } from "@/lib/i18n"
import { INCLUDED } from "@/lib/home-content"

const TEXT = {
  es: {
    eyebrow: "Incluido siempre",
    title: "Todo lo que tu web necesita para vender",
    items: INCLUDED,
    ownTitle: "Tú eres el dueño de todo",
    ownText:
      "Dominio, hosting, accesos y cuentas publicitarias a tu nombre desde el primer día. Si mañana dejamos de trabajar juntos, te llevas todo, documentado.",
  },
  en: {
    eyebrow: "Always included",
    title: "Everything your website needs to sell",
    items: [
      "Mobile-first, fast-loading design",
      "Core Web Vitals performance targets",
      "Technical SEO + structured data",
      "Analytics & conversion tracking (GA4, pixel + CAPI)",
      "Copywriting guidance in English",
      "30 days of post-launch support",
    ],
    ownTitle: "You own everything",
    ownText:
      "Domain, hosting, code and ad accounts are registered under your name from day one. If we ever stop working together, you take everything with you, documented.",
  },
} as const

/** Qué recibe siempre el cliente + propiedad de todo (reduce el riesgo percibido). */
export function HomeIncluded({ locale = "es" }: { locale?: Locale } = {}) {
  const t = TEXT[locale]
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
      <div className="grid grid-cols-1 lg:grid-cols-[1.3fr_1fr] gap-6">
        <div className="rounded-3xl border border-border/50 bg-card/60 p-7 sm:p-10">
          <span className="text-xs font-semibold uppercase tracking-widest text-primary">{t.eyebrow}</span>
          <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight mt-2 text-balance">{t.title}</h2>
          <ul className="mt-7 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
            {t.items.map((item) => (
              <li key={item} className="flex items-start gap-3 text-base text-foreground/85">
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-chart-3/15">
                  <Check className="h-4 w-4 text-chart-3" />
                </span>
                {item}
              </li>
            ))}
          </ul>
        </div>
        <div className="relative overflow-hidden rounded-3xl border border-primary/25 bg-gradient-to-br from-primary/15 via-primary/5 to-transparent p-7 sm:p-10">
          <ShieldCheck className="h-10 w-10 text-primary" />
          <h3 className="font-display text-2xl sm:text-3xl font-bold mt-5 text-balance">{t.ownTitle}</h3>
          <p className="text-base text-foreground/80 leading-relaxed mt-3">{t.ownText}</p>
        </div>
      </div>
    </section>
  )
}
