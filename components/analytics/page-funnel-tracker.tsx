"use client"

import { useEffect } from "react"
import { fireScroll75, fireViewContent } from "@/lib/track-client"

/**
 * Mide el embudo de una página de venta (pestaña "Landings" del admin):
 * ViewContent al cargar y Scroll75 una sola vez. Píxel con consentimiento de
 * marketing; registro 1st-party con consentimiento de analítica.
 */
export function PageFunnelTracker({ landingKey }: { landingKey: string }) {
  useEffect(() => {
    fireViewContent(landingKey)
    let fired = false
    const onScroll = () => {
      if (fired) return
      const total = document.documentElement.scrollHeight
      if (total > 0 && (window.scrollY + window.innerHeight) / total >= 0.75) {
        fired = true
        fireScroll75(landingKey)
        window.removeEventListener("scroll", onScroll)
      }
    }
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [landingKey])
  return null
}
