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

const services = [
  {
    icon: Globe,
    title: "Desarrollo Web",
    description: "Sitios web y aplicaciones de alto rendimiento con tecnologias modernas. E-commerce, landing pages y plataformas a medida.",
    tags: ["Next.js", "React", "E-commerce"],
    color: "primary",
  },
  {
    icon: Search,
    title: "SEO & Posicionamiento",
    description: "Estrategias de optimizacion para motores de busqueda que aumentan tu visibilidad organica y generan trafico cualificado.",
    tags: ["On-Page", "Link Building", "Local SEO"],
    color: "chart-2",
  },
  {
    icon: Megaphone,
    title: "Marketing Digital",
    description: "Campanas de publicidad digital en Google Ads, Meta Ads y TikTok Ads que maximizan tu retorno de inversion.",
    tags: ["PPC", "Social Ads", "Retargeting"],
    color: "chart-4",
  },
  {
    icon: Palette,
    title: "Branding & Diseno",
    description: "Identidad visual que conecta con tu audiencia. Logos, guias de marca y material grafico para todos tus canales.",
    tags: ["UI/UX", "Identidad", "Material"],
    color: "chart-3",
  },
  {
    icon: BarChart3,
    title: "Analitica & Data",
    description: "Dashboards personalizados y reportes avanzados para tomar decisiones basadas en datos reales de tu negocio.",
    tags: ["GA4", "Dashboards", "KPIs"],
    color: "primary",
  },
  {
    icon: Code,
    title: "Automatizacion",
    description: "Flujos automatizados que optimizan procesos, desde email marketing hasta integraciones con CRM y herramientas internas.",
    tags: ["CRM", "Workflows", "APIs"],
    color: "chart-2",
  },
]

export function ServicesSection() {
  const [activeCard, setActiveCard] = useState<number | null>(null)

  return (
    <section id="services" className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-2xl font-bold text-foreground">Nuestros Servicios</h2>
          <p className="text-sm text-muted-foreground mt-1">Soluciones integrales de marketing digital</p>
        </div>
        <button
          type="button"
          className="hidden sm:flex items-center gap-1.5 text-sm text-primary hover:text-primary/80 transition-colors font-medium"
        >
          Ver todos
          <ArrowUpRight className="w-4 h-4" />
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {services.map((service, i) => {
          const Icon = service.icon
          const isActive = activeCard === i

          return (
            <div
              key={service.title}
              onMouseEnter={() => setActiveCard(i)}
              onMouseLeave={() => setActiveCard(null)}
              className="glass-card rounded-xl p-5 flex flex-col gap-4 hover:border-primary/30 transition-all duration-300 cursor-pointer group"
            >
              <div className="flex items-start justify-between">
                <div
                  className="flex items-center justify-center w-11 h-11 rounded-xl transition-all duration-300"
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
            </div>
          )
        })}
      </div>
    </section>
  )
}
