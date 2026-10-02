"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ArrowRight, MessageCircle } from "lucide-react"
import type { Locale } from "@/lib/i18n"
import { WhatsAppLink } from "@/components/whatsapp-link"
import { DIAGNOSTIC_HREF } from "@/components/cta/secondary-cta"
import { cn } from "@/lib/utils"

/**
 * Barra de CTA fija en móvil: aparece al pasar el hero para que el CTA siempre
 * esté a un toque. Deja libre la esquina derecha para la burbuja del chat.
 * En inglés, un único botón a la página de contacto (el modal de WhatsApp es
 * en español).
 */
export function StickyMobileCTA({
  segment,
  showAfter = 560,
  secondaryHref = DIAGNOSTIC_HREF,
  secondaryLabel = "Diagnóstico",
  service,
  locale = "es",
}: {
  segment: string
  showAfter?: number
  /** Destino del botón secundario (en landings: el formulario de la misma página). */
  secondaryHref?: string
  secondaryLabel?: string
  /** Servicio preseleccionado en el modal de WhatsApp. */
  service?: string
  locale?: Locale
}) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > showAfter)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [showAfter])

  return (
    <div
      aria-hidden={!visible}
      className={cn(
        "md:hidden fixed bottom-3 left-3 right-20 z-40 flex gap-2 transition-all duration-300 motion-reduce:transition-none",
        visible ? "translate-y-0 opacity-100" : "translate-y-24 opacity-0 pointer-events-none"
      )}
    >
      {locale === "en" ? (
        <Link
          href="/us/contact"
          tabIndex={visible ? 0 : -1}
          className="flex-1 flex items-center justify-center gap-2 rounded-2xl bg-primary text-primary-foreground font-bold text-sm py-3.5 shadow-lg shadow-black/30"
        >
          Get a free quote
          <ArrowRight className="w-4 h-4" />
        </Link>
      ) : (
        <>
          <WhatsAppLink
            segment={segment}
            defaultService={service}
            className="flex-[1.6] flex items-center justify-center gap-2 rounded-2xl bg-[#25D366] text-white font-bold text-sm py-3.5 shadow-lg shadow-black/30"
          >
            <MessageCircle className="w-4 h-4" />
            WhatsApp
          </WhatsAppLink>
          <Link
            href={secondaryHref}
            tabIndex={visible ? 0 : -1}
            className="flex-1 flex items-center justify-center rounded-2xl border border-border bg-background/95 backdrop-blur text-foreground font-semibold text-sm py-3.5 shadow-lg shadow-black/30"
          >
            {secondaryLabel}
          </Link>
        </>
      )}
    </div>
  )
}
