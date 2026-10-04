"use client"

import Link from "next/link"
import { ArrowRight } from "lucide-react"
import StarBorder from "@/components/reactbits/StarBorder"
import Magnet from "@/components/reactbits/Magnet"
import { useReducedMotion } from "@/hooks/use-reduced-motion"
import { cn } from "@/lib/utils"

/**
 * CTA principal en forma de enlace, con el mismo tratamiento que PrimaryCTA en
 * el color de marca. Se usa en inglés (/us), donde el modal de WhatsApp no
 * aplica: lleva al formulario de la propia página o a /us/contact.
 */
export function LinkCTA({
  href,
  label,
  size = "lg",
  external = false,
  className,
}: {
  href: string
  label: string
  size?: "md" | "lg"
  /** Abre en otra pestaña (p. ej. el calendario). */
  external?: boolean
  className?: string
}) {
  const reduced = useReducedMotion()
  return (
    <Magnet padding={40} magnetStrength={6} disabled={reduced} wrapperClassName="inline-block">
      <StarBorder
        as={Link}
        href={href}
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        color="#ffe2d6"
        speed="5s"
        thickness={2}
        backgroundColor="hsl(var(--primary))"
        textColor="hsl(var(--primary-foreground))"
        borderColor="hsl(var(--primary))"
        className={cn(
          "transition-transform duration-200 hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary",
          className
        )}
        innerClassName={cn(
          "font-bold shadow-lg shadow-primary/25",
          size === "lg" ? "text-base sm:text-lg px-7 py-4" : "text-sm px-5 py-3"
        )}
      >
        <span className="flex items-center justify-center gap-2.5">
          {label}
          <ArrowRight className={size === "lg" ? "w-5 h-5" : "w-4 h-4"} />
        </span>
      </StarBorder>
    </Magnet>
  )
}
