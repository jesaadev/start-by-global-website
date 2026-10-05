import type { ReactNode } from "react"
import { BadgeCheck } from "lucide-react"
import type { PersonaLandingData } from "@/lib/persona-landings"
import type { Locale } from "@/lib/i18n"
import type { ShowcaseItem } from "@/lib/showcase"
import { DeviceDuo } from "@/components/mockups/device-duo"
import { BrowserMockup } from "@/components/mockups/browser-mockup"
import { Tilt } from "@/components/motion/tilt"
import { MiniSite } from "@/components/home-v2/mini-site"
import { MiniStore, MiniDashboard, MiniPersonal } from "@/components/landings/illustrations"

type Visual = PersonaLandingData["visual"]

const CAPTION = {
  es: { real: "Trabajo real:", agency: " · así entregamos bajo la marca de tu agencia", badge: "Entregado con tu marca", example: "Ejemplo ilustrativo" },
  en: { real: "Real work:", agency: " · delivered under your agency's brand", badge: "Delivered under your brand", example: "Illustrative example" },
} as const

const ILLUSTRATION: Record<Visual, { domain: string; screen: ReactNode }> = {
  web: { domain: "tunegocio.com", screen: <MiniSite /> },
  agency: { domain: "tucliente.com", screen: <MiniSite /> },
  store: { domain: "tutienda.com", screen: <MiniStore /> },
  dashboard: { domain: "panel.tuempresa.com", screen: <MiniDashboard /> },
  personal: { domain: "tunombre.com", screen: <MiniPersonal /> },
}

/**
 * Trabajo real relevante para una landing: lo vinculado a ella en el Showcase y,
 * para webs y white-label, cualquier web real publicada (es el mismo entregable).
 */
export function relevantWork(data: PersonaLandingData, items: ShowcaseItem[]): ShowcaseItem[] {
  const linked = items.filter((i) => i.persona === data.segment)
  if (linked.length || (data.visual !== "web" && data.visual !== "agency")) return linked
  return items
}

/** Visual del hero de la landing: trabajo real si lo hay; si no, ilustración. */
export function PersonaVisual({ visual, work, locale = "es" }: { visual: Visual; work: ShowcaseItem[]; locale?: Locale }) {
  const t = CAPTION[locale]
  const real = work.find((i) => i.desktop_image)
  if (real?.desktop_image) {
    return (
      <div>
        <DeviceDuo
          desktopSrc={real.desktop_image}
          mobileSrc={real.mobile_image ?? undefined}
          alt={real.title}
          domain={real.domain ?? undefined}
        />
        <p className="mt-4 text-xs text-muted-foreground text-center lg:text-left">
          {t.real} <span className="font-medium text-foreground">{real.client_name ?? real.title}</span>
          {visual === "agency" && t.agency}
        </p>
      </div>
    )
  }

  const ill = ILLUSTRATION[visual]
  // En inglés solo se usan las variantes de web y white-label.
  const en = locale === "en" && (visual === "web" || visual === "agency")
  const screen = en ? <MiniSite locale="en" /> : ill.screen
  const domain = en ? (visual === "web" ? "yourbusiness.com" : "yourclient.com") : ill.domain
  return (
    <div className="relative">
      <Tilt>
        <BrowserMockup domain={domain}>{screen}</BrowserMockup>
      </Tilt>
      {visual === "agency" && (
        <span className="absolute -top-3 right-4 inline-flex items-center gap-1.5 rounded-full border border-[#7B61FF]/30 bg-background/90 px-3 py-1 text-xs font-semibold text-[#9d88ff] shadow-lg backdrop-blur">
          <BadgeCheck className="h-3.5 w-3.5" /> {t.badge}
        </span>
      )}
      <p className="mt-3 text-center text-[11px] text-muted-foreground lg:text-left">{t.example}</p>
    </div>
  )
}
