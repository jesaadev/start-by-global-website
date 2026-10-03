import Link from "next/link"
import { ArrowRight, BarChart3, Check, Code, Globe, KeyRound, Megaphone, Palette, Search, FileText, Gauge, CalendarCheck } from "lucide-react"
import { AnimateIn } from "@/components/animate-in"
import { PageHero } from "@/components/layout/page-hero"
import { PrimaryCTA } from "@/components/cta/primary-cta"
import { SecondaryCTA } from "@/components/cta/secondary-cta"
import { ClosingCTA } from "@/components/cta/closing-cta"
import { WhatsAppLink } from "@/components/whatsapp-link"

// Regla de dato real: compromisos y entregables, sin cifras ni credenciales
// que no podamos demostrar.

const SERVICES = [
  {
    icon: Globe,
    title: "Desarrollo Web",
    slug: "desarrollo-web",
    whatsapp: "Desarrollo Web",
    page: { href: "/diseno-paginas-web", label: "Ver diseño web y precios" },
    description: "Webs corporativas, tiendas online y landing pages rápidas, pensadas para que el visitante te escriba.",
    features: [
      "Sitios web corporativos y landing pages",
      "Tiendas online con pasarela de pago",
      "Formularios y botón conectados a tu WhatsApp",
      "Integraciones API y sistemas a medida",
      "Optimización de velocidad y Core Web Vitals",
      "Mantenimiento y soporte continuo",
    ],
    tech: ["Next.js", "React", "WordPress", "Shopify", "Tailwind CSS"],
  },
  {
    icon: Megaphone,
    title: "Publicidad en Google y Meta",
    slug: "marketing-digital",
    whatsapp: "Marketing Digital",
    page: { href: "/publicidad-ads", label: "Ver publicidad y precios" },
    description: "Campañas que se optimizan por clientes potenciales, no por clics, con medición de punta a punta.",
    features: [
      "Google Ads (Búsqueda, Display, Performance Max)",
      "Meta Ads (Facebook e Instagram)",
      "TikTok Ads y LinkedIn Ads",
      "Retargeting de visitantes y conversaciones",
      "Creatividades y copies orientados a conversión",
      "Pruebas A/B y optimización semanal",
    ],
    tech: ["Google Ads", "Meta Business", "TikTok Ads", "LinkedIn Ads"],
  },
  {
    icon: Search,
    title: "SEO & Posicionamiento",
    slug: "seo-posicionamiento",
    whatsapp: "SEO & Posicionamiento",
    description: "Que te encuentren en Google cuando te están buscando: base técnica, contenido y ficha local.",
    features: [
      "Auditoría SEO técnica",
      "Optimización on-page y estructura web",
      "SEO local y ficha de Google Business",
      "Estrategia de contenido y palabras clave",
      "Enlazado interno y link building ético",
      "Seguimiento mensual de posiciones",
    ],
    tech: ["Search Console", "GA4", "Ahrefs", "Screaming Frog"],
  },
  {
    icon: Palette,
    title: "Branding & Diseño",
    slug: "branding-diseno",
    whatsapp: "Branding & Diseño",
    description: "Una identidad que transmite confianza desde el primer vistazo, coherente en web, anuncios y redes.",
    features: [
      "Logotipo e identidad visual",
      "Guía de marca y sistema de diseño",
      "Diseño UI/UX para web y móvil",
      "Piezas para redes sociales y anuncios",
      "Presentaciones corporativas",
    ],
    tech: ["Figma", "Adobe CC", "Illustrator"],
  },
  {
    icon: BarChart3,
    title: "Analítica & Data",
    slug: "analitica-data",
    whatsapp: "Analítica & Data",
    description: "Saber de dónde viene cada cliente y cuánto te cuesta, en un panel que se entiende.",
    features: [
      "Google Analytics 4 y Tag Manager",
      "Píxel de Meta + API de Conversiones",
      "Configuración de conversiones y eventos",
      "Paneles en Looker Studio",
      "Atribución por canal y campaña",
    ],
    tech: ["GA4", "Tag Manager", "Looker Studio", "BigQuery"],
  },
  {
    icon: Code,
    title: "Automatización e IA",
    slug: "automatizacion",
    whatsapp: "Automatización e IA",
    page: { href: "/ia-automatizacion", label: "Ver IA & automatización" },
    description: "Respuestas, seguimiento y tareas repetitivas que se hacen solas, conectadas a tus herramientas.",
    features: [
      "Chatbots y asistentes con IA",
      "Seguimiento automático de leads",
      "Integración con tu CRM",
      "Conexión de APIs y webhooks",
      "Reportes y alertas automáticas",
    ],
    tech: ["Make", "n8n", "Zapier", "HubSpot", "OpenAI"],
  },
]

const COMMITMENTS = [
  { icon: KeyRound, title: "Todo a tu nombre", desc: "Dominio, hosting, accesos y cuentas publicitarias son tuyos desde el primer día." },
  { icon: FileText, title: "Precio y fecha por escrito", desc: "Qué hacemos, qué no, cuánto cuesta y cuándo se entrega, antes de empezar." },
  { icon: Gauge, title: "Medición real", desc: "Píxel, API de Conversiones y analítica verificados: cada lead tiene origen." },
  { icon: CalendarCheck, title: "Semanas, no meses", desc: "Los proyectos de captación estándar se entregan en semanas, con avances visibles." },
]

export function ServicesPageContent() {
  return (
    <>
      <PageHero
        badge="Servicios"
        title="Desarrollo web y marketing digital que se convierte en clientes"
        highlight="en clientes"
        subtitle="Diseño web, publicidad en Google y Meta, SEO, branding, analítica y automatización. Un solo equipo con un objetivo: que te escriban."
      >
        <PrimaryCTA segment="servicios_hero" />
        <SecondaryCTA />
      </PageHero>

      {/* Atajos a cada servicio */}
      <nav aria-label="Servicios" className="max-w-7xl mx-auto px-4 sm:px-6 -mt-4 sm:-mt-8 pb-4">
        <div className="flex flex-wrap gap-2">
          {SERVICES.map((s) => (
            <a key={s.slug} href={`#${s.slug}`}
              className="rounded-full border border-border/60 bg-card/60 px-4 py-2 text-sm font-medium text-foreground/85 hover:border-primary/40 hover:text-foreground transition-colors">
              {s.title}
            </a>
          ))}
        </div>
      </nav>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-14 flex flex-col gap-5">
        {SERVICES.map((s, i) => {
          const Icon = s.icon
          return (
            <AnimateIn key={s.slug} delay={i * 40}>
              <article id={s.slug} className="scroll-mt-24 rounded-3xl border border-border/50 bg-card/60 p-6 sm:p-10">
                <div className="grid grid-cols-1 lg:grid-cols-[1.15fr_1fr] gap-8 lg:gap-12">
                  <div className="flex flex-col gap-5">
                    <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                      <Icon className="h-7 w-7" />
                    </span>
                    <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-balance">{s.title}</h2>
                    <p className="text-lg text-foreground/75 leading-relaxed max-w-xl">{s.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {s.tech.map((t) => (
                        <span key={t} className="rounded-full bg-secondary/60 px-3 py-1 text-xs font-medium text-muted-foreground">{t}</span>
                      ))}
                    </div>
                    <div className="mt-auto flex flex-wrap items-center gap-4 pt-2">
                      <WhatsAppLink
                        segment={`servicios_${s.slug}`}
                        defaultService={s.whatsapp}
                        className="inline-flex items-center gap-2 rounded-xl bg-[#25D366] px-5 py-3 text-sm font-bold text-white hover:shadow-lg hover:shadow-[#25D366]/25 transition-shadow"
                      >
                        Consultar por WhatsApp
                      </WhatsAppLink>
                      {s.page && (
                        <Link href={s.page.href} className="group inline-flex items-center gap-1.5 text-sm font-semibold text-foreground hover:text-primary transition-colors">
                          {s.page.label}
                          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none" />
                        </Link>
                      )}
                    </div>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">Incluye</p>
                    <ul className="flex flex-col gap-3">
                      {s.features.map((f) => (
                        <li key={f} className="flex items-start gap-3 text-base text-foreground/85">
                          <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-chart-3/15">
                            <Check className="h-4 w-4 text-chart-3" />
                          </span>
                          {f}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </article>
            </AnimateIn>
          )
        })}
      </section>

      {/* Compromisos */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <h2 className="font-display text-3xl sm:text-5xl font-bold tracking-tight text-balance max-w-3xl">
          Trabajes en lo que trabajes con nosotros, esto no cambia
        </h2>
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {COMMITMENTS.map((c) => {
            const Icon = c.icon
            return (
              <div key={c.title} className="rounded-2xl border border-border/50 bg-card/60 p-6">
                <Icon className="h-7 w-7 text-primary" />
                <h3 className="font-display text-xl font-bold mt-4">{c.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed mt-2">{c.desc}</p>
              </div>
            )
          })}
        </div>
      </section>

      <ClosingCTA
        title="¿No sabes por dónde empezar?"
        text="Cuéntanos qué vendes y a quién. Te decimos qué servicio te conviene primero, y cuál todavía no."
        segment="servicios_final"
        extra={<SecondaryCTA label="Prefiero un diagnóstico por formulario" className="w-fit" />}
      />
    </>
  )
}
