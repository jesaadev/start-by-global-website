"use client"

import { useState } from "react"
import Link from "next/link"
import {
  ArrowRight, Globe, ShoppingCart, Megaphone, Send, Menu, X, Plus,
  Check, Gauge, Search, Rocket, PenTool, Code2,
} from "lucide-react"
import { fireLead } from "@/lib/track-client"
import { WEB_FAQS } from "./faqs"

const CALENDLY_URL = "https://calendly.com/startbyglobal"

const TYPES = [
  { icon: Globe, title: "Webs corporativas", desc: "Sitios profesionales que transmiten autoridad y generan confianza en tu marca." },
  { icon: ShoppingCart, title: "Tiendas online (e-commerce)", desc: "Tiendas WooCommerce/Shopify con pagos, catálogo y optimización para vender." },
  { icon: Megaphone, title: "Landing pages", desc: "Páginas de aterrizaje de alta conversión para campañas y captación de leads." },
]

const STEPS = [
  { icon: PenTool, title: "Briefing", desc: "Entendemos tu negocio, objetivos y cliente ideal." },
  { icon: PenTool, title: "Diseño", desc: "UI/UX orientado a conversión, alineado a tu marca." },
  { icon: Code2, title: "Desarrollo", desc: "Sitio rápido, seguro y optimizado (Core Web Vitals)." },
  { icon: Search, title: "SEO", desc: "Base técnica para posicionar en Google desde el día 1." },
  { icon: Rocket, title: "Lanzamiento", desc: "Publicación, medición y soporte post-entrega." },
]

const PLANS = [
  { name: "Web Básica", price: "Desde $400", points: ["Sitio de 1-3 secciones", "Diseño responsive", "SEO on-page básico", "Formulario de contacto"] },
  { name: "Web Profesional", price: "Desde $900", featured: true, points: ["Sitio corporativo multipágina", "Diseño a medida", "SEO técnico + velocidad", "Blog / Insights", "Integraciones y analítica"] },
  { name: "Tienda Online", price: "Desde $1,500", points: ["E-commerce completo", "Pasarela de pagos", "Catálogo y gestión", "Optimización de conversión"] },
]

export function WebContent() {
  const [navOpen, setNavOpen] = useState(false)
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [form, setForm] = useState({ name: "", company: "", email: "", type: "", message: "" })
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const company_website = (new FormData(e.currentTarget as HTMLFormElement).get("company_website") as string) ?? ""
    setSending(true)
    setError("")
    try {
      const tracking = fireLead("contact_form", "web_landing")
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name, email: form.email, company: form.company,
          service: "Desarrollo Web",
          message: `Tipo de web: ${form.type || "no especificado"}\n\n${form.message}`,
          company_website, ...tracking,
        }),
      })
      if (!res.ok) throw new Error()
      setSent(true)
      setForm({ name: "", company: "", email: "", type: "", message: "" })
    } catch {
      setError("Error al enviar. Intenta de nuevo o escribe a info@startbyglobal.com")
    } finally {
      setSending(false)
    }
  }

  const navLinks = [
    { href: "#tipos", label: "Tipos de web" },
    { href: "#proceso", label: "Proceso" },
    { href: "#precios", label: "Precios" },
    { href: "#faq", label: "FAQ" },
  ]

  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      {/* NAVBAR */}
      <nav className="fixed top-0 inset-x-0 z-50 h-16 border-b border-border/60 bg-background/90 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
          <Link href="/" className="flex items-center">
            <img src="/logo-black.svg" alt="Start By Global" className="h-7 dark:invert" />
          </Link>
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((l) => (
              <a key={l.href} href={l.href} className="text-sm text-muted-foreground hover:text-foreground transition-colors animated-underline">{l.label}</a>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <Link href="/" className="hidden md:flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors">Volver al sitio</Link>
            <a href="#contacto" className="hidden md:flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:shadow-lg hover:shadow-primary/25 transition-all">
              Solicitar cotización <ArrowRight className="w-3.5 h-3.5" />
            </a>
            <button type="button" onClick={() => setNavOpen(!navOpen)} className="md:hidden p-2 rounded-lg bg-secondary/60 text-muted-foreground" aria-label="Menú">
              {navOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
        {navOpen && (
          <div className="md:hidden border-t border-border/60 bg-background/95 backdrop-blur-xl">
            <div className="max-w-7xl mx-auto px-6 py-3 flex flex-col gap-1">
              {navLinks.map((l) => (
                <a key={l.href} href={l.href} onClick={() => setNavOpen(false)} className="px-3 py-2.5 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-secondary/50">{l.label}</a>
              ))}
              <Link href="/" onClick={() => setNavOpen(false)} className="px-3 py-2.5 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-secondary/50">Volver al sitio</Link>
            </div>
          </div>
        )}
      </nav>

      {/* HERO */}
      <header className="relative overflow-hidden pt-32 pb-20 px-6">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full blur-[120px] bg-primary/15" />
        <div className="relative max-w-4xl mx-auto text-center flex flex-col items-center gap-6">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20">
            <Globe className="w-3 h-3" /> Diseño y desarrollo web
          </span>
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.05] text-balance">
            Diseño de páginas web en <span className="text-primary">República Dominicana</span>
          </h1>
          <p className="text-muted-foreground text-base sm:text-lg max-w-2xl leading-relaxed">
            Creamos sitios web profesionales, rápidos y optimizados para SEO que convierten visitantes en
            clientes. Webs corporativas, tiendas online y landing pages para empresas en RD, España, LATAM y EE.UU.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <a href="#contacto" className="flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:shadow-lg hover:shadow-primary/25 transition-all">
              Solicitar cotización gratis <ArrowRight className="w-4 h-4" />
            </a>
            <a href={CALENDLY_URL} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-6 py-3 rounded-xl border border-border text-foreground font-semibold text-sm hover:bg-secondary/60 transition-colors">
              Agendar consultoría
            </a>
          </div>
          <p className="text-xs text-muted-foreground">
            <span className="text-foreground font-semibold">Proyectos desde $400.</span> Incluye SEO on-page y optimización de velocidad.
          </p>
        </div>
      </header>

      {/* TIPOS */}
      <section id="tipos" className="px-6 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="max-w-2xl mb-8">
            <h2 className="font-display text-3xl font-bold">¿Qué tipo de web necesitas?</h2>
            <p className="text-muted-foreground mt-2">Diseñamos el activo digital que tu negocio necesita para crecer.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {TYPES.map((t) => {
              const Icon = t.icon
              return (
                <div key={t.title} className="glass-card rounded-2xl p-6 h-full">
                  <div className="flex items-center justify-center w-11 h-11 rounded-xl mb-4 bg-primary/10 border border-primary/20">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground">{t.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed">{t.desc}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* PROCESO */}
      <section id="proceso" className="px-6 py-16 border-y border-border/50">
        <div className="max-w-6xl mx-auto">
          <div className="max-w-2xl mb-8">
            <span className="text-xs uppercase tracking-wider font-semibold text-primary">Cómo trabajamos</span>
            <h2 className="font-display text-3xl font-bold mt-1">Tu web en 5 pasos</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {STEPS.map((s, i) => (
              <div key={s.title} className="glass-card rounded-xl p-5 h-full">
                <span className="font-display text-2xl font-bold text-primary">0{i + 1}</span>
                <h3 className="font-semibold text-foreground mt-1">{s.title}</h3>
                <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRECIOS */}
      <section id="precios" className="px-6 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="max-w-2xl mb-8">
            <h2 className="font-display text-3xl font-bold">Planes y precios</h2>
            <p className="text-muted-foreground mt-2">Inversión transparente. El precio final depende del alcance; te damos una propuesta clara.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {PLANS.map((p) => (
              <div key={p.name} className={`rounded-2xl p-6 h-full flex flex-col border ${p.featured ? "border-primary/40 bg-primary/[0.04]" : "border-border/60 glass-card"}`}>
                {p.featured && <span className="text-[10px] uppercase tracking-wide text-primary font-bold mb-2">Más popular</span>}
                <h3 className="font-semibold text-foreground">{p.name}</h3>
                <p className="font-display text-2xl font-bold text-primary mt-1">{p.price}</p>
                <ul className="mt-4 flex flex-col gap-2">
                  {p.points.map((pt) => (
                    <li key={pt} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <Check className="w-4 h-4 mt-0.5 shrink-0 text-primary" /> {pt}
                    </li>
                  ))}
                </ul>
                <a href="#contacto" className={`mt-5 text-center px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${p.featured ? "bg-primary text-primary-foreground hover:shadow-lg hover:shadow-primary/25" : "border border-border text-foreground hover:bg-secondary/60"}`}>
                  Solicitar
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="px-6 py-16 border-t border-border/50">
        <div className="max-w-3xl mx-auto">
          <h2 className="font-display text-3xl font-bold mb-6">Preguntas frecuentes</h2>
          <div className="flex flex-col gap-2.5">
            {WEB_FAQS.map((f, i) => (
              <div key={f.q} className="glass-card rounded-xl overflow-hidden">
                <button type="button" onClick={() => setOpenFaq(openFaq === i ? null : i)} className="w-full flex items-center justify-between gap-3 px-5 py-4 text-left">
                  <span className="text-sm font-medium text-foreground">{f.q}</span>
                  <Plus className={`w-4 h-4 shrink-0 text-primary transition-transform ${openFaq === i ? "rotate-45" : ""}`} />
                </button>
                {openFaq === i && <p className="px-5 pb-4 text-sm text-muted-foreground leading-relaxed">{f.a}</p>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACTO */}
      <section id="contacto" className="px-6 py-16 border-t border-border/50">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl mb-3 bg-primary/10 border border-primary/20">
              <Gauge className="w-6 h-6 text-primary" />
            </div>
            <h2 className="font-display text-3xl font-bold">Solicita tu cotización gratis</h2>
            <p className="text-muted-foreground mt-2">Cuéntanos tu proyecto y te enviamos una propuesta a medida.</p>
          </div>
          {sent ? (
            <div className="glass-card rounded-2xl p-8 text-center">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-full mb-3 bg-primary/10">
                <Check className="w-7 h-7 text-primary" />
              </div>
              <h3 className="font-display text-xl font-bold">¡Recibido!</h3>
              <p className="text-sm text-muted-foreground mt-2">Te contactamos en menos de 24 horas con tu propuesta.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="glass-card rounded-2xl p-6 flex flex-col gap-4">
              <input type="text" name="company_website" tabIndex={-1} autoComplete="off" aria-hidden="true" style={{ position: "absolute", left: "-9999px", width: 1, height: 1, opacity: 0 }} />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input required aria-label="Nombre" placeholder="Nombre" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="px-4 py-2.5 rounded-lg bg-secondary/50 border border-border/50 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50" />
                <input aria-label="Empresa" placeholder="Empresa" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} className="px-4 py-2.5 rounded-lg bg-secondary/50 border border-border/50 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input required type="email" aria-label="Email" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="px-4 py-2.5 rounded-lg bg-secondary/50 border border-border/50 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50" />
                <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className="px-4 py-2.5 rounded-lg bg-secondary/50 border border-border/50 text-sm text-foreground focus:outline-none focus:border-primary/50 appearance-none">
                  <option value="" className="bg-card text-foreground">Tipo de web...</option>
                  <option value="Corporativa" className="bg-card text-foreground">Web corporativa</option>
                  <option value="E-commerce" className="bg-card text-foreground">Tienda online</option>
                  <option value="Landing" className="bg-card text-foreground">Landing page</option>
                  <option value="Rediseño" className="bg-card text-foreground">Rediseño / optimización</option>
                </select>
              </div>
              <textarea rows={3} aria-label="Mensaje sobre el proyecto" placeholder="Cuéntanos sobre tu proyecto..." value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className="px-4 py-2.5 rounded-lg bg-secondary/50 border border-border/50 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 resize-none" />
              {error && <p className="text-xs text-destructive">{error}</p>}
              <button type="submit" disabled={sending} className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:shadow-lg hover:shadow-primary/25 transition-all disabled:opacity-60">
                {sending ? "Enviando..." : <>Solicitar cotización <Send className="w-4 h-4" /></>}
              </button>
            </form>
          )}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="px-6 py-10 border-t border-border/50">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <Link href="/" className="flex items-center">
            <img src="/logo-black.svg" alt="Start By Global" className="h-6 dark:invert opacity-60 hover:opacity-100 transition-opacity" />
          </Link>
          <p className="text-xs text-muted-foreground">© 2026 Start By Global · Diseño de páginas web</p>
        </div>
      </footer>
    </div>
  )
}
