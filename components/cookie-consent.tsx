"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Cookie, ToggleLeft, ToggleRight, X } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  setConsent,
  shouldShowBanner,
  getConsent,
  OPEN_CONSENT_EVENT,
  type ConsentCategories,
} from "@/lib/consent"

function ToggleRow({
  label,
  desc,
  value,
  onChange,
  locked,
}: {
  label: string
  desc: string
  value: boolean
  onChange?: (v: boolean) => void
  locked?: boolean
}) {
  return (
    <div className="flex items-start justify-between gap-3 py-2.5">
      <div className="min-w-0">
        <p className="text-sm font-medium text-foreground">{label}</p>
        <p className="text-xs text-muted-foreground leading-relaxed">{desc}</p>
      </div>
      <button
        type="button"
        disabled={locked}
        onClick={() => onChange?.(!value)}
        className={cn("shrink-0 mt-0.5", locked && "opacity-60 cursor-not-allowed")}
        aria-label={label}
      >
        {value ? (
          <ToggleRight className="w-7 h-7 text-chart-3" />
        ) : (
          <ToggleLeft className="w-7 h-7 text-muted-foreground" />
        )}
      </button>
    </div>
  )
}

export function CookieConsent() {
  const [visible, setVisible] = useState(false)
  const [showPrefs, setShowPrefs] = useState(false)
  const [prefs, setPrefs] = useState<ConsentCategories>({ analytics: false, marketing: false })

  // Mostrar el banner solo en la UE sin decisión previa; permitir reabrir.
  useEffect(() => {
    if (shouldShowBanner()) setVisible(true)
    const open = () => {
      const c = getConsent()
      setPrefs({ analytics: c.analytics, marketing: c.marketing })
      setShowPrefs(true)
      setVisible(true)
    }
    window.addEventListener(OPEN_CONSENT_EVENT, open)
    return () => window.removeEventListener(OPEN_CONSENT_EVENT, open)
  }, [])

  if (!visible) return null

  const acceptAll = () => {
    setConsent({ analytics: true, marketing: true })
    setVisible(false)
  }
  const rejectAll = () => {
    setConsent({ analytics: false, marketing: false })
    setVisible(false)
  }
  const savePrefs = () => {
    setConsent(prefs)
    setVisible(false)
  }

  return (
    <div className="fixed inset-x-0 bottom-0 z-[10000] p-3 sm:p-4 pointer-events-none">
      <div className="pointer-events-auto mx-auto max-w-2xl rounded-2xl border border-border/60 bg-card/95 backdrop-blur-xl shadow-2xl">
        {!showPrefs ? (
          <div className="p-5 space-y-4">
            <div className="flex items-start gap-3">
              <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-primary/10 border border-primary/20 shrink-0">
                <Cookie className="w-5 h-5 text-primary" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-foreground">Tu privacidad</p>
                <p className="text-xs text-muted-foreground leading-relaxed mt-1">
                  Usamos cookies propias y de terceros para analítica y marketing. Puedes aceptarlas
                  todas, rechazarlas o configurarlas. Consulta nuestra{" "}
                  <Link href="/cookies" className="text-primary hover:underline">Política de Cookies</Link>.
                </p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 sm:justify-end">
              <button
                type="button"
                onClick={() => setShowPrefs(true)}
                className="px-4 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary/60 transition-colors order-3 sm:order-1"
              >
                Personalizar
              </button>
              <button
                type="button"
                onClick={rejectAll}
                className="px-4 py-2 rounded-lg text-sm font-semibold border border-border text-foreground hover:bg-secondary/60 transition-colors order-2"
              >
                Rechazar
              </button>
              <button
                type="button"
                onClick={acceptAll}
                className="px-4 py-2 rounded-lg text-sm font-semibold bg-primary text-primary-foreground hover:shadow-lg hover:shadow-primary/25 transition-all order-1 sm:order-3"
              >
                Aceptar todo
              </button>
            </div>
          </div>
        ) : (
          <div className="p-5 space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-foreground">Preferencias de cookies</p>
              <button type="button" onClick={() => setVisible(false)} aria-label="Cerrar">
                <X className="w-4 h-4 text-muted-foreground hover:text-foreground" />
              </button>
            </div>
            <div className="divide-y divide-border/40">
              <ToggleRow
                label="Necesarias"
                desc="Imprescindibles para el funcionamiento del sitio. Siempre activas."
                value
                locked
              />
              <ToggleRow
                label="Analítica"
                desc="Nos ayudan a entender el uso del sitio (Google Analytics, Tag Manager, Clarity)."
                value={prefs.analytics}
                onChange={(v) => setPrefs((p) => ({ ...p, analytics: v }))}
              />
              <ToggleRow
                label="Marketing"
                desc="Medición de campañas y publicidad (Meta Pixel, TikTok) y atribución de visitas."
                value={prefs.marketing}
                onChange={(v) => setPrefs((p) => ({ ...p, marketing: v }))}
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-2 sm:justify-end pt-1">
              <button
                type="button"
                onClick={rejectAll}
                className="px-4 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary/60 transition-colors"
              >
                Rechazar todo
              </button>
              <button
                type="button"
                onClick={savePrefs}
                className="px-4 py-2 rounded-lg text-sm font-semibold bg-primary text-primary-foreground hover:shadow-lg hover:shadow-primary/25 transition-all"
              >
                Guardar preferencias
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
