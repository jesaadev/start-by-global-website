"use client"

import { useState } from "react"
import { CheckCircle, MessageSquare, Send } from "lucide-react"
import { fireLead } from "@/lib/track-client"
import type { Locale } from "@/lib/i18n"

const FIELD =
  "w-full px-4 py-3 rounded-xl bg-background/60 border border-border/60 text-base text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/60 focus:ring-2 focus:ring-primary/15 transition-all"

const BUDGETS = {
  USD: [
    { value: "500-1k", label: "$500 - $1,000" },
    { value: "1k-2.5k", label: "$1,000 - $2,500" },
    { value: "2.5k-5k", label: "$2,500 - $5,000" },
    { value: ">5k", label: { es: "Más de $5,000", en: "More than $5,000" } },
  ],
  RD: [
    { value: "30k-50k", label: "30,000 - 50,000 $RD" },
    { value: "50k-100k", label: "50,000 - 100,000 $RD" },
    { value: ">100k", label: { es: "Más de 100,000 $RD", en: "More than 100,000 $RD" } },
  ],
} as const

const TEXT = {
  es: {
    heading: "Escríbenos",
    name: "Nombre *", namePh: "Tu nombre",
    email: "Email *", emailPh: "tu@email.com",
    company: "Empresa", companyPh: "Tu empresa",
    service: "¿Qué necesitas?", select: "Seleccionar…",
    services: [
      ["web", "Desarrollo Web"], ["marketing", "Publicidad (Google / Meta)"], ["seo", "SEO & Posicionamiento"],
      ["branding", "Branding & Diseño"], ["analytics", "Analítica & Data"], ["automation", "Automatización e IA"],
    ],
    currency: "Moneda", usd: "Dólar (USD)", rd: "Peso dominicano (RD$)",
    budget: "Presupuesto estimado", budgetPh: "Seleccionar rango…",
    message: "Mensaje *", messagePh: "Cuéntanos qué vendes, a quién y qué quieres conseguir…",
    privacyPre: "He leído y acepto la", privacy: "Política de Privacidad",
    send: "Enviar mensaje", sending: "Enviando…",
    sendError: "Error al enviar. Inténtalo de nuevo.",
    connError: "Error de conexión. Revisa tu internet e inténtalo de nuevo.",
    sentTitle: "¡Mensaje enviado!", sentBody: "Gracias por escribirnos. Te respondemos en menos de 24 horas.", again: "Enviar otro mensaje",
  },
  en: {
    heading: "Send us a message",
    name: "Name *", namePh: "Your name",
    email: "Email *", emailPh: "you@company.com",
    company: "Company", companyPh: "Your company",
    service: "What do you need?", select: "Select…",
    services: [
      ["web", "Website design"], ["marketing", "Google & Meta Ads"], ["seo", "SEO"],
      ["branding", "Branding & design"], ["analytics", "Analytics & tracking"], ["automation", "Automation & AI"],
    ],
    currency: "Currency", usd: "US dollar (USD)", rd: "Dominican peso (RD$)",
    budget: "Estimated budget", budgetPh: "Select a range…",
    message: "Message *", messagePh: "Tell us what you sell, who you sell to and what you want to achieve…",
    privacyPre: "I have read and accept the", privacy: "Privacy Policy",
    send: "Send message", sending: "Sending…",
    sendError: "Something went wrong. Please try again.",
    connError: "Connection error. Check your internet and try again.",
    sentTitle: "Message sent!", sentBody: "Thanks for reaching out. We'll get back to you within 24 hours.", again: "Send another message",
  },
} as const

const EMPTY = { name: "", email: "", company: "", service: "", currency: "USD", budget: "", message: "" }

/** Formulario completo de contacto: /api/contact (lead + Lead por píxel/CAPI + email). */
export function ContactForm({ locale = "es" }: { locale?: Locale }) {
  const t = TEXT[locale]
  const [formData, setFormData] = useState(EMPTY)
  const [submitted, setSubmitted] = useState(false)
  const [sending, setSending] = useState(false)
  const [error, setError] = useState("")
  const [accepted, setAccepted] = useState(false)

  const set = (k: keyof typeof EMPTY) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setFormData((f) => ({ ...f, [k]: e.target.value, ...(k === "currency" ? { budget: "" } : {}) }))

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    // Honeypot: leer de forma síncrona antes de cualquier await.
    const company_website = (new FormData(e.currentTarget).get("company_website") as string) ?? ""
    setSending(true)
    setError("")
    try {
      const tracking = fireLead("contact_form")
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, ...tracking, company_website }),
      })
      const data = await res.json()
      if (!res.ok) {
        // Los mensajes del servidor están en español.
        setError(locale === "es" && data.error ? data.error : t.sendError)
        return
      }
      setSubmitted(true)
      setFormData(EMPTY)
      setAccepted(false)
    } catch {
      setError(t.connError)
    } finally {
      setSending(false)
    }
  }

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-16 text-center">
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-chart-3/10">
          <CheckCircle className="h-8 w-8 text-chart-3" />
        </span>
        <h2 className="font-display text-2xl font-bold">{t.sentTitle}</h2>
        <p className="max-w-sm text-base text-muted-foreground">{t.sentBody}</p>
        <button type="button" onClick={() => setSubmitted(false)} className="text-sm font-semibold text-primary hover:underline">
          {t.again}
        </button>
      </div>
    )
  }

  const budgets = BUDGETS[formData.currency as keyof typeof BUDGETS]

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      {/* Honeypot anti-bots: oculto para usuarios reales */}
      <input type="text" name="company_website" tabIndex={-1} autoComplete="off" aria-hidden="true" className="absolute -left-[9999px] h-px w-px opacity-0" />
      <h2 className="font-display text-2xl font-bold flex items-center gap-2.5">
        <MessageSquare className="h-6 w-6 text-primary" />
        {t.heading}
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-medium text-foreground/80">{t.name}</span>
          <input required type="text" autoComplete="name" value={formData.name} onChange={set("name")} className={FIELD} placeholder={t.namePh} />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-medium text-foreground/80">{t.email}</span>
          <input required type="email" autoComplete="email" value={formData.email} onChange={set("email")} className={FIELD} placeholder={t.emailPh} />
        </label>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-medium text-foreground/80">{t.company}</span>
          <input type="text" autoComplete="organization" value={formData.company} onChange={set("company")} className={FIELD} placeholder={t.companyPh} />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-medium text-foreground/80">{t.service}</span>
          <select value={formData.service} onChange={set("service")} className={`${FIELD} appearance-none`}>
            <option value="" className="bg-card">{t.select}</option>
            {t.services.map(([v, l]) => (
              <option key={v} value={v} className="bg-card">{l}</option>
            ))}
          </select>
        </label>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* En inglés solo se cotiza en USD */}
        {locale === "es" && (
          <label className="flex flex-col gap-1.5">
            <span className="text-sm font-medium text-foreground/80">{t.currency}</span>
            <select value={formData.currency} onChange={set("currency")} className={`${FIELD} appearance-none`}>
              <option value="USD" className="bg-card">{t.usd}</option>
              <option value="RD" className="bg-card">{t.rd}</option>
            </select>
          </label>
        )}
        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-medium text-foreground/80">{t.budget}</span>
          <select value={formData.budget} onChange={set("budget")} className={`${FIELD} appearance-none`}>
            <option value="" className="bg-card">{t.budgetPh}</option>
            {budgets.map((o) => (
              <option key={o.value} value={o.value} className="bg-card">
                {typeof o.label === "string" ? o.label : o.label[locale]}
              </option>
            ))}
          </select>
        </label>
      </div>

      <label className="flex flex-col gap-1.5">
        <span className="text-sm font-medium text-foreground/80">{t.message}</span>
        <textarea required rows={5} value={formData.message} onChange={set("message")} className={`${FIELD} resize-none`} placeholder={t.messagePh} />
      </label>

      <label className="flex items-start gap-2.5 text-sm text-muted-foreground leading-relaxed">
        <input type="checkbox" required checked={accepted} onChange={(e) => setAccepted(e.target.checked)} className="mt-1 accent-primary" />
        <span>
          {t.privacyPre}{" "}
          <a href="/privacidad" target="_blank" className="text-primary hover:underline">{t.privacy}</a>.
        </span>
      </label>

      {error && (
        <div className="rounded-xl border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive">{error}</div>
      )}

      <button
        type="submit"
        disabled={sending || !accepted}
        className="flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-4 text-base font-bold text-primary-foreground transition-all hover:shadow-lg hover:shadow-primary/25 disabled:pointer-events-none disabled:opacity-60"
      >
        {sending ? (
          <>
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground" />
            {t.sending}
          </>
        ) : (
          <>
            <Send className="h-4 w-4" />
            {t.send}
          </>
        )}
      </button>
    </form>
  )
}

/** Abre el chat del sitio (widget global). */
export function OpenChatButton({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <button
      type="button"
      className={className}
      onClick={() => (window as unknown as { openChatWidget?: () => void }).openChatWidget?.()}
    >
      {children}
    </button>
  )
}
