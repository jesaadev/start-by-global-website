"use client"

import { useEffect, useState } from "react"
import { useTheme } from "next-themes"
import { Sun, Moon } from "lucide-react"
import { cn } from "@/lib/utils"

/** Botón para alternar entre tema claro y oscuro. */
export function ThemeToggle({ className }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  const isDark = resolvedTheme === "dark"
  // El tema real solo se conoce en el cliente: hasta montar, textos neutros
  // (iguales en SSR y en la hidratación) para evitar el mismatch.
  const label = !mounted ? "Cambiar tema" : isDark ? "Activar modo claro" : "Activar modo oscuro"
  const title = !mounted ? "Cambiar tema" : isDark ? "Modo claro" : "Modo oscuro"

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={label}
      title={title}
      className={cn(
        "flex items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary/60 transition-colors",
        className
      )}
    >
      {/* Hasta montar, se reserva el espacio sin icono para evitar mismatch de hidratación */}
      {mounted ? (
        isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />
      ) : (
        <span className="w-4 h-4" />
      )}
    </button>
  )
}
