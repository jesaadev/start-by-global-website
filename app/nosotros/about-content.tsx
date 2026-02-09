"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { AnimateIn } from "@/components/animate-in"
import { Footer } from "@/components/footer"
import {
  Globe,
  Target,
  Heart,
  Lightbulb,
  Users,
  Award,
  MapPin,
  ArrowRight,
  Linkedin,
  TrendingUp,
  Calendar,
  Rocket,
} from "lucide-react"
import Link from "next/link"

const team = [
  {
    name: "Ricardo Mendez",
    role: "CEO & Fundador",
    region: "Santo Domingo",
    specialties: ["Estrategia Digital", "Growth", "Business Development"],
    bio: "15 anos de experiencia en marketing digital. Anteriormente VP de marketing en agencia Top 10 LATAM.",
  },
  {
    name: "Laura Gutierrez",
    role: "Directora Creativa",
    region: "Madrid",
    specialties: ["Branding", "UI/UX", "Direccion de Arte"],
    bio: "Ex-directora creativa en agencia de Madrid galardonada. Mas de 200 marcas creadas.",
  },
  {
    name: "Diego Ramirez",
    role: "Director de Tecnologia",
    region: "Ciudad de Mexico",
    specialties: ["Full Stack", "Cloud", "Arquitectura"],
    bio: "Ingeniero con experiencia en Silicon Valley. Especialista en plataformas de alto rendimiento.",
  },
  {
    name: "Amanda Roberts",
    role: "Head of Performance",
    region: "Miami",
    specialties: ["PPC", "Analytics", "CRO"],
    bio: "Certificada en Google Ads y Meta. Ha gestionado presupuestos de mas de $5M en campanas digitales.",
  },
  {
    name: "Sofia Herrera",
    role: "Directora de SEO",
    region: "Santo Domingo",
    specialties: ["SEO Tecnico", "Content Strategy", "Local SEO"],
    bio: "10 anos posicionando marcas en SERP. Caso de exito: Top 1 para 500+ keywords competitivas.",
  },
  {
    name: "Carlos Rivera",
    role: "Lead Developer",
    region: "Ciudad de Mexico",
    specialties: ["React", "Next.js", "Node.js"],
    bio: "Full stack con pasion por la performance. Contributor de proyectos open source populares.",
  },
]

const values = [
  {
    icon: Target,
    title: "Orientados a Resultados",
    description: "Cada accion esta guiada por datos y enfocada en metricas que impactan tu negocio real.",
  },
  {
    icon: Heart,
    title: "Pasion por lo Digital",
    description: "Vivimos y respiramos marketing digital. Nos apasiona lo que hacemos y se refleja en cada proyecto.",
  },
  {
    icon: Lightbulb,
    title: "Innovacion Constante",
    description: "Adoptamos las ultimas tecnologias y tendencias para mantener a nuestros clientes a la vanguardia.",
  },
  {
    icon: Globe,
    title: "Vision Global",
    description: "Pensamos globalmente y actuamos localmente. Entendemos los matices culturales de cada mercado.",
  },
]

const milestones = [
  { year: "2020", title: "Fundacion", description: "Start By Global nace en Santo Domingo con 3 personas y una vision." },
  { year: "2021", title: "Expansion a Espana", description: "Abrimos oficina en Madrid y comenzamos operaciones en el mercado europeo." },
  { year: "2022", title: "50 Clientes", description: "Alcanzamos los 50 clientes activos y expandimos a Mexico y Colombia." },
  { year: "2023", title: "Oficina Miami", description: "Establecemos presencia en EE.UU. para atender el mercado norteamericano." },
  { year: "2024", title: "100 Proyectos", description: "Superamos los 100 proyectos entregados con un 98% de satisfaccion." },
  { year: "2025", title: "150+ Proyectos", description: "12 paises, 4 oficinas y un equipo de 30+ profesionales certificados." },
]

const bigNumbers = [
  { value: "150+", label: "Proyectos Entregados" },
  { value: "30+", label: "Profesionales" },
  { value: "4", label: "Oficinas" },
  { value: "12", label: "Paises" },
  { value: "98%", label: "Satisfaccion" },
  { value: "$2M+", label: "Ads Gestionados" },
]

export function AboutPageContent() {
  return (
    <DashboardLayout title="Nosotros" subtitle="Conoce al equipo que impulsa tu exito digital">
      {/* Big numbers */}
      <div className="grid grid-cols-3 lg:grid-cols-6 gap-3">
        {bigNumbers.map((stat, i) => (
          <AnimateIn key={stat.label} delay={i * 60}>
            <div className="glass-card rounded-xl p-4 text-center">
              <p className="font-display text-xl font-bold text-primary">{stat.value}</p>
              <p className="text-[10px] text-muted-foreground mt-1">{stat.label}</p>
            </div>
          </AnimateIn>
        ))}
      </div>

      {/* Mission & Story */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        <AnimateIn direction="left" className="lg:col-span-3">
          <div className="glass-card rounded-xl p-6 lg:p-8 h-full flex flex-col gap-5">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10">
                <Rocket className="w-5 h-5 text-primary" />
              </div>
              <h2 className="font-display text-xl font-bold text-foreground">Nuestra Mision</h2>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              En Start By Global, nuestra mision es democratizar el acceso a soluciones de marketing digital
              de clase mundial para empresas en Latinoamerica, el Caribe, Espana y Estados Unidos. Creemos
              que cada negocio, sin importar su tamano o ubicacion, merece una presencia digital que
              impulse su crecimiento.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Fundada en 2020 en Santo Domingo, Rep. Dominicana, nacimos con la conviccion de que el
              talento hispanohablante puede competir con las mejores agencias del mundo. Hoy, con presencia
              en 4 ciudades y un equipo de mas de 30 profesionales, seguimos comprometidos con esa vision.
            </p>
            <div className="pt-4 border-t border-border/50">
              <p className="text-sm font-medium text-foreground italic">
                &ldquo;Transformamos datos en decisiones, ideas en experiencias y clientes en embajadores de marca.&rdquo;
              </p>
              <p className="text-xs text-muted-foreground mt-1">- Ricardo Mendez, CEO</p>
            </div>
          </div>
        </AnimateIn>

        <AnimateIn direction="right" delay={100} className="lg:col-span-2">
          <div className="glass-card rounded-xl p-6 h-full flex flex-col gap-4">
            <h3 className="font-display font-semibold text-foreground flex items-center gap-2">
              <Calendar className="w-4 h-4 text-primary" />
              Nuestra Historia
            </h3>
            <div className="flex flex-col gap-0 relative">
              <div className="absolute left-[7px] top-2 bottom-2 w-px bg-border/50" />
              {milestones.map((m, i) => (
                <AnimateIn key={m.year} delay={i * 80}>
                  <div className="flex items-start gap-4 py-2.5 relative">
                    <div className={`w-3.5 h-3.5 rounded-full shrink-0 mt-0.5 z-10 border-2 ${
                      i === milestones.length - 1
                        ? "bg-primary border-primary"
                        : "bg-card border-border"
                    }`} />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold font-display text-primary">{m.year}</span>
                        <span className="text-xs font-semibold text-foreground">{m.title}</span>
                      </div>
                      <p className="text-[11px] text-muted-foreground mt-0.5">{m.description}</p>
                    </div>
                  </div>
                </AnimateIn>
              ))}
            </div>
          </div>
        </AnimateIn>
      </div>

      {/* Values */}
      <AnimateIn>
        <h2 className="font-display text-xl font-bold text-foreground">Nuestros Valores</h2>
      </AnimateIn>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {values.map((value, i) => {
          const Icon = value.icon
          return (
            <AnimateIn key={value.title} delay={i * 80}>
              <div className="glass-card-hover rounded-xl p-5 flex flex-col gap-3 h-full">
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-display font-semibold text-foreground text-sm">{value.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{value.description}</p>
              </div>
            </AnimateIn>
          )
        })}
      </div>

      {/* Team */}
      <AnimateIn>
        <div className="flex items-center justify-between">
          <h2 className="font-display text-xl font-bold text-foreground">Nuestro Equipo</h2>
          <span className="text-xs text-muted-foreground">Lideres en cada area</span>
        </div>
      </AnimateIn>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {team.map((member, i) => (
          <AnimateIn key={member.name} delay={i * 80}>
            <div className="glass-card-hover rounded-xl p-5 flex flex-col gap-4 h-full group">
              <div className="flex items-center gap-4">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary font-display font-bold border border-primary/20 group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                  {member.name.split(" ").map((n) => n[0]).join("")}
                </div>
                <div className="flex-1">
                  <p className="font-display font-semibold text-foreground text-sm">{member.name}</p>
                  <p className="text-xs text-primary">{member.role}</p>
                </div>
                <Linkedin className="w-4 h-4 text-muted-foreground hover:text-foreground transition-colors cursor-pointer" />
              </div>

              <p className="text-xs text-muted-foreground leading-relaxed">{member.bio}</p>

              <div className="flex items-center gap-2 mt-auto pt-3 border-t border-border/50">
                <MapPin className="w-3 h-3 text-muted-foreground" />
                <span className="text-[10px] text-muted-foreground">{member.region}</span>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {member.specialties.map((s) => (
                  <span key={s} className="px-2 py-0.5 rounded-md bg-secondary/60 text-[10px] text-muted-foreground font-medium">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </AnimateIn>
        ))}
      </div>

      {/* Certifications / Partners */}
      <AnimateIn>
        <div className="glass-card rounded-xl p-6 lg:p-8">
          <div className="flex items-center gap-3 mb-6">
            <Award className="w-5 h-5 text-primary" />
            <h2 className="font-display text-lg font-bold text-foreground">Certificaciones y Partners</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { name: "Google Partner", desc: "Premier Partner certificado" },
              { name: "Meta Business", desc: "Partner de Meta for Business" },
              { name: "HubSpot", desc: "Solutions Partner certificado" },
              { name: "Shopify", desc: "Partner de desarrollo Shopify" },
            ].map((cert) => (
              <div key={cert.name} className="p-4 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors text-center flex flex-col gap-2">
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 mx-auto">
                  <TrendingUp className="w-5 h-5 text-primary" />
                </div>
                <p className="text-sm font-semibold text-foreground">{cert.name}</p>
                <p className="text-[10px] text-muted-foreground">{cert.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </AnimateIn>

      {/* CTA */}
      <AnimateIn>
        <div className="glass-card rounded-xl p-8 lg:p-12 text-center flex flex-col items-center gap-6 glow-accent-lg relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-chart-2/5" />
          <div className="relative flex flex-col items-center gap-4">
            <h2 className="font-display text-2xl lg:text-3xl font-bold text-foreground text-balance">
              Quieres ser parte de nuestro equipo?
            </h2>
            <p className="text-muted-foreground max-w-lg">
              Siempre estamos buscando talento apasionado por el marketing digital.
            </p>
            <Link
              href="/contacto"
              className="flex items-center gap-2 px-8 py-3.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm transition-all duration-300 hover:shadow-lg hover:shadow-primary/25 hover:scale-[1.02] active:scale-[0.98] mt-2"
            >
              Contactanos
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </AnimateIn>

      <Footer />
    </DashboardLayout>
  )
}
