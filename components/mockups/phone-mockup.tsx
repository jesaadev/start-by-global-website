import type { ReactNode } from "react"
import Image from "next/image"
import { cn } from "@/lib/utils"

interface PhoneMockupProps {
  /** Captura móvil (ancho ~390px, idealmente página completa). */
  src?: string
  alt?: string
  /** Contenido HTML a mostrar en pantalla en lugar de una captura. */
  children?: ReactNode
  scrollOnHover?: boolean
  priority?: boolean
  sizes?: string
  className?: string
}

/** Marco de teléfono con la versión móvil de la web (o contenido HTML). */
export function PhoneMockup({
  src,
  alt = "",
  children,
  scrollOnHover = true,
  priority = false,
  sizes = "200px",
  className,
}: PhoneMockupProps) {
  return (
    <div
      className={cn(
        "group/phone relative rounded-[2.2rem] border-[6px] border-[#1f2430] bg-[#0d1117] p-1 shadow-2xl shadow-black/50",
        className
      )}
    >
      {/* Isla / notch */}
      <span aria-hidden className="absolute top-2.5 left-1/2 -translate-x-1/2 z-10 h-4 w-16 rounded-full bg-black" />
      <div className="relative aspect-[9/19.5] overflow-hidden rounded-[1.7rem]">
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
                "transition-[object-position] [transition-duration:5000ms] ease-in-out group-hover/phone:object-bottom motion-reduce:transition-none"
            )}
          />
        ) : (
          children
        )}
      </div>
    </div>
  )
}
