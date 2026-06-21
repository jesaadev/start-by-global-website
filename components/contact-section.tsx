"use client"

import React from "react"
import { Send, MapPin, Phone, Mail, Clock, ArrowUpRight, CheckCircle } from "lucide-react"
import { useState } from "react"
import { AnimateIn } from "@/components/animate-in"
import { fireLead, fireContact } from "@/lib/track-client"

const offices = [
  { city: "Santo Domingo", country: "Rep. Dominicana", timezone: "GMT-4" },
  { city: "Madrid", country: "España", timezone: "GMT+1" },
  { city: "Ciudad de México", country: "México", timezone: "GMT-6" },
  { city: "Miami", country: "EE.UU.", timezone: "GMT-5" },
]

const WHATSAPP_NUMBERS = [
  { label: "RD / Internacional", number: "18493562247", display: "+1 849 356 2247" },
  { label: "Rep. Dominicana", number: "18096378488", display: "+1 809 637 8488" },
]

export function ContactSection() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    service: "",
    message: "",
  })
  const [submitted, setSubmitted] = useState(false)
  const [sending, setSending] = useState(false)
  const [error, setError] = useState("")
  const [accepted, setAccepted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // Honeypot: leer el campo trampa de forma síncrona antes de cualquier await.
    const company_website =
      (new FormData(e.currentTarget as HTMLFormElement).get("company_website") as string) ?? ""
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
        setError(data.error || "Error al enviar. Intenta de nuevo.")
        setSending(false)
        return
      }

      setSubmitted(true)
      setFormData({ name: "", email: "", company: "", service: "", message: "" })
      setTimeout(() => setSubmitted(false), 5000)
    } catch {
      setError("Error de conexión. Verifica tu internet e intenta de nuevo.")
    } finally {
      setSending(false)
    }
  }

  return (
    <section id="contact" className="flex flex-col gap-6">
      <AnimateIn>
        <div>
          <h2 className="font-display text-2xl font-bold text-foreground">Contacto</h2>
          <p className="text-sm text-muted-foreground mt-1">Hablemos sobre tu próximo proyecto</p>
        </div>
      </AnimateIn>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        {/* Contact form */}
        <AnimateIn direction="left" className="lg:col-span-3">
          <div className="glass-card rounded-xl p-6 h-full">
            {submitted ? (
              <div className="flex flex-col items-center justify-center py-12 gap-4">
                <div className="w-16 h-16 rounded-full bg-chart-3/10 flex items-center justify-center animate-pulse-glow">
                  <CheckCircle className="w-8 h-8 text-chart-3" />
                </div>
                <h3 className="font-display text-xl font-bold text-foreground">Mensaje Enviado</h3>
                <p className="text-sm text-muted-foreground text-center max-w-xs">
                  Gracias por contactarnos. Nuestro equipo te responderá en las próximas 24 horas.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                {/* Honeypot anti-bots: oculto para usuarios reales */}
                <input
                  type="text"
                  name="company_website"
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden="true"
                  style={{ position: "absolute", left: "-9999px", width: 1, height: 1, opacity: 0 }}
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="name" className="text-xs text-muted-foreground font-medium">
                      Nombre completo
                    </label>
                    <input
                      id="name"
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="px-4 py-2.5 rounded-lg bg-secondary/50 border border-border/50 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all"
                      placeholder="Tu nombre"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="email" className="text-xs text-muted-foreground font-medium">
                      Email
                    </label>
                    <input
                      id="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="px-4 py-2.5 rounded-lg bg-secondary/50 border border-border/50 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all"
                      placeholder="tu@email.com"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="company" className="text-xs text-muted-foreground font-medium">
                      Empresa
                    </label>
                    <input
                      id="company"
                      type="text"
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      className="px-4 py-2.5 rounded-lg bg-secondary/50 border border-border/50 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all"
                      placeholder="Tu empresa"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="service" className="text-xs text-muted-foreground font-medium">
                      Servicio de interés
                    </label>
                    <select
                      id="service"
                      value={formData.service}
                      onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                      className="px-4 py-2.5 rounded-lg bg-secondary/50 border border-border/50 text-sm text-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all appearance-none"
                    >
                      <option value="" className="bg-card text-foreground">Seleccionar...</option>
                      <option value="web" className="bg-card text-foreground">Desarrollo Web</option>
                      <option value="seo" className="bg-card text-foreground">SEO</option>
                      <option value="marketing" className="bg-card text-foreground">Marketing Digital</option>
                      <option value="branding" className="bg-card text-foreground">Branding</option>
                      <option value="analytics" className="bg-card text-foreground">Analítica</option>
                      <option value="automation" className="bg-card text-foreground">Automatización</option>
                    </select>
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="message" className="text-xs text-muted-foreground font-medium">
                    Mensaje
                  </label>
                  <textarea
                    id="message"
                    required
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="px-4 py-2.5 rounded-lg bg-secondary/50 border border-border/50 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all resize-none"
                    placeholder="Cuéntanos sobre tu proyecto..."
                  />
                </div>

                <label className="flex items-start gap-2 text-xs text-muted-foreground leading-relaxed">
                  <input
                    type="checkbox"
                    required
                    checked={accepted}
                    onChange={(e) => setAccepted(e.target.checked)}
                    className="mt-0.5 accent-primary"
                  />
                  <span>
                    He leído y acepto la{" "}
                    <a href="/privacidad" target="_blank" className="text-primary hover:underline">Política de Privacidad</a>.
                  </span>
                </label>

                {error && (
                  <div className="px-4 py-2.5 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-xs">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={sending || !accepted}
                  className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-sm transition-all duration-300 hover:shadow-lg hover:shadow-primary/25 hover:scale-[1.01] active:scale-[0.99] mt-2 disabled:opacity-60 disabled:pointer-events-none"
                >
                  {sending ? (
                    <>
                      <span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                      Enviando...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Enviar Mensaje
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </AnimateIn>

        {/* Offices */}
        <AnimateIn direction="right" delay={100} className="lg:col-span-2">
          <div className="flex flex-col gap-4 h-full">
            <div className="glass-card rounded-xl p-5 flex-1">
              <h3 className="font-display font-semibold text-foreground mb-4 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-primary" />
                Nuestras Oficinas
              </h3>
              <div className="flex flex-col gap-3">
                {offices.map((office, i) => (
                  <AnimateIn key={office.city} delay={i * 80}>
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors group">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground">{office.city}</p>
                        <p className="text-[10px] text-muted-foreground">{office.country}</p>
                      </div>
                      <div className="text-right flex flex-col items-end gap-0.5 shrink-0">
                        <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                          <Clock className="w-2.5 h-2.5" />
                          {office.timezone}
                        </span>
                      </div>
                    </div>
                  </AnimateIn>
                ))}
              </div>
            </div>

            {/* Quick contact card */}
            <div className="glass-card rounded-xl p-5 glow-accent">
              <h3 className="font-display font-semibold text-foreground mb-3">Respuesta Rápida</h3>
              <p className="text-xs text-muted-foreground mb-4 leading-relaxed">
                ¿Necesitas una cotización urgente? Nuestro equipo responde en menos de 2 horas en horario laboral.
              </p>
              <div className="flex flex-col gap-2">
                <a
                  href="mailto:info@startbyglobal.com"
                  className="flex items-center gap-2 text-sm text-primary hover:text-primary/80 transition-colors"
                >
                  <Mail className="w-4 h-4" />
                  info@startbyglobal.com
                  <ArrowUpRight className="w-3 h-3 ml-auto" />
                </a>
                {WHATSAPP_NUMBERS.map((wa) => (
                  <a
                    key={wa.number}
                    href={`https://wa.me/${wa.number}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => fireContact()}
                    className="flex items-center gap-2 text-sm text-foreground hover:text-[#25D366] transition-colors"
                  >
                    <Phone className="w-4 h-4 text-[#25D366]" />
                    {wa.display}
                    <span className="text-[10px] text-muted-foreground">· {wa.label}</span>
                    <ArrowUpRight className="w-3 h-3 ml-auto" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </AnimateIn>
      </div>
    </section>
  )
}
