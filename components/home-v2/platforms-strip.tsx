import LogoLoop, { type LogoItem } from "@/components/reactbits/LogoLoop"
import { PLATFORMS } from "@/lib/home-content"

/** Franja infinita de plataformas con las que trabajamos (no son clientes). */
export function PlatformsStrip() {
  const logos: LogoItem[] = PLATFORMS.map((name) => ({
    node: (
      <span className="font-display text-lg sm:text-xl font-semibold text-muted-foreground/80 whitespace-nowrap">
        {name}
      </span>
    ),
    title: name,
  }))

  return (
    <section aria-label="Plataformas con las que trabajamos" className="border-y border-border/40 py-6">
      <p className="text-center text-[11px] uppercase tracking-[0.2em] text-muted-foreground mb-4">
        Trabajamos con
      </p>
      <LogoLoop
        logos={logos}
        speed={60}
        direction="left"
        logoHeight={28}
        gap={56}
        pauseOnHover
        fadeOut
        fadeOutColor="hsl(var(--background))"
        ariaLabel="Plataformas"
      />
    </section>
  )
}
