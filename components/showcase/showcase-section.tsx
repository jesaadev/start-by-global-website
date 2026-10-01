import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import { listPublishedShowcase } from "@/lib/showcase"
import { PrimaryCTA } from "@/components/cta/primary-cta"
import { ShowcaseSwap, type ShowcaseCardData } from "@/components/showcase/showcase-swap"

/**
 * "Webs que construimos": trabajo real publicado desde el admin (Showcase), solo
 * lo autorizado por el cliente. Si todavía no hay nada publicado, no se muestra
 * (nunca rellenamos con proyectos inventados).
 */
export async function ShowcaseSection({ minItems = 1 }: { minItems?: number } = {}) {
  const items = await listPublishedShowcase("web", 6)
  const cards: ShowcaseCardData[] = items
    .filter((it) => it.desktop_image)
    .map((it) => ({ id: it.id, title: it.title, domain: it.domain, desktop_image: it.desktop_image as string }))
  // En la home el trabajo más reciente ya se luce en el hero: con uno solo no
  // repetimos la sección (minItems=2).
  if (cards.length < Math.max(1, minItems)) return null

  return (
    <section id="trabajo" className="grid grid-cols-1 lg:grid-cols-[1fr_1.25fr] gap-10 lg:gap-14 items-center py-6">
      <div className="flex flex-col gap-5">
        <span className="text-xs font-semibold uppercase tracking-widest text-primary">Trabajo real</span>
        <h2 className="font-display text-3xl sm:text-5xl font-bold tracking-tight text-balance leading-[1.05]">
          Webs que construimos para negocios como el tuyo
        </h2>
        <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-md">
          Pasa el cursor por cada sitio y recórrelo de arriba abajo. Rápidos, medidos y con un camino claro hasta tu WhatsApp.
        </p>
        <div className="flex flex-wrap items-center gap-4">
          <PrimaryCTA label="Quiero una web así" segment="showcase_cta" service="Desarrollo Web" />
          <Link href="/portafolio" className="inline-flex items-center gap-1 text-sm font-semibold text-foreground hover:text-primary transition-colors">
            Ver portafolio <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
      <ShowcaseSwap items={cards} />
    </section>
  )
}
