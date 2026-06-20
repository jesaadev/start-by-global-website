"use client"

import { useState } from "react"
import Link from "next/link"
import { AnimateIn } from "@/components/animate-in"
import {
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  Menu,
  X,
  Send,
  Zap,
  Bot,
  GitBranch,
  LineChart,
  MessageSquare,
  Database,
  RefreshCw,
  Shield,
  Clock,
  TrendingUp,
  Cpu,
  Workflow,
  FileText,
} from "lucide-react"

// ── DATA ──────────────────────────────────────────────────────────────────────

const services = [
  {
    id: "chatbots",
    badge: "Servicio 01",
    icon: Bot,
    title: "Chatbots & Agentes IA",
    subtitle: "GPT-4o · Claude · Gemini",
    description:
      "Diseñamos agentes conversacionales con memoria, herramientas y acceso a tus datos empresariales. Atención 24/7, calificación de leads, soporte de primer nivel y consultas complejas — sin operador humano.",
    useCases: [
      "Chatbot de ventas con CRM integrado",
      "Agente de soporte con base de conocimiento",
      "Bot de calificacion de leads por WhatsApp",
      "Asistente interno para equipos de trabajo",
      "Automatización de onboarding de clientes",
    ],
    stack: ["OpenAI GPT-4o", "Anthropic Claude", "LangChain", "WhatsApp API", "Slack / Teams"],
    metric: "80% reducción en tickets de soporte",
    color: "#7B61FF",
    bg: "from-[#7B61FF]/8 to-transparent",
    border: "border-[#7B61FF]/20 hover:border-[#7B61FF]/50",
  },
  {
    id: "automatización",
    badge: "Servicio 02",
    icon: Workflow,
    title: "Automatización de Procesos",
    subtitle: "Make · Zapier · N8N",
    description:
      "Conectamos tus herramientas y eliminamos el trabajo repetitivo. Flujos que se ejecutan solos: sincronización de datos, notificaciones, reportes automáticos, facturación y mucho más.",
    useCases: [
      "Flujos entre CRM, email y WhatsApp",
      "Sincronización automática de inventarios",
      "Generación y envio de reportes periodicos",
      "Automatización de facturación recurrente",
      "Pipelines de marketing completamente automatizados",
    ],
    stack: ["Make (Integromat)", "N8N self-hosted", "Zapier", "Webhooks", "APIs REST"],
    metric: "12h/semana devueltas a tu equipo",
    color: "#00C9C8",
    bg: "from-[#00C9C8]/8 to-transparent",
    border: "border-[#00C9C8]/20 hover:border-[#00C9C8]/50",
  },
  {
    id: "datos",
    badge: "Servicio 03",
    icon: LineChart,
    title: "IA para Datos & Reportes",
    subtitle: "Dashboards · Prediccion · Insights",
    description:
      "Convertimos tus datos en decisiones. Implementamos modelos predictivos, dashboards inteligentes y pipelines de datos que te dicen que va a pasar antes de que suceda.",
    useCases: [
      "Dashboard de ventas con prediccion de ingresos",
      "Segmentacion automática de clientes con ML",
      "Deteccion de anomalias en tiempo real",
      "Recomendaciones de productos personalizadas",
      "Análisis de sentimiento de redes sociales",
    ],
    stack: ["Python + Pandas", "Supabase / BigQuery", "Recharts / Metabase", "Scikit-learn", "OpenAI Embeddings"],
    metric: "3x más rápido en toma de decisiones",
    color: "#0074D9",
    bg: "from-[#0074D9]/8 to-transparent",
    border: "border-[#0074D9]/20 hover:border-[#0074D9]/50",
  },
  {
    id: "contenido",
    badge: "Servicio 04",
    icon: FileText,
    title: "Generación de Contenido con IA",
    subtitle: "Copy · SEO · Multicanal",
    description:
      "Pipelines de contenido que producen blogs, emails, posts y anuncios en escala. Con tu voz de marca, optimizados para SEO y listos para publicar.",
    useCases: [
      "Blog SEO automatizado con revision humana",
      "Newsletter semanal generado y enviado solo",
      "Anuncios A/B con variantes generadas por IA",
      "Fichas de producto para ecommerce masivo",
      "Subtitulos y transcripciones automáticas para video",
    ],
    stack: ["GPT-4o + Fine-tuning", "Perplexity API", "Notion / WordPress", "Resend", "Buffer / Hootsuite"],
    metric: "10x más contenido al mismo costo",
    color: "#F4A261",
    bg: "from-[#F4A261]/8 to-transparent",
    border: "border-[#F4A261]/20 hover:border-[#F4A261]/50",
  },
]

const processSteps = [
  {
    num: "01",
    title: "Diagnostico IA",
    description:
      "Auditamos tus procesos actuales para identificar los 3 puntos de mayor impacto donde la IA puede generar ROI inmediato.",
    icon: LineChart,
  },
  {
    num: "02",
    title: "Prototipo en 7 días",
    description:
      "Entregamos un primer prototipo funcional en una semana. Nada de PowerPoints: código real corriendo en tu entorno.",
    icon: Zap,
  },
  {
    num: "03",
    title: "Integración & Training",
    description:
      "Conectamos la solución a tus sistemas existentes y entrenamos a tu equipo para que la adopcion sea inmediata.",
    icon: GitBranch,
  },
  {
    num: "04",
    title: "Monitoreo & Mejora continua",
    description:
      "Los modelos mejoran con el uso. Monitoreamos, ajustamos y optimizamos cada semana para maximizar el retorno.",
    icon: RefreshCw,
  },
]

const plans = [
  {
    name: "Starter IA",
    price: "$890",
    period: "proyecto",
    description: "Un solo flujo o agente IA para un proceso especifico.",
    features: [
      "1 automatización o chatbot",
      "Integración con 2 herramientas",
      "Documentacion técnica",
      "2 semanas de soporte post-entrega",
      "Acceso al panel de monitoreo",
    ],
    cta: "Empezar",
    color: "#0074D9",
    popular: false,
  },
  {
    name: "Growth IA",
    price: "$2,400",
    period: "mes",
    description: "Suite completa: automatizaciones, chatbot y dashboard de datos.",
    features: [
      "Hasta 5 flujos de automatización",
      "1 agente conversacional",
      "Dashboard de métricas en tiempo real",
      "Soporte prioritario Slack",
      "Optimización mensual incluida",
      "Integraciones ilimitadas",
    ],
    cta: "Mejor Valor",
    color: "#7B61FF",
    popular: true,
  },
  {
    name: "Enterprise IA",
    price: "Custom",
    period: "",
    description: "Transformacion digital completa con IA para empresas y grupos.",
    features: [
      "Flujos ilimitados",
      "Modelos fine-tuned con tus datos",
      "Infraestructura dedicada",
      "SLA 99.9% uptime garantizado",
      "Equipo dedicado asignado",
      "Onboarding ejecutivo incluido",
    ],
    cta: "Agendar Llamada",
    color: "#00C9C8",
    popular: false,
  },
]

const faqs = [
  {
    q: "Necesito conocimientos técnicos para implementar estas soluciones?",
    a: "No. Nosotros manejamos todo el stack técnico. Tu equipo solo necesita saber usar la herramienta final, que diseñamos para ser lo más intuitiva posible.",
  },
  {
    q: "¿Mis datos están seguros si los uso para entrenar modelos?",
    a: "Sí. Usamos contratos de procesamiento de datos, modelos con aislamiento por cliente y nunca compartimos datos entre clientes. Podemos firmar DPA o NDA si lo requieres.",
  },
  {
    q: "Cuanto tiempo tarda en verse el ROI?",
    a: "La mayoria de nuestros clientes reportan retorno en el primer mes. Las automatizaciones simples suelen pagarse en la primera semana de funcionamiento.",
  },
  {
    q: "Pueden integrarse con mi CRM / ERP actual?",
    a: "Si. Trabajamos con HubSpot, Salesforce, Zoho, SAP, Odoo y practicamente cualquier sistema que tenga API o webhooks disponibles.",
  },
  {
    q: "Que pasa si el modelo da respuestas incorrectas?",
    a: "Diseñamos circuitos de fallback y revision humana en todos nuestros agentes. Además, monitoreamos la calidad de respuestas semanalmente y ajustamos los prompts y el contexto.",
  },
]

// ── COMPONENT ─────────────────────────────────────────────────────────────────

export function IaContent() {
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    company: "",
    email: "",
    process: "",
    message: "",
  })
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
          company: formData.company,
          service: "IA & Automatización",
          message: `Proceso a automatizar: ${formData.process}\n\n${formData.message}`,
        }),
      })
      if (!res.ok) throw new Error()
      setSent(true)
      setFormData({ name: "", company: "", email: "", process: "", message: "" })
    } catch {
      setFormError("Error al enviar. Intenta de nuevo o escribe a info@startbyglobal.com")
    } finally {
      setSending(false)
    }
  }

  const navLinks = [
    { href: "#soluciones", label: "Soluciones" },
    { href: "#proceso", label: "Proceso" },
    { href: "#planes", label: "Planes" },
    { href: "#faq", label: "FAQ" },
  ]

  return (
    <div className="min-h-screen bg-background text-foreground font-sans">

      {/* ── NAVBAR ──────────────────────────────────── */}
      <nav className="fixed top-0 inset-x-0 z-50 h-16 border-b border-foreground/5 bg-background/90 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
          <Link href="/" className="flex items-center">
            <img src="/logo-black.svg" alt="Start By Global" className="h-7 dark:invert" />
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="text-sm text-foreground/50 hover:text-foreground transition-colors animated-underline"
              >
                {l.label}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="hidden md:flex items-center gap-1.5 text-sm text-foreground/40 hover:text-foreground/70 transition-colors"
            >
              Volver al sitio
            </Link>
            <a
              href="#contacto"
              className="hidden md:flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#7B61FF] text-white text-sm font-semibold hover:bg-[#7B61FF]/85 transition-all hover:shadow-lg hover:shadow-[#7B61FF]/30"
            >
              Agendar Demo
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
            <button
              type="button"
              onClick={() => setMobileNavOpen(!mobileNavOpen)}
              className="md:hidden p-2 rounded-lg bg-foreground/5 text-foreground/70"
              aria-label="Menu"
            >
              {mobileNavOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {mobileNavOpen && (
          <div className="md:hidden absolute top-16 inset-x-0 bg-background/98 border-b border-foreground/5 px-6 py-4 flex flex-col gap-4">
            {[...navLinks, { href: "#contacto", label: "Agendar Demo" }].map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setMobileNavOpen(false)}
                className="text-sm text-foreground/70 hover:text-foreground py-2 transition-colors"
              >
                {l.label}
              </a>
            ))}
          </div>
        )}
      </nav>

      {/* ── HERO ────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center overflow-hidden pt-16">
        {/* Dot grid */}
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage: `radial-gradient(circle, white 1px, transparent 1px)`,
            backgroundSize: "32px 32px",
          }}
        />
        {/* Glow blobs */}
        <div className="absolute top-1/3 right-1/3 w-[700px] h-[700px] bg-[#7B61FF]/10 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute bottom-1/4 left-1/4 w-[500px] h-[500px] bg-[#00C9C8]/6 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-1/4 left-1/3 w-[300px] h-[300px] bg-[#0074D9]/8 rounded-full blur-[80px] pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-6 py-24 lg:py-32 grid lg:grid-cols-[1fr_420px] gap-16 items-center">
          {/* Left */}
          <div>
            <AnimateIn delay={0.05}>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#7B61FF]/10 border border-[#7B61FF]/25 text-[#7B61FF] text-xs font-semibold mb-8 tracking-wide uppercase">
                <div className="w-1.5 h-1.5 rounded-full bg-[#7B61FF] animate-pulse" />
                Inteligencia Artificial & Automatización
              </div>
            </AnimateIn>

            <AnimateIn delay={0.1}>
              <h1 className="font-display text-5xl md:text-6xl lg:text-[4.5rem] font-bold leading-[1.04] text-balance mb-6">
                Automatiza lo{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#7B61FF] via-[#00C9C8] to-[#0074D9]">
                  repetitivo.
                </span>
                <br />
                Amplifica lo{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0074D9] to-[#7B61FF]">
                  humano.
                </span>
              </h1>
            </AnimateIn>

            <AnimateIn delay={0.2}>
              <p className="text-lg text-foreground/50 leading-relaxed mb-10 max-w-xl">
                Implementamos agentes IA, flujos de automatización y pipelines de datos para que tu empresa opere 10x más rápido. Sin cambiar tu equipo — potenciandolo.
              </p>
            </AnimateIn>

            <AnimateIn delay={0.3}>
              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href="#contacto"
                  className="group inline-flex items-center justify-center gap-2 px-7 py-4 rounded-xl bg-[#7B61FF] text-white font-semibold text-base hover:bg-[#7B61FF]/85 hover:shadow-2xl hover:shadow-[#7B61FF]/30 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
                >
                  Agendar Demo Gratuita
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </a>
                <a
                  href="#soluciones"
                  className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-xl border border-foreground/10 text-foreground/70 font-semibold text-base hover:bg-foreground/5 hover:text-foreground hover:border-foreground/20 transition-all"
                >
                  Ver soluciones
                </a>
              </div>
            </AnimateIn>

            <AnimateIn delay={0.4}>
              <div className="mt-12 flex flex-wrap gap-6">
                {[
                  { icon: Zap, label: "Prototipo en 7 días" },
                  { icon: Shield, label: "Datos 100% seguros" },
                  { icon: TrendingUp, label: "ROI en el primer mes" },
                ].map((t) => (
                  <div key={t.label} className="flex items-center gap-2 text-sm text-foreground/35">
                    <t.icon className="w-4 h-4 text-[#7B61FF]" />
                    {t.label}
                  </div>
                ))}
              </div>
            </AnimateIn>
          </div>

          {/* Right — live metrics card */}
          <AnimateIn delay={0.25}>
            <div className="hidden lg:block">
              <div className="relative p-1 rounded-2xl bg-gradient-to-br from-[#7B61FF]/30 via-[#00C9C8]/10 to-transparent">
                <div className="rounded-[14px] bg-background p-7">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <p className="text-xs text-foreground/30 uppercase tracking-widest mb-1">IA Activa</p>
                      <p className="font-display text-lg font-bold">Panel de Impacto</p>
                    </div>
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#00C9C8]/10 border border-[#00C9C8]/20">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#00C9C8] animate-pulse" />
                      <span className="text-[10px] text-[#00C9C8] font-semibold">En vivo</span>
                    </div>
                  </div>

                  {/* Metrics */}
                  <div className="space-y-3 mb-6">
                    {[
                      { label: "Tickets atendidos por bot", value: "2,847", change: "+18%", color: "#7B61FF" },
                      { label: "Horas ahorradas esta semana", value: "143h", change: "+32%", color: "#00C9C8" },
                      { label: "Leads calificados por IA", value: "412", change: "+55%", color: "#0074D9" },
                      { label: "Costo por conversión", value: "$1.20", change: "-41%", color: "#F4A261" },
                    ].map((m) => (
                      <div key={m.label} className="flex items-center justify-between p-3 rounded-xl bg-foreground/[0.03] border border-foreground/5">
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: m.color }} />
                          <span className="text-xs text-foreground/50">{m.label}</span>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <span className="font-display font-bold text-sm">{m.value}</span>
                          <span
                            className="text-[10px] font-semibold px-1.5 py-0.5 rounded"
                            style={{
                              color: m.change.startsWith("+") ? "#00C9C8" : "#F4A261",
                              backgroundColor: (m.change.startsWith("+") ? "#00C9C8" : "#F4A261") + "15",
                            }}
                          >
                            {m.change}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Mini bar chart */}
                  <div>
                    <p className="text-[10px] text-foreground/30 uppercase tracking-widest mb-3">Automatizaciones ejecutadas / semana</p>
                    <div className="flex items-end gap-1.5 h-14">
                      {[30, 55, 40, 70, 60, 85, 100].map((h, i) => (
                        <div
                          key={i}
                          className="flex-1 rounded-sm"
                          style={{
                            height: `${h}%`,
                            backgroundColor: i === 6 ? "#7B61FF" : `rgba(123,97,255,${0.15 + i * 0.06})`,
                          }}
                        />
                      ))}
                    </div>
                    <div className="flex justify-between mt-1.5">
                      {["L", "M", "X", "J", "V", "S", "D"].map((d) => (
                        <span key={d} className="text-[9px] text-foreground/20 flex-1 text-center">{d}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </AnimateIn>
        </div>
      </section>

      {/* ── NUMBERS STRIP ───────────────────────────── */}
      <section className="border-y border-foreground/5 py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-foreground/5 rounded-2xl overflow-hidden">
            {[
              { value: "+80", suffix: "%", label: "Reducción en tareas manuales", color: "text-[#7B61FF]" },
              { value: "7", suffix: " días", label: "De diagnostico a primer prototipo", color: "text-[#00C9C8]" },
              { value: "10x", suffix: "", label: "Más contenido con el mismo equipo", color: "text-[#0074D9]" },
              { value: "-41", suffix: "%", label: "Costo promedio por lead en clientes IA", color: "text-[#F4A261]" },
            ].map((s) => (
              <div key={s.label} className="bg-background px-6 py-8 text-center">
                <div className={`font-display text-4xl lg:text-5xl font-bold mb-2 ${s.color}`}>
                  {s.value}<span className="text-2xl">{s.suffix}</span>
                </div>
                <p className="text-xs text-foreground/35 leading-relaxed">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PROBLEMA ────────────────────────────────── */}
      <section className="py-24 border-b border-foreground/5">
        <div className="max-w-7xl mx-auto px-6">
          <AnimateIn>
            <div className="max-w-3xl mb-16">
              <p className="text-[#7B61FF] text-sm font-semibold uppercase tracking-widest mb-4">El Problema</p>
              <h2 className="font-display text-4xl md:text-5xl font-bold text-balance leading-tight">
                Tu equipo pasa horas en tareas que{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#7B61FF] to-[#00C9C8]">
                  una IA puede hacer en segundos.
                </span>
              </h2>
            </div>
          </AnimateIn>

          <div className="grid md:grid-cols-2 gap-6 max-w-5xl">
            <AnimateIn delay={0.1}>
              <div className="p-8 rounded-2xl border border-red-500/15 bg-red-500/3">
                <p className="text-red-400 text-xs font-semibold uppercase tracking-wider mb-6">Sin IA</p>
                <ul className="space-y-4">
                  {[
                    "Responder los mismos mensajes de soporte cada día",
                    "Copiar datos entre Excel, CRM y email manualmente",
                    "Generar reportes que tardan medio día en prepararse",
                    "Perder leads por falta de seguimiento rápido",
                    "Contratar más gente para hacer más de lo mismo",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3 text-sm text-foreground/50">
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
              <div className="p-8 rounded-2xl border border-[#7B61FF]/20 bg-gradient-to-br from-[#7B61FF]/6 to-transparent">
                <p className="text-[#7B61FF] text-xs font-semibold uppercase tracking-wider mb-6">Con Start By Global IA</p>
                <ul className="space-y-4">
                  {[
                    "Agente IA responde el 80% de consultas sin humano",
                    "Datos sincronizados automáticamente entre sistemas",
                    "Reportes generados y enviados solos cada lunes",
                    "Follow-up automático en minutos, no días",
                    "Escala sin contratar — la IA crece contigo",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3 text-sm text-foreground/70">
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

      {/* ── SOLUCIONES ──────────────────────────────── */}
      <section id="soluciones" className="py-24 border-b border-foreground/5">
        <div className="max-w-7xl mx-auto px-6">
          <AnimateIn>
            <div className="mb-16">
              <p className="text-[#7B61FF] text-sm font-semibold uppercase tracking-widest mb-4">Nuestras Soluciones</p>
              <h2 className="font-display text-4xl md:text-5xl font-bold text-balance">
                Cuatro líneas de IA.<br />Un solo equipo.
              </h2>
            </div>
          </AnimateIn>

          <div className="flex flex-col gap-5">
            {services.map((svc, i) => {
              const Icon = svc.icon
              return (
                <AnimateIn key={svc.id} delay={0.07 * i}>
                  <div
                    className={`group relative p-8 md:p-10 rounded-2xl bg-gradient-to-br ${svc.bg} border ${svc.border} transition-all duration-500`}
                  >
                    <div className="grid md:grid-cols-[1fr_auto] gap-8 items-start">
                      <div>
                        {/* Header */}
                        <div className="flex flex-wrap items-center gap-4 mb-6">
                          <div
                            className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                            style={{ backgroundColor: svc.color + "15", border: `1px solid ${svc.color}25` }}
                          >
                            <Icon className="w-6 h-6" style={{ color: svc.color }} />
                          </div>
                          <div>
                            <p className="text-xs font-semibold uppercase tracking-widest text-foreground/30">{svc.badge}</p>
                            <h3 className="font-display text-2xl md:text-3xl font-bold">{svc.title}</h3>
                          </div>
                          <span
                            className="px-3 py-1 rounded-full text-xs font-medium font-mono"
                            style={{ backgroundColor: svc.color + "12", color: svc.color }}
                          >
                            {svc.subtitle}
                          </span>
                        </div>

                        <p className="text-foreground/55 leading-relaxed mb-8 max-w-2xl">{svc.description}</p>

                        <div className="grid sm:grid-cols-2 gap-8">
                          {/* Use cases */}
                          <div>
                            <p className="text-xs uppercase tracking-widest text-foreground/30 mb-3">Casos de Uso</p>
                            <ul className="space-y-2">
                              {svc.useCases.map((u) => (
                                <li key={u} className="flex items-start gap-2 text-xs text-foreground/55">
                                  <div className="w-1 h-1 rounded-full shrink-0 mt-1.5" style={{ backgroundColor: svc.color }} />
                                  {u}
                                </li>
                              ))}
                            </ul>
                          </div>

                          {/* Stack */}
                          <div>
                            <p className="text-xs uppercase tracking-widest text-foreground/30 mb-3">Stack</p>
                            <div className="flex flex-wrap gap-2">
                              {svc.stack.map((s) => (
                                <span key={s} className="px-2.5 py-1 rounded-md bg-foreground/5 border border-foreground/8 text-xs text-foreground/55 font-mono">
                                  {s}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Metric */}
                      <div
                        className="shrink-0 self-center px-6 py-5 rounded-2xl text-center min-w-[160px]"
                        style={{ backgroundColor: svc.color + "10", border: `1px solid ${svc.color}20` }}
                      >
                        <TrendingUp className="w-5 h-5 mx-auto mb-2" style={{ color: svc.color }} />
                        <p className="font-display font-bold text-sm leading-tight" style={{ color: svc.color }}>
                          {svc.metric}
                        </p>
                        <p className="text-[10px] text-foreground/30 mt-1 uppercase tracking-wide">Promedio clientes</p>
                      </div>
                    </div>
                  </div>
                </AnimateIn>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── PROCESO ─────────────────────────────────── */}
      <section id="proceso" className="py-24 border-b border-foreground/5">
        <div className="max-w-7xl mx-auto px-6">
          <AnimateIn>
            <div className="mb-16">
              <p className="text-[#7B61FF] text-sm font-semibold uppercase tracking-widest mb-4">Como trabajamos</p>
              <h2 className="font-display text-4xl md:text-5xl font-bold text-balance">
                De cero a IA funcionando<br />en 4 semanas.
              </h2>
            </div>
          </AnimateIn>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {processSteps.map((step, i) => {
              const Icon = step.icon
              return (
                <AnimateIn key={step.num} delay={0.1 * i}>
                  <div className="relative p-6 rounded-2xl bg-foreground/[0.025] border border-foreground/8 group hover:border-[#7B61FF]/30 transition-all duration-300">
                    <div className="flex items-center gap-3 mb-5">
                      <div className="w-10 h-10 rounded-xl bg-[#7B61FF]/10 border border-[#7B61FF]/20 flex items-center justify-center">
                        <Icon className="w-5 h-5 text-[#7B61FF]" />
                      </div>
                      <span className="font-display text-3xl font-bold text-foreground/8 group-hover:text-[#7B61FF]/20 transition-colors">
                        {step.num}
                      </span>
                    </div>
                    <h3 className="font-display text-lg font-bold mb-3">{step.title}</h3>
                    <p className="text-sm text-foreground/45 leading-relaxed">{step.description}</p>
                    {i < processSteps.length - 1 && (
                      <div className="hidden lg:block absolute top-10 -right-3 w-6 h-px bg-foreground/10" />
                    )}
                  </div>
                </AnimateIn>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── PLANES ──────────────────────────────────── */}
      <section id="planes" className="py-24 border-b border-foreground/5">
        <div className="max-w-7xl mx-auto px-6">
          <AnimateIn>
            <div className="mb-16 text-center">
              <p className="text-[#7B61FF] text-sm font-semibold uppercase tracking-widest mb-4">Inversion</p>
              <h2 className="font-display text-4xl md:text-5xl font-bold text-balance">
                Planes claros. Sin sorpresas.
              </h2>
            </div>
          </AnimateIn>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {plans.map((plan, i) => (
              <AnimateIn key={plan.name} delay={0.1 * i}>
                <div
                  className={`relative flex flex-col p-7 rounded-2xl border transition-all duration-300 h-full ${
                    plan.popular
                      ? "bg-gradient-to-b from-[#7B61FF]/12 to-transparent border-[#7B61FF]/40"
                      : "bg-foreground/[0.025] border-foreground/8 hover:border-foreground/15"
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-[#7B61FF] text-xs font-bold uppercase tracking-wide text-foreground">
                      Más popular
                    </div>
                  )}

                  <div className="mb-6">
                    <h3 className="font-display text-xl font-bold mb-1">{plan.name}</h3>
                    <p className="text-sm text-foreground/40 mb-5">{plan.description}</p>
                    <div className="flex items-baseline gap-1.5">
                      <span className="font-display text-4xl font-bold" style={{ color: plan.color }}>
                        {plan.price}
                      </span>
                      {plan.period && (
                        <span className="text-sm text-foreground/35">/ {plan.period}</span>
                      )}
                    </div>
                  </div>

                  <ul className="space-y-3 mb-8 flex-1">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-center gap-2.5 text-sm text-foreground/65">
                        <CheckCircle2 className="w-4 h-4 shrink-0" style={{ color: plan.color }} />
                        {f}
                      </li>
                    ))}
                  </ul>

                  <a
                    href="#contacto"
                    className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                    style={
                      plan.popular
                        ? { backgroundColor: plan.color, color: "#fff" }
                        : { border: `1px solid ${plan.color}40`, color: plan.color, backgroundColor: `${plan.color}08` }
                    }
                  >
                    {plan.cta}
                    <ArrowRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </AnimateIn>
            ))}
          </div>

          <AnimateIn delay={0.3}>
            <p className="text-center text-xs text-foreground/25 mt-8">
              Todos los planes incluyen NDA, acceso al panel de monitoreo y soporte por Slack.
            </p>
          </AnimateIn>
        </div>
      </section>

      {/* ── TECNOLOGIAS ─────────────────────────────── */}
      <section className="py-16 border-b border-foreground/5">
        <div className="max-w-7xl mx-auto px-6">
          <AnimateIn>
            <p className="text-xs uppercase tracking-widest text-foreground/25 text-center mb-8">
              Trabajamos con las mejores plataformas del mercado
            </p>
          </AnimateIn>
          <div className="flex flex-wrap justify-center gap-3">
            {[
              "OpenAI GPT-4o", "Anthropic Claude", "Google Gemini", "LangChain",
              "Make / Integromat", "N8N", "Zapier", "Supabase",
              "WhatsApp Business API", "Slack API", "HubSpot", "Salesforce",
              "Python / FastAPI", "Vercel AI SDK", "Pinecone", "Notion API",
            ].map((tech) => (
              <span
                key={tech}
                className="px-3 py-1.5 rounded-lg bg-foreground/[0.04] border border-foreground/8 text-xs text-foreground/40 font-mono hover:text-foreground/70 hover:border-foreground/15 transition-colors cursor-default"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ─────────────────────────────────────── */}
      <section id="faq" className="py-24 border-b border-foreground/5">
        <div className="max-w-3xl mx-auto px-6">
          <AnimateIn>
            <div className="mb-12 text-center">
              <p className="text-[#7B61FF] text-sm font-semibold uppercase tracking-widest mb-4">Preguntas Frecuentes</p>
              <h2 className="font-display text-4xl font-bold">Todo lo que necesitas saber.</h2>
            </div>
          </AnimateIn>

          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <AnimateIn key={i} delay={0.05 * i}>
                <div className="rounded-xl border border-foreground/8 overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left hover:bg-foreground/[0.02] transition-colors"
                  >
                    <span className="text-sm font-medium text-foreground/80">{faq.q}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-foreground/40 shrink-0 transition-transform duration-300 ${openFaq === i ? "rotate-180" : ""}`}
                    />
                  </button>
                  {openFaq === i && (
                    <div className="px-6 pb-5 text-sm text-foreground/50 leading-relaxed border-t border-foreground/5 pt-4">
                      {faq.a}
                    </div>
                  )}
                </div>
              </AnimateIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── CONTACTO ────────────────────────────────── */}
      <section id="contacto" className="py-24">
        <div className="max-w-3xl mx-auto px-6">
          <AnimateIn>
            <div className="mb-12 text-center">
              <p className="text-[#7B61FF] text-sm font-semibold uppercase tracking-widest mb-4">Empieza Hoy</p>
              <h2 className="font-display text-4xl md:text-5xl font-bold text-balance mb-4">
                Agenda tu demo gratuita.
              </h2>
              <p className="text-foreground/45 text-lg">
                30 minutos para mostrarte exactamente que podemos automatizar en tu empresa — sin compromiso.
              </p>
            </div>
          </AnimateIn>

          <AnimateIn delay={0.1}>
            {sent ? (
              <div className="p-10 rounded-2xl border border-[#00C9C8]/25 bg-[#00C9C8]/5 text-center">
                <div className="w-14 h-14 rounded-2xl bg-[#00C9C8]/10 border border-[#00C9C8]/20 flex items-center justify-center mx-auto mb-5">
                  <CheckCircle2 className="w-7 h-7 text-[#00C9C8]" />
                </div>
                <h3 className="font-display text-2xl font-bold mb-2">Solicitud recibida</h3>
                <p className="text-foreground/50 text-sm mb-6">
                  Te contactaremos en menos de 24 horas para coordinar la demo. Revisa tu bandeja de entrada.
                </p>
                <button
                  type="button"
                  onClick={() => setSent(false)}
                  className="text-sm text-[#7B61FF] hover:text-foreground transition-colors"
                >
                  Enviar otra solicitud
                </button>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="p-8 rounded-2xl bg-foreground/[0.025] border border-foreground/8 space-y-5"
              >
                <div className="grid sm:grid-cols-2 gap-5">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs text-foreground/40 uppercase tracking-wide">Nombre *</label>
                    <input
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Tu nombre"
                      className="px-4 py-3 rounded-xl bg-foreground/5 border border-foreground/10 text-sm text-foreground placeholder-foreground/20 focus:outline-none focus:border-[#7B61FF]/50 transition-colors"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs text-foreground/40 uppercase tracking-wide">Empresa *</label>
                    <input
                      required
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      placeholder="Nombre de tu empresa"
                      className="px-4 py-3 rounded-xl bg-foreground/5 border border-foreground/10 text-sm text-foreground placeholder-foreground/20 focus:outline-none focus:border-[#7B61FF]/50 transition-colors"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs text-foreground/40 uppercase tracking-wide">Email *</label>
                  <input
                    required
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="tu@empresa.com"
                    className="px-4 py-3 rounded-xl bg-foreground/5 border border-foreground/10 text-sm text-foreground placeholder-foreground/20 focus:outline-none focus:border-[#7B61FF]/50 transition-colors"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs text-foreground/40 uppercase tracking-wide">Que proceso quieres automatizar?</label>
                  <select
                    value={formData.process}
                    onChange={(e) => setFormData({ ...formData, process: e.target.value })}
                    className="px-4 py-3 rounded-xl bg-background border border-foreground/10 text-sm text-foreground/70 focus:outline-none focus:border-[#7B61FF]/50 transition-colors"
                  >
                    <option value="">Selecciona una opción...</option>
                    <option value="Chatbot / Agente IA">Chatbot / Agente IA</option>
                    <option value="Flujos de automatización">Flujos de automatización</option>
                    <option value="Análisis de datos / Reportes IA">Análisis de datos / Reportes IA</option>
                    <option value="Generación de contenido IA">Generación de contenido IA</option>
                    <option value="Varios / No estoy seguro">Varios / No estoy seguro</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs text-foreground/40 uppercase tracking-wide">Cuéntanos más (opcional)</label>
                  <textarea
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Describe brevemente tu proceso actual y el problema que quieres resolver..."
                    className="px-4 py-3 rounded-xl bg-foreground/5 border border-foreground/10 text-sm text-foreground placeholder-foreground/20 focus:outline-none focus:border-[#7B61FF]/50 transition-colors resize-none"
                  />
                </div>

                {formError && (
                  <p className="text-red-400 text-xs px-4 py-2.5 rounded-lg bg-red-500/10 border border-red-500/20">
                    {formError}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={sending}
                  className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-[#7B61FF] text-white font-semibold text-sm hover:bg-[#7B61FF]/85 hover:shadow-xl hover:shadow-[#7B61FF]/25 hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-60 disabled:pointer-events-none"
                >
                  {sending ? (
                    <>
                      <span className="w-4 h-4 border-2 border-foreground/30 border-t-foreground rounded-full animate-spin" />
                      Enviando...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Agendar Demo Gratuita
                    </>
                  )}
                </button>

                <p className="text-center text-xs text-foreground/20">
                  Sin spam. Sin compromiso. Solo una conversacion técnica.
                </p>
              </form>
            )}
          </AnimateIn>
        </div>
      </section>

      {/* ── FOOTER ──────────────────────────────────── */}
      <footer className="border-t border-foreground/5 py-8">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <Link href="/">
            <img src="/logo-black.svg" alt="Start By Global" className="h-6 dark:invert opacity-40 hover:opacity-70 transition-opacity" />
          </Link>
          <div className="flex items-center gap-6 text-xs text-foreground/25">
            <Link href="/outsourcing" className="hover:text-foreground/50 transition-colors">Outsourcing Web</Link>
            <Link href="/servicios" className="hover:text-foreground/50 transition-colors">Servicios</Link>
            <a href="mailto:info@startbyglobal.com" className="hover:text-foreground/50 transition-colors">info@startbyglobal.com</a>
          </div>
          <p className="text-xs text-foreground/20">2026 Start By Global</p>
        </div>
      </footer>
    </div>
  )
}
