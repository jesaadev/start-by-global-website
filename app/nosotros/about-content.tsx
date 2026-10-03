import { Globe, KeyRound, Lightbulb, Target } from "lucide-react"
import { AnimateIn } from "@/components/animate-in"
import { PageHero } from "@/components/layout/page-hero"
import { PrimaryCTA } from "@/components/cta/primary-cta"
import { SecondaryCTA } from "@/components/cta/secondary-cta"
import { ClosingCTA } from "@/components/cta/closing-cta"
import { PlatformsStrip } from "@/components/home-v2/platforms-strip"

// Regla de dato real: sin años de trayectoria, conteos de proyectos ni
// certificaciones que no podamos demostrar. Hablamos de cómo trabajamos.

const VALUES = [
  {
    icon: Target,
    title: "Resultados que se miden",
    desc: "Cada decisión se toma con datos y se juzga por lo que mueve en tu negocio: conversaciones, citas y ventas, no likes.",
  },
  {
    icon: KeyRound,
    title: "Transparencia total",
    desc: "Precio y fecha por escrito antes de empezar. Dominio, accesos y cuentas siempre a tu nombre.",
  },
  {
    icon: Lightbulb,
    title: "Tecnología actual",
    desc: "Webs rápidas, medición con API de Conversiones y automatización con IA donde de verdad ahorra trabajo.",
  },
  {
    icon: Globe,
    title: "Visión global",
    desc: "Entendemos los matices de cada mercado y trabajamos en tu zona horaria, estés donde estés.",
  },
]

const MARKETS = [
  { name: "Rep. Dominicana", note: "Nuestra base, en Santo Domingo", tz: "GMT-4" },
  { name: "España", note: "Atención en remoto", tz: "GMT+1" },
  { name: "Latinoamérica", note: "Atención en remoto", tz: "GMT-6 a GMT-3" },
  { name: "EE.UU.", note: "Atención en remoto, en inglés o español", tz: "GMT-5 a GMT-8" },
]

export function AboutPageContent() {
  return (
    <>
      <PageHero
        badge="Nosotros"
        title="Hacemos que tu web trabaje como tu mejor vendedor"
        highlight="tu mejor vendedor"
        subtitle="Somos un equipo de diseño, desarrollo y publicidad nacido en Santo Domingo. Trabajamos en remoto con negocios de Rep. Dominicana, España, Latinoamérica y EE.UU."
      >
        <PrimaryCTA segment="nosotros_hero" />
        <SecondaryCTA />
      </PageHero>

      {/* Misión */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
        <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-6">
          <div className="rounded-3xl border border-border/50 bg-card/60 p-7 sm:p-10">
            <span className="text-xs font-semibold uppercase tracking-widest text-primary">Nuestra misión</span>
            <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight mt-2 text-balance">
              Marketing digital de primer nivel, al alcance de cualquier negocio
            </h2>
            <p className="text-lg text-foreground/75 leading-relaxed mt-5">
              Creemos que cada negocio, sin importar su tamaño o ubicación, merece una presencia digital que le traiga
              clientes. Por eso juntamos en un solo equipo lo que normalmente está repartido entre tres proveedores: la
              web, los anuncios y la medición.
            </p>
            <p className="text-lg text-foreground/75 leading-relaxed mt-4">
              Nacimos con la convicción de que el talento hispanohablante puede competir con las mejores agencias del
              mundo, y trabajamos para demostrarlo en cada entrega.
            </p>
          </div>
          <div className="relative overflow-hidden rounded-3xl border border-primary/25 bg-gradient-to-br from-primary/15 via-primary/5 to-transparent p-7 sm:p-10 flex flex-col justify-center">
            <p className="font-display text-2xl sm:text-3xl font-bold leading-snug text-balance">
              &ldquo;Transformamos datos en decisiones, ideas en experiencias y clientes en embajadores de marca.&rdquo;
            </p>
          </div>
        </div>
      </section>

      {/* Cómo trabajamos */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <h2 className="font-display text-3xl sm:text-5xl font-bold tracking-tight text-balance max-w-3xl">Así trabajamos</h2>
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {VALUES.map((v, i) => {
            const Icon = v.icon
            return (
              <AnimateIn key={v.title} delay={i * 80} className="h-full">
                <div className="h-full rounded-2xl border border-border/50 bg-card/60 p-6">
                  <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Icon className="h-6 w-6" />
                  </span>
                  <h3 className="font-display text-xl font-bold mt-5">{v.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed mt-2">{v.desc}</p>
                </div>
              </AnimateIn>
            )
          })}
        </div>
      </section>

      {/* Dónde trabajamos */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <h2 className="font-display text-3xl sm:text-5xl font-bold tracking-tight text-balance max-w-3xl">
          Trabajamos en tu zona horaria
        </h2>
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {MARKETS.map((m) => (
            <div key={m.name} className="rounded-2xl border border-border/50 bg-card/60 p-6">
              <p className="font-display text-xl font-bold">{m.name}</p>
              <p className="text-sm text-muted-foreground mt-1">{m.note}</p>
              <p className="mt-4 inline-flex rounded-full bg-secondary/60 px-3 py-1 text-xs font-medium text-muted-foreground">{m.tz}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="py-6">
        <PlatformsStrip />
      </div>

      <ClosingCTA
        title="¿Hablamos de tu proyecto?"
        text="Escríbenos por WhatsApp y te respondemos con ideas concretas para tu web y tus anuncios, sin compromiso."
        segment="nosotros_final"
        extra={<SecondaryCTA label="Prefiero un diagnóstico por formulario" className="w-fit" />}
      />
    </>
  )
}
