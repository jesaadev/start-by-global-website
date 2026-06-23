"use client"

import { useState } from "react"
import { Linkedin, Twitter, Facebook, MessageCircle, Link2, Check } from "lucide-react"
import { trackBlogEvent } from "@/lib/blog-track-client"

function currentSlug(): string {
  if (typeof window === "undefined") return ""
  return window.location.pathname.split("/").filter(Boolean).pop() ?? ""
}

export function ShareButtons({ title }: { title: string }) {
  const [copied, setCopied] = useState(false)

  const open = (network: string, buildUrl: (url: string, t: string) => string) => {
    const url = window.location.href
    trackBlogEvent(currentSlug(), "share", { target: network })
    window.open(buildUrl(encodeURIComponent(url), encodeURIComponent(title)), "_blank", "noopener,noreferrer,width=600,height=600")
  }

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
      setCopied(true)
      trackBlogEvent(currentSlug(), "share", { target: "copy" })
      setTimeout(() => setCopied(false), 2000)
    } catch {
      /* sin portapapeles */
    }
  }

  const btn = "flex items-center justify-center w-9 h-9 rounded-lg border border-border/60 text-muted-foreground hover:text-foreground hover:bg-secondary/60 transition-colors"

  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-muted-foreground mr-1">Compartir:</span>
      <button type="button" aria-label="Compartir en LinkedIn" className={btn}
        onClick={() => open("linkedin", (u) => `https://www.linkedin.com/sharing/share-offsite/?url=${u}`)}>
        <Linkedin className="w-4 h-4" />
      </button>
      <button type="button" aria-label="Compartir en X" className={btn}
        onClick={() => open("x", (u, t) => `https://twitter.com/intent/tweet?url=${u}&text=${t}`)}>
        <Twitter className="w-4 h-4" />
      </button>
      <button type="button" aria-label="Compartir en WhatsApp" className={btn}
        onClick={() => open("whatsapp", (u, t) => `https://wa.me/?text=${t}%20${u}`)}>
        <MessageCircle className="w-4 h-4" />
      </button>
      <button type="button" aria-label="Compartir en Facebook" className={btn}
        onClick={() => open("facebook", (u) => `https://www.facebook.com/sharer/sharer.php?u=${u}`)}>
        <Facebook className="w-4 h-4" />
      </button>
      <button type="button" aria-label="Copiar enlace" className={btn} onClick={copy}>
        {copied ? <Check className="w-4 h-4 text-chart-3" /> : <Link2 className="w-4 h-4" />}
      </button>
    </div>
  )
}
