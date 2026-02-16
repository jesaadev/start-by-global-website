import { Globe } from "lucide-react"
import Link from "next/link"

export function Footer() {
  return (
    <footer className="glass-card rounded-xl p-6 mt-2">
      <div className="flex flex-col gap-6">
        {/* Top row */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-3">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary text-primary-foreground font-bold font-display text-xs">
                SG
              </div>
              <div>
                <p className="text-xs font-semibold text-foreground">Start By Global</p>
                <p className="text-[10px] text-muted-foreground">Soluciones Web & Marketing Digital</p>
              </div>
            </Link>
          </div>

          <div className="flex items-center gap-3">
            {["LinkedIn", "Instagram", "X"].map((social) => (
              <a
                key={social}
                href="#"
                className="px-3 py-1.5 rounded-md bg-secondary/60 text-[10px] text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
              >
                {social}
              </a>
            ))}
          </div>
        </div>

        {/* Links row */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-8 border-t border-border/50 pt-4">
          <nav className="flex items-center gap-4 flex-wrap">
            {[
              { label: "Dashboard", href: "/" },
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
            <span>2026 Start By Global</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
