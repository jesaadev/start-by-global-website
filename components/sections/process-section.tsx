import { AnimateIn } from "@/components/animate-in"
import { cn } from "@/lib/utils"

export interface ProcessStep {
  title: string
  desc: string
}

/** Pasos numerados: transparencia de proceso en lugar de promesas de resultado. */
export function ProcessSection({
  eyebrow = "Cómo trabajamos",
  title,
  steps,
}: {
  eyebrow?: string
  title: string
  steps: ProcessStep[]
}) {
  return (
    <section id="proceso" className="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-24 scroll-mt-20">
      <div className="max-w-2xl mb-10">
        <span className="text-xs font-semibold uppercase tracking-widest text-primary">{eyebrow}</span>
        <h2 className="font-display text-3xl sm:text-5xl font-bold tracking-tight leading-[1.05] mt-2 text-balance">{title}</h2>
      </div>
      <ol
        className={cn(
          "relative grid grid-cols-1 sm:grid-cols-2 gap-4",
          steps.length >= 5 ? "lg:grid-cols-5" : steps.length === 3 ? "lg:grid-cols-3" : "lg:grid-cols-4"
        )}
      >
        {/* línea que une los pasos (desktop) */}
        <span aria-hidden className="hidden lg:block absolute top-7 left-[12%] right-[12%] h-px bg-gradient-to-r from-primary/0 via-primary/40 to-primary/0" />
        {steps.map((p, i) => (
          <li key={p.title}>
            <AnimateIn delay={i * 90} className="h-full">
              <div className="relative h-full rounded-2xl border border-border/50 bg-card/60 p-6 backdrop-blur-sm">
                <span className="relative z-[1] flex h-14 w-14 items-center justify-center rounded-2xl bg-primary font-display text-xl font-bold text-primary-foreground shadow-lg shadow-primary/25">
                  0{i + 1}
                </span>
                <h3 className="font-display text-xl font-bold mt-5">{p.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed mt-2">{p.desc}</p>
              </div>
            </AnimateIn>
          </li>
        ))}
      </ol>
    </section>
  )
}
