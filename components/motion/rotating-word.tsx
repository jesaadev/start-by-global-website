"use client"

import { useEffect, useState } from "react"
import { useReducedMotion } from "@/hooks/use-reduced-motion"
import { cn } from "@/lib/utils"

/**
 * Palabra que rota dentro de un titular. La primera palabra se renderiza ya
 * visible en SSR, así el H1 cuenta para el LCP desde el primer paint. Entrada
 * con keyframes CSS (sin librería de animación en el JS inicial). Con "reducir
 * movimiento" se queda fija en la primera palabra.
 */
export function RotatingWord({
  words,
  interval = 2400,
  className,
}: {
  words: string[]
  interval?: number
  className?: string
}) {
  const reduced = useReducedMotion()
  const [i, setI] = useState(0)
  // La primera palabra (la del SSR) no anima; a partir del primer cambio, sí.
  const [cycled, setCycled] = useState(false)

  useEffect(() => {
    if (reduced || words.length < 2) return
    const t = setInterval(() => {
      setI((n) => (n + 1) % words.length)
      setCycled(true)
    }, interval)
    return () => clearInterval(t)
  }, [reduced, words.length, interval])

  return (
    <span
      className={cn(
        "inline-flex overflow-hidden rounded-2xl bg-primary px-3 sm:px-4 pb-1 text-primary-foreground align-baseline",
        className
      )}
    >
      <span
        key={i}
        className="inline-block"
        style={cycled && !reduced ? { animation: "sbg-word-in 420ms cubic-bezier(0.22, 1, 0.36, 1) both" } : undefined}
      >
        {words[i]}
      </span>
    </span>
  )
}
