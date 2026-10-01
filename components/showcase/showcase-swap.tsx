"use client"

import CardSwap, { Card } from "@/components/reactbits/CardSwap"
import { BrowserMockup } from "@/components/mockups/browser-mockup"
import { useIsDesktop, useReducedMotion } from "@/hooks/use-reduced-motion"

export interface ShowcaseCardData {
  id: string
  title: string
  domain: string | null
  desktop_image: string
}

/**
 * Webs de clientes como ventanas de navegador apiladas que rotan
 * (React Bits·CardSwap). Al pasar el cursor se pausa la rotación y la captura
 * hace "scroll". Con un solo trabajo o "reducir movimiento": mockup estático.
 */
export function ShowcaseSwap({ items }: { items: ShowcaseCardData[] }) {
  const reduced = useReducedMotion()
  const desktop = useIsDesktop(768)

  if (items.length < 2 || reduced) {
    const it = items[0]
    return <BrowserMockup src={it.desktop_image} alt={it.title} domain={it.domain ?? undefined} />
  }

  const width = desktop ? 540 : 300
  const height = Math.round(width * 0.625) + 36 // 16:10 + barra del navegador

  return (
    <div className="relative" style={{ height: height + (items.length - 1) * 50 + 40 }}>
      <CardSwap
        width={width}
        height={height}
        cardDistance={desktop ? 44 : 26}
        verticalDistance={desktop ? 50 : 30}
        delay={4500}
        pauseOnHover
        skewAmount={3}
        easing="elastic"
        containerClassName="absolute left-[44%] top-[58%] -translate-x-1/2 -translate-y-1/2"
      >
        {items.map((it) => (
          <Card key={it.id} customClass="!border-0 !bg-transparent">
            <BrowserMockup src={it.desktop_image} alt={it.title} domain={it.domain ?? undefined} sizes={`${width}px`} />
          </Card>
        ))}
      </CardSwap>
    </div>
  )
}
