"use client"

import {
  Globe,
  Palette,
  Search,
  BarChart3,
  Megaphone,
  Code,
  ArrowUpRight,
} from "lucide-react"
import { useState } from "react"
import Link from "next/link"
import { AnimateIn } from "@/components/animate-in"

const services = [
  {
    icon: Globe,
    title: "Desarrollo Web",
    slug: "desarrollo-web",
    description: "Sitios web y aplicaciones de alto rendimiento con tecnologías modernas. E-commerce, landing pages y plataformas a medida.",
    tags: ["Next.js", "React", "E-commerce"],
    color: "primary",
  },
  {
    icon: Search,
    title: "SEO & Posicionamiento",
    slug: "seo-posicionamiento",
    description: "Estrategias de optimización para motores de busqueda que aumentan tu visibilidad orgánica y generan tráfico cualificado.",
    tags: ["On-Page", "Link Building", "Local SEO"],
    color: "chart-2",
  },
  {
    icon: Megaphone,
    title: "Marketing Digital",
    slug: "marketing-digital",
    description: "Campañas de publicidad digital en Google Ads, Meta Ads y TikTok Ads que maximizan tu retorno de inversion.",
    tags: ["PPC", "Social Ads", "Retargeting"],
    color: "chart-4",
  },
  {
    icon: Palette,
    title: "Branding & Diseño",
    slug: "branding-diseno",
    description: "Identidad visual que conecta con tu audiencia. Logos, guias de marca y material gráfico para todos tus canales.",
    tags: ["UI/UX", "Identidad", "Material"],
    color: "chart-3",
  },
  {
    icon: BarChart3,
    title: "Analítica & Data",
    slug: "analitica-data",
    description: "Dashboards personalizados y reportes avanzados para tomar decisiones basadas en datos reales de tu negocio.",
    tags: ["GA4", "Dashboards", "KPIs"],
    color: "primary",
  },
  {
    icon: Code,
    title: "Automatización",
    slug: "automatización",
    description: "Flujos automatizados que optimizan procesos, desde email marketing hasta integraciones con CRM y herramientas internas.",
    tags: ["CRM", "Workflows", "APIs"],
    color: "chart-2",
  },
]

export { services }

export function ServicesSection() {
  const [activeCard, setActiveCard] = useState<number | null>(null)

  return (
    <section id="services" className="flex flex-col gap-6">
      <AnimateIn>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-display text-2xl font-bold text-foreground">Nuestros Servicios</h2>
            <p className="text-sm text-muted-foreground mt-1">Soluciones integrales de marketing digital</p>
          </div>
          <Link
            href="/servicios"
            className="hidden sm:flex items-center gap-1.5 text-sm text-primary hover:text-primary/80 transition-colors font-medium"
          >
            Ver todos
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>
      </AnimateIn>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {services.map((service, i) => {
          const Icon = service.icon
          const isActive = activeCard === i

          return (
            <AnimateIn key={service.title} delay={i * 80} direction="up">
              <Link
                href={`/servicios#${service.slug}`}
                onMouseEnter={() => setActiveCard(i)}
                onMouseLeave={() => setActiveCard(null)}
                className="glass-card-hover rounded-xl p-5 flex flex-col gap-4 cursor-pointer group h-full"
              >
                <div className="flex items-start justify-between">
                  <div
                    className="flex items-center justify-center w-11 h-11 rounded-xl transition-all duration-300 group-hover:scale-110"
                    style={{
                      backgroundColor: `hsl(var(--${service.color}) / 0.1)`,
                    }}
                  >
                    <Icon
                      className="w-5 h-5 transition-all duration-300"
                      style={{ color: `hsl(var(--${service.color}))` }}
                    />
                  </div>
                  <ArrowUpRight
                    className={`w-4 h-4 text-muted-foreground transition-all duration-300 ${
                      isActive ? "opacity-100 translate-x-0.5 -translate-y-0.5 text-primary" : "opacity-0"
                    }`}
                  />
                </div>

                <div className="flex-1 flex flex-col gap-2">
                  <h3 className="font-display font-semibold text-foreground">{service.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{service.description}</p>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {service.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 rounded-md bg-secondary/60 text-[10px] text-muted-foreground font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </Link>
            </AnimateIn>
          )
        })}
      </div>
    </section>
  )
}
