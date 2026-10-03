import Link from "next/link"
import { ArrowRight, Globe, Megaphone, ShoppingCart } from "lucide-react"
import type { ShowcaseItem } from "@/lib/showcase"
import { PageFunnelTracker } from "@/components/analytics/page-funnel-tracker"
import { AnimateIn } from "@/components/animate-in"
import { PageHero } from "@/components/layout/page-hero"
import { PrimaryCTA } from "@/components/cta/primary-cta"
import { SecondaryCTA } from "@/components/cta/secondary-cta"
import { ClosingCTA } from "@/components/cta/closing-cta"
import { PersonaVisual } from "@/components/landings/persona-visual"
import { ShowcaseSection } from "@/components/showcase/showcase-section"
import { HomeIncluded } from "@/components/home-v2/included"
import { ProcessSection } from "@/components/sections/process-section"
import { FaqSection } from "@/components/sections/faq-section"
import SpotlightCard from "@/components/reactbits/SpotlightCard"
import { PlansSection, type Plan } from "@/components/sections/plans-section"
import { WEB_FAQS } from "./faqs"

const SERVICE = "Desarrollo Web"

const TYPES = [
  { icon: Globe, title: "Webs corporativas", desc: "Sitios profesionales que transmiten autoridad, generan confianza y llevan al visitante a escribirte.", href: "/web-que-genera-clientes" },
  { icon: ShoppingCart, title: "Tiendas online", desc: "WooCommerce o Shopify con pagos, catálogo y un checkout pensado para no perder la venta.", href: "/optimizacion-ecommerce" },
  { icon: Megaphone, title: "Landing pages", desc: "Páginas de aterrizaje para campañas: un mensaje, una oferta y un solo camino hasta el lead." },
]

const STEPS = [
  { title: "Briefing", desc: "Entendemos tu negocio, tus objetivos y a tu cliente ideal." },
  { title: "Diseño", desc: "UI/UX orientado a conversión y alineado a tu marca. Lo ves antes de programar." },
  { title: "Desarrollo", desc: "Sitio rápido, seguro y optimizado para Core Web Vitals." },
  { title: "SEO", desc: "Base técnica para posicionar en Google desde el día uno." },
  { title: "Lanzamiento", desc: "Publicación, medición conectada y soporte post-entrega." },
]

const PLANS: Plan[] = [
  { name: "Web Básica", pricePrefix: "Desde", price: "$400", cta: "Cotizar este plan", points: ["Sitio de 1 a 3 secciones", "Diseño responsive", "SEO on-page básico", "Formulario y botón de WhatsApp"] },
  { name: "Web Profesional", pricePrefix: "Desde", price: "$900", featured: true, cta: "Cotizar este plan", points: ["Sitio corporativo multipágina", "Diseño a medida", "SEO técnico + velocidad", "Blog / Insights", "Integraciones y analítica"] },
  { name: "Tienda Online", pricePrefix: "Desde", price: "$1,500", cta: "Cotizar este plan", points: ["E-commerce completo", "Pasarela de pagos", "Catálogo y gestión", "Optimización de conversión"] },
]

export function WebContent({ work }: { work: ShowcaseItem[] }) {
  return (
    <>
      <PageFunnelTracker landingKey="diseno_web" />

      <PageHero
        badge="Diseño y desarrollo web"
        title="Diseño de páginas web en República Dominicana que te traen clientes"
        highlight="que te traen clientes"
        subtitle="Webs corporativas, tiendas online y landing pages rápidas y optimizadas para SEO, con WhatsApp y medición conectados desde el primer día."
        note={<><span className="font-semibold text-foreground">Proyectos desde $400.</span> Para empresas en RD, España, Latinoamérica y EE.UU.</>}
        aside={<PersonaVisual visual="web" work={work} />}
      >
        <PrimaryCTA label="Cotizar mi web" segment="diseno_web_hero" service={SERVICE} />
        <SecondaryCTA label="Prefiero dejar mis datos" href="#contacto" />
      </PageHero>

      {/* Tipos de web */}
      <section id="tipos" className="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-20 scroll-mt-20">
        <h2 className="font-display text-3xl sm:text-5xl font-bold tracking-tight leading-[1.05] text-balance max-w-3xl">
          ¿Qué tipo de web necesitas?
        </h2>
        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-4">
          {TYPES.map((t, i) => {
            const Icon = t.icon
            return (
              <AnimateIn key={t.title} delay={i * 80} className="h-full">
                <SpotlightCard spotlightColor="rgba(242, 109, 61, 0.18)" className="h-full !p-7 flex flex-col">
                  <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Icon className="h-6 w-6" />
                  </span>
                  <h3 className="font-display text-2xl font-bold mt-5">{t.title}</h3>
                  <p className="text-base text-foreground/70 leading-relaxed mt-2">{t.desc}</p>
                  {t.href && (
                    <Link href={t.href} className="group mt-auto pt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-foreground hover:text-primary transition-colors">
                      Ver cómo lo hacemos
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none" />
                    </Link>
                  )}
                </SpotlightCard>
              </AnimateIn>
            )
          })}
        </div>
      </section>

      {/* Trabajo real (el primero ya está en el hero) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <ShowcaseSection minItems={2} />
      </div>

      <HomeIncluded />

      <ProcessSection title="Tu web en 5 pasos, sin cajas negras" steps={STEPS} />

      <PlansSection
        title="Planes y precios"
        subtitle="Precios de partida. El precio final depende del alcance y te lo damos por escrito antes de empezar."
        plans={PLANS}
        whatsapp={{ service: SERVICE, segment: "diseno_web_plan" }}
      />

      <FaqSection faqs={WEB_FAQS} jsonLd={false} />

      <ClosingCTA
        title="Solicita tu cotización gratis"
        text="Cuéntanos qué vendes y qué web necesitas. Te respondemos con una propuesta clara, con precio y fecha."
        segment="diseno_web_final"
        service={SERVICE}
        ctaLabel="Cotizar por WhatsApp"
        form={{
          landingKey: "diseno_web",
          landingName: "Diseño web (página de servicio)",
          button: "Quiero mi cotización",
          qualifierLabel: "¿Qué web necesitas? (corporativa, tienda, landing…)",
        }}
      />
    </>
  )
}
