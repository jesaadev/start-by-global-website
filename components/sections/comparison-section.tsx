import { Check, X } from "lucide-react"
import { AnimateIn } from "@/components/animate-in"
import { HighlightTitle } from "@/components/typography/highlight-title"

interface Column {
  label: string
  items: string[]
}

/** "Hoy" vs "con nosotros": el dolor y el cambio, lado a lado. */
export function ComparisonSection({
  eyebrow,
  title,
  highlight,
  before,
  after,
}: {
  eyebrow: string
  title: string
  highlight?: string
  before: Column
  after: Column
}) {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
      <div className="max-w-3xl">
        <span className="text-xs font-semibold uppercase tracking-widest text-primary">{eyebrow}</span>
        <h2 className="font-display text-3xl sm:text-5xl font-bold tracking-tight leading-[1.05] mt-2 text-balance">
          <HighlightTitle text={title} highlight={highlight} />
        </h2>
      </div>
      <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-4">
        <AnimateIn className="h-full">
          <div className="h-full rounded-3xl border border-border/50 bg-card/40 p-7 sm:p-9">
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">{before.label}</p>
            <ul className="mt-6 flex flex-col gap-4">
              {before.items.map((it) => (
                <li key={it} className="flex items-start gap-3 text-base text-muted-foreground">
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-destructive/10">
                    <X className="h-3.5 w-3.5 text-destructive" />
                  </span>
                  {it}
                </li>
              ))}
            </ul>
          </div>
        </AnimateIn>
        <AnimateIn delay={90} className="h-full">
          <div className="h-full rounded-3xl border border-primary/30 bg-gradient-to-br from-primary/15 via-primary/[0.05] to-transparent p-7 sm:p-9">
            <p className="text-xs font-semibold uppercase tracking-widest text-primary">{after.label}</p>
            <ul className="mt-6 flex flex-col gap-4">
              {after.items.map((it) => (
                <li key={it} className="flex items-start gap-3 text-base text-foreground/90">
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-chart-3/15">
                    <Check className="h-4 w-4 text-chart-3" />
                  </span>
                  {it}
                </li>
              ))}
            </ul>
          </div>
        </AnimateIn>
      </div>
    </section>
  )
}
