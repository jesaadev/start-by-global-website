"use client"

import { useEffect, Suspense } from "react"
import { usePathname, useSearchParams } from "next/navigation"
import { captureAttribution, getStoredAttribution, getMetaCookies } from "@/lib/attribution"

function newEventId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID()
  return `pv-${Date.now()}-${Math.random().toString(36).slice(2)}`
}

function Tracker() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    // 1) Captura first-touch de atribución (solo escribe la cookie una vez).
    captureAttribution()

    // 2) PageView server-side (CAPI) para reforzar la cobertura ante
    //    bloqueadores. Fire-and-forget; el pixel del navegador ya envía el suyo.
    const { fbp, fbc } = getMetaCookies()
    fetch("/api/capi", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      keepalive: true,
      body: JSON.stringify({
        eventName: "PageView",
        eventId: newEventId(),
        attribution: getStoredAttribution(),
        fbp,
        fbc,
        eventSourceUrl: typeof window !== "undefined" ? window.location.href : undefined,
      }),
    }).catch(() => {})
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, searchParams])

  return null
}

/**
 * Captura atribución de marketing y envía PageView server-side a Meta CAPI.
 * Se monta una vez en el layout.
 */
export function AttributionTracker() {
  return (
    <Suspense fallback={null}>
      <Tracker />
    </Suspense>
  )
}
