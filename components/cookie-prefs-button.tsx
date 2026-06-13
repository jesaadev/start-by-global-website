"use client"

import { openConsentPreferences } from "@/lib/consent"
import { cn } from "@/lib/utils"

/** Botón/enlace que reabre el panel de preferencias de cookies. */
export function CookiePrefsButton({
  className,
  label = "Configurar cookies",
  variant = "button",
}: {
  className?: string
  label?: string
  variant?: "button" | "link"
}) {
  if (variant === "link") {
    return (
      <button
        type="button"
        onClick={openConsentPreferences}
        className={cn("hover:text-foreground transition-colors", className)}
      >
        {label}
      </button>
    )
  }
  return (
    <button
      type="button"
      onClick={openConsentPreferences}
      className={cn(
        "inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold",
        "border border-border text-foreground hover:bg-secondary/60 transition-colors",
        className
      )}
    >
      {label}
    </button>
  )
}
