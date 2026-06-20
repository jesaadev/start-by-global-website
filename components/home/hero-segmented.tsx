import Link from "next/link"
import { Sparkles, MessageCircle, Calendar, ArrowRight, Rocket, Layers, LineChart } from "lucide-react"
import { AnimateIn } from "@/components/animate-in"
import { WhatsAppLink } from "@/components/whatsapp-link"
import { ClientLogos } from "@/components/client-logos"

const CALENDLY_URL = "https://calendly.com/startbyglobal"

// Cada camino corresponde a un dolor del avatar B2B.
const PATHS = [
  {
    icon: Rocket,
    eyebrow: "No tengo presencia digital",
    promise: "Lanza una web que vende, lista en días, no en meses.",
    cta: "Quiero mi web",
    type: "whatsapp" as const,
    service: "Desarrollo Web",
    segment: "sin_presencia",
    color: "#0074D9",
  },
  {
    icon: Layers,
    eyebrow: "Soy agencia / quiero tercerizar",
    promise: "Desarrollo white-label bajo tu marca, con NDA. Entregas más sin hacer más.",
    cta: "Ver outsourcing",
    type: "link" as const,
    href: "/outsourcing",
    color: "#7B61FF",
  },
  {
    icon: LineChart,
    eyebrow: "Tengo web pero no genera",
    promise: "Diagnóstico de conversión gratuito: deja de quemar dinero en Ads.",
    cta: "Auditar mi web",
    type: "whatsapp" as const,
    service: "Marketing Digital",
    segment: "web_no_genera",
    color: "#e05a2b",
  },
]

export function HeroSegmented() {
  return (
    <section id="hero" className="relative overflow-hidden rounded-2xl glass-card glow-accent-lg">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-chart-2/5" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-float" />

      <div className="relative flex flex-col gap-8 p-5 sm:p-8 lg:p-12">
        {/* Encabezado */}
        <div className="flex flex-col gap-5 max-w-3xl">
          <AnimateIn delay={0}>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-medium w-fit">
              <Sparkles className="w-3 h-3" />
              Agencia de marketing y desarrollo web · RD · ES · LATAM · EE.UU.
            </span>
          </AnimateIn>

          <AnimateIn delay={100}>
            <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight text-balance text-foreground">
              Webs y marketing que convierten{" "}
              <span className="text-primary">visitantes en clientes</span>
            </h1>
          </AnimateIn>

          <AnimateIn delay={200}>
            <p className="text-muted-foreground text-base lg:text-lg leading-relaxed max-w-xl">
              Una mala web cuesta clientes; una buena los multiplica. Diseñamos,
              desarrollamos y posicionamos activos digitales que generan ventas reales.
            </p>
          </AnimateIn>

          {/* Jerarquía de CTAs: WhatsApp → Agenda → Formulario */}
          <AnimateIn delay={300}>
            <div className="flex flex-wrap items-center gap-3">
              <WhatsAppLink segment="hero_cta" className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[#25D366] text-white font-semibold text-sm transition-all duration-300 hover:bg-[#25D366]/90 hover:shadow-lg hover:shadow-[#25D366]/25">
                <MessageCircle className="w-4 h-4" />
                Hablar por WhatsApp
              </WhatsAppLink>
              <a
                href={CALENDLY_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-sm transition-all duration-300 hover:shadow-lg hover:shadow-primary/25"
              >
                <Calendar className="w-4 h-4" />
                Agendar consultoría
              </a>
              <Link
                href="/contacto"
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-transparent border border-border text-foreground font-semibold text-sm transition-all duration-200 hover:bg-secondary hover:border-border/80"
              >
                Solicitar propuesta
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </AnimateIn>

          {/* Filtro de calificación por precio */}
          <AnimateIn delay={350}>
            <p className="text-xs text-muted-foreground">
              <span className="text-foreground font-semibold">Proyectos desde $400.</span>{" "}
              Trabajamos con empresas listas para invertir en crecer.
            </p>
          </AnimateIn>
        </div>

        {/* Selector de caminos por avatar */}
        <AnimateIn delay={400}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {PATHS.map((p) => {
              const Icon = p.icon
              const inner = (
                <>
                  <div
                    className="flex items-center justify-center w-10 h-10 rounded-xl shrink-0"
                    style={{ backgroundColor: p.color + "1a", border: `1px solid ${p.color}33` }}
                  >
                    <Icon className="w-5 h-5" style={{ color: p.color }} />
                  </div>
                  <div className="flex flex-col gap-1 min-w-0 text-left">
                    <span className="text-[11px] uppercase tracking-wide text-muted-foreground">{p.eyebrow}</span>
                    <span className="text-sm font-medium text-foreground leading-snug">{p.promise}</span>
                    <span className="inline-flex items-center gap-1 text-xs font-semibold mt-1.5" style={{ color: p.color }}>
                      {p.cta} <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </>
              )
              const cardCls =
                "flex items-start gap-3 p-4 rounded-xl bg-card/60 border border-border/50 text-left h-full w-full transition-all duration-200 hover:border-border hover:bg-card hover:-translate-y-0.5"

              return p.type === "whatsapp" ? (
                <WhatsAppLink key={p.eyebrow} defaultService={p.service} segment={p.segment} className={cardCls} aria-label={p.cta}>
                  {inner}
                </WhatsAppLink>
              ) : (
                <Link key={p.eyebrow} href={p.href!} className={cardCls} aria-label={p.cta}>
                  {inner}
                </Link>
              )
            })}
          </div>
        </AnimateIn>

        {/* Prueba social */}
        <ClientLogos />
      </div>
    </section>
  )
}
