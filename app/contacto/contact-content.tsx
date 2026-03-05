"use client"

import React from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { AnimateIn } from "@/components/animate-in"
import { Footer } from "@/components/footer"
import {
  Send,
  MapPin,
  Phone,
  Mail,
  Clock,
  MessageCircle,
  Globe,
  CheckCircle,
  Calendar,
  Video,
} from "lucide-react"
import { useState } from "react"

const offices = [
  { city: "Santo Domingo", country: "Rep. Dominicana", address: "Torre Empresarial, Av. Winston Churchill", phone: "+1 (809) 555-0100", email: "info@startbyglobal.com", timezone: "GMT-4", hours: "8:00 AM - 6:00 PM" },
  { city: "Madrid", country: "Espana", address: "Paseo de la Castellana 95", phone: "+34 91 555 0100", email: "info@startbyglobal.com", timezone: "GMT+1", hours: "9:00 AM - 7:00 PM" },
  { city: "Ciudad de Mexico", country: "Mexico", address: "Av. Reforma 222, Col. Juarez", phone: "+52 55 5555 0100", email: "info@startbyglobal.com", timezone: "GMT-6", hours: "8:00 AM - 6:00 PM" },
  { city: "Miami", country: "EE.UU.", address: "1001 Brickell Bay Dr, Suite 2700", phone: "+1 (305) 555-0100", email: "info@startbyglobal.com", timezone: "GMT-5", hours: "9:00 AM - 6:00 PM" },
]

const contactMethods = [
  { icon: MessageCircle, title: "Chat en Vivo", desc: "Respuesta inmediata en horario laboral", action: "Iniciar chat" },
  { icon: Calendar, title: "Agendar Llamada", desc: "Reserva 30 min con un experto", action: "Ver calendario" },
  { icon: Video, title: "Videollamada", desc: "Presentacion gratuita por Zoom/Meet", action: "Solicitar demo" },
]

export function ContactPageContent() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    service: "",
    budget: "",
    message: "",
  })
  const [submitted, setSubmitted] = useState(false)
  const [sending, setSending] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSending(true)
    setError("")

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })
      const data = await res.json()

      if (!res.ok) {
        setError(data.error || "Error al enviar. Intenta de nuevo.")
        setSending(false)
        return
      }

      setSubmitted(true)
      setFormData({ name: "", email: "", company: "", service: "", budget: "", message: "" })
      setTimeout(() => setSubmitted(false), 6000)
    } catch {
      setError("Error de conexion. Verifica tu internet e intenta de nuevo.")
    } finally {
      setSending(false)
    }
  }

  return (
    <DashboardLayout title="Contacto" subtitle="Hablemos sobre como impulsar tu negocio">
      {/* Contact methods */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {contactMethods.map((method, i) => {
          const Icon = method.icon
          return (
            <AnimateIn key={method.title} delay={i * 80}>
              <div className="glass-card-hover rounded-xl p-5 flex flex-col gap-3 cursor-pointer group h-full">
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-display font-semibold text-foreground text-sm">{method.title}</h3>
                <p className="text-xs text-muted-foreground">{method.desc}</p>
                <span className="text-xs text-primary font-medium mt-auto">{method.action}</span>
              </div>
            </AnimateIn>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        {/* Form */}
        <AnimateIn direction="left" className="lg:col-span-3">
          <div className="glass-card rounded-xl p-6 h-full">
            {submitted ? (
              <div className="flex flex-col items-center justify-center py-16 gap-4">
                <div className="w-16 h-16 rounded-full bg-chart-3/10 flex items-center justify-center animate-pulse-glow">
                  <CheckCircle className="w-8 h-8 text-chart-3" />
                </div>
                <h3 className="font-display text-xl font-bold text-foreground">Mensaje Enviado</h3>
                <p className="text-sm text-muted-foreground text-center max-w-sm">
                  Gracias por contactarnos. Un miembro de nuestro equipo se pondra en contacto contigo en las proximas 24 horas.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                <h3 className="font-display font-semibold text-foreground flex items-center gap-2">
                  <Send className="w-4 h-4 text-primary" />
                  Enviar Mensaje
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="c-name" className="text-xs text-muted-foreground font-medium">Nombre completo *</label>
                    <input
                      id="c-name"
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="px-4 py-2.5 rounded-lg bg-secondary/50 border border-border/50 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all"
                      placeholder="Tu nombre"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="c-email" className="text-xs text-muted-foreground font-medium">Email *</label>
                    <input
                      id="c-email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="px-4 py-2.5 rounded-lg bg-secondary/50 border border-border/50 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all"
                      placeholder="tu@email.com"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="c-company" className="text-xs text-muted-foreground font-medium">Empresa</label>
                    <input
                      id="c-company"
                      type="text"
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      className="px-4 py-2.5 rounded-lg bg-secondary/50 border border-border/50 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all"
                      placeholder="Tu empresa"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="c-service" className="text-xs text-muted-foreground font-medium">Servicio de interes</label>
                    <select
                      id="c-service"
                      value={formData.service}
                      onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                      className="px-4 py-2.5 rounded-lg bg-secondary/50 border border-border/50 text-sm text-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all appearance-none"
                    >
                      <option value="" className="bg-card text-foreground">Seleccionar...</option>
                      <option value="web" className="bg-card text-foreground">Desarrollo Web</option>
                      <option value="seo" className="bg-card text-foreground">SEO & Posicionamiento</option>
                      <option value="marketing" className="bg-card text-foreground">Marketing Digital</option>
                      <option value="branding" className="bg-card text-foreground">Branding & Diseno</option>
                      <option value="analytics" className="bg-card text-foreground">Analitica & Data</option>
                      <option value="automation" className="bg-card text-foreground">Automatizacion</option>
                    </select>
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="c-budget" className="text-xs text-muted-foreground font-medium">Presupuesto estimado</label>
                  <select
                    id="c-budget"
                    value={formData.budget}
                    onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                    className="px-4 py-2.5 rounded-lg bg-secondary/50 border border-border/50 text-sm text-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all appearance-none"
                  >
                    <option value="" className="bg-card text-foreground">Seleccionar rango...</option>
                    <option value="<5k" className="bg-card text-foreground">Menos de $5,000</option>
                    <option value="5k-10k" className="bg-card text-foreground">$5,000 - $10,000</option>
                    <option value="10k-25k" className="bg-card text-foreground">$10,000 - $25,000</option>
                    <option value="25k-50k" className="bg-card text-foreground">$25,000 - $50,000</option>
                    <option value=">50k" className="bg-card text-foreground">Mas de $50,000</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="c-message" className="text-xs text-muted-foreground font-medium">Mensaje *</label>
                  <textarea
                    id="c-message"
                    required
                    rows={5}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="px-4 py-2.5 rounded-lg bg-secondary/50 border border-border/50 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all resize-none"
                    placeholder="Cuentanos sobre tu proyecto, objetivos y timeline..."
                  />
                </div>

                {error && (
                  <div className="px-4 py-2.5 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-xs">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={sending}
                  className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-sm transition-all duration-300 hover:shadow-lg hover:shadow-primary/25 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-60 disabled:pointer-events-none"
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

        {/* Offices sidebar */}
        <AnimateIn direction="right" delay={100} className="lg:col-span-2">
          <div className="flex flex-col gap-4 h-full">
            <div className="glass-card rounded-xl p-5 flex-1">
              <h3 className="font-display font-semibold text-foreground mb-4 flex items-center gap-2">
                <Globe className="w-4 h-4 text-primary" />
                Nuestras Oficinas
              </h3>
              <div className="flex flex-col gap-4">
                {offices.map((office, i) => (
                  <AnimateIn key={office.city} delay={i * 80}>
                    <div className="p-4 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors flex flex-col gap-2">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-semibold text-foreground">{office.city}</h4>
                        <span className="text-[10px] text-muted-foreground">{office.country}</span>
                      </div>
                      <p className="text-[11px] text-muted-foreground flex items-center gap-1.5">
                        <MapPin className="w-3 h-3 shrink-0" />
                        {office.address}
                      </p>
                      <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Phone className="w-3 h-3" />
                          {office.phone}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {office.timezone}
                        </span>
                      </div>
                      <a href={`mailto:${office.email}`} className="text-[11px] text-primary hover:text-primary/80 transition-colors flex items-center gap-1">
                        <Mail className="w-3 h-3" />
                        {office.email}
                      </a>
                    </div>
                  </AnimateIn>
                ))}
              </div>
            </div>

            {/* Quick info */}
            <div className="glass-card rounded-xl p-5 glow-accent">
              <h3 className="font-display font-semibold text-foreground mb-2">Tiempo de Respuesta</h3>
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Email</span>
                  <span className="text-foreground font-medium">{"< 24 horas"}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Chat</span>
                  <span className="text-foreground font-medium">{"< 2 horas"}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Cotizacion</span>
                  <span className="text-foreground font-medium">48 horas</span>
                </div>
              </div>
            </div>
          </div>
        </AnimateIn>
      </div>

      <Footer />
    </DashboardLayout>
  )
}
