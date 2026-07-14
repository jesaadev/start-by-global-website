"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { X, Globe } from "lucide-react"
import { localeFromPath } from "@/lib/i18n"

const DISMISS_KEY = "sbg_us_banner_dismissed"

/**
 * Sugerencia discreta para visitantes de EE.UU. navegando la versión en
 * español: enlaza a /us sin redirigir (SEO-safe). El proxy marca al visitante
 * con la cookie sbg_geo_us=1; el banner es descartable y no vuelve a aparecer.
 */
export function UsSuggestBanner() {
  const pathname = usePathname()
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (localeFromPath(pathname) === "en") {
      setVisible(false)
      return
    }
    try {
      if (localStorage.getItem(DISMISS_KEY)) return
    } catch {
      /* storage bloqueado: seguimos con la cookie */
    }
    const isUsVisitor = /(?:^|; )sbg_geo_us=1/.test(document.cookie)
    setVisible(isUsVisitor)
  }, [pathname])

  if (!visible) return null

  const dismiss = () => {
    setVisible(false)
    try {
      localStorage.setItem(DISMISS_KEY, "1")
    } catch {
      /* sin storage: se re-mostrará en la próxima visita */
    }
  }

  return (
    <div className="fixed inset-x-0 top-0 z-[9000] flex justify-center p-2 pointer-events-none">
      <div className="pointer-events-auto flex items-center gap-3 rounded-full border border-border/60 bg-card/95 backdrop-blur-xl shadow-lg px-4 py-2">
        <Globe className="w-4 h-4 text-primary shrink-0" />
        <span className="text-xs text-foreground">
          Visiting from the U.S.?{" "}
          <Link href="/us" onClick={dismiss} className="font-semibold text-primary hover:underline">
            View our U.S. site →
          </Link>
        </span>
        <button
          type="button"
          onClick={dismiss}
          aria-label="Dismiss"
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  )
}
