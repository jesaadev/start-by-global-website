"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X, MessageCircle, ChevronDown, ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Locale } from "@/lib/i18n"
import { WhatsAppLink } from "@/components/whatsapp-link"
import { ThemeToggle } from "@/components/theme-toggle"
import { PERSONA_LANDINGS } from "@/lib/persona-landings"

type NavLink = { href: string; label: string }

// Navegación de venta: pocas opciones visibles y un único CTA. El resto de
// páginas vive en "Más" (desktop) y en el menú móvil.
const NAV: Record<Locale, {
  home: string
  items: NavLink[]
  cases: NavLink[]
  more: NavLink[]
  t: { more: string; cases: string; open: string; close: string; cta: string; nav: string; mobileNav: string; homeLabel: string }
}> = {
  es: {
    home: "/",
    items: [
      { href: "/diseno-paginas-web", label: "Diseño web" },
      { href: "/publicidad-ads", label: "Publicidad" },
      { href: "/portafolio", label: "Portafolio" },
      { href: "/insights", label: "Blog" },
    ],
    cases: Object.values(PERSONA_LANDINGS).map((l) => ({ href: `/${l.slug}`, label: l.persona })),
    more: [
      { href: "/servicios", label: "Todos los servicios" },
      { href: "/ia-automatizacion", label: "IA & Automatización" },
      { href: "/outsourcing", label: "Outsourcing" },
      { href: "/nosotros", label: "Nosotros" },
      { href: "/contacto", label: "Contacto" },
    ],
    t: {
      more: "Más",
      cases: "Soluciones por caso",
      open: "Abrir menú",
      close: "Cerrar menú",
      cta: "Hablar por WhatsApp",
      nav: "Principal",
      mobileNav: "Menú móvil",
      homeLabel: "Start By Global — inicio",
    },
  },
  en: {
    home: "/us",
    items: [
      { href: "/us/website-design", label: "Website Design" },
      { href: "/us/google-ads", label: "Google & Meta Ads" },
      { href: "/us/insights", label: "Insights" },
      { href: "/us/contact", label: "Contact" },
    ],
    cases: [],
    more: [{ href: "/", label: "Sitio en español" }],
    t: {
      more: "More",
      cases: "",
      open: "Open menu",
      close: "Close menu",
      cta: "Get a free quote",
      nav: "Main",
      mobileNav: "Mobile menu",
      homeLabel: "Start By Global — home",
    },
  },
}

const isActive = (pathname: string, href: string) =>
  href === "/" || href === "/us" ? pathname === href : pathname === href || pathname.startsWith(`${href}/`)

/** CTA de la barra: WhatsApp en español; en inglés, la página de contacto (el modal de WhatsApp es en español). */
function NavCTA({ locale, mobile, onClick, className, children }: { locale: Locale; mobile?: boolean; onClick?: () => void; className: string; children: React.ReactNode }) {
  if (locale === "en") {
    return (
      <Link href="/us/contact" onClick={onClick} className={className}>
        {children}
      </Link>
    )
  }
  return (
    <WhatsAppLink segment={mobile ? "nav_mobile" : "nav"} onClick={onClick} className={className}>
      {children}
    </WhatsAppLink>
  )
}

export function TopNav({ locale = "es" }: { locale?: Locale }) {
  const nav = NAV[locale]
  const [open, setOpen] = useState(false)
  const [moreOpen, setMoreOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()
  const moreRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  // Cierra los menús al navegar.
  useEffect(() => {
    setOpen(false)
    setMoreOpen(false)
  }, [pathname])

  // "Más": cierre con clic fuera o Escape.
  useEffect(() => {
    if (!moreOpen) return
    const onDown = (e: MouseEvent) => {
      if (moreRef.current && !moreRef.current.contains(e.target as Node)) setMoreOpen(false)
    }
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMoreOpen(false)
    document.addEventListener("mousedown", onDown)
    document.addEventListener("keydown", onKey)
    return () => {
      document.removeEventListener("mousedown", onDown)
      document.removeEventListener("keydown", onKey)
    }
  }, [moreOpen])

  const moreActive = [...nav.cases, ...nav.more].some((l) => l.href !== "/" && isActive(pathname, l.href))

  return (
    <header
      className={cn(
        "sticky top-0 z-40 transition-colors duration-300",
        scrolled || open ? "border-b border-border/50 bg-background/85 backdrop-blur-xl" : "bg-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        <Link href={nav.home} className="flex items-center shrink-0" onClick={() => setOpen(false)} aria-label={nav.t.homeLabel}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo-black.svg" alt="Start By Global" className="h-8 dark:invert" />
        </Link>

        <nav className="hidden lg:flex items-center gap-1" aria-label={nav.t.nav}>
          {nav.items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "px-3.5 py-2 rounded-lg text-sm font-medium transition-colors",
                isActive(pathname, item.href) ? "text-foreground bg-secondary/60" : "text-muted-foreground hover:text-foreground"
              )}
            >
              {item.label}
            </Link>
          ))}

          <div ref={moreRef} className="relative">
            <button
              type="button"
              onClick={() => setMoreOpen((v) => !v)}
              aria-expanded={moreOpen}
              aria-haspopup="true"
              className={cn(
                "flex items-center gap-1 px-3.5 py-2 rounded-lg text-sm font-medium transition-colors",
                moreActive || moreOpen ? "text-foreground bg-secondary/60" : "text-muted-foreground hover:text-foreground"
              )}
            >
              {nav.t.more}
              <ChevronDown className={cn("w-4 h-4 transition-transform motion-reduce:transition-none", moreOpen && "rotate-180")} />
            </button>
            {moreOpen && (
              <div className="absolute right-0 top-full mt-2 w-[min(36rem,calc(100vw-2rem))] rounded-2xl border border-border/60 bg-background/95 p-3 shadow-2xl shadow-black/20 backdrop-blur-xl">
                <div className={cn("grid gap-3", nav.cases.length ? "grid-cols-2" : "grid-cols-1")}>
                  {nav.cases.length > 0 && (
                    <div>
                      <p className="px-3 pt-1 pb-1.5 text-[11px] uppercase tracking-wider text-muted-foreground">{nav.t.cases}</p>
                      {nav.cases.map((l) => (
                        <Link key={l.href} href={l.href}
                          className="group flex items-center justify-between gap-2 rounded-lg px-3 py-2 text-sm text-foreground/85 hover:bg-secondary/60 hover:text-foreground">
                          {l.label}
                          <ArrowRight className="w-3.5 h-3.5 opacity-0 -translate-x-1 transition-all group-hover:opacity-100 group-hover:translate-x-0 motion-reduce:transition-none" />
                        </Link>
                      ))}
                    </div>
                  )}
                  <div>
                    <p className="px-3 pt-1 pb-1.5 text-[11px] uppercase tracking-wider text-muted-foreground">{nav.t.more}</p>
                    {nav.more.map((l) => (
                      <Link key={l.href} href={l.href}
                        className={cn(
                          "block rounded-lg px-3 py-2 text-sm hover:bg-secondary/60 hover:text-foreground",
                          l.href !== "/" && isActive(pathname, l.href) ? "text-foreground bg-secondary/40" : "text-foreground/85"
                        )}>
                        {l.label}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </nav>

        <div className="hidden lg:flex items-center gap-2 shrink-0">
          <ThemeToggle className="w-9 h-9 border border-border/60" />
          <NavCTA
            locale={locale}
            className={cn(
              "flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-shadow",
              locale === "en"
                ? "bg-primary text-primary-foreground hover:shadow-lg hover:shadow-primary/25"
                : "bg-[#25D366] text-white hover:shadow-lg hover:shadow-[#25D366]/25"
            )}
          >
            {locale === "es" && <MessageCircle className="w-4 h-4" />}
            {nav.t.cta}
            {locale === "en" && <ArrowRight className="w-4 h-4" />}
          </NavCTA>
        </div>

        <div className="lg:hidden flex items-center gap-2">
          {locale === "es" && (
            <WhatsAppLink
              segment="nav_mobile"
              aria-label="Hablar por WhatsApp"
              className="flex items-center justify-center w-10 h-10 rounded-xl bg-[#25D366] text-white"
            >
              <MessageCircle className="w-5 h-5" />
            </WhatsAppLink>
          )}
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="flex items-center justify-center w-10 h-10 rounded-xl border border-border/60 text-foreground"
            aria-label={open ? nav.t.close : nav.t.open}
            aria-expanded={open}
          >
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="lg:hidden border-t border-border/50 bg-background/95 backdrop-blur-xl max-h-[calc(100dvh-4rem)] overflow-y-auto">
          <nav className="max-w-7xl mx-auto px-4 py-4 flex flex-col gap-5" aria-label={nav.t.mobileNav}>
            <div className="flex flex-col gap-1">
              {nav.items.map((item) => (
                <Link key={item.href} href={item.href} onClick={() => setOpen(false)}
                  className="px-3 py-2.5 rounded-lg text-base font-semibold text-foreground hover:bg-secondary/50">
                  {item.label}
                </Link>
              ))}
            </div>
            {nav.cases.length > 0 && (
              <div>
                <p className="px-3 text-[11px] uppercase tracking-wider text-muted-foreground mb-1">{nav.t.cases}</p>
                {nav.cases.map((item) => (
                  <Link key={item.href} href={item.href} onClick={() => setOpen(false)}
                    className="block px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-secondary/50">
                    {item.label}
                  </Link>
                ))}
              </div>
            )}
            <div>
              <p className="px-3 text-[11px] uppercase tracking-wider text-muted-foreground mb-1">{nav.t.more}</p>
              {nav.more.map((item) => (
                <Link key={item.href} href={item.href} onClick={() => setOpen(false)}
                  className="block px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-secondary/50">
                  {item.label}
                </Link>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <NavCTA
                locale={locale}
                mobile
                onClick={() => setOpen(false)}
                className={cn(
                  "flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold",
                  locale === "en" ? "bg-primary text-primary-foreground" : "bg-[#25D366] text-white"
                )}
              >
                {locale === "es" && <MessageCircle className="w-4 h-4" />}
                {nav.t.cta}
              </NavCTA>
              <ThemeToggle className="w-12 h-12 border border-border/50" />
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
