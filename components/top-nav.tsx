"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X, MessageCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import { WhatsAppLink } from "@/components/whatsapp-link"
import { ThemeToggle } from "@/components/theme-toggle"
import { PERSONA_LANDINGS } from "@/lib/persona-landings"

// Navegación de venta: pocas opciones y un único CTA (WhatsApp).
const NAV_ITEMS = [
  { href: "/diseno-paginas-web", label: "Diseño web" },
  { href: "/publicidad-ads", label: "Publicidad" },
  { href: "/portafolio", label: "Portafolio" },
  { href: "/insights", label: "Blog" },
]

// En el menú móvil: accesos directos a cada caso + el resto de páginas.
const CASES = Object.values(PERSONA_LANDINGS).map((l) => ({ href: `/${l.slug}`, label: l.persona }))
const MORE = [
  { href: "/ia-automatizacion", label: "IA & Automatización" },
  { href: "/outsourcing", label: "Outsourcing" },
  { href: "/nosotros", label: "Nosotros" },
  { href: "/contacto", label: "Contacto" },
]

export function TopNav() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <header
      className={cn(
        "sticky top-0 z-40 transition-colors duration-300",
        scrolled || open ? "border-b border-border/50 bg-background/85 backdrop-blur-xl" : "bg-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        <Link href="/" className="flex items-center shrink-0" onClick={() => setOpen(false)} aria-label="Start By Global — inicio">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo-black.svg" alt="Start By Global" className="h-8 dark:invert" />
        </Link>

        <nav className="hidden lg:flex items-center gap-1" aria-label="Principal">
          {NAV_ITEMS.map((item) => {
            const active = pathname === item.href || pathname.startsWith(`${item.href}/`)
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "px-3.5 py-2 rounded-lg text-sm font-medium transition-colors",
                  active ? "text-foreground bg-secondary/60" : "text-muted-foreground hover:text-foreground"
                )}
              >
                {item.label}
              </Link>
            )
          })}
        </nav>

        <div className="hidden lg:flex items-center gap-2 shrink-0">
          <ThemeToggle className="w-9 h-9 border border-border/60" />
          <WhatsAppLink
            segment="nav"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#25D366] text-white text-sm font-bold hover:shadow-lg hover:shadow-[#25D366]/25 transition-shadow"
          >
            <MessageCircle className="w-4 h-4" />
            Hablar por WhatsApp
          </WhatsAppLink>
        </div>

        <div className="lg:hidden flex items-center gap-2">
          <WhatsAppLink
            segment="nav_mobile"
            aria-label="Hablar por WhatsApp"
            className="flex items-center justify-center w-10 h-10 rounded-xl bg-[#25D366] text-white"
          >
            <MessageCircle className="w-5 h-5" />
          </WhatsAppLink>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="flex items-center justify-center w-10 h-10 rounded-xl border border-border/60 text-foreground"
            aria-label={open ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={open}
          >
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="lg:hidden border-t border-border/50 bg-background/95 backdrop-blur-xl max-h-[calc(100dvh-4rem)] overflow-y-auto">
          <nav className="max-w-7xl mx-auto px-4 py-4 flex flex-col gap-5" aria-label="Menú móvil">
            <div className="flex flex-col gap-1">
              {NAV_ITEMS.map((item) => (
                <Link key={item.href} href={item.href} onClick={() => setOpen(false)}
                  className="px-3 py-2.5 rounded-lg text-base font-semibold text-foreground hover:bg-secondary/50">
                  {item.label}
                </Link>
              ))}
            </div>
            <div>
              <p className="px-3 text-[11px] uppercase tracking-wider text-muted-foreground mb-1">Soluciones por caso</p>
              {CASES.map((item) => (
                <Link key={item.href} href={item.href} onClick={() => setOpen(false)}
                  className="block px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-secondary/50">
                  {item.label}
                </Link>
              ))}
            </div>
            <div>
              <p className="px-3 text-[11px] uppercase tracking-wider text-muted-foreground mb-1">Más</p>
              {MORE.map((item) => (
                <Link key={item.href} href={item.href} onClick={() => setOpen(false)}
                  className="block px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-secondary/50">
                  {item.label}
                </Link>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <WhatsAppLink segment="nav_mobile" onClick={() => setOpen(false)}
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-[#25D366] text-white font-bold">
                <MessageCircle className="w-4 h-4" />
                Hablar por WhatsApp
              </WhatsAppLink>
              <ThemeToggle className="w-12 h-12 border border-border/50" />
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
