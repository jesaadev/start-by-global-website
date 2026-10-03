import { Bot, FileText, LineChart, Workflow } from "lucide-react"
import { PageFunnelTracker } from "@/components/analytics/page-funnel-tracker"
import { AnimateIn } from "@/components/animate-in"
import { PageHero } from "@/components/layout/page-hero"
import { PrimaryCTA } from "@/components/cta/primary-cta"
import { SecondaryCTA } from "@/components/cta/secondary-cta"
import { ClosingCTA } from "@/components/cta/closing-cta"
import { AgentDemo } from "@/components/ia/agent-demo"
import { ComparisonSection } from "@/components/sections/comparison-section"
import { ProcessSection } from "@/components/sections/process-section"
import { PlansSection, type Plan } from "@/components/sections/plans-section"
import { FaqSection } from "@/components/sections/faq-section"
import { PlatformsStrip } from "@/components/home-v2/platforms-strip"
import SpotlightCard from "@/components/reactbits/SpotlightCard"
import { WhatsAppLink } from "@/components/whatsapp-link"

// Regla de dato real: lo que hacemos y cómo, sin cifras de resultados.

const SERVICE = "Automatización e IA"

const SOLUTIONS = [
  {
    icon: Bot,
    title: "Chatbots y agentes IA",
    tag: "GPT · Claude · Gemini",
    desc: "Agentes con memoria, herramientas y acceso a tus datos: atienden, califican leads y resuelven el soporte de primer nivel sin operador.",
    uses: ["Bot de ventas por WhatsApp con CRM", "Soporte con tu base de conocimiento", "Calificación de leads", "Asistente interno para tu equipo"],
    gain: "Menos consultas repetitivas para tu equipo",
    color: "#7B61FF",
  },
  {
    icon: Workflow,
    title: "Automatización de procesos",
    tag: "Make · n8n · Zapier",
    desc: "Conectamos tus herramientas y quitamos el trabajo manual: datos sincronizados, avisos, reportes y facturación que se hacen solos.",
    uses: ["Flujos entre CRM, email y WhatsApp", "Inventarios sincronizados", "Reportes periódicos automáticos", "Facturación recurrente"],
    gain: "Horas de trabajo manual devueltas a tu equipo",
    color: "#00C9C8",
  },
  {
    icon: LineChart,
    title: "IA para datos y reportes",
    tag: "Paneles · Predicción",
    desc: "Convertimos tus datos en decisiones: paneles que se actualizan solos, segmentación de clientes y alertas cuando algo se sale de lo normal.",
    uses: ["Panel de ventas con proyección", "Segmentación automática de clientes", "Alertas de anomalías", "Recomendaciones de productos"],
    gain: "Decisiones con datos al día",
    color: "#0074D9",
  },
  {
    icon: FileText,
    title: "Contenido con IA",
    tag: "Copy · SEO · Multicanal",
    desc: "Blogs, emails, publicaciones y anuncios con tu voz de marca, optimizados para SEO y siempre con revisión humana antes de publicar.",
    uses: ["Blog SEO con revisión humana", "Newsletter semanal", "Variantes de anuncios para pruebas A/B", "Fichas de producto a escala"],
    gain: "Más contenido con el mismo equipo",
    color: "#F4A261",
  },
]

const STEPS = [
  { title: "Diagnóstico IA", desc: "Revisamos tus procesos y elegimos los 3 puntos donde la IA ahorra más trabajo primero." },
  { title: "Prototipo en 7 días", desc: "Un primer prototipo funcionando en una semana. Nada de presentaciones: algo que puedes probar." },
  { title: "Integración y formación", desc: "Lo conectamos a tus sistemas y capacitamos a tu equipo para que lo use desde el primer día." },
  { title: "Mejora continua", desc: "Revisamos la calidad de las respuestas y los flujos cada semana, y ajustamos." },
]

const PLANS: Plan[] = [
  {
    name: "Starter IA",
    price: "$890",
    period: "/ proyecto",
    desc: "Un flujo o un agente IA para un proceso concreto.",
    points: ["1 automatización o chatbot", "Integración con 2 herramientas", "Documentación técnica", "2 semanas de soporte post-entrega"],
    cta: "Empezar con un proceso",
  },
  {
    name: "Growth IA",
    price: "$2,400",
    period: "/ mes",
    desc: "Automatizaciones, chatbot y panel de datos trabajando juntos.",
    points: ["Hasta 5 flujos de automatización", "1 agente conversacional", "Panel de métricas", "Soporte prioritario", "Optimización mensual incluida"],
    featured: true,
    cta: "Quiero este plan",
  },
  {
    name: "Enterprise IA",
    price: "A medida",
    desc: "Para empresas y grupos que quieren llevar la IA a toda la operación.",
    points: ["Flujos ilimitados", "Modelos ajustados con tus datos", "Infraestructura dedicada", "Acuerdo de nivel de servicio (SLA)", "Equipo asignado"],
    cta: "Hablar de mi caso",
  },
]

const TOOLS = ["OpenAI", "Anthropic Claude", "Google Gemini", "Make", "n8n", "Zapier", "WhatsApp Business API", "HubSpot", "Supabase", "Vercel AI SDK"]

const FAQS = [
  { q: "¿Necesito conocimientos técnicos?", a: "No. Nos encargamos de toda la parte técnica. Tu equipo solo usa la herramienta final, que diseñamos para que sea lo más simple posible." },
  { q: "¿Mis datos están seguros?", a: "Sí. Usamos acuerdos de procesamiento de datos, aislamiento por cliente y nunca mezclamos datos entre clientes. Firmamos NDA o DPA si lo necesitas." },
  { q: "¿Cuándo se nota el retorno?", a: "Depende del proceso. Empezamos por las automatizaciones simples, que suelen ser las de retorno más rápido, y lo definimos contigo en el diagnóstico antes de comprometer nada." },
  { q: "¿Se integra con mi CRM o ERP?", a: "Sí. Trabajamos con HubSpot, Salesforce, Zoho, Odoo y prácticamente cualquier sistema con API o webhooks." },
  { q: "¿Qué pasa si la IA responde mal?", a: "Todos nuestros agentes tienen derivación a una persona y límites claros de lo que pueden responder. Además revisamos la calidad cada semana y ajustamos el contexto." },
]

export function IaContent() {
  return (
    <>
      <PageFunnelTracker landingKey="ia" />

      <PageHero
        badge="IA & Automatización"
        title="Automatiza lo repetitivo. Amplifica lo humano."
        highlight="Amplifica lo humano."
        glow="#7B61FF"
        subtitle="Agentes de IA que atienden y agendan, flujos que mueven datos solos y reportes que se hacen sin que nadie los arme. Tu equipo hace más sin contratar más."
        note={<><span className="font-semibold text-foreground">Prototipo funcionando en 7 días.</span> NDA disponible desde el primer contacto.</>}
        aside={<AgentDemo />}
      >
        <PrimaryCTA label="Agendar demo por WhatsApp" segment="ia_hero" service={SERVICE} />
        <SecondaryCTA label="Prefiero dejar mis datos" href="#contacto" />
      </PageHero>

      <ComparisonSection
        eyebrow="El problema"
        title="Tu equipo pasa horas en tareas que una IA hace en segundos."
        highlight="una IA hace en segundos."
        before={{
          label: "Hoy",
          items: [
            "Responder los mismos mensajes todos los días",
            "Copiar datos a mano entre Excel, CRM y email",
            "Reportes que tardan medio día en armarse",
            "Leads que se enfrían por falta de seguimiento",
            "Contratar más gente para hacer más de lo mismo",
          ],
        }}
        after={{
          label: "Con IA bien implementada",
          items: [
            "Un agente responde las consultas frecuentes al instante",
            "Datos sincronizados solos entre tus sistemas",
            "Reportes que llegan armados cada lunes",
            "Seguimiento automático en minutos, no en días",
            "Tu equipo se dedica a lo que de verdad necesita una persona",
          ],
        }}
      />

      {/* Soluciones */}
      <section id="soluciones" className="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-20 scroll-mt-20">
        <h2 className="font-display text-3xl sm:text-5xl font-bold tracking-tight leading-[1.05] text-balance max-w-3xl">
          Cuatro líneas de IA, un solo equipo
        </h2>
        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-4">
          {SOLUTIONS.map((s, i) => {
            const Icon = s.icon
            return (
              <AnimateIn key={s.title} delay={(i % 2) * 90} className="h-full">
                <SpotlightCard spotlightColor="rgba(123, 97, 255, 0.18)" className="h-full !p-7 sm:!p-8 flex flex-col">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="flex h-12 w-12 items-center justify-center rounded-xl" style={{ backgroundColor: `${s.color}1f`, color: s.color }}>
                      <Icon className="h-6 w-6" />
                    </span>
                    <span className="rounded-full bg-secondary/70 px-3 py-1 text-xs font-medium text-muted-foreground">{s.tag}</span>
                  </div>
                  <h3 className="font-display text-2xl font-bold mt-5">{s.title}</h3>
                  <p className="text-base text-foreground/70 leading-relaxed mt-2">{s.desc}</p>
                  <ul className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2">
                    {s.uses.map((u) => (
                      <li key={u} className="flex items-start gap-2 text-sm text-foreground/80">
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full" style={{ backgroundColor: s.color }} />
                        {u}
                      </li>
                    ))}
                  </ul>
                  <p className="mt-auto pt-6 text-sm font-semibold" style={{ color: s.color }}>→ {s.gain}</p>
                </SpotlightCard>
              </AnimateIn>
            )
          })}
        </div>
        <div className="mt-10 flex flex-wrap items-center gap-4">
          <WhatsAppLink
            segment="ia_soluciones"
            defaultService={SERVICE}
            className="inline-flex items-center gap-2 rounded-xl bg-[#25D366] px-6 py-3.5 text-base font-bold text-white hover:shadow-lg hover:shadow-[#25D366]/25 transition-shadow"
          >
            Cuéntanos qué quieres automatizar
          </WhatsAppLink>
        </div>
      </section>

      <ProcessSection title="De cero a IA funcionando en 4 semanas" steps={STEPS} />

      <PlansSection
        id="planes"
        title="Planes claros, sin sorpresas"
        subtitle="Todos los planes incluyen NDA, panel de monitoreo y soporte por Slack. El alcance exacto queda por escrito antes de empezar."
        plans={PLANS}
        whatsapp={{ service: SERVICE, segment: "ia_plan" }}
      />

      <div className="py-6">
        <PlatformsStrip items={TOOLS} label="Trabajamos con" />
      </div>

      <FaqSection faqs={FAQS} />

      <ClosingCTA
        title="Agenda tu demo gratis"
        text="30 minutos para mostrarte qué podemos automatizar en tu empresa, con ejemplos de tu propio día a día. Sin compromiso."
        segment="ia_final"
        service={SERVICE}
        ctaLabel="Agendar por WhatsApp"
        form={{
          landingKey: "ia",
          landingName: "IA & Automatización (página de servicio)",
          button: "Quiero mi demo",
          qualifierLabel: "¿Qué proceso quieres automatizar?",
        }}
      />
    </>
  )
}
