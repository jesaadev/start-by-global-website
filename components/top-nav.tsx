"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { WhatsAppLink } from "@/components/whatsapp-link"
import { ThemeToggle } from "@/components/theme-toggle"

const NAV_ITEMS = [
  { href: "/", label: "Inicio" },
  { href: "/servicios", label: "Servicios" },
  { href: "/outsourcing", label: "Outsourcing" },
  { href: "/ia-automatizacion", label: "IA & Automatización" },
  { href: "/publicidad-ads", label: "Publicidad & Ads" },
  { href: "/portafolio", label: "Portafolio" },
  { href: "/insights", label: "Insights" },
  { href: "/nosotros", label: "Nosotros" },
]

/** Navegación horizontal de agencia (variante B del A/B de la home). */
export function TopNav() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-40 border-b border-border/50 bg-background/85 backdrop-blur-xl">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-3 shrink-0" onClick={() => setOpen(false)}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo-black.svg" alt="Start By Global" className="h-9 dark:invert" />
        </Link>

        {/* Links (desktop) */}
        <nav className="hidden lg:flex items-center gap-1">
          {NAV_ITEMS.map((item) => {
            const active = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                  active ? "text-foreground bg-secondary/60" : "text-muted-foreground hover:text-foreground hover:bg-secondary/40"
                )}
              >
                {item.label}
              </Link>
            )
          })}
        </nav>

        {/* CTAs (desktop) */}
        <div className="hidden lg:flex items-center gap-2 shrink-0">
          <ThemeToggle className="w-9 h-9 border border-border/60" />
          <WhatsAppLink segment="nav" className="px-3 py-2 rounded-lg text-sm font-medium border border-border text-foreground hover:bg-secondary/60 transition-colors">
            WhatsApp
          </WhatsAppLink>
          <Link
            href="/contacto"
            className="px-4 py-2 rounded-lg text-sm font-semibold bg-primary text-primary-foreground hover:shadow-lg hover:shadow-primary/25 transition-all"
          >
            Iniciar Proyecto
          </Link>
        </div>

        {/* Mobile controls */}
        <div className="lg:hidden flex items-center gap-2">
          <ThemeToggle className="w-10 h-10 border border-border/50" />
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="flex items-center justify-center w-10 h-10 rounded-lg border border-border/50 text-foreground"
            aria-label={open ? "Cerrar menú" : "Abrir menú"}
          >
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile panel */}
      {open && (
        <div className="lg:hidden border-t border-border/50 bg-background/95 backdrop-blur-xl">
          <nav className="max-w-[1400px] mx-auto px-4 py-3 flex flex-col gap-1">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-colors"
              >
                {item.label}
              </Link>
            ))}
            <div className="flex gap-2 pt-2">
              <WhatsAppLink segment="nav" onClick={() => setOpen(false)} className="flex-1 text-center px-3 py-2.5 rounded-lg text-sm font-medium border border-border text-foreground">
                WhatsApp
              </WhatsAppLink>
              <Link
                href="/contacto"
                onClick={() => setOpen(false)}
                className="flex-1 text-center px-3 py-2.5 rounded-lg text-sm font-semibold bg-primary text-primary-foreground"
              >
                Iniciar Proyecto
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
