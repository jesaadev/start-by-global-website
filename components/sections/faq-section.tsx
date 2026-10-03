import { Plus } from "lucide-react"
import { FaqJsonLd } from "@/components/seo-jsonld"

export interface Faq {
  q: string
  a: string
}

/**
 * Preguntas frecuentes con <details> (0 JS) y FAQPage JSON-LD para rich
 * snippets. `jsonLd={false}` cuando la página ya emite el suyo.
 */
export function FaqSection({ faqs, title = "Preguntas frecuentes", jsonLd = true }: { faqs: Faq[]; title?: string; jsonLd?: boolean }) {
  return (
    <section id="faq" className="max-w-4xl mx-auto px-4 sm:px-6 py-16 sm:py-20 scroll-mt-20">
      {jsonLd && <FaqJsonLd faqs={faqs} />}
      <h2 className="font-display text-3xl sm:text-5xl font-bold tracking-tight text-center text-balance">{title}</h2>
      <div className="mt-10 flex flex-col gap-3">
        {faqs.map((f) => (
          <details key={f.q} className="group rounded-2xl border border-border/50 bg-card/60 px-5 sm:px-6 py-5">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4">
              <span className="text-base sm:text-lg font-semibold text-foreground">{f.q}</span>
              <Plus className="h-5 w-5 shrink-0 text-primary transition-transform group-open:rotate-45 motion-reduce:transition-none" />
            </summary>
            <p className="mt-3 text-base text-muted-foreground leading-relaxed">{f.a}</p>
          </details>
        ))}
      </div>
    </section>
  )
}
