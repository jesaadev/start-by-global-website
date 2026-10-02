import Link from "next/link"
import { Check, Lock, MessageCircle, Plus } from "lucide-react"
import type { PersonaLandingData } from "@/lib/persona-landings"
import { listPublishedShowcase } from "@/lib/showcase"
import { PageFunnelTracker } from "@/components/analytics/page-funnel-tracker"
import { HeroBackground } from "@/components/backgrounds/hero-background"
import { PrimaryCTA } from "@/components/cta/primary-cta"
import { SecondaryCTA } from "@/components/cta/secondary-cta"
import { StickyMobileCTA } from "@/components/cta/sticky-mobile-cta"
import { LeadForm } from "@/components/forms/lead-form"
import { AnimateIn } from "@/components/animate-in"
import { AdFlow } from "@/components/home-v2/ad-flow"
import { BrowserMockup } from "@/components/mockups/browser-mockup"
import SpotlightCard from "@/components/reactbits/SpotlightCard"
import { WhatsAppLink } from "@/components/whatsapp-link"
import { PersonaVisual, relevantWork } from "@/components/landings/persona-visual"
import { LeadMagnet } from "@/components/landings/lead-magnet"
import { HighlightTitle } from "@/components/typography/highlight-title"

// Plantilla común de las landings por persona: arquitectura fija de 9 bloques
// del spec, con el sistema visual de venta (v2). Navegación reducida (logo + 1
// CTA), un solo camino de salida, indexable. Server component: solo los islotes
// interactivos (CTAs, formularios, animación) llevan JavaScript.

const H2 = "font-display text-3xl sm:text-5xl font-bold tracking-tight leading-[1.05] text-balance"

export async function PersonaLanding({ data }: { data: PersonaLandingData }) {
  const seg = data.segment
  const work = relevantWork(data, await listPublishedShowcase("web", 12))

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-clip">
      <PageFunnelTracker landingKey={seg} />

      {/* NAV reducido: logo + un solo CTA, sin menú */}
      <header className="sticky top-0 z-40 border-b border-border/50 bg-background/85 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center" aria-label="Start By Global — inicio">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo-black.svg" alt="Start By Global" className="h-7 dark:invert" />
          </Link>
          <WhatsAppLink
            segment={`${seg}_nav`}
            defaultService={data.whatsappService}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#25D366] text-white text-sm font-bold hover:shadow-lg hover:shadow-[#25D366]/25 transition-shadow"
          >
            <MessageCircle className="w-4 h-4" />
            <span className="hidden sm:inline">Hablar por WhatsApp</span>
            <span className="sm:hidden">WhatsApp</span>
          </WhatsAppLink>
        </div>
      </header>

      {/* BLOQUE 1 — Encabezado */}
      <section className="relative overflow-hidden">
        <HeroBackground />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 pt-10 sm:pt-16 lg:pt-20 pb-14 sm:pb-20 grid grid-cols-1 lg:grid-cols-[1.05fr_1fr] gap-12 lg:gap-10 items-center">
          <div className="flex flex-col gap-6">
            <span className="inline-flex w-fit items-center gap-2 rounded-full border border-primary/25 bg-primary/10 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wide text-primary">
              <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse motion-reduce:animate-none" />
              {data.hero.badge}
            </span>
            <h1 className="font-display font-bold tracking-tight leading-[1.04] text-[2.4rem] sm:text-6xl xl:text-[4.25rem] text-balance">
              <HighlightTitle text={data.hero.h1} highlight={data.hero.highlight} />
            </h1>
            <p className="text-lg sm:text-xl text-foreground/75 leading-relaxed max-w-xl">{data.hero.subtitle}</p>
            <div className="flex flex-wrap items-center gap-3">
              <PrimaryCTA label={data.hero.ctaLabel} segment={`${seg}_hero`} service={data.whatsappService} />
              <SecondaryCTA label="Prefiero dejar mis datos" href="#contacto" />
            </div>
            <p className="text-sm text-muted-foreground max-w-md">{data.hero.microcopy}</p>
          </div>
          <PersonaVisual visual={data.visual} work={work} />
        </div>
      </section>

      {/* BLOQUE 2 — Espejo del dolor */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
        <h2 className={H2}>{data.pain.h2}</h2>
        <ul className="mt-8 flex flex-col gap-3">
          {data.pain.bullets.map((b, i) => (
            <li key={b}>
              <AnimateIn delay={i * 70}>
                <div className="flex items-start gap-4 rounded-2xl border border-border/50 bg-card/60 p-5 text-base sm:text-lg text-foreground/85 leading-relaxed">
                  <span className="mt-2 h-2.5 w-2.5 shrink-0 rounded-full bg-primary" />
                  {b}
                </div>
              </AnimateIn>
            </li>
          ))}
        </ul>
        {data.pain.closing && (
          <p className="mt-8 rounded-r-2xl border-l-4 border-primary bg-primary/[0.07] py-5 pl-6 pr-5 text-xl sm:text-2xl font-semibold text-foreground text-balance">
            {data.pain.closing}
          </p>
        )}
      </section>

      {/* BLOQUE 3 — Mecanismo */}
      <section className="border-y border-border/40 bg-secondary/[0.15]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
          <h2 className={`${H2} max-w-3xl`}>{data.mechanism.h2}</h2>
          <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.mechanism.items.map((it, i) => (
              <AnimateIn key={it.title} delay={i * 80} className="h-full">
                <SpotlightCard spotlightColor="rgba(242, 109, 61, 0.18)" className="h-full !p-7">
                  <span className="font-display text-sm font-bold text-primary">0{i + 1}</span>
                  <h3 className="font-display text-xl font-bold mt-2">{it.title}</h3>
                  <p className="text-base text-foreground/70 leading-relaxed mt-2">{it.desc}</p>
                </SpotlightCard>
              </AnimateIn>
            ))}
          </div>
          <div className="mt-10 flex justify-center">
            <PrimaryCTA label={data.hero.ctaLabel} segment={`${seg}_mechanism`} service={data.whatsappService} />
          </div>
        </div>
      </section>

      {/* Recorrido de una campaña (personas donde la publicidad es parte del dolor) */}
      {data.showAdFlow && (
        <AdFlow
          id="como-convierte"
          segment={`${seg}_adflow`}
          service={data.whatsappService}
          ctaLabel={data.hero.ctaLabel}
          showLink={false}
        />
      )}

      {/* BLOQUE 4 — Qué incluye */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
        <div className="rounded-3xl border border-border/50 bg-card/60 p-7 sm:p-10">
          <h2 className={H2}>{data.includes.h2}</h2>
          <ul className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
            {data.includes.bullets.map((b) => (
              <li key={b} className="flex items-start gap-3 text-base sm:text-lg text-foreground/85">
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-chart-3/15">
                  <Check className="h-4 w-4 text-chart-3" />
                </span>
                {b}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* BLOQUE 5 — Prueba: trabajo real autorizado o, mientras tanto, prueba de método */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
        {work.length > 0 ? (
          <>
            <span className="text-xs font-semibold uppercase tracking-widest text-primary">Trabajo real</span>
            <h2 className={`${H2} mt-2`}>{data.proof.h2}</h2>
            <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {work.slice(0, 3).map((w) => (
                <figure key={w.id}>
                  <BrowserMockup src={w.desktop_image ?? undefined} alt={w.title} domain={w.domain ?? undefined} sizes="(max-width: 768px) 92vw, 400px" />
                  <figcaption className="mt-3 text-sm text-muted-foreground">
                    <span className="font-medium text-foreground">{w.client_name ?? w.title}</span> · pasa el cursor para recorrerla
                  </figcaption>
                </figure>
              ))}
            </div>
          </>
        ) : (
          <>
            <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              <Lock className="h-3.5 w-3.5" /> Prueba de método
            </span>
            <h2 className={`${H2} mt-2`}>{data.proof.h2}</h2>
            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
              {data.proof.bullets.map((b) => (
                <div key={b} className="rounded-2xl border border-border/50 bg-card/60 p-6 text-base text-foreground/80 leading-relaxed">{b}</div>
              ))}
            </div>
          </>
        )}
      </section>

      {/* BLOQUE 6 — Objeciones / FAQ (JSON-LD en la página) */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
        <h2 className={`${H2} text-center`}>Preguntas frecuentes</h2>
        <div className="mt-10 flex flex-col gap-3">
          {data.faqs.map((f) => (
            <details key={f.q} className="group rounded-2xl border border-border/50 bg-card/60 px-5 sm:px-6 py-5">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4">
                <span className="text-base sm:text-lg font-semibold text-foreground">{f.q}</span>
                <Plus className="h-5 w-5 shrink-0 text-primary transition-transform group-open:rotate-45 motion-reduce:transition-none" />
              </summary>
              <p className="mt-3 text-base text-muted-foreground leading-relaxed">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* BLOQUE 7 — Cómo trabajamos */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
        <h2 className={H2}>Cómo trabajamos</h2>
        <ol className={`mt-10 grid grid-cols-1 sm:grid-cols-2 gap-4 ${data.process.steps.length > 4 ? "lg:grid-cols-5" : "lg:grid-cols-4"}`}>
          {data.process.steps.map((s, i) => (
            <li key={s.title}>
              <AnimateIn delay={i * 80} className="h-full">
                <div className="h-full rounded-2xl border border-border/50 bg-card/60 p-6">
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary font-display text-lg font-bold text-primary-foreground shadow-lg shadow-primary/25">
                    0{i + 1}
                  </span>
                  <h3 className="font-display text-lg font-bold mt-4">{s.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed mt-1.5">{s.desc}</p>
                </div>
              </AnimateIn>
            </li>
          ))}
        </ol>
      </section>

      {/* BLOQUE 8 — CTA final + formulario de 3 campos */}
      <section id="contacto" className="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-20 scroll-mt-20">
        <div className="relative overflow-hidden rounded-[2rem] border border-primary/25 bg-gradient-to-br from-primary/20 via-primary/[0.06] to-transparent p-7 sm:p-12">
          <div aria-hidden className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-primary/25 blur-[100px]" />
          <div className="relative grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] gap-10 items-center">
            <div className="flex flex-col gap-5">
              <h2 className="font-display text-4xl sm:text-5xl font-bold tracking-tight leading-[1.04] text-balance">{data.form.h2}</h2>
              <p className="text-lg text-foreground/80 leading-relaxed max-w-lg">{data.form.text}</p>
              <div>
                <PrimaryCTA label="Prefiero WhatsApp" segment={`${seg}_final`} service={data.whatsappService} />
              </div>
            </div>
            <LeadForm
              landingKey={seg}
              landingName={data.persona}
              button={data.form.button}
              nameLabel={data.form.nameLabel}
              contactLabel={data.form.contactLabel}
              qualifierLabel={data.form.qualifierLabel}
            />
          </div>
        </div>
      </section>

      {/* BLOQUE 9 — Descargable (jerarquía menor) */}
      <LeadMagnet data={data} />

      {/* FOOTER mínimo */}
      <footer className="border-t border-border/50 px-4 sm:px-6 pt-8 pb-24 md:pb-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <Link href="/" className="flex items-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo-black.svg" alt="Start By Global" className="h-6 dark:invert opacity-60 hover:opacity-100 transition-opacity" />
          </Link>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <Link href="/privacidad" className="hover:text-foreground transition-colors">Privacidad</Link>
            <span>© {new Date().getFullYear()} Start By Global</span>
          </div>
        </div>
      </footer>

      <StickyMobileCTA segment={`${seg}_sticky`} secondaryHref="#contacto" secondaryLabel="Formulario" service={data.whatsappService} />
    </div>
  )
}
