import Link from "next/link"
import { ArrowRight, ArrowUpRight, Sparkles } from "lucide-react"
import type { ShowcaseItem } from "@/lib/showcase"
import { LANDING_LABELS } from "@/lib/persona-landings"
import { AnimateIn } from "@/components/animate-in"
import { PageHero } from "@/components/layout/page-hero"
import { PrimaryCTA } from "@/components/cta/primary-cta"
import { SecondaryCTA } from "@/components/cta/secondary-cta"
import { ClosingCTA } from "@/components/cta/closing-cta"
import { DeviceDuo } from "@/components/mockups/device-duo"
import { BrowserMockup } from "@/components/mockups/browser-mockup"
import { PhoneMockup } from "@/components/mockups/phone-mockup"

// Portafolio = Showcase del admin: solo trabajo real, publicado con la
// autorización del cliente. Nunca se rellena con proyectos de ejemplo.

const displayDomain = (d: string) => d.replace(/^https?:\/\//i, "").replace(/\/+$/, "")
const siteUrl = (d: string) => (/^https?:\/\//i.test(d) ? d : `https://${d}`)

/** Ficha bajo cada mockup: cliente, dominio y la solución equivalente para el visitante. */
function WorkMeta({ item, large }: { item: ShowcaseItem; large?: boolean }) {
  const persona = item.persona ? LANDING_LABELS[item.persona] : undefined
  return (
    <div className="flex flex-col gap-3">
      {item.client_name && (
        <span className="text-xs font-semibold uppercase tracking-widest text-primary">{item.client_name}</span>
      )}
      <h2 className={large ? "font-display text-3xl sm:text-4xl font-bold tracking-tight text-balance" : "font-display text-2xl font-bold tracking-tight text-balance"}>
        {item.title}
      </h2>
      <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
        {item.domain && (
          <a href={siteUrl(item.domain)} target="_blank" rel="noopener" className="group inline-flex items-center gap-1 text-sm font-semibold text-foreground hover:text-primary transition-colors">
            {displayDomain(item.domain)}
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 motion-reduce:transition-none" />
          </a>
        )}
        {persona && (
          <Link href={`/${persona.slug}`} className="group inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
            Solución para {persona.persona}
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none" />
          </Link>
        )}
      </div>
    </div>
  )
}

export function PortfolioPageContent({ webs, ads }: { webs: ShowcaseItem[]; ads: ShowcaseItem[] }) {
  const [featured, ...rest] = webs

  return (
    <>
      <PageHero
        badge="Portafolio"
        title="Trabajo real que puedes recorrer"
        highlight="puedes recorrer"
        size="lg"
        subtitle="Cada proyecto se publica con permiso del cliente. Pasa el cursor por las capturas y recórrelas de arriba abajo."
      >
        <PrimaryCTA label="Quiero una web así" segment="portafolio_hero" service="Desarrollo Web" />
        <SecondaryCTA />
      </PageHero>

      {featured ? (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-10 sm:pb-16 flex flex-col gap-16 sm:gap-20">
          {/* Destacado: escritorio + móvil */}
          <div className="grid grid-cols-1 lg:grid-cols-[1.35fr_1fr] gap-10 lg:gap-14 items-center">
            <DeviceDuo
              desktopSrc={featured.desktop_image as string}
              mobileSrc={featured.mobile_image ?? undefined}
              alt={featured.title}
              domain={featured.domain ?? undefined}
              priority
            />
            <WorkMeta item={featured} large />
          </div>

          {rest.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-14">
              {rest.map((item, i) => (
                <AnimateIn key={item.id} delay={(i % 2) * 90}>
                  <article className="flex flex-col gap-6">
                    <div className={item.mobile_image ? "relative pr-[10%] pb-[8%]" : undefined}>
                      <BrowserMockup
                        src={item.desktop_image as string}
                        alt={item.title}
                        domain={item.domain ?? undefined}
                        sizes="(max-width: 768px) 92vw, 600px"
                      />
                      {item.mobile_image && (
                        <PhoneMockup
                          src={item.mobile_image}
                          alt={`${item.title} — versión móvil`}
                          className="absolute bottom-0 right-0 w-[24%] min-w-[84px]"
                        />
                      )}
                    </div>
                    <WorkMeta item={item} />
                  </article>
                </AnimateIn>
              ))}
            </div>
          )}
        </section>
      ) : (
        <section className="max-w-3xl mx-auto px-4 sm:px-6 pb-12">
          <div className="rounded-3xl border border-dashed border-border/70 bg-card/40 p-8 sm:p-12 text-center">
            <Sparkles className="mx-auto h-9 w-9 text-primary" />
            <h2 className="font-display text-2xl sm:text-3xl font-bold mt-4">Estamos preparando los casos</h2>
            <p className="text-base text-muted-foreground mt-3 leading-relaxed">
              Solo mostramos proyectos con permiso del cliente. Mientras tanto, escríbenos y te enseñamos trabajos
              similares al tuyo en una llamada.
            </p>
          </div>
        </section>
      )}

      {ads.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
          <span className="text-xs font-semibold uppercase tracking-widest text-primary">Publicidad</span>
          <h2 className="font-display text-3xl sm:text-5xl font-bold tracking-tight mt-2 text-balance">Anuncios que creamos</h2>
          <div className="mt-10 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {ads.map((ad) => (
              <figure key={ad.id} className="flex flex-col gap-3">
                <PhoneMockup src={(ad.mobile_image ?? ad.desktop_image) as string} alt={ad.title} scrollOnHover={false} sizes="(max-width: 640px) 45vw, 260px" />
                <figcaption className="text-sm font-medium text-foreground/85 text-center">{ad.client_name ?? ad.title}</figcaption>
              </figure>
            ))}
          </div>
        </section>
      )}

      <ClosingCTA
        title="Tu web puede ser la siguiente"
        text="Cuéntanos qué vendes y te mostramos cómo se vería una web pensada para que te escriban."
        segment="portafolio_final"
        service="Desarrollo Web"
        ctaLabel="Quiero una web así"
        extra={<SecondaryCTA label="Prefiero un diagnóstico por formulario" className="w-fit" />}
      />
    </>
  )
}
