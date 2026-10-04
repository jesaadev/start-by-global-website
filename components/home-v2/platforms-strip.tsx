import LogoLoop, { type LogoItem } from "@/components/reactbits/LogoLoop"
import { PLATFORMS } from "@/lib/home-content"

/** Franja infinita de plataformas con las que trabajamos (no son clientes). */
export function PlatformsStrip({ items = PLATFORMS, label = "Trabajamos con" }: { items?: readonly string[]; label?: string } = {}) {
  const logos: LogoItem[] = items.map((name) => ({
    node: (
      <span className="font-display text-lg sm:text-xl font-semibold text-muted-foreground/80 whitespace-nowrap">
        {name}
      </span>
    ),
    title: name,
  }))

  return (
    <section aria-label={label} className="border-y border-border/40 py-6">
      <p className="text-center text-[11px] uppercase tracking-[0.2em] text-muted-foreground mb-4">
        {label}
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
        ariaLabel={label}
      />
    </section>
  )
}
