"use client"

import { useRef, type ReactNode } from "react"
import { cn } from "@/lib/utils"

/**
 * Inclinación 3D que sigue al cursor, envolviendo cualquier contenido (p. ej.
 * un mockup). Sin librería de animación: el transform se escribe directo en el
 * estilo (sin re-renders) y la transición CSS lo suaviza. Solo con puntero
 * fino (desktop) y sin "reducir movimiento"; en táctil queda estático.
 */
export function Tilt({
  children,
  amplitude = 8,
  className,
}: {
  children: ReactNode
  amplitude?: number
  className?: string
}) {
  const inner = useRef<HTMLDivElement>(null)
  const frame = useRef(0)

  const enabled = () =>
    typeof window !== "undefined" &&
    window.matchMedia("(hover: hover) and (pointer: fine)").matches &&
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = inner.current
    if (!el || !enabled()) return
    const r = e.currentTarget.getBoundingClientRect()
    const rx = ((e.clientY - r.top - r.height / 2) / (r.height / 2)) * -amplitude
    const ry = ((e.clientX - r.left - r.width / 2) / (r.width / 2)) * amplitude
    cancelAnimationFrame(frame.current)
    frame.current = requestAnimationFrame(() => {
      el.style.transform = `rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg)`
    })
  }

  const onLeave = () => {
    cancelAnimationFrame(frame.current)
    if (inner.current) inner.current.style.transform = ""
  }

  return (
    <div onMouseMove={onMove} onMouseLeave={onLeave} className={cn("[perspective:1200px]", className)}>
      <div
        ref={inner}
        className="[transform-style:preserve-3d] transition-transform [transition-duration:600ms] [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none"
      >
        {children}
      </div>
    </div>
  )
}
