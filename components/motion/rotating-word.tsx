"use client"

import RotatingText from "@/components/reactbits/RotatingText"
import { useReducedMotion } from "@/hooks/use-reduced-motion"
import { cn } from "@/lib/utils"

/**
 * Palabra que rota dentro de un titular (React Bits·RotatingText). La primera
 * palabra se renderiza ya visible en SSR (animatePresenceInitial=false), así el
 * H1 cuenta para el LCP desde el primer paint. Con "reducir movimiento" se
 * queda fija en la primera palabra.
 */
export function RotatingWord({
  words,
  interval = 2400,
  className,
}: {
  words: string[]
  interval?: number
  className?: string
}) {
  const reduced = useReducedMotion()
  return (
    <RotatingText
      texts={words}
      auto={!reduced}
      rotationInterval={interval}
      animatePresenceInitial={false}
      animatePresenceMode="wait"
      staggerFrom="last"
      staggerDuration={0.02}
      initial={{ y: "100%", opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: "-110%", opacity: 0 }}
      transition={{ type: "spring", damping: 30, stiffness: 400 }}
      mainClassName={cn(
        "inline-flex overflow-hidden rounded-2xl bg-primary px-3 sm:px-4 pb-1 text-primary-foreground align-baseline",
        className
      )}
      splitLevelClassName="overflow-hidden"
    />
  )
}
