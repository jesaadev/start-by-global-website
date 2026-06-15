import Link from "next/link"
import { Check, ArrowRight, Layers } from "lucide-react"
import { AnimateIn } from "@/components/animate-in"
import { WhatsAppLink } from "@/components/whatsapp-link"
import { OUTSOURCING_BENEFITS } from "@/lib/home-content"

export function OutsourcingBlock() {
  return (
    <AnimateIn>
      <section className="relative overflow-hidden rounded-2xl glass-card p-6 sm:p-8 lg:p-10">
        <div
          className="absolute top-0 right-0 w-72 h-72 rounded-full blur-3xl"
          style={{ background: "#7B61FF14" }}
        />
        <div className="relative grid lg:grid-cols-2 gap-8 items-center">
          <div className="flex flex-col gap-4">
            <span
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium w-fit"
              style={{ backgroundColor: "#7B61FF1a", color: "#7B61FF", border: "1px solid #7B61FF33" }}
            >
              <Layers className="w-3 h-3" />
              Para agencias y equipos
            </span>
            <h2 className="font-display text-2xl lg:text-3xl font-bold text-foreground leading-tight">
              Tu agencia entrega más, sin hacer más
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-md">
              Tercerizar tu desarrollo web te ahorra tiempo y dinero. Trabajamos como tu
              equipo en la sombra, bajo tu marca y con NDA.
            </p>
            <div className="flex flex-wrap items-center gap-3 mt-1">
              <Link
                href="/outsourcing"
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:shadow-lg hover:shadow-primary/25 transition-all"
              >
                Ver outsourcing <ArrowRight className="w-4 h-4" />
              </Link>
              <WhatsAppLink
                defaultService="Outsourcing / Marca Blanca"
                segment="outsourcing"
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-border text-foreground font-semibold text-sm hover:bg-secondary/60 transition-colors"
              >
                Hablar de mi caso
              </WhatsAppLink>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {OUTSOURCING_BENEFITS.map((b) => (
              <div key={b} className="flex items-start gap-2.5 rounded-xl bg-secondary/30 border border-border/40 p-3.5">
                <Check className="w-4 h-4 mt-0.5 shrink-0" style={{ color: "#7B61FF" }} />
                <span className="text-xs text-foreground leading-relaxed">{b}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </AnimateIn>
  )
}
