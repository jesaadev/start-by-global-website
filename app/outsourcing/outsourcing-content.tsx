import { Award, Clock, Code2, Layers, LifeBuoy, Megaphone, ShieldCheck } from "lucide-react"
import type { ShowcaseItem } from "@/lib/showcase"
import { PageFunnelTracker } from "@/components/analytics/page-funnel-tracker"
import { AnimateIn } from "@/components/animate-in"
import { PageHero } from "@/components/layout/page-hero"
import { PrimaryCTA } from "@/components/cta/primary-cta"
import { SecondaryCTA } from "@/components/cta/secondary-cta"
import { ClosingCTA } from "@/components/cta/closing-cta"
import { PersonaVisual } from "@/components/landings/persona-visual"
import { ComparisonSection } from "@/components/sections/comparison-section"
import { ProcessSection } from "@/components/sections/process-section"
import { PlansSection, type Plan } from "@/components/sections/plans-section"
import { FaqSection } from "@/components/sections/faq-section"
import SpotlightCard from "@/components/reactbits/SpotlightCard"
import { WhatsAppLink } from "@/components/whatsapp-link"

// Regla de dato real: compromisos de entrega (NDA, revisiones, Lighthouse 90+)
// sí; conteos de agencias o informes "reales" que no podamos mostrar, no.

const SERVICE = "Outsourcing / Marca Blanca"

const SERVICES = [
  {
    icon: Layers,
    title: "WordPress",
    tag: "Sitios y tiendas",
    desc: "Sitios corporativos, blogs y WooCommerce entregados rápido y bien. Tu cliente ve tu marca; nosotros ponemos el código.",
    stack: ["WordPress", "WooCommerce", "ACF Pro", "Elementor / Gutenberg", "WPML"],
    deliverables: ["Diseño a medida", "Core Web Vitals en verde", "SEO on-page configurado", "Seguridad reforzada", "Documentación para tu equipo"],
    turnaround: "7 a 21 días",
    color: "#0074D9",
  },
  {
    icon: Code2,
    title: "Corporativas sin CMS",
    tag: "Astro · React · Next.js",
    desc: "Para clientes que priorizan velocidad y seguridad: sitios estáticos que cargan al instante, sin base de datos que mantener.",
    stack: ["Astro", "Next.js", "Tailwind CSS", "Framer Motion", "Vercel / Cloudflare"],
    deliverables: ["Lighthouse 90+ garantizado", "Sin CMS: menos superficie de ataque", "Despliegue automático en CDN", "Animaciones fluidas", "Accesibilidad WCAG 2.1 AA"],
    turnaround: "5 a 14 días",
    color: "#00C9C8",
  },
  {
    icon: Megaphone,
    title: "Landing pages",
    tag: "Embudos de conversión",
    desc: "Landings para campañas, lanzamientos y captación de leads, pensadas para bajar el costo por lead de tu cliente.",
    stack: ["Next.js", "Meta Pixel + GTM", "API de Conversiones", "Integración con CRM"],
    deliverables: ["Copy orientado a conversión", "Diseño orientado a CRO", "Formularios con automatización", "Integración con cualquier CRM", "Variantes A/B listas"],
    turnaround: "3 a 10 días",
    color: "#7B61FF",
  },
]

const STEPS = [
  { title: "Brief confidencial", desc: "Nos envías los requisitos con el NDA firmado. Ningún dato de tu cliente sale de ese canal." },
  { title: "Propuesta en 24 h", desc: "Cotización con desglose técnico, cronograma y alcance. La revisas y ajustas." },
  { title: "Desarrollo en silencio", desc: "Trabajamos en staging bajo tu dominio. Te reportamos con tu marca, por Slack o Notion." },
  { title: "Entrega lista para publicar", desc: "Repositorio, credenciales y documentación. Tú haces la entrega final: el crédito es 100 % tuyo." },
]

const PLANS: Plan[] = [
  {
    name: "Puntual",
    tagline: "Por proyecto",
    desc: "Para apoyo esporádico o para probar la alianza.",
    points: ["Sin compromiso de volumen", "Cotización por proyecto", "Pago 50 % al inicio / 50 % a la entrega", "Soporte por email", "1 revisión incluida"],
    cta: "Empezar con un proyecto",
  },
  {
    name: "Partner",
    tagline: "3+ proyectos / mes",
    desc: "Para agencias con flujo continuo que quieren mejor precio y prioridad.",
    points: ["15 % de descuento en todos los proyectos", "Prioridad en la agenda", "2 revisiones por proyecto", "Canal de Slack dedicado", "Reportes con tu marca"],
    featured: true,
    cta: "Quiero ser partner",
  },
  {
    name: "Partner Pro",
    tagline: "6+ proyectos / mes",
    desc: "Para agencias de alto volumen que necesitan capacidad extendida.",
    points: ["25 % de descuento en todos los proyectos", "Gestor de cuenta dedicado", "Revisiones ilimitadas", "SLA de entrega garantizado", "Capacitación a tu equipo"],
    cta: "Hablar de volumen",
  },
]

const GUARANTEES = [
  { icon: Award, text: "Informes con tu logo para tu cliente" },
  { icon: Code2, text: "Código limpio, comentado y documentado" },
  { icon: ShieldCheck, text: "NDA firmado antes de empezar" },
  { icon: LifeBuoy, text: "Soporte post-entrega durante 30 días" },
]

const REPORT = [
  { label: "Performance", score: 96 },
  { label: "Accesibilidad", score: 100 },
  { label: "Buenas prácticas", score: 100 },
  { label: "SEO", score: 100 },
]

const FAQS = [
  { q: "¿Mi cliente puede enterarse de que tercericé el proyecto?", a: "No. Firmamos un NDA antes de empezar y trabajamos solo bajo tu marca: reportes, emails y repositorios llevan tu logo." },
  { q: "¿Cómo es el proceso de entrega?", a: "Nos pasas el brief con tus especificaciones; diseñamos, desarrollamos y te entregamos todo en un repositorio privado o en staging bajo tu dominio. Tú haces la entrega final al cliente." },
  { q: "¿Y si el cliente pide cambios después de entregado?", a: "Cada proyecto incluye las revisiones de tu plan sin costo. Cambios adicionales o de alcance se cotizan aparte con tarifa de partner." },
  { q: "¿Trabajan con agencias fuera de República Dominicana?", a: "Sí. Trabajamos en remoto con agencias de cualquier país y nos comunicamos por Slack, Notion o la herramienta que ya uses." },
  { q: "¿Hay un volumen mínimo?", a: "No. Puedes empezar con un solo proyecto. Los precios mejoran con los planes Partner (desde 3 proyectos al mes) y Partner Pro (desde 6)." },
]

function ScoreRing({ score, label }: { score: number; label: string }) {
  const r = 30
  const c = 2 * Math.PI * r
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative h-20 w-20">
        <svg viewBox="0 0 72 72" className="h-20 w-20 -rotate-90" aria-hidden>
          <circle cx="36" cy="36" r={r} fill="none" stroke="currentColor" strokeWidth="6" className="text-foreground/10" />
          <circle cx="36" cy="36" r={r} fill="none" stroke="currentColor" strokeWidth="6" strokeLinecap="round" className="text-chart-3" strokeDasharray={c} strokeDashoffset={c * (1 - score / 100)} />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center font-display text-xl font-bold">{score}</span>
      </div>
      <span className="text-xs text-muted-foreground text-center">{label}</span>
    </div>
  )
}

export function OutsourcingContent({ work }: { work: ShowcaseItem[] }) {
  return (
    <>
      <PageFunnelTracker landingKey="outsourcing" />

      <PageHero
        badge="Outsourcing y marca blanca para agencias"
        title="Tu equipo de desarrollo web, invisible para tu cliente."
        highlight="invisible para tu cliente."
        glow="#0074D9"
        subtitle="WordPress, sitios corporativos en Astro o React y landing pages de alta conversión, entregados bajo tu marca. Sin créditos, sin rastro."
        note={<><span className="font-semibold text-foreground">NDA antes de empezar · Lighthouse 90+ garantizado.</span> Pagas por proyecto entregado.</>}
        aside={<PersonaVisual visual="agency" work={work} />}
      >
        <PrimaryCTA label="Quiero ser partner" segment="outsourcing_hero" service={SERVICE} />
        <SecondaryCTA label="Prefiero dejar mis datos" href="#contacto" />
      </PageHero>

      <ComparisonSection
        eyebrow="El problema real"
        title="Rechazas clientes por falta de capacidad técnica."
        highlight="por falta de capacidad técnica."
        before={{
          label: "Sin partner",
          items: [
            "Freelancers sin garantía de calidad ni de plazos",
            "Nómina fija aunque no entren proyectos",
            "Proyectos que se retrasan y hay que rehacer",
            "Cuellos de botella cuando sube la demanda",
            "Tu reputación en juego en cada entrega",
          ],
        }}
        after={{
          label: "Con Start By Global",
          items: [
            "Un equipo técnico dedicado detrás de tu marca",
            "Pagas solo por proyecto entregado",
            "Calidad medida: Lighthouse 90+ o lo rehacemos",
            "Escalas de 1 a 10 proyectos al mes sin contratar",
            "Tu marca, tu crédito, nuestro código",
          ],
        }}
      />

      {/* Servicios */}
      <section id="servicios" className="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-20 scroll-mt-20">
        <h2 className="font-display text-3xl sm:text-5xl font-bold tracking-tight leading-[1.05] text-balance max-w-3xl">
          Tres servicios, un solo partner
        </h2>
        <div className="mt-10 grid grid-cols-1 lg:grid-cols-3 gap-4">
          {SERVICES.map((s, i) => {
            const Icon = s.icon
            return (
              <AnimateIn key={s.title} delay={i * 80} className="h-full">
                <SpotlightCard spotlightColor="rgba(0, 116, 217, 0.18)" className="h-full !p-7 flex flex-col">
                  <div className="flex items-center justify-between gap-3">
                    <span className="flex h-12 w-12 items-center justify-center rounded-xl" style={{ backgroundColor: `${s.color}1f`, color: s.color }}>
                      <Icon className="h-6 w-6" />
                    </span>
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary/70 px-3 py-1 text-xs font-semibold text-foreground/80">
                      <Clock className="h-3.5 w-3.5" /> {s.turnaround}
                    </span>
                  </div>
                  <h3 className="font-display text-2xl font-bold mt-5">{s.title}</h3>
                  <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mt-1">{s.tag}</p>
                  <p className="text-base text-foreground/70 leading-relaxed mt-3">{s.desc}</p>
                  <ul className="mt-5 flex flex-col gap-2">
                    {s.deliverables.map((d) => (
                      <li key={d} className="flex items-start gap-2 text-sm text-foreground/80">
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full" style={{ backgroundColor: s.color }} />
                        {d}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-5 flex flex-wrap gap-1.5">
                    {s.stack.map((t) => (
                      <span key={t} className="rounded-md bg-secondary/60 px-2 py-0.5 text-[11px] text-muted-foreground">{t}</span>
                    ))}
                  </div>
                  <WhatsAppLink
                    segment={`outsourcing_${s.title.toLowerCase().split(" ")[0]}`}
                    defaultService={SERVICE}
                    className="mt-auto pt-6 text-left text-sm font-semibold text-foreground hover:text-primary transition-colors"
                  >
                    Cotizar este servicio →
                  </WhatsAppLink>
                </SpotlightCard>
              </AnimateIn>
            )
          })}
        </div>
      </section>

      <ProcessSection eyebrow="Cómo funciona" title="Del brief a la entrega en 4 pasos" steps={STEPS} />

      <PlansSection
        title="El margen es tuyo. Siempre."
        subtitle="Nuestros precios son para ti: tú pones el margen que quieras a tu cliente. Sin restricciones y sin competir contigo."
        plans={PLANS}
        whatsapp={{ service: SERVICE, segment: "outsourcing_plan" }}
      />

      {/* Garantía */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <div>
            <span className="text-xs font-semibold uppercase tracking-widest text-primary">Nuestra promesa</span>
            <h2 className="font-display text-3xl sm:text-5xl font-bold tracking-tight leading-[1.05] mt-2 text-balance">
              Si no llegamos a 90 en Lighthouse, lo rehacemos gratis.
            </h2>
            <p className="text-lg text-foreground/75 leading-relaxed mt-4">
              Cada proyecto sale con su informe de Lighthouse y Core Web Vitals. Si el Performance no alcanza 90/100,
              seguimos trabajando hasta lograrlo sin costo adicional.
            </p>
            <ul className="mt-7 grid grid-cols-1 sm:grid-cols-2 gap-3">
              {GUARANTEES.map((g) => (
                <li key={g.text} className="flex items-center gap-3 rounded-2xl border border-border/50 bg-card/60 p-4 text-sm text-foreground/85">
                  <g.icon className="h-5 w-5 shrink-0 text-primary" />
                  {g.text}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-3xl border border-border/50 bg-card/60 p-7 sm:p-9">
            <div className="flex items-center justify-between gap-3">
              <p className="font-display text-lg font-bold">Informe de entrega</p>
              <span className="rounded-full bg-[#F4A261]/15 px-2.5 py-1 text-[11px] font-semibold text-[#b45309] dark:text-[#F4A261]">Ejemplo ilustrativo</span>
            </div>
            <div className="mt-7 grid grid-cols-2 sm:grid-cols-4 gap-4">
              {REPORT.map((r) => (
                <ScoreRing key={r.label} score={r.score} label={r.label} />
              ))}
            </div>
            <p className="mt-6 border-t border-border/50 pt-5 text-sm text-muted-foreground">
              Se adjunta con tu logo para que se lo entregues a tu cliente.
            </p>
          </div>
        </div>
      </section>

      <FaqSection faqs={FAQS} />

      <ClosingCTA
        title="Cuéntanos tu primer proyecto"
        text="Te respondemos en menos de 24 horas con una propuesta preliminar y el NDA listo para firmar."
        segment="outsourcing_final"
        service={SERVICE}
        ctaLabel="Hablar por WhatsApp"
        form={{
          landingKey: "outsourcing",
          landingName: "Outsourcing (página de servicio)",
          button: "Quiero la propuesta",
          nameLabel: "Nombre y agencia",
          qualifierLabel: "¿Cuántos proyectos al mes estimas?",
        }}
      />
    </>
  )
}
