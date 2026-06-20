import { ArrowRight } from "lucide-react"
import { AnimateIn } from "@/components/animate-in"
import { FUNNEL_STAGES } from "@/lib/home-content"

export function FunnelMethod() {
  return (
    <section className="flex flex-col gap-6">
      <AnimateIn>
        <div className="max-w-2xl">
          <span className="text-[11px] uppercase tracking-wider text-primary font-semibold">Nuestro método</span>
          <h2 className="font-display text-2xl font-bold text-foreground mt-1">El Embudo de Ventas Digital</h2>
          <p className="text-sm text-muted-foreground mt-1">
            No vendemos "webs bonitas": construimos un sistema que convierte desconocidos en clientes.
          </p>
        </div>
      </AnimateIn>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {FUNNEL_STAGES.map((s, i) => (
          <AnimateIn key={s.stage} delay={i * 80}>
            <div className="relative glass-card rounded-xl p-5 h-full flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="font-display text-3xl font-bold text-primary/30">{i + 1}</span>
                <span className="text-[10px] uppercase tracking-wide px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                  {s.tag}
                </span>
              </div>
              <h3 className="text-sm font-semibold text-foreground">{s.stage}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">{s.desc}</p>
              {i < FUNNEL_STAGES.length - 1 && (
                <ArrowRight className="hidden lg:block absolute -right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-border" />
              )}
            </div>
          </AnimateIn>
        ))}
      </div>
    </section>
  )
}
