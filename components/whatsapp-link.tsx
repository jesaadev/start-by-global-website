"use client"

import { useEffect, useState, type ReactNode } from "react"
import { createPortal } from "react-dom"
import { MessageCircle, X, Send } from "lucide-react"
import { cn } from "@/lib/utils"
import { fireWhatsAppLead } from "@/lib/track-client"

// Datos centralizados del canal de WhatsApp (evita duplicación entre vistas).
export const WHATSAPP_NUMBER = "18493562247"

const SERVICES = [
  "Desarrollo Web",
  "SEO & Posicionamiento",
  "Marketing Digital",
  "Branding & Diseño",
  "Analítica & Data",
  "Automatización e IA",
  "Outsourcing / Marca Blanca",
]

function buildWhatsAppUrl(number: string, data: { name: string; service: string; detail: string }) {
  const lines = [
    "¡Hola Start By Global! Quiero más información.",
    data.name ? `Nombre: ${data.name}` : null,
    data.service ? `Servicio de interés: ${data.service}` : null,
    data.detail ? `Detalle: ${data.detail}` : null,
  ].filter(Boolean)
  return `https://wa.me/${number}?text=${encodeURIComponent(lines.join("\n"))}`
}

type WhatsAppLinkProps = {
  children: ReactNode
  className?: string
  number?: string
  defaultService?: string
  segment?: string
  "aria-label"?: string
  title?: string
}

/**
 * Disparador de WhatsApp que primero abre un modal con un mini-formulario
 * (nombre + servicio + detalle) y luego abre WhatsApp con esos datos
 * prellenados en el mensaje, registrando el evento de conversión (Contact).
 * Es un Client Component, por lo que puede usarse desde Server Components.
 */
export function WhatsAppLink({ children, className, number = WHATSAPP_NUMBER, defaultService = "", segment, ...rest }: WhatsAppLinkProps) {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState("")
  const [service, setService] = useState(defaultService)
  const [detail, setDetail] = useState("")

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false) }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [open])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const url = buildWhatsAppUrl(number, { name: name.trim(), service, detail: detail.trim() })
    fireWhatsAppLead({ name: name.trim(), service, segment })
    window.open(url, "_blank", "noopener,noreferrer")
    setOpen(false)
  }

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className={className} {...rest}>
        {children}
      </button>

      {open && createPortal(
        <div
          className="fixed inset-0 z-[10001] flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        >
          <div
            className="w-full max-w-sm bg-card border border-border/50 shadow-2xl rounded-2xl p-5 sm:p-6 space-y-4"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label="Contactar por WhatsApp"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-[#25D366]/15 border border-[#25D366]/25 shrink-0">
                  <MessageCircle className="w-5 h-5 text-[#25D366]" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">Hablemos por WhatsApp</p>
                  <p className="text-xs text-muted-foreground">Cuéntanos lo básico y te respondemos al instante.</p>
                </div>
              </div>
              <button type="button" onClick={() => setOpen(false)} aria-label="Cerrar" className="text-muted-foreground hover:text-foreground shrink-0">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="flex flex-col gap-1.5">
                <label htmlFor="wa-name" className="text-xs text-muted-foreground font-medium">Nombre</label>
                <input
                  id="wa-name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Tu nombre"
                  className="px-3 py-2 rounded-lg bg-secondary/50 border border-border/50 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="wa-service" className="text-xs text-muted-foreground font-medium">Servicio de interés</label>
                <select
                  id="wa-service"
                  value={service}
                  onChange={(e) => setService(e.target.value)}
                  className="px-3 py-2 rounded-lg bg-secondary/50 border border-border/50 text-sm text-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all appearance-none"
                >
                  <option value="" className="bg-card">Seleccionar...</option>
                  {SERVICES.map((s) => (
                    <option key={s} value={s} className="bg-card">{s}</option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="wa-detail" className="text-xs text-muted-foreground font-medium">Detalle (opcional)</label>
                <textarea
                  id="wa-detail"
                  rows={2}
                  value={detail}
                  onChange={(e) => setDetail(e.target.value)}
                  placeholder="Cuéntanos brevemente tu proyecto..."
                  className="px-3 py-2 rounded-lg bg-secondary/50 border border-border/50 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={!name.trim()}
                className="flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-xl bg-[#25D366] text-white text-sm font-semibold hover:bg-[#25D366]/90 hover:shadow-lg hover:shadow-[#25D366]/25 transition-all disabled:opacity-50 disabled:pointer-events-none"
              >
                <Send className="w-4 h-4" />
                Abrir WhatsApp
              </button>
            </form>
          </div>
        </div>,
        document.body
      )}
    </>
  )
}
