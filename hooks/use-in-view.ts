"use client"

import { useEffect, useState, type RefObject } from "react"

/**
 * true mientras el elemento está en pantalla (al menos `amount` de su área).
 * IntersectionObserver nativo: evita cargar una librería de animación solo
 * para saber si una sección es visible.
 */
export function useInView(ref: RefObject<Element | null>, amount = 0.35): boolean {
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el || typeof IntersectionObserver === "undefined") return
    const io = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: amount })
    io.observe(el)
    return () => io.disconnect()
  }, [ref, amount])
  return inView
}
