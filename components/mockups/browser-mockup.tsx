import type { ReactNode } from "react"
import Image from "next/image"
import { Lock } from "lucide-react"
import { cn } from "@/lib/utils"

interface BrowserMockupProps {
  /** Captura de la web (idealmente de página completa, ancho ~1440px). */
  src?: string
  alt?: string
  /** Contenido HTML a mostrar en pantalla en lugar de una captura. */
  children?: ReactNode
  /** Dominio mostrado en la barra de direcciones. */
  domain?: string
  /** Al pasar el cursor, la captura se desplaza hasta abajo (efecto "scroll"). */
  scrollOnHover?: boolean
  priority?: boolean
  sizes?: string
  className?: string
}

/** "https://www.cliente.com/" → "www.cliente.com" para la barra de direcciones. */
function displayDomain(d: string): string {
  return d.replace(/^https?:\/\//i, "").replace(/\/+$/, "")
}

/**
 * Ventana de navegador con la captura de la web de un cliente (o contenido HTML
 * ilustrativo vía children). El "scroll" es CSS puro: la imagen cubre el marco
 * anclada arriba y al hover transiciona object-position hasta abajo.
 */
export function BrowserMockup({
  src,
  alt = "",
  children,
  domain,
  scrollOnHover = true,
  priority = false,
  sizes = "(max-width: 768px) 92vw, 640px",
  className,
}: BrowserMockupProps) {
  return (
    <div
      className={cn(
        "group/mock overflow-hidden rounded-xl border border-white/10 bg-[#0d1117] shadow-2xl shadow-black/40",
        className
      )}
    >
      {/* Barra del navegador */}
      <div className="flex items-center gap-3 px-3.5 h-9 bg-[#161b22] border-b border-white/5">
        <div className="flex gap-1.5 shrink-0" aria-hidden>
          <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
        </div>
        {domain && (
          <div className="flex-1 min-w-0 flex items-center justify-center gap-1.5 h-6 rounded-md bg-black/30 px-3 text-[11px] text-white/55">
            <Lock className="w-3 h-3 shrink-0" aria-hidden />
            <span className="truncate">{displayDomain(domain)}</span>
          </div>
        )}
      </div>
      {/* Pantalla */}
      <div className="relative aspect-[16/10] overflow-hidden">
        {src ? (
          <Image
            src={src}
            alt={alt}
            fill
            priority={priority}
            sizes={sizes}
            className={cn(
              "object-cover object-top",
              scrollOnHover &&
                "transition-[object-position] [transition-duration:6000ms] ease-in-out group-hover/mock:object-bottom motion-reduce:transition-none"
            )}
          />
        ) : (
          children
        )}
      </div>
    </div>
  )
}
