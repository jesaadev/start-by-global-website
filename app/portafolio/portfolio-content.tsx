"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { AnimateIn } from "@/components/animate-in"
import { Footer } from "@/components/footer"
import {
  ExternalLink,
  TrendingUp,
  Globe,
  Users,
  Filter,
  BarChart3,
  ArrowRight,
} from "lucide-react"
import Link from "next/link"

const categories = ["Todos", "Web", "E-commerce", "Branding", "Marketing"]
const regions = ["Todas", "Rep. Dominicana", "España", "Latinoamérica", "EE.UU."]

const allProjects = [
  {
    title: "Resort Punta Cana",
    category: "Web",
    description: "Sitio web de lujo para resort 5 estrellas con sistema de reservas integrado y experiencia inmersiva. Implementamos un sistema de booking personalizado que incremento las reservas directas.",
    metrics: { conversion: "+45%", traffic: "120K/mes", roi: "320%", leads: "850/mes" },
    region: "Rep. Dominicana",
    color: "primary",
    tech: ["Next.js", "Stripe", "Sanity CMS", "Vercel"],
    year: "2025",
    duration: "8 semanas",
  },
  {
    title: "Fintech Barcelona",
    category: "E-commerce",
    description: "Plataforma de pagos digitales con interfaz intuitiva y procesamiento en tiempo real para el mercado europeo. Diseño centrado en seguridad y experiencia del usuario.",
    metrics: { conversion: "+62%", traffic: "85K/mes", roi: "450%", leads: "1.2K/mes" },
    region: "España",
    color: "chart-2",
    tech: ["React", "Node.js", "PostgreSQL", "AWS"],
    year: "2025",
    duration: "12 semanas",
  },
  {
    title: "Restaurante CDMX",
    category: "Branding",
    description: "Rebranding completo y presencia digital para cadena de restaurantes gourmet. Incluyo identidad visual, redes sociales y estrategia de contenido.",
    metrics: { conversion: "+38%", traffic: "45K/mes", roi: "280%", leads: "320/mes" },
    region: "Latinoamérica",
    color: "chart-4",
    tech: ["Figma", "WordPress", "Instagram", "TikTok"],
    year: "2024",
    duration: "6 semanas",
  },
  {
    title: "SaaS Miami",
    category: "Marketing",
    description: "Estrategia integral de growth marketing para startup SaaS B2B. Campañas multicanal que posicionaron la marca en el mercado norteamericano.",
    metrics: { conversion: "+78%", traffic: "200K/mes", roi: "520%", leads: "2.5K/mes" },
    region: "EE.UU.",
    color: "chart-3",
    tech: ["HubSpot", "Google Ads", "GA4", "Mixpanel"],
    year: "2025",
    duration: "Ongoing",
  },
  {
    title: "E-commerce Bogota",
    category: "E-commerce",
    description: "Tienda en línea de moda sostenible con integración de pasarelas de pago locales e internacionales. Estrategia omnicanal con email marketing avanzado.",
    metrics: { conversion: "+55%", traffic: "95K/mes", roi: "380%", leads: "1.8K/mes" },
    region: "Latinoamérica",
    color: "primary",
    tech: ["Shopify", "Klaviyo", "Meta Ads", "Google Ads"],
    year: "2024",
    duration: "10 semanas",
  },
  {
    title: "Clinica Madrid",
    category: "Web",
    description: "Portal medico con reserva de citas online, telemedicina y gestión de pacientes. Plataforma integral para clinica privada con multiples especialidades.",
    metrics: { conversion: "+41%", traffic: "60K/mes", roi: "290%", leads: "600/mes" },
    region: "España",
    color: "chart-2",
    tech: ["Next.js", "Supabase", "Tailwind", "Vercel"],
    year: "2025",
    duration: "10 semanas",
  },
  {
    title: "Hotel Bavaro Collection",
    category: "Web",
    description: "Experiencia digital premium para grupo hotelero con 5 propiedades. Sistema de reservas unificado con soporte multilingue y multi-moneda.",
    metrics: { conversion: "+52%", traffic: "180K/mes", roi: "410%", leads: "1.1K/mes" },
    region: "Rep. Dominicana",
    color: "chart-4",
    tech: ["Next.js", "Contentful", "Stripe", "i18n"],
    year: "2024",
    duration: "14 semanas",
  },
  {
    title: "Legal Tech Santiago",
    category: "Marketing",
    description: "Estrategia de posicionamiento digital para firma de abogados. SEO especializado y campañas de Google Ads en mercado competitivo.",
    metrics: { conversion: "+67%", traffic: "35K/mes", roi: "350%", leads: "450/mes" },
    region: "Latinoamérica",
    color: "chart-3",
    tech: ["Google Ads", "SEMrush", "WordPress", "HubSpot"],
    year: "2025",
    duration: "Ongoing",
  },
]

const overallStats = [
  { label: "Proyectos Entregados", value: "150+", icon: BarChart3 },
  { label: "Clientes Activos", value: "85", icon: Users },
  { label: "Países", value: "12", icon: Globe },
  { label: "ROI Promedio", value: "380%", icon: TrendingUp },
]

export function PortfolioPageContent() {
  const [activeCategory, setActiveCategory] = useState("Todos")
  const [activeRegion, setActiveRegion] = useState("Todas")

  const filtered = allProjects.filter((p) => {
    const catMatch = activeCategory === "Todos" || p.category === activeCategory
    const regMatch = activeRegion === "Todas" || p.region === activeRegion
    return catMatch && regMatch
  })

  return (
    <DashboardLayout title="Portafolio" subtitle="Proyectos destacados que demuestran resultados reales">
      {/* Overall stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {overallStats.map((stat, i) => {
          const Icon = stat.icon
          return (
            <AnimateIn key={stat.label} delay={i * 80}>
              <div className="glass-card rounded-xl p-4 flex items-center gap-4">
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-display text-xl font-bold text-foreground">{stat.value}</p>
                  <p className="text-[10px] text-muted-foreground">{stat.label}</p>
                </div>
              </div>
            </AnimateIn>
          )
        })}
      </div>

      {/* Filters */}
      <AnimateIn>
        <div className="glass-card rounded-xl p-4 flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Filter className="w-3.5 h-3.5 text-muted-foreground" />
              <span className="text-xs text-muted-foreground font-medium">Categoría</span>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setActiveCategory(cat)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${
                    activeCategory === cat
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary/60 text-muted-foreground hover:text-foreground hover:bg-secondary"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
          <div className="w-px bg-border/50 hidden sm:block" />
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Globe className="w-3.5 h-3.5 text-muted-foreground" />
              <span className="text-xs text-muted-foreground font-medium">Región</span>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              {regions.map((reg) => (
                <button
                  key={reg}
                  type="button"
                  onClick={() => setActiveRegion(reg)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${
                    activeRegion === reg
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary/60 text-muted-foreground hover:text-foreground hover:bg-secondary"
                  }`}
                >
                  {reg}
                </button>
              ))}
            </div>
          </div>
        </div>
      </AnimateIn>

      {/* Results count */}
      <p className="text-sm text-muted-foreground">
        Mostrando <span className="text-foreground font-semibold">{filtered.length}</span> proyectos
      </p>

      {/* Project grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filtered.map((project, i) => (
          <AnimateIn key={project.title} delay={i * 80}>
            <div className="glass-card-hover rounded-xl overflow-hidden group h-full flex flex-col">
              <div className="h-1.5 w-full" style={{ background: `linear-gradient(90deg, hsl(var(--${project.color})), hsl(var(--${project.color}) / 0.3))` }} />

              <div className="p-6 flex flex-col gap-4 flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] uppercase tracking-wider text-muted-foreground">{project.region}</span>
                      <span className="text-[10px] text-muted-foreground/60">|</span>
                      <span className="text-[10px] text-muted-foreground">{project.year}</span>
                    </div>
                    <h3 className="font-display text-lg font-bold text-foreground">{project.title}</h3>
                  </div>
                  <button
                    type="button"
                    className="flex items-center justify-center w-9 h-9 rounded-lg bg-secondary/60 text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all duration-200 opacity-0 group-hover:opacity-100"
                    aria-label={`Ver proyecto ${project.title}`}
                  >
                    <ExternalLink className="w-4 h-4" />
                  </button>
                </div>

                <p className="text-sm text-muted-foreground leading-relaxed flex-1">{project.description}</p>

                {/* Tech stack */}
                <div className="flex flex-wrap gap-1.5">
                  {project.tech.map((t) => (
                    <span key={t} className="px-2 py-0.5 rounded-md bg-secondary/60 text-[10px] text-muted-foreground font-medium">
                      {t}
                    </span>
                  ))}
                  <span className="px-2 py-0.5 rounded-md bg-primary/10 text-[10px] text-primary font-medium">
                    {project.duration}
                  </span>
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-4 gap-3 pt-4 border-t border-border/50">
                  <div className="flex flex-col">
                    <span className="text-[10px] text-muted-foreground">Conversión</span>
                    <span className="text-sm font-bold font-display text-chart-3">{project.metrics.conversion}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] text-muted-foreground">Tráfico</span>
                    <span className="text-sm font-bold font-display text-foreground">{project.metrics.traffic}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] text-muted-foreground">ROI</span>
                    <span className="text-sm font-bold font-display text-chart-3">{project.metrics.roi}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] text-muted-foreground">Leads</span>
                    <span className="text-sm font-bold font-display text-foreground">{project.metrics.leads}</span>
                  </div>
                </div>
              </div>
            </div>
          </AnimateIn>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="glass-card rounded-xl p-12 text-center">
          <p className="text-muted-foreground">No se encontraron proyectos con los filtros seleccionados.</p>
        </div>
      )}

      {/* CTA */}
      <AnimateIn>
        <div className="glass-card rounded-xl p-8 lg:p-12 text-center flex flex-col items-center gap-6 glow-accent relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-chart-2/5" />
          <div className="relative flex flex-col items-center gap-4">
            <h2 className="font-display text-2xl font-bold text-foreground text-balance">
              Tu proyecto puede ser el siguiente
            </h2>
            <p className="text-muted-foreground max-w-lg">
              Cuéntanos tu idea y la convertimos en resultados medibles.
            </p>
            <Link
              href="/contacto"
              className="flex items-center gap-2 px-8 py-3.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm transition-all duration-300 hover:shadow-lg hover:shadow-primary/25 hover:scale-[1.02] active:scale-[0.98] mt-2"
            >
              Iniciar Proyecto
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </AnimateIn>

      <Footer />
    </DashboardLayout>
  )
}
