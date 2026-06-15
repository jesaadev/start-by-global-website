import { AlertTriangle } from "lucide-react"
import { AnimateIn } from "@/components/animate-in"
import { PAINS } from "@/lib/home-content"

export function ProblemSection() {
  return (
    <section className="flex flex-col gap-6">
      <AnimateIn>
        <div className="max-w-2xl">
          <h2 className="font-display text-2xl font-bold text-foreground">
            ¿Tu presencia digital trabaja para ti… o en tu contra?
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Estos son los frenos más comunes que vemos en empresas que quieren crecer.
          </p>
        </div>
      </AnimateIn>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {PAINS.map((pain, i) => (
          <AnimateIn key={pain.title} delay={i * 80}>
            <div className="glass-card rounded-xl p-5 h-full flex flex-col gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-destructive/10 border border-destructive/20">
                <AlertTriangle className="w-5 h-5 text-destructive" />
              </div>
              <h3 className="text-sm font-semibold text-foreground leading-snug">{pain.title}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">{pain.desc}</p>
            </div>
          </AnimateIn>
        ))}
      </div>
    </section>
  )
}
