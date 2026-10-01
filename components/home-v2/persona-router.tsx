import Link from "next/link"
import { ArrowRight, Store, ShoppingCart, BarChart3, UserRound, Layers, type LucideIcon } from "lucide-react"
import SpotlightCard from "@/components/reactbits/SpotlightCard"
import { PERSONA_LANDINGS } from "@/lib/persona-landings"

// Icono y color de foco por landing (clave = segment).
const STYLE: Record<string, { icon: LucideIcon; spot: `rgba(${number}, ${number}, ${number}, ${number})`; tint: string }> = {
  landing_a: { icon: Store, spot: "rgba(242, 109, 61, 0.22)", tint: "text-primary bg-primary/10" },
  landing_d: { icon: ShoppingCart, spot: "rgba(37, 211, 102, 0.18)", tint: "text-[#25D366] bg-[#25D366]/10" },
  landing_b: { icon: BarChart3, spot: "rgba(0, 116, 217, 0.22)", tint: "text-[#3b9cff] bg-[#0074D9]/10" },
  landing_c: { icon: UserRound, spot: "rgba(244, 162, 97, 0.22)", tint: "text-[#F4A261] bg-[#F4A261]/10" },
  landing_e: { icon: Layers, spot: "rgba(123, 97, 255, 0.22)", tint: "text-[#9d88ff] bg-[#7B61FF]/10" },
}

/**
 * "¿Cuál es tu caso?": enruta a cada visitante a la landing de su persona,
 * donde el mensaje y la oferta están hechos a su medida.
 */
export function PersonaRouter() {
  const cases = Object.values(PERSONA_LANDINGS)

  return (
    <section id="casos" className="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-24 scroll-mt-20">
      <div className="max-w-2xl mb-10">
        <span className="text-xs font-semibold uppercase tracking-widest text-primary">Soluciones por caso</span>
        <h2 className="font-display text-3xl sm:text-5xl font-bold tracking-tight leading-[1.05] mt-2 text-balance">
          ¿Cuál es tu caso?
        </h2>
        <p className="text-base sm:text-lg text-muted-foreground mt-3">
          Elige el que más se parece al tuyo y te mostramos cómo lo resolvemos, paso a paso.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
        {cases.map((c, i) => {
          const s = STYLE[c.segment] ?? STYLE.landing_a
          const Icon = s.icon
          return (
            <Link
              key={c.slug}
              href={`/${c.slug}`}
              className={`group block rounded-3xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary ${i < 3 ? "lg:col-span-2" : "lg:col-span-3"}`}
            >
              <SpotlightCard spotlightColor={s.spot} className="h-full !p-6 sm:!p-7 transition-colors group-hover:border-border">
                <div className="flex h-full flex-col gap-4">
                  <span className={`flex h-11 w-11 items-center justify-center rounded-xl ${s.tint}`}>
                    <Icon className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{c.persona}</p>
                    <h3 className="font-display text-xl sm:text-2xl font-bold leading-snug mt-1 text-balance">{c.hero.h1}</h3>
                  </div>
                  <span className="mt-auto inline-flex items-center gap-1.5 text-sm font-semibold text-foreground">
                    Ver cómo lo resolvemos
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1 motion-reduce:transition-none" />
                  </span>
                </div>
              </SpotlightCard>
            </Link>
          )
        })}
      </div>
    </section>
  )
}
