"use client"

import { useEffect, useRef, useState, type ReactNode } from "react"
import { cn } from "@/lib/utils"

interface AnimateInProps {
  children: ReactNode
  className?: string
  delay?: number
  direction?: "up" | "down" | "left" | "right" | "fade"
  once?: boolean
}

// "static": visible sin animación (SSR y todo lo que ya está en pantalla al
// montar). "hidden"/"shown": solo para contenido que arranca debajo del pliegue.
// Así el contenido nunca queda invisible esperando a que hidrate el JS (antes el
// hero de la home se veía vacío varios segundos y retrasaba el LCP).
type Phase = "static" | "hidden" | "shown"

const directionClasses: Record<NonNullable<AnimateInProps["direction"]>, string> = {
  up: "translate-y-8",
  down: "-translate-y-8",
  left: "translate-x-8",
  right: "-translate-x-8",
  fade: "",
}

export function AnimateIn({ children, className, delay = 0, direction = "up", once = true }: AnimateInProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [phase, setPhase] = useState<Phase>("static")

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return
    // Ya visible (o por encima) al montar: se queda estático, sin parpadeo.
    if (el.getBoundingClientRect().top < window.innerHeight) return

    setPhase("hidden")
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setPhase("shown")
          if (once) observer.unobserve(el)
        } else if (!once) {
          setPhase("hidden")
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [once])

  return (
    <div
      ref={ref}
      className={cn(
        phase !== "static" && "transition-all duration-700 ease-out",
        phase === "hidden" && `opacity-0 ${directionClasses[direction]}`,
        phase === "shown" && "opacity-100 translate-x-0 translate-y-0",
        className
      )}
      style={phase !== "static" ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </div>
  )
}
