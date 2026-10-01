"use client"

import { useRef, useState } from "react"
import Link from "next/link"
import { Check, Send } from "lucide-react"
import { fireLandingLead, landingSession } from "@/lib/track-client"
import { cn } from "@/lib/utils"

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
}

/**
 * Formulario de 3 campos (nombre, WhatsApp o correo, calificación). Envía a
 * /api/landing-lead: registra el lead en Atribución y en el embudo, dispara
 * Lead por píxel + CAPI con event_id compartido y notifica por email.
 */
export function LeadForm({
  landingKey,
  landingName,
  button = "Quiero mi diagnóstico",
  nameLabel = "Nombre",
  contactLabel = "WhatsApp o correo",
  qualifierLabel = "¿Qué necesitas? (web, anuncios, tienda…)",
  successText = "Te contactamos en las próximas 24 horas por la vía que nos dejaste.",
  className,
}: LeadFormProps) {
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
        throw new Error(data.error || "No se pudo enviar.")
      }
      setSent(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo enviar. Escríbenos a info@startbyglobal.com")
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
        <p className="font-display text-xl font-bold">¡Recibido!</p>
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
        {sending ? "Enviando…" : <>{button} <Send className="h-4 w-4" /></>}
      </button>
      <p className="text-center text-[11px] text-muted-foreground">
        Al enviar aceptas nuestra <Link href="/privacidad" className="underline hover:text-foreground">política de privacidad</Link>.
      </p>
    </form>
  )
}
