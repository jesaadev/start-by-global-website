import type { ReactNode } from "react"
import { HeroBackground } from "@/components/backgrounds/hero-background"
import { HighlightTitle } from "@/components/typography/highlight-title"
import { cn } from "@/lib/utils"

interface PageHeroProps {
  badge?: string
  title: string
  /** Frase del título que va en color con subrayado animado. */
  highlight?: string
  subtitle?: ReactNode
  /** Fila de CTAs. */
  children?: ReactNode
  /** Microcopy bajo los CTAs. */
  note?: ReactNode
  /** Visual a la derecha (mockup, ilustración). Sin él, el texto ocupa el ancho. */
  aside?: ReactNode
  size?: "xl" | "lg"
  /** Color de los rayos del fondo (desktop). */
  glow?: string
}

/**
 * Encabezado de las páginas internas con el sistema de venta: badge, H1 grande
 * con la frase clave destacada, subtítulo y CTAs. Todo SSR y visible en el
 * primer paint (la animación solo decora: subrayado CSS + fondo diferido).
 */
export function PageHero({ badge, title, highlight, subtitle, children, note, aside, size = "xl", glow }: PageHeroProps) {
  return (
    <section className="relative overflow-hidden">
      <HeroBackground color={glow} />
      <div
        className={cn(
          "relative max-w-7xl mx-auto px-4 sm:px-6 pt-10 sm:pt-16 lg:pt-20 pb-14 sm:pb-20",
          aside && "grid grid-cols-1 lg:grid-cols-[1.05fr_1fr] gap-12 lg:gap-10 items-center"
        )}
      >
        <div className={cn("flex flex-col gap-6", !aside && "max-w-4xl")}>
          {badge && (
            <span className="inline-flex w-fit items-center gap-2 rounded-full border border-primary/25 bg-primary/10 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wide text-primary">
              <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse motion-reduce:animate-none" />
              {badge}
            </span>
          )}
          <h1
            className={cn(
              "font-display font-bold tracking-tight leading-[1.04] text-balance",
              size === "xl" ? "text-[2.4rem] sm:text-6xl xl:text-[4.25rem]" : "text-[2.25rem] sm:text-5xl xl:text-6xl"
            )}
          >
            <HighlightTitle text={title} highlight={highlight} />
          </h1>
          {subtitle && <p className="text-lg sm:text-xl text-foreground/75 leading-relaxed max-w-2xl">{subtitle}</p>}
          {children && <div className="flex flex-wrap items-center gap-3">{children}</div>}
          {note && <p className="text-sm text-muted-foreground max-w-xl">{note}</p>}
        </div>
        {aside}
      </div>
    </section>
  )
}
