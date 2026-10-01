import { BrowserMockup } from "@/components/mockups/browser-mockup"
import { PhoneMockup } from "@/components/mockups/phone-mockup"
import { Tilt } from "@/components/motion/tilt"
import { cn } from "@/lib/utils"

interface DeviceDuoProps {
  desktopSrc: string
  mobileSrc?: string
  alt: string
  domain?: string
  priority?: boolean
  /** Inclinación 3D que sigue al cursor (desktop). */
  tilt?: boolean
  className?: string
}

/** Web del cliente en escritorio + móvil superpuestos, listos para el hero. */
export function DeviceDuo({ desktopSrc, mobileSrc, alt, domain, priority, tilt = true, className }: DeviceDuoProps) {
  const content = (
    <div className={cn("relative", mobileSrc && "pr-[12%] pb-[9%]", className)}>
      <BrowserMockup src={desktopSrc} alt={alt} domain={domain} priority={priority} />
      {mobileSrc && (
        <PhoneMockup
          src={mobileSrc}
          alt={`${alt} — versión móvil`}
          priority={priority}
          className="absolute bottom-0 right-0 w-[27%] min-w-[92px]"
        />
      )}
    </div>
  )
  return tilt ? <Tilt>{content}</Tilt> : content
}
