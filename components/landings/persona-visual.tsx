import type { ReactNode } from "react"
import { BadgeCheck } from "lucide-react"
import type { PersonaLandingData } from "@/lib/persona-landings"
import type { ShowcaseItem } from "@/lib/showcase"
import { DeviceDuo } from "@/components/mockups/device-duo"
import { BrowserMockup } from "@/components/mockups/browser-mockup"
import { Tilt } from "@/components/motion/tilt"
import { MiniSite } from "@/components/home-v2/mini-site"
import { MiniStore, MiniDashboard, MiniPersonal } from "@/components/landings/illustrations"

type Visual = PersonaLandingData["visual"]

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
export function PersonaVisual({ data, work }: { data: PersonaLandingData; work: ShowcaseItem[] }) {
  const real = work.find((i) => i.desktop_image)
  if (real?.desktop_image) {
    return (
      <div>
        <DeviceDuo
          desktopSrc={real.desktop_image}
          mobileSrc={real.mobile_image ?? undefined}
          alt={real.title}
          domain={real.domain ?? undefined}
          priority
        />
        <p className="mt-4 text-xs text-muted-foreground text-center lg:text-left">
          Trabajo real: <span className="font-medium text-foreground">{real.client_name ?? real.title}</span>
          {data.visual === "agency" && " · así entregamos bajo la marca de tu agencia"}
        </p>
      </div>
    )
  }

  const ill = ILLUSTRATION[data.visual]
  return (
    <div className="relative">
      <Tilt>
        <BrowserMockup domain={ill.domain}>{ill.screen}</BrowserMockup>
      </Tilt>
      {data.visual === "agency" && (
        <span className="absolute -top-3 right-4 inline-flex items-center gap-1.5 rounded-full border border-[#7B61FF]/30 bg-background/90 px-3 py-1 text-xs font-semibold text-[#9d88ff] shadow-lg backdrop-blur">
          <BadgeCheck className="h-3.5 w-3.5" /> Entregado con tu marca
        </span>
      )}
      <p className="mt-3 text-center text-[11px] text-muted-foreground lg:text-left">Ejemplo ilustrativo</p>
    </div>
  )
}
