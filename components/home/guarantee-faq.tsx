import { ShieldCheck, Clock, FileLock, Plus } from "lucide-react"
import { AnimateIn } from "@/components/animate-in"
import { FAQS } from "@/lib/home-content"

const GUARANTEES = [
  { icon: Clock, title: "Entrega puntual", desc: "Plazos claros desde el briefing." },
  { icon: ShieldCheck, title: "Enfoque en resultados", desc: "Sitios pensados para convertir, no solo lucir." },
  { icon: FileLock, title: "Confidencialidad (NDA)", desc: "Tu información y tus clientes, protegidos." },
]

const FAQ_JSONLD = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQS.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
}

export function GuaranteeFaq() {
  return (
    <section className="flex flex-col gap-6">
      {/* Datos estructurados para rich snippets de FAQ en buscadores */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_JSONLD) }}
      />
      {/* Garantías */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {GUARANTEES.map((g, i) => {
          const Icon = g.icon
          return (
            <AnimateIn key={g.title} delay={i * 80}>
              <div className="glass-card rounded-xl p-5 h-full flex items-start gap-3">
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-chart-3/10 border border-chart-3/20 shrink-0">
                  <Icon className="w-5 h-5 text-chart-3" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-foreground">{g.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed mt-0.5">{g.desc}</p>
                </div>
              </div>
            </AnimateIn>
          )
        })}
      </div>

      {/* FAQ */}
      <AnimateIn>
        <div className="max-w-2xl">
          <h2 className="font-display text-2xl font-bold text-foreground">Preguntas frecuentes</h2>
          <p className="text-sm text-muted-foreground mt-1">Resolvemos las dudas más comunes antes de empezar.</p>
        </div>
      </AnimateIn>

      <div className="flex flex-col gap-2.5">
        {FAQS.map((item, i) => (
          <AnimateIn key={item.q} delay={i * 50}>
            <details className="group glass-card rounded-xl px-5 py-4">
              <summary className="flex items-center justify-between gap-3 cursor-pointer list-none">
                <span className="text-sm font-medium text-foreground">{item.q}</span>
                <Plus className="w-4 h-4 text-muted-foreground shrink-0 transition-transform group-open:rotate-45" />
              </summary>
              <p className="text-sm text-muted-foreground leading-relaxed mt-3">{item.a}</p>
            </details>
          </AnimateIn>
        ))}
      </div>
    </section>
  )
}
