"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { AnimateIn } from "@/components/animate-in"
import { Footer } from "@/components/footer"
import {
  Globe,
  Palette,
  Search,
  BarChart3,
  Megaphone,
  Code,
  CheckCircle,
  ArrowRight,
  Zap,
  Shield,
  Clock,
  Users,
} from "lucide-react"
import Link from "next/link"

const services = [
  {
    icon: Globe,
    title: "Desarrollo Web",
    slug: "desarrollo-web",
    description: "Sitios web y aplicaciones de alto rendimiento con tecnologías modernas. E-commerce, landing pages y plataformas a medida.",
    longDescription: "Creamos experiencias digitales que convierten visitantes en clientes. Desde sitios corporativos hasta plataformas complejas de e-commerce, nuestro equipo domina las tecnologías más avanzadas para entregar proyectos que destacan.",
    features: [
      "Sitios web corporativos y landing pages",
      "Plataformas e-commerce con pasarelas de pago",
      "Aplicaciones web progresivas (PWA)",
      "Integraciones API y sistemas a medida",
      "Optimización de rendimiento y Core Web Vitals",
      "Mantenimiento y soporte continuo",
    ],
    tech: ["Next.js", "React", "Node.js", "TypeScript", "Tailwind CSS", "PostgreSQL"],
    color: "primary",
    stats: { projects: "85+", satisfaction: "99%", avgDelivery: "6 sem" },
  },
  {
    icon: Search,
    title: "SEO & Posicionamiento",
    slug: "seo-posicionamiento",
    description: "Estrategias de optimización para motores de busqueda que aumentan tu visibilidad orgánica y generan tráfico cualificado.",
    longDescription: "Posicionamos tu marca donde tus clientes te buscan. Combinamos estrategias técnicas y de contenido para lograr rankings sostenibles que generan tráfico orgánico de alta calidad.",
    features: [
      "Auditorias SEO técnicas completas",
      "Optimización on-page y estructura web",
      "Estrategia de link building ético",
      "SEO local y multi-regional",
      "Optimización de contenido y keywords",
      "Monitoreo y reportes mensuales",
    ],
    tech: ["Google Search Console", "Ahrefs", "SEMrush", "Screaming Frog", "GA4"],
    color: "chart-2",
    stats: { projects: "120+", satisfaction: "97%", avgDelivery: "3 meses" },
  },
  {
    icon: Megaphone,
    title: "Marketing Digital",
    slug: "marketing-digital",
    description: "Campañas de publicidad digital que maximizan tu retorno de inversion en todas las plataformas principales.",
    longDescription: "Diseñamos y ejecutamos campañas publicitarias que conectan con tu audiencia ideal. Desde Google Ads hasta TikTok, optimizamos cada dolar invertido para maximizar tu ROI.",
    features: [
      "Campañas Google Ads (Search, Display, Shopping)",
      "Meta Ads (Facebook e Instagram)",
      "TikTok Ads y LinkedIn Ads",
      "Estrategias de retargeting avanzado",
      "Optimización de landing pages",
      "A/B testing y optimización continua",
    ],
    tech: ["Google Ads", "Meta Business", "TikTok Ads", "LinkedIn Ads", "Hotjar"],
    color: "chart-4",
    stats: { projects: "200+", satisfaction: "98%", avgDelivery: "2 sem" },
  },
  {
    icon: Palette,
    title: "Branding & Diseño",
    slug: "branding-diseno",
    description: "Identidad visual que conecta con tu audiencia. Logos, guias de marca y material gráfico para todos tus canales.",
    longDescription: "Construimos marcas que inspiran confianza y generan conexión emocional. Desde la conceptualizacion hasta la implementación, creamos identidades visuales memorables.",
    features: [
      "Diseño de logotipos e identidad visual",
      "Guias de marca y sistemas de diseño",
      "Diseño UI/UX para web y mobile",
      "Material gráfico para redes sociales",
      "Presentaciones corporativas",
      "Packaging y material impreso",
    ],
    tech: ["Figma", "Adobe CC", "Illustrator", "After Effects", "Blender"],
    color: "chart-3",
    stats: { projects: "95+", satisfaction: "100%", avgDelivery: "4 sem" },
  },
  {
    icon: BarChart3,
    title: "Analítica & Data",
    slug: "analitica-data",
    description: "Dashboards personalizados y reportes avanzados para tomar decisiones basadas en datos reales.",
    longDescription: "Transformamos datos en decisiones estratégicas. Implementamos soluciones de analítica que te dan visibilidad completa sobre el rendimiento de tu negocio digital.",
    features: [
      "Implementación de Google Analytics 4",
      "Dashboards personalizados en tiempo real",
      "Configuración de conversiones y eventos",
      "Reportes automatizados mensuales",
      "Análisis de cohortes y atribucion",
      "Data visualization y storytelling",
    ],
    tech: ["GA4", "Looker Studio", "BigQuery", "Tag Manager", "Mixpanel"],
    color: "primary",
    stats: { projects: "70+", satisfaction: "98%", avgDelivery: "3 sem" },
  },
  {
    icon: Code,
    title: "Automatización",
    slug: "automatización",
    description: "Flujos automatizados que optimizan procesos, desde email marketing hasta integraciones con CRM.",
    longDescription: "Eliminamos tareas repetitivas y optimizamos flujos de trabajo. Conectamos tus herramientas y creamos automatizaciones que ahorran tiempo y reducen errores.",
    features: [
      "Automatización de email marketing",
      "Integración de CRM (HubSpot, Salesforce)",
      "Workflows de lead nurturing",
      "Conexión de APIs y webhooks",
      "Chatbots y atención automatizada",
      "Reportes y alertas automáticas",
    ],
    tech: ["HubSpot", "Zapier", "Make", "n8n", "API REST", "Webhooks"],
    color: "chart-2",
    stats: { projects: "55+", satisfaction: "97%", avgDelivery: "4 sem" },
  },
]

const whyUs = [
  { icon: Zap, title: "Velocidad", description: "Entregamos proyectos en tiempo record sin sacrificar calidad." },
  { icon: Shield, title: "Confianza", description: "Más de 150 clientes satisfechos en 4 regiones internacionales." },
  { icon: Clock, title: "Soporte 24/7", description: "Equipo distribuido que asegura cobertura en todas las zonas horarias." },
  { icon: Users, title: "Equipo Experto", description: "Profesionales certificados en cada área de especialidad." },
]

export function ServicesPageContent() {
  return (
    <DashboardLayout title="Servicios de Desarrollo Web y Marketing Digital" subtitle="Diseño web, SEO, publicidad (Google y Meta Ads), branding, analítica y automatización para empresas">
      {/* Why choose us cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {whyUs.map((item, i) => {
          const Icon = item.icon
          return (
            <AnimateIn key={item.title} delay={i * 80}>
              <div className="glass-card rounded-xl p-4 flex flex-col gap-3 text-center h-full">
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 mx-auto">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-display font-semibold text-foreground text-sm">{item.title}</h3>
                <p className="text-[11px] text-muted-foreground leading-relaxed">{item.description}</p>
              </div>
            </AnimateIn>
          )
        })}
      </div>

      {/* Detailed service cards */}
      <div className="flex flex-col gap-6">
        {services.map((service, i) => {
          const Icon = service.icon
          return (
            <AnimateIn key={service.slug} delay={i * 60}>
              <div
                id={service.slug}
                className="glass-card rounded-xl overflow-hidden scroll-mt-24"
              >
                {/* Color bar */}
                <div className="h-1" style={{ background: `linear-gradient(90deg, hsl(var(--${service.color})), hsl(var(--${service.color}) / 0.3))` }} />

                <div className="p-6 lg:p-8">
                  <div className="flex flex-col lg:flex-row gap-6 lg:gap-10">
                    {/* Left: info */}
                    <div className="flex-1 flex flex-col gap-5">
                      <div className="flex items-center gap-4">
                        <div
                          className="flex items-center justify-center w-12 h-12 rounded-xl"
                          style={{ backgroundColor: `hsl(var(--${service.color}) / 0.1)` }}
                        >
                          <Icon className="w-6 h-6" style={{ color: `hsl(var(--${service.color}))` }} />
                        </div>
                        <div>
                          <h2 className="font-display text-xl font-bold text-foreground">{service.title}</h2>
                          <p className="text-xs text-muted-foreground">{service.description}</p>
                        </div>
                      </div>

                      <p className="text-sm text-muted-foreground leading-relaxed">{service.longDescription}</p>

                      {/* Stats */}
                      <div className="flex items-center gap-6 py-4 border-y border-border/50">
                        <div className="flex flex-col">
                          <span className="font-display text-lg font-bold text-foreground">{service.stats.projects}</span>
                          <span className="text-[10px] text-muted-foreground">Proyectos</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="font-display text-lg font-bold text-chart-3">{service.stats.satisfaction}</span>
                          <span className="text-[10px] text-muted-foreground">Satisfacción</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="font-display text-lg font-bold text-foreground">{service.stats.avgDelivery}</span>
                          <span className="text-[10px] text-muted-foreground">Entrega promedio</span>
                        </div>
                      </div>

                      {/* Tech stack */}
                      <div className="flex flex-wrap gap-2">
                        {service.tech.map((t) => (
                          <span key={t} className="px-3 py-1 rounded-full bg-secondary/60 text-[11px] text-muted-foreground font-medium">
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Right: features */}
                    <div className="lg:w-[340px] flex flex-col gap-3">
                      <h3 className="text-xs uppercase tracking-wider text-muted-foreground mb-1">Incluye</h3>
                      {service.features.map((feature) => (
                        <div key={feature} className="flex items-start gap-2.5 p-2 rounded-lg hover:bg-secondary/30 transition-colors">
                          <CheckCircle className="w-4 h-4 text-chart-3 mt-0.5 shrink-0" />
                          <span className="text-sm text-foreground">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </AnimateIn>
          )
        })}
      </div>

      {/* CTA */}
      <AnimateIn>
        <div className="glass-card rounded-xl p-8 lg:p-12 text-center flex flex-col items-center gap-6 glow-accent-lg relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-chart-2/5" />
          <div className="relative flex flex-col items-center gap-4">
            <h2 className="font-display text-2xl lg:text-3xl font-bold text-foreground text-balance">
              Listo para transformar tu presencia digital?
            </h2>
            <p className="text-muted-foreground max-w-lg">
              Agenda una consultoría gratuita y descubre como podemos impulsar tu negocio.
            </p>
            <Link
              href="/contacto"
              className="flex items-center gap-2 px-8 py-3.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm transition-all duration-300 hover:shadow-lg hover:shadow-primary/25 hover:scale-[1.02] active:scale-[0.98] mt-2"
            >
              Agendar Consultoría
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </AnimateIn>

      <Footer />
    </DashboardLayout>
  )
}
