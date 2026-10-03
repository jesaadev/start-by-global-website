import { Linkedin, Megaphone, Music2, Search } from "lucide-react"
import { PageFunnelTracker } from "@/components/analytics/page-funnel-tracker"
import { AnimateIn } from "@/components/animate-in"
import { PageHero } from "@/components/layout/page-hero"
import { PrimaryCTA } from "@/components/cta/primary-cta"
import { SecondaryCTA } from "@/components/cta/secondary-cta"
import { ClosingCTA } from "@/components/cta/closing-cta"
import { AdFlow } from "@/components/home-v2/ad-flow"
import { ProcessSection } from "@/components/sections/process-section"
import { FaqSection } from "@/components/sections/faq-section"
import SpotlightCard from "@/components/reactbits/SpotlightCard"

const SERVICE = "Marketing Digital"

const PLATFORMS = [
  { icon: Megaphone, name: "Meta Ads", desc: "Facebook e Instagram: prospección y retargeting que llenan tu WhatsApp de conversaciones." },
  { icon: Search, name: "Google Ads", desc: "Búsqueda, Display y Performance Max para captar a quien ya te está buscando." },
  { icon: Music2, name: "TikTok Ads", desc: "Creatividades nativas para ganar alcance con un costo por resultado controlado." },
  { icon: Linkedin, name: "LinkedIn Ads", desc: "Segmentación B2B por cargo, sector y empresa para ventas de ticket alto." },
]

const STEPS = [
  { title: "Auditoría", desc: "Revisamos cuentas, datos y embudo. Encontramos dónde se fuga el presupuesto." },
  { title: "Estrategia", desc: "Definimos públicos, oferta, creatividades y objetivo por plataforma." },
  { title: "Campañas", desc: "Lanzamos con medición (píxel + API de Conversiones) y estructura lista para escalar." },
  { title: "Optimización", desc: "Iteramos con datos cada semana para bajar el costo por cliente." },
]

const FAQS = [
  { q: "¿Cuál es la inversión mínima?", a: "Nuestra gestión arranca desde $400/mes, aparte del presupuesto que destines a las plataformas. En la auditoría te recomendamos la pauta mínima según tu objetivo." },
  { q: "¿En cuánto tiempo veo resultados?", a: "Las primeras señales (clics, costo por clic, leads) llegan en 1 a 2 semanas; la optimización del costo por cliente madura entre 4 y 8 semanas según el volumen de datos." },
  { q: "¿Quién es dueño de las cuentas?", a: "Tú. Trabajamos sobre tus cuentas de Meta y Google con acceso de socio; tus datos y activos siempre son tuyos." },
  { q: "¿Incluyen creatividades?", a: "Sí. Producimos copies y piezas orientadas a conversión, y montamos pruebas A/B para encontrar las ganadoras." },
  { q: "¿Necesito una web para anunciarme?", a: "No siempre: muchas campañas llevan directo a WhatsApp. Si tu web no convierte, te lo diremos en la auditoría y te proponemos cómo arreglarlo." },
]

export function AdsContent() {
  return (
    <>
      <PageFunnelTracker landingKey="publicidad" />

      <PageHero
        badge="Publicidad de performance"
        title="Deja de quemar dinero en anuncios. Genera clientes, no clics."
        highlight="Genera clientes, no clics."
        glow="#F43F5E"
        subtitle="Campañas en Meta, Google, TikTok y LinkedIn con estrategia, creatividades que convierten y medición real con píxel y API de Conversiones."
        note={<><span className="font-semibold text-foreground">Gestión desde $400/mes</span>, aparte de la inversión en plataformas.</>}
      >
        <PrimaryCTA label="Pedir auditoría gratis" segment="publicidad_hero" service={SERVICE} />
        <SecondaryCTA label="Prefiero dejar mis datos" href="#contacto" />
      </PageHero>

      <AdFlow id="como-convierte" segment="publicidad_adflow" service={SERVICE} ctaLabel="Quiero campañas así" showLink={false} />

      {/* Plataformas */}
      <section id="plataformas" className="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-20 scroll-mt-20">
        <h2 className="font-display text-3xl sm:text-5xl font-bold tracking-tight leading-[1.05] text-balance max-w-3xl">
          Pautamos donde está tu cliente
        </h2>
        <p className="text-lg text-muted-foreground mt-3 max-w-2xl">Estrategia y ejecución por plataforma, con un solo objetivo: que la pauta se pague sola.</p>
        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {PLATFORMS.map((p, i) => {
            const Icon = p.icon
            return (
              <AnimateIn key={p.name} delay={i * 80} className="h-full">
                <SpotlightCard spotlightColor="rgba(244, 63, 94, 0.16)" className="h-full !p-7">
                  <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400">
                    <Icon className="h-6 w-6" />
                  </span>
                  <h3 className="font-display text-xl font-bold mt-5">{p.name}</h3>
                  <p className="text-base text-foreground/70 leading-relaxed mt-2">{p.desc}</p>
                </SpotlightCard>
              </AnimateIn>
            )
          })}
        </div>
      </section>

      <ProcessSection title="De la auditoría a los clientes" steps={STEPS} />

      <FaqSection faqs={FAQS} />

      <ClosingCTA
        title="Pide tu auditoría gratis"
        text="Revisamos tus cuentas y tu embudo, y te decimos dónde se está yendo el dinero. Trabajes o no con nosotros."
        segment="publicidad_final"
        service={SERVICE}
        ctaLabel="Pedir auditoría por WhatsApp"
        form={{
          landingKey: "publicidad",
          landingName: "Publicidad (página de servicio)",
          button: "Quiero mi auditoría",
          qualifierLabel: "¿Cuánto inviertes al mes en anuncios?",
        }}
      />
    </>
  )
}
