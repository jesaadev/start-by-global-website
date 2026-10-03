"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { AnimatePresence, motion, useInView } from "motion/react"
import {
  Megaphone, MousePointerClick, MessageCircle, Target, Heart, Send, MessageSquare,
  ChevronRight, CheckCircle2, ArrowUpRight, type LucideIcon,
} from "lucide-react"
import { PhoneMockup } from "@/components/mockups/phone-mockup"
import { PrimaryCTA } from "@/components/cta/primary-cta"
import { LinkCTA } from "@/components/cta/link-cta"
import { MiniSite } from "@/components/home-v2/mini-site"
import { useReducedMotion } from "@/hooks/use-reduced-motion"
import type { Locale } from "@/lib/i18n"
import { cn } from "@/lib/utils"

const STEP_MS = 3400

const ICONS: LucideIcon[] = [Megaphone, MousePointerClick, MessageCircle, Target]

const TEXT = {
  es: {
    eyebrow: "Publicidad que convierte",
    title: "Así convierte una campaña bien hecha",
    desc: "No vendemos clics: construimos el camino completo desde el anuncio hasta la conversación, y lo medimos.",
    steps: [
      { title: "Ve tu anuncio", desc: "En Instagram, Facebook o Google, con un mensaje hecho para su problema." },
      { title: "Llega a tu landing", desc: "Una página rápida con una sola acción clara: escribirte." },
      { title: "Te escribe por WhatsApp", desc: "El mensaje te llega con su nombre y lo que necesita." },
      { title: "El lead queda medido", desc: "Meta recibe el evento por píxel + API de Conversiones y la campaña aprende a quién mostrarse." },
    ],
    link: "Ver publicidad",
    example: "Ejemplo ilustrativo",
    ad: { account: "tunegocio", sponsored: "Publicidad", headline: "¿Tu web no te trae clientes?", sub: "Diagnóstico gratis en 30 min", badge: "Agenda hoy", action: "Enviar mensaje" },
    chat: {
      name: "Tu negocio",
      online: "en línea",
      msgs: [
        "Hola 👋 vi su anuncio. Quiero más clientes para mi negocio.",
        "¡Hola! Claro 🙌 Cuéntanos a qué se dedica tu negocio y te enviamos el diagnóstico.",
        "Tengo una clínica dental 🦷",
      ],
    },
    panel: "Tu panel · ahora",
    rows: [
      { title: "Nuevo lead · vía Instagram", sub: "Campaña «Diagnóstico» · clínica dental" },
      { title: "Evento Lead enviado a Meta", sub: "Píxel + API de Conversiones" },
      { title: "Origen guardado en tu panel", sub: "Canal, campaña y anuncio" },
    ],
  },
  en: {
    eyebrow: "Ads that convert",
    title: "How a well-built campaign converts",
    desc: "We don't sell clicks: we build the whole path from the ad to the conversation, and we measure it.",
    steps: [
      { title: "They see your ad", desc: "On Instagram, Facebook or Google, with a message made for their problem." },
      { title: "They land on your page", desc: "A fast page with one clear action: contacting you." },
      { title: "They message you", desc: "The message arrives with their name and what they need." },
      { title: "The lead is measured", desc: "Meta gets the event via pixel + Conversions API, so the campaign learns who to show up for." },
    ],
    link: "See ads management",
    example: "Illustrative example",
    ad: { account: "yourbusiness", sponsored: "Sponsored", headline: "Is your website not bringing customers?", sub: "Free 30-min audit", badge: "Book today", action: "Send message" },
    chat: {
      name: "Your business",
      online: "online",
      msgs: [
        "Hi 👋 saw your ad. I want more customers for my business.",
        "Hi! Sure 🙌 Tell us what your business does and we'll send you the audit.",
        "I run a dental clinic 🦷",
      ],
    },
    panel: "Your dashboard · now",
    rows: [
      { title: "New lead · via Instagram", sub: "\u201cAudit\u201d campaign · dental clinic" },
      { title: "Lead event sent to Meta", sub: "Pixel + Conversions API" },
      { title: "Source saved in your dashboard", sub: "Channel, campaign and ad" },
    ],
  },
} as const

type Text = (typeof TEXT)[Locale]

/**
 * "Así convierte una campaña": recorrido ILUSTRATIVO (sin métricas) de un
 * anuncio hasta el lead medido, dentro de un teléfono. Avanza solo mientras la
 * sección está en pantalla; con "reducir movimiento" no avanza solo y las
 * transiciones son instantáneas.
 */
export function AdFlow({
  segment = "adflow_cta",
  service = "Marketing Digital",
  ctaLabel = "Quiero campañas así",
  showLink = true,
  id = "anuncios",
  locale = "es",
  ctaHref = "#contact",
}: {
  /** Segmento de tracking del CTA de WhatsApp. */
  segment?: string
  service?: string
  ctaLabel?: string
  /** Enlace a /publicidad-ads (desactivar en landings: un solo camino de salida). */
  showLink?: boolean
  id?: string
  locale?: Locale
  /** En inglés el CTA es un enlace (al formulario de la página). */
  ctaHref?: string
} = {}) {
  const t = TEXT[locale]
  const steps = t.steps.map((st, i) => ({ ...st, icon: ICONS[i] }))
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { amount: 0.35 })
  const reduced = useReducedMotion()
  const [step, setStep] = useState(0)
  const [auto, setAuto] = useState(true)

  useEffect(() => {
    if (!inView || reduced || !auto) return
    const t = setInterval(() => setStep((s) => (s + 1) % steps.length), STEP_MS)
    return () => clearInterval(t)
  }, [inView, reduced, auto])

  const select = (i: number) => {
    setStep(i)
    setAuto(false) // el usuario toma el control: no cambiar el paso bajo sus ojos
  }

  return (
    <section ref={ref} id={id} className="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-24 scroll-mt-20">
      {/* Móvil: título → teléfono → pasos. Desktop: título y pasos a la izquierda, teléfono a la derecha. */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] lg:grid-rows-[auto_1fr] gap-x-20 gap-y-8">
        <div className="lg:col-start-1 lg:row-start-1">
          <span className="text-xs font-semibold uppercase tracking-widest text-primary">{t.eyebrow}</span>
          <h2 className="font-display text-3xl sm:text-5xl font-bold tracking-tight leading-[1.05] mt-2 text-balance">
            {t.title}
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground mt-3 max-w-xl">{t.desc}</p>
        </div>

        <div className="lg:col-start-1 lg:row-start-2">
          <ol className="flex flex-col gap-2.5">
            {steps.map((s, i) => {
              const Icon = s.icon
              const active = i === step
              return (
                <li key={s.title}>
                  <button
                    type="button"
                    onClick={() => select(i)}
                    aria-pressed={active}
                    className={cn(
                      "relative w-full overflow-hidden text-left rounded-2xl border p-4 transition-colors",
                      active ? "border-primary/40 bg-primary/[0.06]" : "border-border/50 hover:bg-secondary/40"
                    )}
                  >
                    <span className="flex items-start gap-3.5">
                      <span
                        className={cn(
                          "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-colors",
                          active ? "bg-primary text-primary-foreground" : "bg-secondary/70 text-muted-foreground"
                        )}
                      >
                        <Icon className="h-5 w-5" />
                      </span>
                      <span>
                        <span className="block font-semibold text-foreground">
                          <span className="text-muted-foreground mr-1.5">0{i + 1}</span>
                          {s.title}
                        </span>
                        <span className={cn("block text-sm text-muted-foreground leading-relaxed", !active && "hidden sm:block")}>
                          {s.desc}
                        </span>
                      </span>
                    </span>
                    {active && auto && !reduced && inView && (
                      <motion.span
                        key={`bar-${step}`}
                        aria-hidden
                        className="absolute bottom-0 left-0 h-0.5 bg-primary"
                        initial={{ width: "0%" }}
                        animate={{ width: "100%" }}
                        transition={{ duration: STEP_MS / 1000, ease: "linear" }}
                      />
                    )}
                  </button>
                </li>
              )
            })}
          </ol>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            {locale === "es" ? (
              <PrimaryCTA label={ctaLabel} segment={segment} service={service} />
            ) : (
              <LinkCTA href={ctaHref} label={ctaLabel} />
            )}
            {showLink && (
              <Link href={locale === "es" ? "/publicidad-ads" : "/us/google-ads"} className="inline-flex items-center gap-1 text-sm font-semibold hover:text-primary transition-colors">
                {t.link} <ArrowUpRight className="h-4 w-4" />
              </Link>
            )}
          </div>
        </div>

        {/* Teléfono con la pantalla del paso activo (decorativo) */}
        <div className="mx-auto w-[230px] sm:w-[280px] row-start-2 lg:col-start-2 lg:row-start-1 lg:row-span-2 lg:self-center" aria-hidden>
          <PhoneMockup>
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={step}
                className="absolute inset-0"
                initial={{ opacity: 0, y: reduced ? 0 : 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: reduced ? 0 : -16 }}
                transition={{ duration: reduced ? 0 : 0.35, ease: "easeOut" }}
              >
                {step === 0 && <AdScreen reduced={reduced} t={t} />}
                {step === 1 && <LandingScreen reduced={reduced} locale={locale} />}
                {step === 2 && <ChatScreen reduced={reduced} t={t} />}
                {step === 3 && <LeadScreen reduced={reduced} t={t} />}
              </motion.div>
            </AnimatePresence>
          </PhoneMockup>
          <p className="mt-3 text-center text-[11px] text-muted-foreground">{t.example}</p>
        </div>
      </div>
    </section>
  )
}

/* ── Pantallas ─────────────────────────────────────────────────────────────── */

function AdScreen({ reduced, t }: { reduced: boolean; t: Text }) {
  return (
    <div className="absolute inset-0 flex flex-col bg-[#0b0d12] pt-8 text-white">
      <div className="flex items-center gap-2 px-3 py-2">
        <span className="h-7 w-7 rounded-full bg-gradient-to-br from-primary to-[#F4A261]" />
        <span className="flex flex-col leading-tight">
          <span className="text-[11px] font-semibold">{t.ad.account}</span>
          <span className="text-[9px] text-white/50">{t.ad.sponsored}</span>
        </span>
      </div>
      <div className="relative mx-0 aspect-square overflow-hidden bg-gradient-to-br from-primary via-[#c2410c] to-[#7c2d12] p-4">
        <p className="font-display text-[22px] font-bold leading-[1.05]">{t.ad.headline}</p>
        <p className="mt-2 text-[11px] text-white/85">{t.ad.sub}</p>
        <span className="absolute bottom-3 right-3 rounded-full bg-white px-2.5 py-1 text-[10px] font-bold text-[#7c2d12]">
          {t.ad.badge}
        </span>
      </div>
      <div className="flex items-center justify-between bg-white/10 px-3 py-2 text-[11px] font-semibold">
        {t.ad.action} <ChevronRight className="h-3.5 w-3.5" />
      </div>
      <div className="flex items-center gap-3 px-3 py-2.5">
        <motion.span
          initial={{ scale: 1 }}
          animate={reduced ? undefined : { scale: [1, 1.35, 1] }}
          transition={{ delay: 0.9, duration: 0.45 }}
        >
          <Heart className="h-5 w-5 fill-[#ff3b5c] text-[#ff3b5c]" />
        </motion.span>
        <MessageSquare className="h-5 w-5 text-white/80" />
        <Send className="h-5 w-5 text-white/80" />
      </div>
    </div>
  )
}

function LandingScreen({ reduced, locale }: { reduced: boolean; locale: Locale }) {
  return (
    <div className="absolute inset-0 pt-7">
      <div className="relative h-full">
        <MiniSite compact locale={locale} />
        {/* "Toque" sobre el botón de WhatsApp */}
        {!reduced && (
          <motion.span
            className="absolute left-[30%] top-[39%] h-8 w-8 rounded-full border-2 border-white/80"
            initial={{ scale: 0.3, opacity: 0 }}
            animate={{ scale: [0.3, 1.4], opacity: [0.9, 0] }}
            transition={{ delay: 1.1, duration: 0.7, repeat: 1, repeatDelay: 0.3 }}
          />
        )}
      </div>
    </div>
  )
}

function ChatScreen({ reduced, t }: { reduced: boolean; t: Text }) {
  const bubble = (delay: number) =>
    reduced
      ? {}
      : { initial: { opacity: 0, y: 10, scale: 0.96 }, animate: { opacity: 1, y: 0, scale: 1 }, transition: { delay, duration: 0.3 } }
  return (
    <div className="absolute inset-0 flex flex-col bg-[#0b141a] pt-7 text-white">
      <div className="flex items-center gap-2 bg-[#1f2c34] px-3 py-2.5">
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#25D366]">
          <MessageCircle className="h-4 w-4" />
        </span>
        <span className="flex flex-col leading-tight">
          <span className="text-[11px] font-semibold">{t.chat.name}</span>
          <span className="text-[9px] text-[#25D366]">{t.chat.online}</span>
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-2 p-3 text-[11px] leading-snug">
        <motion.div {...bubble(0.3)} className="ml-auto max-w-[82%] rounded-xl rounded-tr-sm bg-[#005c4b] px-2.5 py-1.5">
          {t.chat.msgs[0]}
        </motion.div>
        <motion.div {...bubble(1.2)} className="max-w-[82%] rounded-xl rounded-tl-sm bg-[#1f2c34] px-2.5 py-1.5">
          {t.chat.msgs[1]}
        </motion.div>
        <motion.div {...bubble(2.1)} className="ml-auto max-w-[82%] rounded-xl rounded-tr-sm bg-[#005c4b] px-2.5 py-1.5">
          {t.chat.msgs[2]}
        </motion.div>
      </div>
    </div>
  )
}

const ROW_ACCENTS = ["bg-primary/20 text-primary", "bg-[#25D366]/20 text-[#25D366]", "bg-[#0074D9]/25 text-[#5fb0ff]"]

function LeadScreen({ reduced, t }: { reduced: boolean; t: Text }) {
  const rows = t.rows.map((r, i) => ({ ...r, accent: ROW_ACCENTS[i] }))
  return (
    <div className="absolute inset-0 flex flex-col bg-[#0b0d12] px-3 pt-9 text-white">
      <p className="text-[10px] uppercase tracking-wider text-white/45">{t.panel}</p>
      <div className="mt-2 flex flex-col gap-2">
        {rows.map((r, i) => (
          <motion.div
            key={r.title}
            initial={reduced ? false : { opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: reduced ? 0 : 0.25 + i * 0.45, type: "spring", damping: 22, stiffness: 260 }}
            className="flex items-start gap-2 rounded-xl border border-white/10 bg-white/[0.04] p-2.5"
          >
            <span className={cn("flex h-6 w-6 shrink-0 items-center justify-center rounded-lg", r.accent)}>
              <CheckCircle2 className="h-3.5 w-3.5" />
            </span>
            <span className="leading-tight">
              <span className="block text-[11px] font-semibold">{r.title}</span>
              <span className="block text-[9px] text-white/55">{r.sub}</span>
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
