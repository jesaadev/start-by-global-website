"use client"

import { MessageCircle } from "lucide-react"
import { WhatsAppLink } from "@/components/whatsapp-link"
import StarBorder from "@/components/reactbits/StarBorder"
import Magnet from "@/components/reactbits/Magnet"
import { useReducedMotion } from "@/hooks/use-reduced-motion"
import { cn } from "@/lib/utils"

const WHATSAPP_GREEN = "#25D366"

interface PrimaryCTAProps {
  label?: string
  /** Segmento de tracking del lead (aparece en Atribución). */
  segment: string
  /** Servicio preseleccionado en el modal de WhatsApp. */
  service?: string
  size?: "md" | "lg"
  className?: string
}

/**
 * CTA principal único del sitio: WhatsApp. Reutiliza WhatsAppLink (registra el
 * lead server-side + píxel/CAPI) con un borde de luz animado (StarBorder) y
 * atracción magnética en desktop (Magnet). Sin movimiento si el usuario pidió
 * reducirlo.
 */
export function PrimaryCTA({
  label = "Hablar por WhatsApp",
  segment,
  service,
  size = "lg",
  className,
}: PrimaryCTAProps) {
  const reduced = useReducedMotion()
  return (
    <Magnet padding={40} magnetStrength={6} disabled={reduced} wrapperClassName="inline-block">
      <StarBorder
        as={WhatsAppLink}
        segment={segment}
        defaultService={service}
        aria-label={label}
        color="#d9ffe7"
        speed="5s"
        thickness={2}
        backgroundColor={WHATSAPP_GREEN}
        textColor="#ffffff"
        borderColor="#1fb855"
        className={cn(
          "transition-transform duration-200 hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#25D366]",
          className
        )}
        innerClassName={cn(
          "font-bold shadow-lg shadow-[#25D366]/25",
          size === "lg" ? "text-base sm:text-lg px-7 py-4" : "text-sm px-5 py-3"
        )}
      >
        <span className="flex items-center justify-center gap-2.5">
          <MessageCircle className={size === "lg" ? "w-5 h-5" : "w-4 h-4"} />
          {label}
        </span>
      </StarBorder>
    </Magnet>
  )
}
