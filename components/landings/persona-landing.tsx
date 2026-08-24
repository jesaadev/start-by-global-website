"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { ArrowRight, Check, Plus, Send, Lock } from "lucide-react"
import { fireLandingLead, fireViewContent, fireScroll75, landingSession } from "@/lib/track-client"
import type { PersonaLandingData } from "@/lib/persona-landings"

// Plantilla común de las landings por persona: arquitectura fija de 9 bloques.
// Navegación reducida (logo + 1 CTA), un solo camino de salida, indexable.

export function PersonaLanding({ data }: { data: PersonaLandingData }) {
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  // Bloque 1: ViewContent al cargar. Bloque de medición: Scroll75 una vez.
  useEffect(() => {
    fireViewContent(data.segment)
    let fired = false
    const onScroll = () => {
      if (fired) return
      const scrolled = window.scrollY + window.innerHeight
      const total = document.documentElement.scrollHeight
      if (total > 0 && scrolled / total >= 0.75) {
        fired = true
        fireScroll75(data.segment)
        window.removeEventListener("scroll", onScroll)
      }
    }
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [data.segment])

  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      {/* NAVBAR reducido: logo + un solo CTA, sin menú */}
      <nav className="fixed top-0 inset-x-0 z-50 h-16 border-b border-border/60 bg-background/90 backdrop-blur-xl">
        <div className="max-w-5xl mx-auto px-6 h-full flex items-center justify-between">
          <Link href="/" className="flex items-center" aria-label="Start By Global">
            <img src="/logo-black.svg" alt="Start By Global" className="h-7 dark:invert" />
          </Link>
          <a href="#contacto" className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:shadow-lg hover:shadow-primary/25 transition-all">
            {data.hero.ctaLabel} <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </div>
      </nav>

      {/* BLOQUE 1 — Encabezado */}
      <header className="relative overflow-hidden pt-32 pb-20 px-6">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full blur-[120px] bg-primary/20" />
        <div className="absolute -top-10 left-0 w-[380px] h-[380px] rounded-full blur-[120px] bg-chart-2/10" />
        <div className="relative max-w-4xl mx-auto text-center flex flex-col items-center gap-7">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-primary/15 text-primary border border-primary/25 uppercase tracking-wide">
            {data.hero.badge}
          </span>
          <h1 className="font-display text-[2.6rem] leading-[1.03] sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-balance">
            {data.hero.h1}
          </h1>
          <p className="text-lg sm:text-2xl text-foreground/80 max-w-2xl leading-relaxed font-medium">
            {data.hero.subtitle}
          </p>
          <a href="#contacto" className="group flex items-center gap-2 px-8 py-4 rounded-2xl bg-primary text-primary-foreground font-bold text-base shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/40 hover:-translate-y-0.5 transition-all">
            {data.hero.ctaLabel} <ArrowRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
          </a>
          <p className="text-sm text-muted-foreground max-w-md">{data.hero.microcopy}</p>
        </div>
      </header>

      {/* BLOQUE 2 — Espejo del dolor */}
      <section className="px-6 py-16">
        <div className="max-w-3xl mx-auto">
          <h2 className="font-display text-3xl sm:text-4xl font-bold mb-8 tracking-tight text-balance">{data.pain.h2}</h2>
          <ul className="flex flex-col gap-4">
            {data.pain.bullets.map((b) => (
              <li key={b} className="flex items-start gap-3.5 text-base sm:text-lg text-foreground/85 leading-relaxed">
                <span className="mt-2.5 w-2 h-2 rounded-full bg-primary shrink-0" />
                <span>{b}</span>
              </li>
            ))}
          </ul>
          {data.pain.closing && (
            <p className="mt-8 text-lg sm:text-xl font-semibold text-foreground bg-primary/[0.06] border-l-4 border-primary rounded-r-xl py-4 pl-5 pr-4 text-balance">{data.pain.closing}</p>
          )}
        </div>
      </section>

      {/* BLOQUE 3 — Mecanismo */}
      <section className="px-6 py-14 border-y border-border/50">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-display text-3xl sm:text-4xl font-bold mb-10 max-w-2xl tracking-tight text-balance">{data.mechanism.h2}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {data.mechanism.items.map((it) => (
              <div key={it.title} className="glass-card rounded-2xl p-7 hover:border-primary/30 transition-colors">
                <h3 className="font-display text-lg font-bold text-foreground">{it.title}</h3>
                <p className="text-base text-foreground/70 mt-2 leading-relaxed">{it.desc}</p>
              </div>
            ))}
          </div>
          {/* CTA repetido */}
          <div className="mt-10 flex justify-center">
            <a href="#contacto" className="group flex items-center gap-2 px-8 py-4 rounded-2xl bg-primary text-primary-foreground font-bold text-base shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/40 hover:-translate-y-0.5 transition-all">
              {data.hero.ctaLabel} <ArrowRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
            </a>
          </div>
        </div>
      </section>

      {/* BLOQUE 4 — Qué incluye */}
      <section className="px-6 py-14">
        <div className="max-w-3xl mx-auto">
          <h2 className="font-display text-3xl sm:text-4xl font-bold mb-8 tracking-tight text-balance">{data.includes.h2}</h2>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
            {data.includes.bullets.map((b) => (
              <li key={b} className="flex items-start gap-3 text-base text-foreground/85">
                <Check className="w-5 h-5 mt-0.5 shrink-0 text-primary" />
                <span className="leading-relaxed">{b}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* BLOQUE 5 — Prueba (de método, bloqueada hasta dato real) */}
      <section className="px-6 py-14 border-y border-border/50">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-2 mb-2">
            <Lock className="w-4 h-4 text-muted-foreground" />
            <span className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">Prueba de método</span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-bold mb-8 tracking-tight text-balance">{data.proof.h2}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {data.proof.bullets.map((b) => (
              <div key={b} className="glass-card rounded-xl p-6 text-base text-foreground/80 leading-relaxed">{b}</div>
            ))}
          </div>
        </div>
      </section>

      {/* BLOQUE 6 — Objeciones / FAQ */}
      <section className="px-6 py-14">
        <div className="max-w-3xl mx-auto">
          <h2 className="font-display text-3xl sm:text-4xl font-bold mb-8 tracking-tight text-balance">Preguntas frecuentes</h2>
          <div className="flex flex-col gap-2.5">
            {data.faqs.map((f, i) => (
              <div key={f.q} className="glass-card rounded-xl overflow-hidden">
                <button type="button" onClick={() => setOpenFaq(openFaq === i ? null : i)} className="w-full flex items-center justify-between gap-3 px-5 py-4 text-left">
                  <span className="text-base font-semibold text-foreground">{f.q}</span>
                  <Plus className={`w-4 h-4 shrink-0 text-primary transition-transform ${openFaq === i ? "rotate-45" : ""}`} />
                </button>
                {openFaq === i && <p className="px-5 pb-4 text-sm text-muted-foreground leading-relaxed">{f.a}</p>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BLOQUE 7 — Cómo trabajamos */}
      <section className="px-6 py-14 border-y border-border/50">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-display text-3xl sm:text-4xl font-bold mb-10 tracking-tight text-balance">Cómo trabajamos</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {data.process.steps.map((s, i) => (
              <div key={s.title} className="glass-card rounded-xl p-5">
                <span className="font-display text-2xl font-bold text-primary">0{i + 1}</span>
                <h3 className="font-semibold text-foreground mt-1">{s.title}</h3>
                <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BLOQUE 8 — CTA final + formulario */}
      <AgendaForm data={data} />

      {/* BLOQUE 9 — Descargable (lead magnet) */}
      <LeadMagnet data={data} />

      {/* FOOTER minimal */}
      <footer className="px-6 py-10 border-t border-border/50">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <Link href="/" className="flex items-center">
            <img src="/logo-black.svg" alt="Start By Global" className="h-6 dark:invert opacity-60 hover:opacity-100 transition-opacity" />
          </Link>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <Link href="/privacidad" className="hover:text-foreground transition-colors">Privacidad</Link>
            <span>© 2026 Start By Global</span>
          </div>
        </div>
      </footer>
    </div>
  )
}

// ── Bloque 8: formulario de agenda (3 campos: nombre, contacto, calificación) ──
function AgendaForm({ data }: { data: PersonaLandingData }) {
  const [name, setName] = useState("")
  const [contact, setContact] = useState("")
  const [qualifier, setQualifier] = useState("")
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState("")
  const hp = useRef<HTMLInputElement>(null)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSending(true); setError("")
    try {
      const tracking = fireLandingLead("agenda", `landing:${data.segment}`)
      const res = await fetch("/api/landing-lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          kind: "agenda", landing: data.persona, landingKey: data.segment,
          session_id: landingSession(),
          name, contact, qualifier, qualifierLabel: data.form.qualifierLabel,
          company_website: hp.current?.value ?? "",
          ...tracking,
        }),
      })
      if (!res.ok) throw new Error()
      setSent(true)
    } catch {
      setError("No se pudo enviar. Escribinos a info@startbyglobal.com")
    } finally {
      setSending(false)
    }
  }

  return (
    <section id="contacto" className="px-6 py-16 scroll-mt-20">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-balance">{data.form.h2}</h2>
          <p className="text-base sm:text-lg text-foreground/75 mt-3 leading-relaxed">{data.form.text}</p>
        </div>
        {sent ? (
          <div className="glass-card rounded-2xl p-8 text-center">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full mb-3 bg-primary/10">
              <Check className="w-7 h-7 text-primary" />
            </div>
            <h3 className="font-display text-xl font-bold">¡Recibido!</h3>
            <p className="text-sm text-muted-foreground mt-2">Te contactamos en las próximas 24 horas para coordinar el diagnóstico.</p>
          </div>
        ) : (
          <form onSubmit={submit} className="glass-card rounded-2xl p-6 flex flex-col gap-4">
            <input ref={hp} type="text" name="company_website" tabIndex={-1} autoComplete="off" aria-hidden="true" style={{ position: "absolute", left: "-9999px", width: 1, height: 1, opacity: 0 }} />
            <input required aria-label={data.form.nameLabel} placeholder={data.form.nameLabel} value={name} onChange={(e) => setName(e.target.value)}
              className="px-4 py-2.5 rounded-lg bg-secondary/50 border border-border/50 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50" />
            <input required aria-label={data.form.contactLabel} placeholder={data.form.contactLabel} value={contact} onChange={(e) => setContact(e.target.value)}
              className="px-4 py-2.5 rounded-lg bg-secondary/50 border border-border/50 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50" />
            <input required aria-label={data.form.qualifierLabel} placeholder={data.form.qualifierLabel} value={qualifier} onChange={(e) => setQualifier(e.target.value)}
              className="px-4 py-2.5 rounded-lg bg-secondary/50 border border-border/50 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50" />
            {error && <p className="text-xs text-destructive">{error}</p>}
            <button type="submit" disabled={sending} className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:shadow-lg hover:shadow-primary/25 transition-all disabled:opacity-60">
              {sending ? "Enviando..." : <>{data.form.button} <Send className="w-4 h-4" /></>}
            </button>
            <p className="text-[11px] text-muted-foreground text-center">
              Al enviar aceptás nuestra <Link href="/privacidad" className="underline hover:text-foreground">política de privacidad</Link>.
            </p>
          </form>
        )}
      </div>
    </section>
  )
}

// ── Bloque 9: lead magnet (captura de correo, jerarquía visual menor) ──
function LeadMagnet({ data }: { data: PersonaLandingData }) {
  const [email, setEmail] = useState("")
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState("")
  const hp = useRef<HTMLInputElement>(null)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSending(true); setError("")
    try {
      const tracking = fireLandingLead("lead_magnet", `lead_magnet:${data.segment}`)
      const res = await fetch("/api/landing-lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          kind: "lead_magnet", landing: data.persona, landingKey: data.segment,
          session_id: landingSession(), contact: email,
          asset: data.leadMagnet.asset,
          company_website: hp.current?.value ?? "",
          ...tracking,
        }),
      })
      if (!res.ok) throw new Error()
      setSent(true)
    } catch {
      setError("No se pudo enviar. Intentá de nuevo.")
    } finally {
      setSending(false)
    }
  }

  return (
    <section className="px-6 pb-16">
      <div className="max-w-2xl mx-auto rounded-2xl border border-border/60 bg-secondary/20 p-6 sm:p-7">
        <h3 className="font-semibold text-foreground">{data.leadMagnet.h3}</h3>
        <p className="text-sm text-muted-foreground mt-1 mb-4">{data.leadMagnet.desc}</p>
        {sent ? (
          <p className="text-sm text-primary font-medium flex items-center gap-2">
            <Check className="w-4 h-4" /> ¡Listo! Te lo enviamos a tu correo en breve.
          </p>
        ) : (
          <form onSubmit={submit} className="flex flex-col sm:flex-row gap-3">
            <input ref={hp} type="text" name="company_website" tabIndex={-1} autoComplete="off" aria-hidden="true" style={{ position: "absolute", left: "-9999px", width: 1, height: 1, opacity: 0 }} />
            <input required type="email" aria-label="Correo" placeholder="Tu correo" value={email} onChange={(e) => setEmail(e.target.value)}
              className="flex-1 px-4 py-2.5 rounded-lg bg-background border border-border/50 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50" />
            <button type="submit" disabled={sending} className="px-5 py-2.5 rounded-lg border border-border text-foreground font-medium text-sm hover:bg-secondary/60 transition-colors disabled:opacity-60 whitespace-nowrap">
              {sending ? "Enviando..." : data.leadMagnet.button}
            </button>
          </form>
        )}
        {error && <p className="text-xs text-destructive mt-2">{error}</p>}
      </div>
    </section>
  )
}
