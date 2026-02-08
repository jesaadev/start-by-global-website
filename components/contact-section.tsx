"use client"

import React from "react"

import { Send, MapPin, Phone, Mail, Clock, ArrowUpRight } from "lucide-react"
import { useState } from "react"

const offices = [
  { city: "Santo Domingo", country: "Rep. Dominicana", phone: "+1 (809) 555-0100", timezone: "GMT-4" },
  { city: "Madrid", country: "Espana", phone: "+34 91 555 0100", timezone: "GMT+1" },
  { city: "Ciudad de Mexico", country: "Mexico", phone: "+52 55 5555 0100", timezone: "GMT-6" },
  { city: "Miami", country: "EE.UU.", phone: "+1 (305) 555-0100", timezone: "GMT-5" },
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 3000)
    setFormData({ name: "", email: "", company: "", service: "", message: "" })
  }

  return (
    <section id="contact" className="flex flex-col gap-6">
      <div>
        <h2 className="font-display text-2xl font-bold text-foreground">Contacto</h2>
        <p className="text-sm text-muted-foreground mt-1">Hablemos sobre tu proximo proyecto</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        {/* Contact form */}
        <div className="lg:col-span-3 glass-card rounded-xl p-6">
          {submitted ? (
            <div className="flex flex-col items-center justify-center py-12 gap-4">
              <div className="w-16 h-16 rounded-full bg-chart-3/10 flex items-center justify-center">
                <Send className="w-7 h-7 text-chart-3" />
              </div>
              <h3 className="font-display text-xl font-bold text-foreground">Mensaje Enviado</h3>
              <p className="text-sm text-muted-foreground text-center max-w-xs">
                Gracias por contactarnos. Nuestro equipo te respondera en las proximas 24 horas.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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
                    className="px-4 py-2.5 rounded-lg bg-secondary/50 border border-border/50 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all"
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
                    className="px-4 py-2.5 rounded-lg bg-secondary/50 border border-border/50 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all"
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
                    className="px-4 py-2.5 rounded-lg bg-secondary/50 border border-border/50 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all"
                    placeholder="Tu empresa"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="service" className="text-xs text-muted-foreground font-medium">
                    Servicio de interes
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
                    <option value="analytics" className="bg-card text-foreground">Analitica</option>
                    <option value="automation" className="bg-card text-foreground">Automatizacion</option>
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
                  className="px-4 py-2.5 rounded-lg bg-secondary/50 border border-border/50 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all resize-none"
                  placeholder="Cuentanos sobre tu proyecto..."
                />
              </div>

              <button
                type="submit"
                className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-sm transition-all duration-300 hover:shadow-lg hover:shadow-primary/25 hover:scale-[1.01] active:scale-[0.99] mt-2"
              >
                <Send className="w-4 h-4" />
                Enviar Mensaje
              </button>
            </form>
          )}
        </div>

        {/* Offices */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          <div className="glass-card rounded-xl p-5">
            <h3 className="font-display font-semibold text-foreground mb-4 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-primary" />
              Nuestras Oficinas
            </h3>
            <div className="flex flex-col gap-3">
              {offices.map((office) => (
                <div key={office.city} className="flex items-center gap-3 p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors group">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">{office.city}</p>
                    <p className="text-[10px] text-muted-foreground">{office.country}</p>
                  </div>
                  <div className="text-right flex flex-col items-end gap-0.5">
                    <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                      <Phone className="w-2.5 h-2.5" />
                      {office.phone}
                    </span>
                    <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                      <Clock className="w-2.5 h-2.5" />
                      {office.timezone}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick contact card */}
          <div className="glass-card rounded-xl p-5 glow-accent">
            <h3 className="font-display font-semibold text-foreground mb-3">Respuesta Rapida</h3>
            <p className="text-xs text-muted-foreground mb-4 leading-relaxed">
              Necesitas una cotizacion urgente? Nuestro equipo responde en menos de 2 horas en horario laboral.
            </p>
            <div className="flex flex-col gap-2">
              <a
                href="mailto:hola@startbyglobal.com"
                className="flex items-center gap-2 text-sm text-primary hover:text-primary/80 transition-colors"
              >
                <Mail className="w-4 h-4" />
                hola@startbyglobal.com
                <ArrowUpRight className="w-3 h-3 ml-auto" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
