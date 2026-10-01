import { Check } from "lucide-react"
import { listPublishedShowcase } from "@/lib/showcase"
import { HERO_WORDS } from "@/lib/home-content"
import { HeroBackground } from "@/components/backgrounds/hero-background"
import { PrimaryCTA } from "@/components/cta/primary-cta"
import { SecondaryCTA } from "@/components/cta/secondary-cta"
import { RotatingWord } from "@/components/motion/rotating-word"
import ShinyText from "@/components/reactbits/ShinyText"
import { DeviceDuo } from "@/components/mockups/device-duo"
import { BrowserMockup } from "@/components/mockups/browser-mockup"
import { Tilt } from "@/components/motion/tilt"
import { MiniSite } from "@/components/home-v2/mini-site"

const TRUST = ["Proyectos desde $400", "Sin compromiso", "Dominio y accesos a tu nombre"]

/**
 * Hero de la home. Todo el texto y los CTAs se renderizan en SSR y son visibles
 * desde el primer paint (LCP). La palabra rotativa vive en su propia línea para
 * que su cambio de ancho no reacomode el resto del titular (sin CLS). El visual
 * es el trabajo real más reciente del Showcase; si no hay, una mini web
 * ilustrativa en HTML.
 */
export async function HomeHero() {
  const [featured] = await listPublishedShowcase("web", 1)

  return (
    <section className="relative overflow-hidden">
      <HeroBackground />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 pt-8 sm:pt-14 lg:pt-20 pb-14 sm:pb-20 grid grid-cols-1 lg:grid-cols-[1.05fr_1fr] gap-12 lg:gap-10 items-center">
        <div className="flex flex-col gap-6">
          <span className="inline-flex w-fit items-center gap-2 rounded-full border border-primary/25 bg-primary/10 px-3.5 py-1.5 text-xs font-semibold">
            <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse motion-reduce:animate-none" />
            <ShinyText
              text="Diseño web y publicidad · RD · ES · LATAM · EE.UU."
              speed={3}
              color="hsl(var(--primary))"
              shineColor="#ffd9c7"
            />
          </span>

          <h1 className="font-display font-bold tracking-tight leading-[1.02] text-[2.6rem] sm:text-6xl xl:text-7xl text-foreground">
            Webs y anuncios que convierten visitas en
            {/* Texto estable para lectores de pantalla y buscadores; la palabra
                animada es decorativa (RotatingText la parte letra por letra). */}
            <span className="sr-only"> {HERO_WORDS[0]}</span>
            <span aria-hidden className="block mt-2">
              <RotatingWord words={HERO_WORDS} />
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-foreground/75 leading-relaxed max-w-xl">
            Diseñamos tu web, lanzamos tus campañas en Meta y Google y medimos cada lead hasta tu WhatsApp.
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <PrimaryCTA segment="hero_v2" />
            <SecondaryCTA />
          </div>

          <ul className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted-foreground">
            {TRUST.map((t) => (
              <li key={t} className="flex items-center gap-1.5">
                <Check className="w-4 h-4 text-chart-3" /> {t}
              </li>
            ))}
          </ul>
        </div>

        <div className="relative">
          {featured?.desktop_image ? (
            <>
              <DeviceDuo
                desktopSrc={featured.desktop_image}
                mobileSrc={featured.mobile_image ?? undefined}
                alt={featured.title}
                domain={featured.domain ?? undefined}
                priority
              />
              <p className="mt-4 text-xs text-muted-foreground text-center lg:text-left">
                Trabajo real: <span className="text-foreground font-medium">{featured.client_name ?? featured.title}</span> · pasa el cursor para recorrerla
              </p>
            </>
          ) : (
            <Tilt>
              <BrowserMockup domain="tunegocio.com">
                <MiniSite />
              </BrowserMockup>
            </Tilt>
          )}
        </div>
      </div>
    </section>
  )
}
