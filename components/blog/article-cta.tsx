"use client"

import Link from "next/link"
import { ArrowLeft, ArrowRight, MessageCircle } from "lucide-react"
import type { Locale } from "@/lib/i18n"
import { WhatsAppLink } from "@/components/whatsapp-link"
import { cn } from "@/lib/utils"

// CTAs de conversión dentro de los artículos. Estáticos a propósito: los
// artículos van sin animaciones. Cada categoría empuja a la oferta más afín
// (landing por persona o money page) y, en español, a WhatsApp.

interface CategoryCta {
  title: string
  text: string
  href: string
  linkLabel: string
  /** Servicio preseleccionado en el modal de WhatsApp. */
  service?: string
}

const CTAS: Record<Locale, { byCategory: Record<string, CategoryCta>; fallback: CategoryCta }> = {
  es: {
    byCategory: {
      "Marketing Digital": {
        title: "¿Tus anuncios traen clics o clientes?",
        text: "Revisamos tus campañas, tu medición y la página a la que llegan, y te decimos dónde se está yendo el presupuesto. Gratis.",
        href: "/publicidad-ads#contacto",
        linkLabel: "Pedir auditoría de anuncios",
        service: "Marketing Digital",
      },
      "Desarrollo Web": {
        title: "¿Tu web informa o vende?",
        text: "En 30 minutos revisamos tu web actual y te decimos qué corregir para que te escriban más. Sin compromiso.",
        href: "/web-que-genera-clientes#contacto",
        linkLabel: "Pedir diagnóstico gratuito",
        service: "Desarrollo Web",
      },
    },
    fallback: {
      title: "¿Quieres aplicar esto en tu negocio?",
      text: "Cuéntanos qué vendes y a quién. Te decimos por dónde empezar: web, anuncios o automatización.",
      href: "/web-que-genera-clientes#contacto",
      linkLabel: "Pedir diagnóstico gratuito",
    },
  },
  en: {
    byCategory: {
      "Marketing Digital": {
        title: "Are your ads bringing clicks or customers?",
        text: "We review your campaigns, tracking and landing pages, and show you where budget is leaking. Free.",
        href: "/us/google-ads#contact",
        linkLabel: "Request your free audit",
      },
      "Desarrollo Web": {
        title: "Is your website informing or selling?",
        text: "Tell us about your site and we'll reply with what to fix first so more visitors contact you.",
        href: "/us/website-design#contact",
        linkLabel: "Get your fixed quote",
      },
    },
    fallback: {
      title: "Want to apply this to your business?",
      text: "Tell us what you sell and who you sell to. We'll tell you where to start: website, ads or automation.",
      href: "/us#contact",
      linkLabel: "Get a free quote",
    },
  },
}

const TEXT = {
  es: { kicker: "Start By Global", whatsapp: "Hablar por WhatsApp", finalTitle: "¿Listo para aplicar lo que acabas de leer?", more: "Más artículos", base: "/insights" },
  en: { kicker: "Start By Global", whatsapp: "", finalTitle: "Ready to put this into practice?", more: "More articles", base: "/us/insights" },
} as const

const WA_BUTTON =
  "inline-flex items-center justify-center gap-2 rounded-xl bg-[#25D366] px-6 py-3.5 text-base font-bold text-white hover:shadow-lg hover:shadow-[#25D366]/25 transition-shadow"

/**
 * - inline: bloque a mitad del artículo, con la oferta de la categoría.
 * - final: cierre del artículo (oferta + volver al blog).
 * data-nosnippet: que Google no use el texto comercial en el snippet.
 */
export function ArticleCta({
  category,
  locale = "es",
  variant,
}: {
  category: string
  locale?: Locale
  variant: "inline" | "final"
}) {
  const t = TEXT[locale]
  const c = CTAS[locale].byCategory[category] ?? CTAS[locale].fallback
  const final = variant === "final"

  const primary =
    locale === "es" ? (
      <span data-blog-cta={`whatsapp_${variant}`}>
        <WhatsAppLink segment={`blog_${variant}`} defaultService={c.service} className={WA_BUTTON}>
          <MessageCircle className="h-5 w-5" />
          {t.whatsapp}
        </WhatsAppLink>
      </span>
    ) : (
      <Link href={c.href} className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-base font-bold text-primary-foreground hover:shadow-lg hover:shadow-primary/25 transition-shadow">
        {c.linkLabel}
        <ArrowRight className="h-4 w-4" />
      </Link>
    )

  return (
    <aside
      data-nosnippet=""
      aria-label={c.title}
      className={cn(
        "rounded-2xl border border-primary/30 bg-gradient-to-br from-primary/[0.12] via-primary/[0.05] to-transparent",
        final ? "p-8 sm:p-12 text-center" : "my-12 p-6 sm:p-8"
      )}
    >
      <p className="text-[11px] font-semibold uppercase tracking-widest text-primary">{t.kicker}</p>
      <p className={cn("font-display font-bold text-foreground text-balance mt-2", final ? "text-2xl sm:text-4xl" : "text-xl sm:text-2xl")}>
        {final ? t.finalTitle : c.title}
      </p>
      <p className={cn("text-muted-foreground leading-relaxed mt-3", final && "max-w-xl mx-auto")}>{c.text}</p>
      <div className={cn("mt-6 flex flex-wrap items-center gap-3", final && "justify-center")}>
        {primary}
        {locale === "es" && (
          <Link href={c.href} className="inline-flex items-center gap-1.5 px-2 py-3 text-base font-semibold text-foreground hover:text-primary transition-colors">
            {c.linkLabel}
            <ArrowRight className="h-4 w-4" />
          </Link>
        )}
        {final && (
          <Link href={t.base} className="inline-flex items-center gap-1.5 px-2 py-3 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-4 w-4" />
            {t.more}
          </Link>
        )}
      </div>
    </aside>
  )
}
