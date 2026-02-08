"use client"

import { useState } from "react"
import { ArrowUpRight, ExternalLink, ChevronLeft, ChevronRight } from "lucide-react"

const categories = ["Todos", "Web", "E-commerce", "Branding", "Marketing"]

const projects = [
  {
    title: "Resort Punta Cana",
    category: "Web",
    description: "Sitio web de lujo para resort 5 estrellas con sistema de reservas integrado y experiencia inmersiva.",
    metrics: { conversion: "+45%", traffic: "120K/mes" },
    region: "Rep. Dominicana",
    color: "primary",
  },
  {
    title: "Fintech Barcelona",
    category: "E-commerce",
    description: "Plataforma de pagos digitales con interfaz intuitiva y procesamiento en tiempo real para el mercado europeo.",
    metrics: { conversion: "+62%", traffic: "85K/mes" },
    region: "Espana",
    color: "chart-2",
  },
  {
    title: "Restaurante CDMX",
    category: "Branding",
    description: "Rebranding completo y presencia digital para cadena de restaurantes gourmet en Ciudad de Mexico.",
    metrics: { conversion: "+38%", traffic: "45K/mes" },
    region: "Latinoamerica",
    color: "chart-4",
  },
  {
    title: "SaaS Miami",
    category: "Marketing",
    description: "Estrategia integral de growth marketing para startup SaaS B2B con enfoque en el mercado norteamericano.",
    metrics: { conversion: "+78%", traffic: "200K/mes" },
    region: "EE.UU.",
    color: "chart-3",
  },
  {
    title: "E-commerce Bogota",
    category: "E-commerce",
    description: "Tienda en linea de moda sostenible con integracion de pasarelas de pago locales e internacionales.",
    metrics: { conversion: "+55%", traffic: "95K/mes" },
    region: "Latinoamerica",
    color: "primary",
  },
  {
    title: "Clinica Madrid",
    category: "Web",
    description: "Portal medico con reserva de citas online, telemedicina y gestion de pacientes para clinica privada.",
    metrics: { conversion: "+41%", traffic: "60K/mes" },
    region: "Espana",
    color: "chart-2",
  },
]

export function PortfolioSection() {
  const [activeCategory, setActiveCategory] = useState("Todos")
  const [page, setPage] = useState(0)

  const filtered = activeCategory === "Todos"
    ? projects
    : projects.filter((p) => p.category === activeCategory)

  const itemsPerPage = 3
  const totalPages = Math.ceil(filtered.length / itemsPerPage)
  const paginated = filtered.slice(page * itemsPerPage, (page + 1) * itemsPerPage)

  return (
    <section id="portfolio" className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-2xl font-bold text-foreground">Portafolio</h2>
          <p className="text-sm text-muted-foreground mt-1">Proyectos destacados en nuestras regiones</p>
        </div>
        <div className="hidden sm:flex items-center gap-2">
          <button
            type="button"
            onClick={() => setPage(Math.max(0, page - 1))}
            disabled={page === 0}
            className="flex items-center justify-center w-8 h-8 rounded-lg bg-secondary/60 text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            aria-label="Anterior"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-xs text-muted-foreground font-mono">
            {String(page + 1).padStart(2, "0")} / {String(totalPages).padStart(2, "0")}
          </span>
          <button
            type="button"
            onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
            disabled={page >= totalPages - 1}
            className="flex items-center justify-center w-8 h-8 rounded-lg bg-secondary/60 text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            aria-label="Siguiente"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Category filter */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => { setActiveCategory(cat); setPage(0) }}
            className={`px-4 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all duration-200 ${
              activeCategory === cat
                ? "bg-primary text-primary-foreground"
                : "bg-secondary/60 text-muted-foreground hover:text-foreground hover:bg-secondary"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Project cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {paginated.map((project) => (
          <div
            key={project.title}
            className="glass-card rounded-xl overflow-hidden group hover:border-primary/30 transition-all duration-300"
          >
            {/* Top color bar */}
            <div
              className="h-1.5 w-full"
              style={{ background: `hsl(var(--${project.color}))` }}
            />

            <div className="p-5 flex flex-col gap-4">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-muted-foreground">{project.region}</span>
                  <h3 className="font-display font-semibold text-foreground mt-0.5">{project.title}</h3>
                </div>
                <button
                  type="button"
                  className="flex items-center justify-center w-8 h-8 rounded-lg bg-secondary/60 text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all duration-200 opacity-0 group-hover:opacity-100"
                  aria-label={`Ver proyecto ${project.title}`}
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>

              <p className="text-xs text-muted-foreground leading-relaxed">{project.description}</p>

              <div className="flex items-center gap-4 pt-3 border-t border-border/50">
                <div className="flex flex-col">
                  <span className="text-xs text-muted-foreground">Conversion</span>
                  <span className="text-sm font-bold font-display text-chart-3">{project.metrics.conversion}</span>
                </div>
                <div className="w-px h-8 bg-border/50" />
                <div className="flex flex-col">
                  <span className="text-xs text-muted-foreground">Trafico</span>
                  <span className="text-sm font-bold font-display text-foreground">{project.metrics.traffic}</span>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <span className="px-2 py-0.5 rounded-md bg-secondary/60 text-[10px] text-muted-foreground font-medium">
                  {project.category}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Mobile pagination */}
      <div className="flex sm:hidden items-center justify-center gap-3">
        <button
          type="button"
          onClick={() => setPage(Math.max(0, page - 1))}
          disabled={page === 0}
          className="flex items-center justify-center w-8 h-8 rounded-lg bg-secondary/60 text-muted-foreground hover:text-foreground transition-colors disabled:opacity-30"
          aria-label="Anterior"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <span className="text-xs text-muted-foreground font-mono">
          {String(page + 1).padStart(2, "0")} / {String(totalPages).padStart(2, "0")}
        </span>
        <button
          type="button"
          onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
          disabled={page >= totalPages - 1}
          className="flex items-center justify-center w-8 h-8 rounded-lg bg-secondary/60 text-muted-foreground hover:text-foreground transition-colors disabled:opacity-30"
          aria-label="Siguiente"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </section>
  )
}
