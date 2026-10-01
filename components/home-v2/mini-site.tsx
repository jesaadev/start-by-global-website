import { MessageCircle } from "lucide-react"
import { cn } from "@/lib/utils"

/**
 * Mini landing ilustrativa en HTML (sin imágenes): se usa dentro de los mockups
 * cuando aún no hay trabajo publicado en el Showcase y en la animación de ads.
 */
export function MiniSite({ compact = false, className }: { compact?: boolean; className?: string }) {
  return (
    <div className={cn("absolute inset-0 flex flex-col bg-gradient-to-b from-[#141922] to-[#0d1117] text-white", className)}>
      {/* nav */}
      <div className={cn("flex items-center justify-between border-b border-white/5", compact ? "px-3 py-2" : "px-5 py-3")}>
        <div className="flex items-center gap-1.5">
          <span className={cn("rounded-md bg-primary", compact ? "w-3 h-3" : "w-4 h-4")} />
          <span className={cn("rounded-full bg-white/70", compact ? "h-1.5 w-10" : "h-2 w-14")} />
        </div>
        {!compact && (
          <div className="flex gap-3">
            <span className="h-1.5 w-8 rounded-full bg-white/20" />
            <span className="h-1.5 w-8 rounded-full bg-white/20" />
            <span className="h-1.5 w-8 rounded-full bg-white/20" />
          </div>
        )}
      </div>
      {/* hero */}
      <div className={cn("flex flex-col gap-2", compact ? "px-3 pt-4" : "px-6 pt-7 max-w-[70%]")}>
        <span className={cn("w-fit rounded-full bg-primary/20 text-primary font-semibold", compact ? "px-1.5 py-0.5 text-[6px]" : "px-2 py-0.5 text-[9px]")}>
          Diagnóstico gratis
        </span>
        <p className={cn("font-display font-bold leading-tight", compact ? "text-[11px]" : "text-xl")}>
          Más clientes para tu negocio, directo a tu WhatsApp
        </p>
        <span className={cn("rounded-full bg-white/15", compact ? "h-1 w-24" : "h-1.5 w-56")} />
        <span className={cn("rounded-full bg-white/15", compact ? "h-1 w-20" : "h-1.5 w-44")} />
        <span
          className={cn(
            "mt-1 inline-flex w-fit items-center gap-1 rounded-lg bg-[#25D366] font-bold text-white",
            compact ? "px-2 py-1 text-[7px]" : "px-3 py-1.5 text-[10px]"
          )}
        >
          <MessageCircle className={compact ? "w-2 h-2" : "w-3 h-3"} />
          Escríbenos por WhatsApp
        </span>
      </div>
      {/* tarjetas */}
      <div className={cn("mt-auto grid grid-cols-3", compact ? "gap-1.5 p-3" : "gap-3 p-5")}>
        {[0, 1, 2].map((i) => (
          <div key={i} className={cn("rounded-lg border border-white/5 bg-white/[0.04]", compact ? "h-8" : "h-16")}>
            <span className={cn("block rounded bg-primary/40", compact ? "m-1.5 h-1.5 w-1.5" : "m-2.5 h-3 w-3")} />
          </div>
        ))}
      </div>
    </div>
  )
}
