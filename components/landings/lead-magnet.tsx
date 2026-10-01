"use client"

import { useRef, useState } from "react"
import { Check, Download } from "lucide-react"
import { fireLandingLead, landingSession } from "@/lib/track-client"
import type { PersonaLandingData } from "@/lib/persona-landings"

/**
 * Bloque 9: descargable para el visitante que aún no quiere hablar. Captura el
 * correo (CompleteRegistration por píxel + CAPI) con jerarquía visual menor que
 * el formulario de agenda.
 */
export function LeadMagnet({ data }: { data: PersonaLandingData }) {
  const [email, setEmail] = useState("")
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState("")
  const hp = useRef<HTMLInputElement>(null)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSending(true)
    setError("")
    try {
      const tracking = fireLandingLead("lead_magnet", `lead_magnet:${data.segment}`)
      const res = await fetch("/api/landing-lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          kind: "lead_magnet",
          landing: data.persona,
          landingKey: data.segment,
          session_id: landingSession(),
          contact: email,
          asset: data.leadMagnet.asset,
          company_website: hp.current?.value ?? "",
          ...tracking,
        }),
      })
      if (!res.ok) throw new Error()
      setSent(true)
    } catch {
      setError("No se pudo enviar. Inténtalo de nuevo.")
    } finally {
      setSending(false)
    }
  }

  return (
    <section className="max-w-3xl mx-auto px-4 sm:px-6 pb-16">
      <div className="rounded-2xl border border-border/60 bg-secondary/20 p-6 sm:p-7">
        <div className="flex items-start gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Download className="h-5 w-5" />
          </span>
          <div>
            <h3 className="font-semibold text-foreground">{data.leadMagnet.h3}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{data.leadMagnet.desc}</p>
          </div>
        </div>
        {sent ? (
          <p className="mt-4 flex items-center gap-2 text-sm font-medium text-primary">
            <Check className="h-4 w-4" /> ¡Listo! Te lo enviamos a tu correo en breve.
          </p>
        ) : (
          <form onSubmit={submit} className="mt-4 flex flex-col gap-3 sm:flex-row">
            <input ref={hp} type="text" name="company_website" tabIndex={-1} autoComplete="off" aria-hidden="true" className="absolute -left-[9999px] h-px w-px opacity-0" />
            <input
              required
              type="email"
              aria-label="Correo"
              placeholder="Tu correo"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              className="flex-1 rounded-xl border border-border/50 bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary/50 focus:outline-none"
            />
            <button
              type="submit"
              disabled={sending}
              className="whitespace-nowrap rounded-xl border border-border px-5 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-secondary/60 disabled:opacity-60"
            >
              {sending ? "Enviando…" : data.leadMagnet.button}
            </button>
          </form>
        )}
        {error && <p className="mt-2 text-xs text-destructive">{error}</p>}
      </div>
    </section>
  )
}
