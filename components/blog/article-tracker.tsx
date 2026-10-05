"use client"

import { useEffect, useRef } from "react"
import { trackBlogEvent, beaconBlogEvent, setSourceArticle } from "@/lib/blog-track-client"

// Enlaces que cuentan como clic de conversión desde un artículo: money pages,
// landings por persona y sus equivalentes en inglés.
const CTA_PATHS =
  /^\/(diseno-paginas-web|publicidad-ads|servicios|contacto|ia-automatizacion|outsourcing|web-que-genera-clientes|optimizacion-ecommerce|marketing-para-empresas|presencia-profesional|agencias-white-label|us(\/(website-design|google-ads|contact))?)\b/

// Una "lectura completa" exige tiempo real en la página: llegar al final en
// pocos segundos es un vistazo (o un bot con un viewport gigante).
const MIN_READ_MS = 20_000

/**
 * Mide el consumo orgánico de un artículo: vista, scroll (25/50/75/100%),
 * lectura completa, tiempo activo y clics a CTAs / money pages. Sin PII.
 */
export function ArticleTracker({ slug }: { slug: string }) {
  const milestones = useRef<Set<number>>(new Set())
  const engagedMs = useRef(0)
  const activeSince = useRef<number | null>(null)
  const engagedSent = useRef(false)
  const viewAt = useRef(0)

  useEffect(() => {
    milestones.current = new Set()
    engagedMs.current = 0
    engagedSent.current = false
    activeSince.current = document.visibilityState === "visible" ? Date.now() : null
    viewAt.current = Date.now()

    trackBlogEvent(slug, "view")
    setSourceArticle(slug)

    const flushEngaged = () => {
      if (activeSince.current != null) {
        engagedMs.current += Date.now() - activeSince.current
        activeSince.current = null
      }
    }
    const sendEngaged = () => {
      if (engagedSent.current) return
      flushEngaged()
      const secs = Math.round(engagedMs.current / 1000)
      if (secs >= 2) {
        engagedSent.current = true
        beaconBlogEvent(slug, "engaged", { value: secs })
      }
    }

    const onVisibility = () => {
      if (document.visibilityState === "visible") activeSince.current = Date.now()
      else flushEngaged()
    }

    // Throttle con requestAnimationFrame: las lecturas de layout se hacen una
    // vez por frame para evitar reflows sincrónicos (jank) al hacer scroll.
    let ticking = false
    const onScroll = () => {
      if (ticking) return
      ticking = true
      window.requestAnimationFrame(() => {
        const el = document.documentElement
        const max = el.scrollHeight - el.clientHeight
        const pct = max > 0 ? Math.min(100, Math.round((el.scrollTop / max) * 100)) : 100
        for (const m of [25, 50, 75, 100]) {
          // El 100% no se marca antes del tiempo mínimo: si llegó antes, se
          // registrará en un scroll posterior.
          if (m === 100 && Date.now() - viewAt.current < MIN_READ_MS) continue
          if (pct >= m && !milestones.current.has(m)) {
            milestones.current.add(m)
            trackBlogEvent(slug, m === 100 ? "read_complete" : "scroll", { value: m })
          }
        }
        ticking = false
      })
    }

    const onClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null
      // CTAs sin href (p. ej. el botón de WhatsApp, que abre un modal).
      const tagged = target?.closest?.("[data-blog-cta]")
      if (tagged) {
        trackBlogEvent(slug, "cta_click", { target: tagged.getAttribute("data-blog-cta") || "cta" })
        return
      }
      const a = target?.closest?.("a") as HTMLAnchorElement | null
      if (!a) return
      const href = a.getAttribute("href") || ""
      if (CTA_PATHS.test(href)) trackBlogEvent(slug, "cta_click", { target: href })
    }

    document.addEventListener("visibilitychange", onVisibility)
    window.addEventListener("scroll", onScroll, { passive: true })
    document.addEventListener("click", onClick)
    window.addEventListener("pagehide", sendEngaged)
    onScroll()
    // Quien llegó al final antes del mínimo y se quedó leyendo también cuenta.
    const readCheck = window.setTimeout(onScroll, MIN_READ_MS + 50)

    return () => {
      document.removeEventListener("visibilitychange", onVisibility)
      window.removeEventListener("scroll", onScroll)
      document.removeEventListener("click", onClick)
      window.removeEventListener("pagehide", sendEngaged)
      window.clearTimeout(readCheck)
      sendEngaged()
    }
  }, [slug])

  return null
}
