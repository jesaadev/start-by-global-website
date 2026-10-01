import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"

/** Diagnóstico gratuito = formulario de 3 campos de la landing PYME. */
export const DIAGNOSTIC_HREF = "/web-que-genera-clientes#contacto"

interface SecondaryCTAProps {
  label?: string
  href?: string
  className?: string
}

/** CTA secundario (nunca compite visualmente con el principal). */
export function SecondaryCTA({ label = "Diagnóstico gratis", href = DIAGNOSTIC_HREF, className }: SecondaryCTAProps) {
  return (
    <Link
      href={href}
      className={cn(
        "group inline-flex items-center justify-center gap-2 px-6 py-4 rounded-[20px] border border-border bg-background/40 text-foreground font-semibold text-sm sm:text-base backdrop-blur-sm transition-colors hover:bg-secondary/70",
        className
      )}
    >
      {label}
      <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none" />
    </Link>
  )
}
