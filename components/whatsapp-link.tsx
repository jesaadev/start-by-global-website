"use client"

import type { AnchorHTMLAttributes, ReactNode } from "react"
import { fireContact } from "@/lib/track-client"

// Datos centralizados del canal de WhatsApp (evita duplicación entre vistas).
export const WHATSAPP_NUMBER = "18493562247"
export const WHATSAPP_DEFAULT_MESSAGE =
  "Hola Start By Global, quiero info sobre sus servicios"

type WhatsAppLinkProps = {
  children: ReactNode
  message?: string
  number?: string
} & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href" | "onClick">

/**
 * Enlace a WhatsApp con mensaje prellenado y registro del evento de conversión
 * (Contact, pixel + CAPI). Encapsula número, texto y tracking en un solo lugar.
 * Es un Client Component, por lo que puede usarse también desde Server Components.
 */
export function WhatsAppLink({
  children,
  message = WHATSAPP_DEFAULT_MESSAGE,
  number = WHATSAPP_NUMBER,
  ...rest
}: WhatsAppLinkProps) {
  const href = `https://wa.me/${number}?text=${encodeURIComponent(message)}`
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => fireContact()}
      {...rest}
    >
      {children}
    </a>
  )
}
