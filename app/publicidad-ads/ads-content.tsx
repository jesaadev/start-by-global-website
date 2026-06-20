"use client"

import { useState } from "react"
import Link from "next/link"
import {
  ArrowRight, Target, TrendingUp, Megaphone, Search, Music2, Linkedin,
  Send, Menu, X, Plus, BarChart3, Gauge, Crosshair,
} from "lucide-react"
import { fireLead } from "@/lib/track-client"

// Gama propia de la landing de Ads: rose + orange + amber (energía "performance").
const ACCENT = "#F43F5E"
// Texto de acento con contraste WCAG AA: rose-600 en claro, rose-400 en oscuro.
const ACCENT_TEXT = "text-rose-600 dark:text-rose-400"

const PLATFORMS = [
  { icon: Megaphone, name: "Meta Ads", desc: "Facebook e Instagram: prospección y retargeting que llenan tu pipeline." },
  { icon: Search, name: "Google Ads", desc: "Búsqueda, Display y Performance Max para captar demanda activa." },
  { icon: Music2, name: "TikTok Ads", desc: "Creatividades nativas que escalan alcance con CPA bajo." },
  { icon: Linkedin, name: "LinkedIn Ads", desc: "Segmentación B2B por cargo, sector y empresa para ticket alto." },
]

const STEPS = [
  { icon: Search, title: "Auditoría", desc: "Revisamos cuentas, datos y embudo. Encontramos dónde se fuga el presupuesto." },
  { icon: Crosshair, title: "Estrategia", desc: "Definimos públicos, oferta, creatividades y objetivos por plataforma." },
  { icon: Megaphone, title: "Campañas", desc: "Lanzamos con tracking (pixel + CAPI) y estructura lista para escalar." },
  { icon: Gauge, title: "Optimización", desc: "Iteramos por datos: bajamos CPA y subimos ROAS semana a semana." },
]

const RESULTS = [
  { value: "300%", label: "ROI promedio" },
  { value: "-35%", label: "CPA tras optimizar" },
  { value: "+4", label: "Países" },
  { value: "24/7", label: "Medición y reportes" },
]

const FAQS = [
  { q: "¿Cuál es la inversión mínima?", a: "Nuestra gestión arranca desde $400/mes (fee), aparte del presupuesto que destines a las plataformas. Te recomendamos el pauta mínima según tu objetivo en la auditoría." },
  { q: "¿En cuánto tiempo veo resultados?", a: "Las primeras señales (CTR, CPC, leads) llegan en 1-2 semanas; la optimización de CPA/ROAS madura entre 4 y 8 semanas según volumen de datos." },
  { q: "¿Quién es dueño de las cuentas?", a: "Tú. Trabajamos sobre tus cuentas de Meta/Google con acceso de socio; tus datos y activos siempre son tuyos." },
  { q: "¿Incluyen creatividades?", a: "Sí. Producimos copies y piezas orientadas a conversión, y montamos pruebas A/B para encontrar las ganadoras." },
]

export function AdsContent() {
  const [navOpen, setNavOpen] = useState(false)
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [form, setForm] = useState({ name: "", company: "", email: "", budget: "", message: "" })
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSending(true)
    setError("")
    try {
      const tracking = fireLead("contact_form", "ads")
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          company: form.company,
          budget: form.budget,
          service: "Publicidad Digital / Ads",
          message: form.message,
          ...tracking,
        }),
      })
      if (!res.ok) throw new Error()
      setSent(true)
      setForm({ name: "", company: "", email: "", budget: "", message: "" })
    } catch {
      setError("Error al enviar. Intenta de nuevo o escribe a info@startbyglobal.com")
    } finally {
      setSending(false)
    }
  }

  const navLinks = [
    { href: "#plataformas", label: "Plataformas" },
    { href: "#proceso", label: "Proceso" },
    { href: "#faq", label: "FAQ" },
  ]

  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      {/* NAVBAR */}
      <nav className="fixed top-0 inset-x-0 z-50 h-16 border-b border-foreground/5 bg-background/90 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
          <Link href="/" className="flex items-center">
            <img src="/logo-black.svg" alt="Start By Global" className="h-7 dark:invert" />
          </Link>
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((l) => (
              <a key={l.href} href={l.href} className="text-sm text-muted-foreground hover:text-foreground transition-colors animated-underline">
                {l.label}
              </a>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <Link href="/" className="hidden md:flex items-center text-sm text-muted-foreground hover:text-foreground/70 transition-colors">
              Volver al sitio
            </Link>
            <a
              href="#contacto"
              className="hidden md:flex items-center gap-2 px-5 py-2.5 rounded-lg text-white text-sm font-semibold transition-all hover:shadow-lg"
              style={{ backgroundColor: ACCENT, boxShadow: `0 0 0 0 ${ACCENT}` }}
            >
              Solicitar auditoría <ArrowRight className="w-3.5 h-3.5" />
            </a>
            <button type="button" onClick={() => setNavOpen(!navOpen)} className="md:hidden p-2 rounded-lg bg-foreground/5 text-foreground/70" aria-label="Menú">
              {navOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
        {navOpen && (
          <div className="md:hidden border-t border-foreground/5 bg-background/95 backdrop-blur-xl">
            <div className="max-w-7xl mx-auto px-6 py-3 flex flex-col gap-1">
              {navLinks.map((l) => (
                <a key={l.href} href={l.href} onClick={() => setNavOpen(false)} className="px-3 py-2.5 rounded-lg text-sm text-foreground/60 hover:text-foreground hover:bg-foreground/5">
                  {l.label}
                </a>
              ))}
              <Link href="/" onClick={() => setNavOpen(false)} className="px-3 py-2.5 rounded-lg text-sm text-foreground/60 hover:text-foreground hover:bg-foreground/5">
                Volver al sitio
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* HERO */}
      <header className="relative overflow-hidden pt-32 pb-20 px-6">
        <div
          className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full blur-[120px] opacity-20"
          style={{ background: `radial-gradient(circle, ${ACCENT}, transparent 70%)` }}
        />
        <div className="relative max-w-4xl mx-auto text-center flex flex-col items-center gap-6">
          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${ACCENT_TEXT}`}
            style={{ backgroundColor: `${ACCENT}1a`, border: `1px solid ${ACCENT}40` }}
          >
            <Target className="w-3 h-3" /> Publicidad de performance
          </span>
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.05] text-balance">
            Deja de quemar dinero en Ads.{" "}
            <span style={{ color: ACCENT }}>Genera clientes, no clics.</span>
          </h1>
          <p className="text-foreground/60 text-base sm:text-lg max-w-2xl leading-relaxed">
            Campañas de Meta, Google, TikTok y LinkedIn con estrategia, creatividades que convierten y
            medición real (pixel + CAPI). Pauta que se paga sola.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <a href="#contacto" className="flex items-center gap-2 px-6 py-3 rounded-xl text-white font-semibold text-sm transition-all hover:shadow-lg" style={{ backgroundColor: ACCENT }}>
              Solicitar auditoría gratuita <ArrowRight className="w-4 h-4" />
            </a>
            <a href="#proceso" className="flex items-center gap-2 px-6 py-3 rounded-xl border border-foreground/15 text-foreground font-semibold text-sm hover:bg-foreground/5 transition-colors">
              Ver cómo trabajamos
            </a>
          </div>
          <p className="text-xs text-muted-foreground">
            <span className="text-foreground font-semibold">Gestión desde $400/mes.</span> Para empresas listas para escalar su inversión.
          </p>
        </div>
      </header>

      {/* RESULTADOS */}
      <section className="px-6 pb-8">
        <div className="max-w-5xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-3">
          {RESULTS.map((r) => (
            <div key={r.label} className="rounded-xl border border-foreground/10 bg-foreground/[0.03] p-5 text-center">
              <p className="font-display text-3xl font-bold" style={{ color: ACCENT }}>{r.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{r.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* PLATAFORMAS */}
      <section id="plataformas" className="px-6 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="max-w-2xl mb-8">
            <h2 className="font-display text-3xl font-bold">Pautamos donde está tu cliente</h2>
            <p className="text-muted-foreground mt-2">Estrategia y ejecución por plataforma, con un solo objetivo: rentabilidad.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {PLATFORMS.map((p) => {
              const Icon = p.icon
              return (
                <div key={p.name} className="rounded-2xl border border-foreground/10 bg-foreground/[0.03] p-6 hover:border-foreground/20 transition-colors h-full">
                  <div className="flex items-center justify-center w-11 h-11 rounded-xl mb-4" style={{ backgroundColor: `${ACCENT}1a`, border: `1px solid ${ACCENT}33` }}>
                    <Icon className="w-5 h-5" style={{ color: ACCENT }} />
                  </div>
                  <h3 className="font-semibold text-foreground">{p.name}</h3>
                  <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed">{p.desc}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* PROCESO */}
      <section id="proceso" className="px-6 py-16 border-y border-foreground/5">
        <div className="max-w-6xl mx-auto">
          <div className="max-w-2xl mb-8">
            <span className={`text-xs uppercase tracking-wider font-semibold ${ACCENT_TEXT}`}>Cómo trabajamos</span>
            <h2 className="font-display text-3xl font-bold mt-1">De la auditoría al ROI</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {STEPS.map((s, i) => {
              const Icon = s.icon
              return (
                <div key={s.title} className="rounded-2xl border border-foreground/10 bg-foreground/[0.03] p-6 h-full">
                  <div className="flex items-center justify-between mb-3">
                    <Icon className="w-6 h-6" style={{ color: ACCENT }} />
                    <span className="font-display text-3xl font-bold text-foreground/15">0{i + 1}</span>
                  </div>
                  <h3 className="font-semibold text-foreground">{s.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed">{s.desc}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="px-6 py-16">
        <div className="max-w-3xl mx-auto">
          <h2 className="font-display text-3xl font-bold mb-6">Preguntas frecuentes</h2>
          <div className="flex flex-col gap-2.5">
            {FAQS.map((f, i) => (
              <div key={f.q} className="rounded-xl border border-foreground/10 bg-foreground/[0.03] overflow-hidden">
                <button
                  type="button"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between gap-3 px-5 py-4 text-left"
                >
                  <span className="text-sm font-medium text-foreground">{f.q}</span>
                  <Plus className={`w-4 h-4 shrink-0 transition-transform ${openFaq === i ? "rotate-45" : ""}`} style={{ color: ACCENT }} />
                </button>
                {openFaq === i && <p className="px-5 pb-4 text-sm text-foreground/60 leading-relaxed">{f.a}</p>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACTO */}
      <section id="contacto" className="px-6 py-16 border-t border-foreground/5">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl mb-3" style={{ backgroundColor: `${ACCENT}1a`, border: `1px solid ${ACCENT}33` }}>
              <BarChart3 className="w-6 h-6" style={{ color: ACCENT }} />
            </div>
            <h2 className="font-display text-3xl font-bold">Solicita tu auditoría gratuita</h2>
            <p className="text-muted-foreground mt-2">Revisamos tus cuentas y te decimos dónde está el dinero.</p>
          </div>

          {sent ? (
            <div className="rounded-2xl border border-foreground/10 bg-foreground/[0.03] p-8 text-center">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-full mb-3" style={{ backgroundColor: `${ACCENT}1a` }}>
                <TrendingUp className="w-7 h-7" style={{ color: ACCENT }} />
              </div>
              <h3 className="font-display text-xl font-bold">¡Recibido!</h3>
              <p className="text-sm text-foreground/60 mt-2">Te contactamos en menos de 24 horas con los próximos pasos.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="rounded-2xl border border-foreground/10 bg-foreground/[0.03] p-6 flex flex-col gap-4">
              <input type="text" name="company_website" tabIndex={-1} autoComplete="off" aria-hidden="true" style={{ position: "absolute", left: "-9999px", width: 1, height: 1, opacity: 0 }} />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input required placeholder="Nombre" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="px-4 py-2.5 rounded-lg bg-foreground/5 border border-foreground/10 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-foreground/30" />
                <input placeholder="Empresa" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} className="px-4 py-2.5 rounded-lg bg-foreground/5 border border-foreground/10 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-foreground/30" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input required type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="px-4 py-2.5 rounded-lg bg-foreground/5 border border-foreground/10 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-foreground/30" />
                <select value={form.budget} onChange={(e) => setForm({ ...form, budget: e.target.value })} className="px-4 py-2.5 rounded-lg bg-foreground/5 border border-foreground/10 text-sm text-foreground focus:outline-none focus:border-foreground/30 appearance-none">
                  <option value="">Presupuesto mensual de pauta...</option>
                  <option value="<500">Menos de $500</option>
                  <option value="500-2000">$500 - $2,000</option>
                  <option value="2000-5000">$2,000 - $5,000</option>
                  <option value=">5000">Más de $5,000</option>
                </select>
              </div>
              <textarea rows={3} placeholder="¿Qué vendes y cuál es tu objetivo?" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className="px-4 py-2.5 rounded-lg bg-foreground/5 border border-foreground/10 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-foreground/30 resize-none" />
              {error && <p className="text-xs text-destructive">{error}</p>}
              <button type="submit" disabled={sending} className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-white font-semibold text-sm transition-all hover:shadow-lg disabled:opacity-60" style={{ backgroundColor: ACCENT }}>
                {sending ? "Enviando..." : <>Solicitar auditoría <Send className="w-4 h-4" /></>}
              </button>
            </form>
          )}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="px-6 py-10 border-t border-foreground/5">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <Link href="/" className="flex items-center">
            <img src="/logo-black.svg" alt="Start By Global" className="h-6 dark:invert opacity-60 hover:opacity-100 transition-opacity" />
          </Link>
          <p className="text-xs text-muted-foreground">© 2026 Start By Global · Publicidad Digital & Ads</p>
        </div>
      </footer>
    </div>
  )
}
