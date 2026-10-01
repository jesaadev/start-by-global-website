"use client"

import { useEffect, useState } from "react"

/**
 * true si el usuario pidió reducir movimiento en su sistema. Arranca en false
 * (SSR) y se corrige al montar: las animaciones son decorativas, así que el
 * primer render nunca depende de esto.
 */
export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false)
  useEffect(() => {
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)")
    const update = () => setReduced(mql.matches)
    update()
    mql.addEventListener("change", update)
    return () => mql.removeEventListener("change", update)
  }, [])
  return reduced
}

/** true en pantallas >= breakpoint (por defecto 1024px, "lg"). */
export function useIsDesktop(minWidth = 1024): boolean {
  const [desktop, setDesktop] = useState(false)
  useEffect(() => {
    const mql = window.matchMedia(`(min-width: ${minWidth}px)`)
    const update = () => setDesktop(mql.matches)
    update()
    mql.addEventListener("change", update)
    return () => mql.removeEventListener("change", update)
  }, [minWidth])
  return desktop
}
