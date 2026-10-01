"use client"

import { useEffect, useState } from "react"
import dynamic from "next/dynamic"
import { useIsDesktop, useReducedMotion } from "@/hooks/use-reduced-motion"

// WebGL (ogl) fuera del bundle inicial: se descarga solo si se va a usar.
const LightRays = dynamic(() => import("@/components/reactbits/LightRays"), { ssr: false })

/**
 * Fondo del hero. Siempre pinta un gradiente CSS (0 JS, también en SSR); en
 * desktop con hardware suficiente y sin "reducir movimiento" añade los rayos de
 * luz de React Bits cuando el navegador está ocioso, para no competir con el LCP.
 */
export function HeroBackground({ color = "#f26d3d" }: { color?: string }) {
  const reduced = useReducedMotion()
  const desktop = useIsDesktop()
  const [ready, setReady] = useState(false)

  useEffect(() => {
    if (reduced || !desktop) return
    if ((navigator.hardwareConcurrency ?? 8) < 4) return
    if ("requestIdleCallback" in window) {
      const id = window.requestIdleCallback(() => setReady(true), { timeout: 2500 })
      return () => window.cancelIdleCallback(id)
    }
    const t = setTimeout(() => setReady(true), 1500)
    return () => clearTimeout(t)
  }, [reduced, desktop])

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_55%_at_50%_-5%,hsl(var(--primary)/0.30),transparent_70%)]" />
      <div className="absolute -bottom-40 -left-40 w-[520px] h-[520px] rounded-full bg-chart-2/10 blur-[120px]" />
      {ready && (
        <LightRays
          raysOrigin="top-center"
          raysColor={color}
          raysSpeed={0.9}
          lightSpread={0.9}
          rayLength={1.6}
          fadeDistance={1.1}
          followMouse
          mouseInfluence={0.08}
          className="absolute inset-0 opacity-60"
        />
      )}
    </div>
  )
}
