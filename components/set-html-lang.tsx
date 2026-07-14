"use client"

import { useEffect } from "react"

// Fija el atributo lang del documento en cliente. El layout raíz renderiza
// <html lang="es"> estático (preserva ISR); bajo /us este componente lo pasa a
// "en". La señal SSR primaria para buscadores es el hreflang de la metadata.
export function SetHtmlLang({ lang }: { lang: string }) {
  useEffect(() => {
    const prev = document.documentElement.lang
    document.documentElement.lang = lang
    return () => {
      document.documentElement.lang = prev
    }
  }, [lang])
  return null
}
