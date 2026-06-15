import { AnimateIn } from "@/components/animate-in"
import { PROCESS_STEPS } from "@/lib/home-content"

export function ProcessSteps() {
  return (
    <section className="flex flex-col gap-6">
      <AnimateIn>
        <div className="max-w-2xl">
          <span className="text-[11px] uppercase tracking-wider text-primary font-semibold">Cómo trabajamos</span>
          <h2 className="font-display text-2xl font-bold text-foreground mt-1">Tu web en 5 pasos</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Un proceso claro y ágil: lanzamos en días, no en meses.
          </p>
        </div>
      </AnimateIn>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {PROCESS_STEPS.map((s, i) => (
          <AnimateIn key={s.step} delay={i * 70}>
            <div className="glass-card rounded-xl p-5 h-full flex flex-col gap-2">
              <span className="font-display text-2xl font-bold text-primary">{s.step}</span>
              <h3 className="text-sm font-semibold text-foreground">{s.title}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">{s.desc}</p>
            </div>
          </AnimateIn>
        ))}
      </div>
    </section>
  )
}
