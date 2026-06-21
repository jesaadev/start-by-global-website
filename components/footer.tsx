import { Globe } from "lucide-react"
import Link from "next/link"
import { CookiePrefsButton } from "@/components/cookie-prefs-button"

export function Footer() {
  return (
    <footer className="glass-card rounded-xl p-6 mt-2">
      <div className="flex flex-col gap-6">
        {/* Top row */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-3">
              <img
                src="/logo-black.svg"
                alt="Start By Global"
                className="h-10 dark:invert"
              />
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="https://www.instagram.com/startbyglobal/"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 rounded-md bg-secondary/60 text-[10px] text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
            >
              Instagram
            </a>
          </div>
        </div>

        {/* Links row */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-8 border-t border-border/50 pt-4">
          <nav className="flex items-center gap-4 flex-wrap">
            {[
              { label: "Inicio", href: "/" },
              { label: "Servicios", href: "/servicios" },
              { label: "Portafolio", href: "/portafolio" },
              { label: "Nosotros", href: "/nosotros" },
              { label: "Contacto", href: "/contacto" },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-[11px] text-muted-foreground hover:text-foreground transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="sm:ml-auto flex items-center gap-4 text-[10px] text-muted-foreground flex-wrap">
            <a href="mailto:info@startbyglobal.com" className="hover:text-primary transition-colors">
              info@startbyglobal.com
            </a>
            <span className="flex items-center gap-1">
              <Globe className="w-3 h-3" />
              RD / ES / LATAM / US
            </span>
            <span>© 2026 Start By Global</span>
          </div>
        </div>

        {/* Legal row */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-border/50 pt-4 text-[10px] text-muted-foreground">
          <Link href="/privacidad" className="hover:text-foreground transition-colors">Privacidad</Link>
          <Link href="/cookies" className="hover:text-foreground transition-colors">Cookies</Link>
          <Link href="/aviso-legal" className="hover:text-foreground transition-colors">Aviso Legal</Link>
          <CookiePrefsButton variant="link" className="text-[10px] text-muted-foreground" />
        </div>
      </div>
    </footer>
  )
}
