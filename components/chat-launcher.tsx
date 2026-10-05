"use client"

import { useEffect, useState } from "react"
import dynamic from "next/dynamic"
import { MessageCircle } from "lucide-react"
import { useLocale } from "@/lib/i18n"

// El chat completo (≈800 líneas + iconos) fuera del JavaScript inicial: se
// descarga cuando el navegador queda libre tras la carga, o al tocar el botón.
const ChatWidget = dynamic(() => import("@/components/chat-widget").then((m) => m.ChatWidget), { ssr: false })

/** Margen tras el evento load antes de precargar el chat (no compite con el LCP/INP inicial). */
const PRELOAD_DELAY_MS = 3000

/**
 * Botón flotante ligero con el mismo aspecto que el del chat. Mientras el chat
 * no está cargado, `window.openChatWidget` también lo carga y lo abre.
 */
export function ChatLauncher() {
  const locale = useLocale()
  const [load, setLoad] = useState(false)
  const [openOnLoad, setOpenOnLoad] = useState(false)

  useEffect(() => {
    const w = window as unknown as { openChatWidget?: () => void }
    // Stub hasta que el módulo del chat registre el suyo al cargarse.
    if (!w.openChatWidget) {
      w.openChatWidget = () => {
        setOpenOnLoad(true)
        setLoad(true)
      }
    }

    let timer: ReturnType<typeof setTimeout> | undefined
    let idle: number | undefined
    const preload = () => {
      timer = setTimeout(() => {
        if ("requestIdleCallback" in window) idle = window.requestIdleCallback(() => setLoad(true), { timeout: 4000 })
        else setLoad(true)
      }, PRELOAD_DELAY_MS)
    }
    if (document.readyState === "complete") preload()
    else window.addEventListener("load", preload, { once: true })

    return () => {
      window.removeEventListener("load", preload)
      if (timer) clearTimeout(timer)
      if (idle !== undefined && "cancelIdleCallback" in window) window.cancelIdleCallback(idle)
    }
  }, [])

  if (load) return <ChatWidget defaultOpen={openOnLoad} />

  return (
    <div className="fixed bottom-6 right-6 z-[9999]">
      <button
        type="button"
        onClick={() => {
          setOpenOnLoad(true)
          setLoad(true)
        }}
        aria-label={locale === "en" ? "Open chat" : "Abrir chat"}
        className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-xl transition-transform duration-300 hover:scale-110 hover:shadow-2xl hover:shadow-primary/40 active:scale-95"
      >
        <MessageCircle className="h-6 w-6" />
      </button>
    </div>
  )
}
