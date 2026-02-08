import { Globe } from "lucide-react"

export function Footer() {
  return (
    <footer className="glass-card rounded-xl p-6 mt-2">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary text-primary-foreground font-bold font-display text-xs">
            SG
          </div>
          <div>
            <p className="text-xs font-semibold text-foreground">Start By Global</p>
            <p className="text-[10px] text-muted-foreground">Soluciones Web & Marketing Digital</p>
          </div>
        </div>

        <div className="flex items-center gap-4 text-[10px] text-muted-foreground">
          <span className="flex items-center gap-1">
            <Globe className="w-3 h-3" />
            RD / ES / LATAM / US
          </span>
          <span>2026 Start By Global. Todos los derechos reservados.</span>
        </div>

        <div className="flex items-center gap-3">
          {["LinkedIn", "Instagram", "X"].map((social) => (
            <a
              key={social}
              href="#"
              className="px-3 py-1 rounded-md bg-secondary/60 text-[10px] text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
            >
              {social}
            </a>
          ))}
        </div>
      </div>
    </footer>
  )
}
