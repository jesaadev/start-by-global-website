"use client"

import { useRef, useState } from "react"
import Link from "next/link"
import { Check, Send } from "lucide-react"
import { fireLandingLead, landingSession } from "@/lib/track-client"
import type { Locale } from "@/lib/i18n"
import { cn } from "@/lib/utils"

const TEXT = {
  es: {
    button: "Quiero mi diagnóstico",
    name: "Nombre",
    contact: "WhatsApp o correo",
    qualifier: "¿Qué necesitas? (web, anuncios, tienda…)",
    success: "Te contactamos en las próximas 24 horas por la vía que nos dejaste.",
    received: "¡Recibido!",
    sending: "Enviando…",
    error: "No se pudo enviar. Escríbenos a info@startbyglobal.com",
    privacyPre: "Al enviar aceptas nuestra",
    privacy: "política de privacidad",
  },
  en: {
    button: "Get my free quote",
    name: "Name",
    contact: "Email or phone",
    qualifier: "What do you need? (website, ads, store…)",
    success: "We'll get back to you within 24 hours, by the channel you left us.",
    received: "Got it!",
    sending: "Sending…",
    error: "Something went wrong. Email us at info@startbyglobal.com",
    privacyPre: "By submitting you accept our",
    privacy: "privacy policy",
  },
} as const

interface LeadFormProps {
  /** Clave de analítica del embudo (pestaña "Landings" del admin). */
  landingKey: string
  /** Nombre legible para la notificación por email. */
  landingName: string
  button?: string
  nameLabel?: string
  contactLabel?: string
  qualifierLabel?: string
  successText?: string
  className?: string
  locale?: Locale
}

/**
 * Formulario de 3 campos (nombre, WhatsApp o correo, calificación). Envía a
 * /api/landing-lead: registra el lead en Atribución y en el embudo, dispara
 * Lead por píxel + CAPI con event_id compartido y notifica por email.
 */
export function LeadForm({
  landingKey,
  landingName,
  locale = "es",
  button = TEXT[locale].button,
  nameLabel = TEXT[locale].name,
  contactLabel = TEXT[locale].contact,
  qualifierLabel = TEXT[locale].qualifier,
  successText = TEXT[locale].success,
  className,
}: LeadFormProps) {
  const t = TEXT[locale]
  const [name, setName] = useState("")
  const [contact, setContact] = useState("")
  const [qualifier, setQualifier] = useState("")
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState("")
  const hp = useRef<HTMLInputElement>(null)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSending(true)
    setError("")
    try {
      const tracking = fireLandingLead("agenda", `landing:${landingKey}`)
      const res = await fetch("/api/landing-lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          kind: "agenda",
          landing: landingName,
          landingKey,
          session_id: landingSession(),
          name,
          contact,
          qualifier,
          qualifierLabel,
          company_website: hp.current?.value ?? "",
          ...tracking,
        }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        // Los mensajes del servidor están en español.
        throw new Error(locale === "es" && data.error ? data.error : t.error)
      }
      setSent(true)
    } catch (err) {
      setError(err instanceof Error && err.message ? err.message : t.error)
    } finally {
      setSending(false)
    }
  }

  if (sent) {
    return (
      <div className={cn("rounded-2xl border border-border/60 bg-card p-8 text-center", className)}>
        <span className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-chart-3/15">
          <Check className="h-7 w-7 text-chart-3" />
        </span>
        <p className="font-display text-xl font-bold">{t.received}</p>
        <p className="mt-2 text-sm text-muted-foreground">{successText}</p>
      </div>
    )
  }

  const input =
    "w-full rounded-xl border border-border/60 bg-background/60 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary/60 focus:outline-none"

  return (
    <form onSubmit={submit} className={cn("flex flex-col gap-3 rounded-2xl border border-border/60 bg-card p-5 sm:p-6", className)}>
      {/* honeypot anti-bots */}
      <input ref={hp} type="text" name="company_website" tabIndex={-1} autoComplete="off" aria-hidden="true" className="absolute -left-[9999px] h-px w-px opacity-0" />
      <input required aria-label={nameLabel} placeholder={nameLabel} value={name} onChange={(e) => setName(e.target.value)} className={input} autoComplete="name" />
      <input required aria-label={contactLabel} placeholder={contactLabel} value={contact} onChange={(e) => setContact(e.target.value)} className={input} />
      <input required aria-label={qualifierLabel} placeholder={qualifierLabel} value={qualifier} onChange={(e) => setQualifier(e.target.value)} className={input} />
      {error && <p className="text-xs text-destructive">{error}</p>}
      <button
        type="submit"
        disabled={sending}
        className="mt-1 flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3.5 font-bold text-primary-foreground transition-shadow hover:shadow-lg hover:shadow-primary/25 disabled:opacity-60"
      >
        {sending ? t.sending : <>{button} <Send className="h-4 w-4" /></>}
      </button>
      <p className="text-center text-[11px] text-muted-foreground">
        {t.privacyPre} <Link href="/privacidad" className="underline hover:text-foreground">{t.privacy}</Link>.
      </p>
    </form>
  )
}
