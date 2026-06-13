"use client"

import { useState } from "react"
import Link from "next/link"
import { AnimateIn } from "@/components/animate-in"
import {
  ArrowRight,
  CheckCircle2,
  Lock,
  Award,
  Zap,
  Globe2,
  ChevronDown,
  Code2,
  Layers,
  Megaphone,
  Shield,
  Clock,
  Star,
  Send,
  Menu,
  X,
} from "lucide-react"

const services = [
  {
    id: "wordpress",
    badge: "Servicio 01",
    icon: Layers,
    title: "WordPress",
    subtitle: "Sites & Tiendas",
    description:
      "Desarrollo full-stack en WordPress para agencias que necesitan entregar sitios corporativos, blogs y WooCommerce con velocidad y calidad garantizada. Tu cliente ve tu marca, nosotros ponemos el código.",
    stack: ["WordPress 6.x", "WooCommerce", "ACF Pro", "Elementor / Gutenberg", "WPML Multilingue"],
    deliverables: [
      "Diseño personalizado pixel-perfect",
      "Optimización Core Web Vitals 90+",
      "SEO On-Page configurado",
      "Seguridad Hardening incluida",
      "Documentacion para tu equipo",
    ],
    turnaround: "7 - 21 días",
    color: "#0074D9",
    bg: "from-[#0074D9]/8 to-transparent",
    border: "border-[#0074D9]/20 hover:border-[#0074D9]/50",
  },
  {
    id: "corporate",
    badge: "Servicio 02",
    icon: Code2,
    title: "Corporativas",
    subtitle: "Sin CMS — Astro & React",
    description:
      "Para clientes que priorizan velocidad extrema y seguridad maxima. Páginas corporativas estaticas con Astro o React que cargan en milisegundos, sin base de datos ni superficie de ataque.",
    stack: ["Astro 5.x", "React + Next.js", "Tailwind CSS", "Framer Motion", "Vercel / Cloudflare"],
    deliverables: [
      "Performance Score 99/100 garantizado",
      "0 dependencia de CMS (100% seguro)",
      "Deploy automatizado en CDN global",
      "Animaciones fluidas e interactivas",
      "Accesibilidad WCAG 2.1 AA",
    ],
    turnaround: "5 - 14 días",
    color: "#00C9C8",
    bg: "from-[#00C9C8]/8 to-transparent",
    border: "border-[#00C9C8]/20 hover:border-[#00C9C8]/50",
  },
  {
    id: "landing",
    badge: "Servicio 03",
    icon: Megaphone,
    title: "Landing Pages",
    subtitle: "Embudos de Conversión",
    description:
      "Landing pages disenadas para convertir: embudos para campañas de paid media, lanzamientos de productos, webinars y estrategias de lead generation. Cada elemento optimizado para el CPA de tu cliente.",
    stack: ["Next.js App Router", "A/B Testing Ready", "Meta Pixel + GTM", "CRM Integration", "Heatmap Ready"],
    deliverables: [
      "Copy persuasivo orientado a conversión",
      "Diseño orientado a CRO",
      "Formularios con automatización",
      "Integración con cualquier CRM",
      "Variantes A/B configuradas",
    ],
    turnaround: "3 - 10 días",
    color: "#7B61FF",
    bg: "from-[#7B61FF]/8 to-transparent",
    border: "border-[#7B61FF]/20 hover:border-[#7B61FF]/50",
  },
]

const faqs = [
  {
    q: "Mi cliente puede descubrir que tercericé el proyecto?",
    a: "Nunca. Firmamos un NDA antes de iniciar y trabajamos exclusivamente bajo tu marca. Facturas, reportes, emails y repositorios llevan tu logo. Somos invisibles.",
  },
  {
    q: "Como funciona el proceso de entrega?",
    a: "Recibes un brief, lo pasas a nosotros con tus especificaciones. Nosotros diseñamos, desarrollamos y te entregamos todo listo en un repositorio privado o staging bajo tu dominio. Tu haces el delivery final al cliente.",
  },
  {
    q: "Que pasa si el cliente pide revisiones después de entregado?",
    a: "Cada proyecto incluye 2 rondas de revision sin costo. Revisiones adicionales o cambios de scope se cotizan aparte con tarifa de partner preferencial.",
  },
  {
    q: "Trabajan con agencias fuera de Republica Dominicana?",
    a: "Si. Tenemos partners activos en Venezuela, España, México, Colombia y EE.UU. Nos comunicamos por Slack, Notion o la herramienta que ya uses.",
  },
  {
    q: "Cual es el volumen mínimo de proyectos?",
    a: "No hay volumen mínimo para empezar. Sin embargo, los margenes mejoran con el plan Partner (desde 3 proyectos/mes) y Partner Pro (desde 6 proyectos/mes).",
  },
]

export function OutsourcingContent() {
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const [formData, setFormData] = useState({ name: "", agency: "", email: "", volume: "", message: "" })
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [formError, setFormError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSending(true)
    setFormError("")
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          company: formData.agency,
          service: "Outsourcing / Marca Blanca",
          message: `Volumen estimado: ${formData.volume} proyectos/mes\n\n${formData.message}`,
        }),
      })
      if (!res.ok) throw new Error()
      setSent(true)
      setFormData({ name: "", agency: "", email: "", volume: "", message: "" })
    } catch {
      setFormError("Error al enviar. Intenta de nuevo o escribe a info@startbyglobal.com")
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0E0E0E] text-white font-sans">

      {/* ── NAVBAR ─────────────────────────────────── */}
      <nav className="fixed top-0 inset-x-0 z-50 h-16 border-b border-white/5 bg-[#0E0E0E]/90 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
          <Link href="/" className="flex items-center">
            <img src="/logo-black.svg" alt="Start By Global" className="h-7 invert" />
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-8">
            {[
              { href: "#servicios", label: "Servicios" },
              { href: "#proceso", label: "Proceso" },
              { href: "#precios", label: "Precios" },
              { href: "#faq", label: "FAQ" },
            ].map((l) => (
              <a key={l.href} href={l.href} className="text-sm text-white/50 hover:text-white transition-colors animated-underline">
                {l.label}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <a
              href="#contacto"
              className="hidden md:flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#0074D9] text-white text-sm font-semibold hover:bg-[#0074D9]/85 transition-all hover:shadow-lg hover:shadow-[#0074D9]/30"
            >
              Solicitar Info
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
            <button
              type="button"
              onClick={() => setMobileNavOpen(!mobileNavOpen)}
              className="md:hidden p-2 rounded-lg bg-white/5 text-white/70"
              aria-label="Menu"
            >
              {mobileNavOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile nav */}
        {mobileNavOpen && (
          <div className="md:hidden absolute top-16 inset-x-0 bg-[#0E0E0E]/98 border-b border-white/5 px-6 py-4 flex flex-col gap-4">
            {[
              { href: "#servicios", label: "Servicios" },
              { href: "#proceso", label: "Proceso" },
              { href: "#precios", label: "Precios" },
              { href: "#faq", label: "FAQ" },
              { href: "#contacto", label: "Solicitar Info" },
            ].map((l) => (
              <a key={l.href} href={l.href} onClick={() => setMobileNavOpen(false)} className="text-sm text-white/70 hover:text-white py-2 transition-colors">
                {l.label}
              </a>
            ))}
          </div>
        )}
      </nav>

      {/* ── HERO ───────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center overflow-hidden pt-16">
        {/* Grid background */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)`,
            backgroundSize: "64px 64px",
          }}
        />
        {/* Glow blobs */}
        <div className="absolute top-1/4 right-1/4 w-[600px] h-[600px] bg-[#0074D9]/8 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-1/4 left-1/6 w-[400px] h-[400px] bg-[#00C9C8]/5 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-6 py-24 lg:py-32 grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <AnimateIn delay={0.05}>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#0074D9]/10 border border-[#0074D9]/20 text-[#0074D9] text-xs font-semibold mb-8 tracking-wide uppercase">
                <div className="w-1.5 h-1.5 rounded-full bg-[#0074D9] animate-pulse" />
                Outsourcing & Marca Blanca — Agencias
              </div>
            </AnimateIn>

            <AnimateIn delay={0.1}>
              <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.05] text-balance mb-6">
                Tu equipo de
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0074D9] to-[#00C9C8]">
                  desarrollo web
                </span>
                <br />
                invisible.
              </h1>
            </AnimateIn>

            <AnimateIn delay={0.2}>
              <p className="text-lg text-white/55 leading-relaxed mb-10 max-w-lg">
                Entregamos WordPress, sitios corporativos en Astro/React y Landing Pages de alta conversión bajo tu marca. Sin creditos, sin rastro. Solo resultados.
              </p>
            </AnimateIn>

            <AnimateIn delay={0.3}>
              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href="#contacto"
                  className="group inline-flex items-center justify-center gap-2 px-7 py-4 rounded-xl bg-[#0074D9] text-white font-semibold text-base hover:bg-[#0074D9]/85 hover:shadow-2xl hover:shadow-[#0074D9]/30 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
                >
                  Quiero ser Partner
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </a>
                <a
                  href="#servicios"
                  className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-xl border border-white/10 text-white/70 font-semibold text-base hover:bg-white/5 hover:text-white hover:border-white/20 transition-all"
                >
                  Ver los 3 Servicios
                </a>
              </div>
            </AnimateIn>

            <AnimateIn delay={0.4}>
              <div className="mt-12 flex flex-wrap gap-6">
                {[
                  { icon: Lock, label: "NDA firmado antes de iniciar" },
                  { icon: Shield, label: "Marca Blanca 100%" },
                  { icon: Zap, label: "Lighthouse 90+ garantizado" },
                ].map((t) => (
                  <div key={t.label} className="flex items-center gap-2 text-sm text-white/40">
                    <t.icon className="w-4 h-4 text-[#00C9C8]" />
                    {t.label}
                  </div>
                ))}
              </div>
            </AnimateIn>
          </div>

          {/* Stats card */}
          <AnimateIn delay={0.25}>
            <div className="hidden lg:block">
              <div className="relative p-8 rounded-2xl bg-white/[0.025] border border-white/8 backdrop-blur-sm">
                <div className="grid grid-cols-2 gap-px bg-white/8 rounded-xl overflow-hidden">
                  {[
                    { value: "+120", label: "Proyectos entregados", color: "text-[#0074D9]" },
                    { value: "100%", label: "Confidencialidad", color: "text-[#00C9C8]" },
                    { value: "3-21", label: "Días de entrega", color: "text-[#7B61FF]" },
                    { value: "5+", label: "Países con partners", color: "text-[#0074D9]" },
                  ].map((s) => (
                    <div key={s.label} className="bg-[#0E0E0E] p-6">
                      <div className={`font-display text-4xl font-bold mb-1 ${s.color}`}>{s.value}</div>
                      <div className="text-xs text-white/40">{s.label}</div>
                    </div>
                  ))}
                </div>
                <div className="mt-6 flex items-center gap-3 pt-6 border-t border-white/5">
                  <div className="flex -space-x-2">
                    {["#0074D9", "#00C9C8", "#7B61FF", "#F4A261"].map((c) => (
                      <div key={c} className="w-8 h-8 rounded-full border-2 border-[#0E0E0E]" style={{ backgroundColor: c + "33", borderColor: c + "66" }} />
                    ))}
                  </div>
                  <p className="text-xs text-white/40">Agencias activas en RD, ES, VE, MX, US</p>
                </div>
              </div>
            </div>
          </AnimateIn>
        </div>
      </section>

      {/* ── PROBLEMA / SOLUCION ────────────────────── */}
      <section className="py-24 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <AnimateIn>
            <div className="max-w-3xl mb-16">
              <p className="text-[#0074D9] text-sm font-semibold uppercase tracking-widest mb-4">El Problema Real</p>
              <h2 className="font-display text-4xl md:text-5xl font-bold text-balance leading-tight">
                Rechazas clientes por falta de{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0074D9] to-[#00C9C8]">
                  capacidad técnica.
                </span>
              </h2>
            </div>
          </AnimateIn>

          <div className="grid md:grid-cols-2 gap-6 max-w-5xl">
            <AnimateIn delay={0.1}>
              <div className="p-8 rounded-2xl border border-red-500/15 bg-red-500/3">
                <p className="text-red-400 text-xs font-semibold uppercase tracking-wider mb-6">Sin Partner</p>
                <ul className="space-y-4">
                  {[
                    "Contratas freelancers sin garantía de calidad",
                    "Nómina fija aunque no haya proyectos",
                    "Recuerzas proyectos por problemas de entrega",
                    "Cuellos de botella en picos de demanda",
                    "Riesgo reputacional en cada proyecto",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3 text-sm text-white/50">
                      <div className="w-5 h-5 rounded-full bg-red-500/15 flex items-center justify-center shrink-0 mt-0.5">
                        <div className="w-1.5 h-1.5 bg-red-400 rounded-full" />
                      </div>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </AnimateIn>
            <AnimateIn delay={0.15}>
              <div className="p-8 rounded-2xl border border-[#0074D9]/20 bg-gradient-to-br from-[#0074D9]/6 to-transparent">
                <p className="text-[#00C9C8] text-xs font-semibold uppercase tracking-wider mb-6">Con Start By Global</p>
                <ul className="space-y-4">
                  {[
                    "Equipo técnico certificado en tu back-office",
                    "Solo pagas por proyecto entregado (costo variable)",
                    "Calidad garantizada con Lighthouse 90+",
                    "Escala instantanea: 1 o 10 proyectos al mes",
                    "Tu marca, tu credito, nuestro código",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3 text-sm text-white/70">
                      <CheckCircle2 className="w-5 h-5 text-[#00C9C8] shrink-0 mt-0.5" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </AnimateIn>
          </div>
        </div>
      </section>

      {/* ── LOS 3 SERVICIOS ────────────────────────── */}
      <section id="servicios" className="py-24 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <AnimateIn>
            <div className="mb-16">
              <p className="text-[#0074D9] text-sm font-semibold uppercase tracking-widest mb-4">Portafolio B2B</p>
              <h2 className="font-display text-4xl md:text-5xl font-bold text-balance">
                Tres servicios. Un solo partner.
              </h2>
            </div>
          </AnimateIn>

          <div className="flex flex-col gap-6">
            {services.map((svc, i) => {
              const Icon = svc.icon
              return (
                <AnimateIn key={svc.id} delay={0.08 * i}>
                  <div
                    className={`group relative p-8 md:p-10 rounded-2xl bg-gradient-to-br ${svc.bg} border ${svc.border} transition-all duration-500`}
                  >
                    <div className="grid md:grid-cols-[1fr_auto] gap-8 items-start">
                      <div>
                        <div className="flex items-center gap-4 mb-6">
                          <div
                            className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                            style={{ backgroundColor: svc.color + "15", border: `1px solid ${svc.color}25` }}
                          >
                            <Icon className="w-6 h-6" style={{ color: svc.color }} />
                          </div>
                          <div>
                            <p className="text-xs font-semibold uppercase tracking-widest text-white/30">{svc.badge}</p>
                            <h3 className="font-display text-2xl md:text-3xl font-bold">{svc.title}</h3>
                          </div>
                          <span
                            className="hidden sm:inline-block ml-2 px-3 py-1 rounded-full text-xs font-medium"
                            style={{ backgroundColor: svc.color + "12", color: svc.color }}
                          >
                            {svc.subtitle}
                          </span>
                        </div>

                        <p className="text-white/55 leading-relaxed mb-8 max-w-2xl">{svc.description}</p>

                        <div className="grid sm:grid-cols-2 gap-8">
                          <div>
                            <p className="text-xs uppercase tracking-widest text-white/30 mb-3">Stack Tecnologico</p>
                            <div className="flex flex-wrap gap-2">
                              {svc.stack.map((s) => (
                                <span key={s} className="px-3 py-1 rounded-md bg-white/5 border border-white/8 text-xs text-white/60 font-mono">
                                  {s}
                                </span>
                              ))}
                            </div>
                          </div>
                          <div>
                            <p className="text-xs uppercase tracking-widest text-white/30 mb-3">Entregables</p>
                            <ul className="space-y-2">
                              {svc.deliverables.map((d) => (
                                <li key={d} className="flex items-center gap-2 text-xs text-white/55">
                                  <div className="w-1 h-1 rounded-full shrink-0" style={{ backgroundColor: svc.color }} />
                                  {d}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col items-start md:items-end gap-4 md:min-w-[180px]">
                        <div className="text-right">
                          <div className="flex items-center gap-1.5 text-white/30 text-xs mb-1">
                            <Clock className="w-3.5 h-3.5" />
                            Tiempo de entrega
                          </div>
                          <div className="font-display text-3xl font-bold" style={{ color: svc.color }}>
                            {svc.turnaround}
                          </div>
                        </div>
                        <a
                          href="#contacto"
                          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all hover:scale-[1.02]"
                          style={{ backgroundColor: svc.color + "15", color: svc.color, border: `1px solid ${svc.color}25` }}
                        >
                          Cotizar este servicio
                          <ArrowRight className="w-4 h-4" />
                        </a>
                      </div>
                    </div>
                  </div>
                </AnimateIn>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── PROCESO ────────────────────────────────── */}
      <section id="proceso" className="py-24 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <AnimateIn>
            <div className="mb-16 text-center">
              <p className="text-[#0074D9] text-sm font-semibold uppercase tracking-widest mb-4">Como Funciona</p>
              <h2 className="font-display text-4xl md:text-5xl font-bold text-balance">
                De brief a entrega en 4 pasos.
              </h2>
            </div>
          </AnimateIn>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-px bg-white/5 rounded-2xl overflow-hidden">
            {[
              { step: "01", title: "Brief Confidencial", desc: "Nos envias los requerimientos del proyecto con NDA firmado. Ningun dato de tu cliente sale de ese canal." },
              { step: "02", title: "Propuesta en 24h", desc: "Enviamos cotización detallada con desglose técnico, cronograma y alcance. Tu la revisas y ajustas." },
              { step: "03", title: "Desarrollo en Silencio", desc: "Trabajamos en staging bajo tu dominio o un temporal. Updates por Slack/Notion con tu marca." },
              { step: "04", title: "Entrega Lista para Deploy", desc: "Recibes repositorio, credenciales y documentacion. Tu haces el handoff final. Credito 100% tuyo." },
            ].map((step, i) => (
              <AnimateIn key={step.step} delay={0.08 * i}>
                <div className="bg-[#0E0E0E] p-8 flex flex-col gap-4 h-full">
                  <div className="font-display text-5xl font-bold text-white/5">{step.step}</div>
                  <div>
                    <h3 className="font-display text-lg font-bold text-white mb-2">{step.title}</h3>
                    <p className="text-sm text-white/45 leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              </AnimateIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRECIOS / MODELOS ──────────────────────── */}
      <section id="precios" className="py-24 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <AnimateIn>
            <div className="mb-16 text-center">
              <p className="text-[#0074D9] text-sm font-semibold uppercase tracking-widest mb-4">Modelos de Alianza</p>
              <h2 className="font-display text-4xl md:text-5xl font-bold text-balance">
                El margen es tuyo. Siempre.
              </h2>
              <p className="text-white/45 mt-4 max-w-xl mx-auto">
                Nuestros precios son para ti. Tu pones el markup que quieras a tu cliente. Sin restricciones, sin competencia directa.
              </p>
            </div>
          </AnimateIn>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              {
                name: "Puntual",
                tagline: "Por proyecto",
                desc: "Ideal para agencias que necesitan apoyo esporadico o que quieren probar la alianza.",
                perks: ["Sin compromiso de volumen", "Cotización por proyecto", "Pago 50% inicio / 50% entrega", "Soporte via email", "1 revision incluida"],
                cta: "Empezar ahora",
                highlight: false,
                color: "#ffffff",
              },
              {
                name: "Partner",
                tagline: "3+ proyectos / mes",
                desc: "Para agencias con flujo continuo que quieren precios preferenciales y prioridad de agenda.",
                perks: ["Descuento del 15% en todos los proyectos", "Prioridad en agenda de desarrollo", "2 revisiones por proyecto", "Canal Slack dedicado", "Reportes con tu marca"],
                cta: "Quiero ser Partner",
                highlight: true,
                color: "#0074D9",
              },
              {
                name: "Partner Pro",
                tagline: "6+ proyectos / mes",
                desc: "Para agencias de alto volumen que necesitan capacidad extendida y SLA garantizado.",
                perks: ["Descuento del 25% en todos los proyectos", "Cuenta manager dedicada", "Revisiones ilimitadas", "SLA de entrega garantizado", "Capacitacion a tu equipo"],
                cta: "Hablar con ventas",
                highlight: false,
                color: "#00C9C8",
              },
            ].map((plan, i) => (
              <AnimateIn key={plan.name} delay={0.08 * i}>
                <div
                  className={`relative flex flex-col p-8 rounded-2xl border transition-all duration-300 h-full ${
                    plan.highlight
                      ? "border-[#0074D9]/50 bg-gradient-to-b from-[#0074D9]/10 to-transparent scale-[1.02]"
                      : "border-white/10 bg-white/[0.02] hover:border-white/20"
                  }`}
                >
                  {plan.highlight && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-[#0074D9] text-white text-xs font-semibold">
                      Más popular
                    </div>
                  )}
                  <div className="mb-6">
                    <h3 className="font-display text-2xl font-bold mb-1" style={{ color: plan.color }}>{plan.name}</h3>
                    <p className="text-xs text-white/35 uppercase tracking-widest mb-4">{plan.tagline}</p>
                    <p className="text-sm text-white/50 leading-relaxed">{plan.desc}</p>
                  </div>
                  <ul className="space-y-3 mb-8 flex-1">
                    {plan.perks.map((perk) => (
                      <li key={perk} className="flex items-center gap-2.5 text-sm text-white/60">
                        <CheckCircle2 className="w-4 h-4 shrink-0" style={{ color: plan.color }} />
                        {perk}
                      </li>
                    ))}
                  </ul>
                  <a
                    href="#contacto"
                    className={`inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold transition-all ${
                      plan.highlight
                        ? "bg-[#0074D9] text-white hover:bg-[#0074D9]/85 hover:shadow-lg hover:shadow-[#0074D9]/25"
                        : "border border-white/10 text-white/70 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    {plan.cta}
                    <ArrowRight className="w-4 h-4" />
                  </a>
                </div>
              </AnimateIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── GARANTIA ───────────────────────────────── */}
      <section className="py-24 border-t border-white/5 bg-gradient-to-b from-[#001F3F]/20 to-transparent">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <AnimateIn>
              <div>
                <p className="text-[#00C9C8] text-sm font-semibold uppercase tracking-widest mb-4">Nuestra Promesa</p>
                <h2 className="font-display text-4xl md:text-5xl font-bold text-balance leading-tight mb-6">
                  Si no cumplimos el score,{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0074D9] to-[#00C9C8]">
                    lo rehacemos gratis.
                  </span>
                </h2>
                <p className="text-white/50 leading-relaxed mb-8">
                  Cada proyecto sale con un informe de Lighthouse y Core Web Vitals adjunto. Si el Performance Score no alcanza 90/100, continuamos hasta lograrlo sin costo adicional.
                </p>
                <div className="space-y-4">
                  {[
                    { icon: Award, text: "Reportes brandables con tu logo para tu cliente" },
                    { icon: Code2, text: "Código limpio, comentado y documentado" },
                    { icon: Globe2, text: "Optimización multiregion: RD, ES, US" },
                    { icon: Star, text: "Soporte post-entrega durante 30 días" },
                  ].map((g) => (
                    <div key={g.text} className="flex items-center gap-4">
                      <div className="w-9 h-9 rounded-lg bg-[#0074D9]/10 flex items-center justify-center shrink-0">
                        <g.icon className="w-4.5 h-4.5 text-[#0074D9]" />
                      </div>
                      <p className="text-sm text-white/60">{g.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            </AnimateIn>

            <AnimateIn delay={0.15}>
              <div className="relative p-8 rounded-2xl bg-white/[0.025] border border-white/8">
                <p className="text-xs text-white/30 uppercase tracking-widest mb-6">Lighthouse Report — Ejemplo Real</p>
                <div className="space-y-5">
                  {[
                    { label: "Performance", score: 96, color: "#00C9C8" },
                    { label: "Accessibility", score: 100, color: "#0074D9" },
                    { label: "Best Practices", score: 100, color: "#7B61FF" },
                    { label: "SEO", score: 100, color: "#F4A261" },
                  ].map((m) => (
                    <div key={m.label}>
                      <div className="flex items-center justify-between text-sm mb-2">
                        <span className="text-white/50">{m.label}</span>
                        <span className="font-semibold" style={{ color: m.color }}>{m.score}</span>
                      </div>
                      <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                        <div className="h-full rounded-full transition-all" style={{ width: `${m.score}%`, backgroundColor: m.color }} />
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-6 pt-5 border-t border-white/5 flex items-center justify-between">
                  <span className="text-xs text-white/25">Tiempo de carga</span>
                  <span className="font-display text-2xl font-bold text-[#00C9C8]">{'< 1.1s'}</span>
                </div>
              </div>
            </AnimateIn>
          </div>
        </div>
      </section>

      {/* ── FAQ ────────────────────────────────────── */}
      <section id="faq" className="py-24 border-t border-white/5">
        <div className="max-w-4xl mx-auto px-6">
          <AnimateIn>
            <div className="mb-14 text-center">
              <p className="text-[#0074D9] text-sm font-semibold uppercase tracking-widest mb-4">FAQ</p>
              <h2 className="font-display text-4xl md:text-5xl font-bold text-balance">Preguntas frecuentes.</h2>
            </div>
          </AnimateIn>

          <div className="flex flex-col divide-y divide-white/5">
            {faqs.map((faq, i) => (
              <AnimateIn key={i} delay={0.05 * i}>
                <button
                  type="button"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-start justify-between gap-6 py-6 text-left group"
                >
                  <span className="font-semibold text-white/80 group-hover:text-white transition-colors">{faq.q}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-white/30 shrink-0 mt-0.5 transition-transform duration-300 ${openFaq === i ? "rotate-180 text-[#0074D9]" : ""}`}
                  />
                </button>
                {openFaq === i && (
                  <p className="text-sm text-white/50 leading-relaxed pb-6 -mt-2">{faq.a}</p>
                )}
              </AnimateIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── CONTACTO / CTA ─────────────────────────── */}
      <section id="contacto" className="py-24 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            <AnimateIn>
              <div>
                <p className="text-[#0074D9] text-sm font-semibold uppercase tracking-widest mb-4">Empecemos</p>
                <h2 className="font-display text-4xl md:text-5xl font-bold text-balance leading-tight mb-6">
                  Cuéntanos tu primer proyecto.
                </h2>
                <p className="text-white/45 leading-relaxed mb-10">
                  Completar el formulario tarda menos de 2 minutos. Respondemos en menos de 24 horas con una propuesta preliminar y un NDA listo para firmar.
                </p>
                <div className="space-y-5">
                  {[
                    { label: "Respuesta en", value: "Menos de 24 horas" },
                    { label: "Primer contrato", value: "NDA incluido" },
                    { label: "Reunion inicial", value: "Google Meet / Zoom" },
                    { label: "Email directo", value: "info@startbyglobal.com" },
                  ].map((d) => (
                    <div key={d.label} className="flex items-center justify-between py-3 border-b border-white/5">
                      <span className="text-sm text-white/35">{d.label}</span>
                      <span className="text-sm text-white/70 font-medium">{d.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </AnimateIn>

            <AnimateIn delay={0.15}>
              {sent ? (
                <div className="flex flex-col items-center justify-center gap-4 h-full py-20 text-center">
                  <div className="w-16 h-16 rounded-full bg-[#00C9C8]/10 flex items-center justify-center">
                    <CheckCircle2 className="w-8 h-8 text-[#00C9C8]" />
                  </div>
                  <h3 className="font-display text-2xl font-bold">Mensaje recibido.</h3>
                  <p className="text-white/45 max-w-sm">Te respondemos en menos de 24 horas con una propuesta preliminar y el NDA listo.</p>
                  <button type="button" onClick={() => setSent(false)} className="text-sm text-[#0074D9] hover:underline mt-2">
                    Enviar otro mensaje
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs text-white/40 uppercase tracking-wider mb-2">Tu nombre</label>
                      <input
                        required
                        value={formData.name}
                        onChange={(e) => setFormData((f) => ({ ...f, name: e.target.value }))}
                        placeholder="Juan Garcia"
                        className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/8 text-white text-sm placeholder:text-white/20 focus:border-[#0074D9]/50 focus:outline-none focus:bg-white/[0.06] transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-white/40 uppercase tracking-wider mb-2">Agencia / empresa</label>
                      <input
                        required
                        value={formData.agency}
                        onChange={(e) => setFormData((f) => ({ ...f, agency: e.target.value }))}
                        placeholder="Mi Agencia Digital"
                        className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/8 text-white text-sm placeholder:text-white/20 focus:border-[#0074D9]/50 focus:outline-none focus:bg-white/[0.06] transition-all"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs text-white/40 uppercase tracking-wider mb-2">Email de contacto</label>
                    <input
                      required
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData((f) => ({ ...f, email: e.target.value }))}
                      placeholder="juan@miagencia.com"
                      className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/8 text-white text-sm placeholder:text-white/20 focus:border-[#0074D9]/50 focus:outline-none focus:bg-white/[0.06] transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-white/40 uppercase tracking-wider mb-2">Proyectos estimados al mes</label>
                    <select
                      value={formData.volume}
                      onChange={(e) => setFormData((f) => ({ ...f, volume: e.target.value }))}
                      className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/8 text-white text-sm focus:border-[#0074D9]/50 focus:outline-none focus:bg-white/[0.06] transition-all"
                    >
                      <option value="" className="bg-[#0E0E0E]">Selecciona un rango</option>
                      <option value="1-2" className="bg-[#0E0E0E]">1-2 proyectos</option>
                      <option value="3-5" className="bg-[#0E0E0E]">3-5 proyectos</option>
                      <option value="6-10" className="bg-[#0E0E0E]">6-10 proyectos</option>
                      <option value="10+" className="bg-[#0E0E0E]">Más de 10</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-white/40 uppercase tracking-wider mb-2">Cuéntanos tu necesidad</label>
                    <textarea
                      required
                      rows={4}
                      value={formData.message}
                      onChange={(e) => setFormData((f) => ({ ...f, message: e.target.value }))}
                      placeholder="Tengo una agencia de marketing y necesito apoyo con desarrollo web para mis clientes..."
                      className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/8 text-white text-sm placeholder:text-white/20 focus:border-[#0074D9]/50 focus:outline-none focus:bg-white/[0.06] transition-all resize-none"
                    />
                  </div>

                  {formError && (
                    <p className="text-xs text-red-400 bg-red-400/5 border border-red-400/20 px-4 py-3 rounded-lg">{formError}</p>
                  )}

                  <button
                    type="submit"
                    disabled={sending}
                    className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-[#0074D9] text-white font-semibold text-sm hover:bg-[#0074D9]/85 hover:shadow-xl hover:shadow-[#0074D9]/25 transition-all disabled:opacity-50 disabled:pointer-events-none"
                  >
                    {sending ? (
                      <>
                        <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                        Enviando...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        Solicitar información de partner
                      </>
                    )}
                  </button>
                  <p className="text-center text-xs text-white/20">
                    Al enviar aceptas que te contactemos. Nunca compartimos tu información.
                  </p>
                </form>
              )}
            </AnimateIn>
          </div>
        </div>
      </section>

      {/* ── FOOTER ─────────────────────────────────── */}
      <footer className="border-t border-white/5 py-10">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <Link href="/">
            <img src="/logo-black.svg" alt="Start By Global" className="h-6 invert opacity-40 hover:opacity-70 transition-opacity" />
          </Link>
          <div className="flex items-center gap-6 text-xs text-white/25">
            <Link href="/" className="hover:text-white/50 transition-colors">Volver al sitio principal</Link>
            <Link href="/contacto" className="hover:text-white/50 transition-colors">Contacto</Link>
            <span>2026 Start By Global</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
