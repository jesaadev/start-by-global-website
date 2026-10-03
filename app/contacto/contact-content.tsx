import { Bot, CalendarCheck, Clock, Mail, MessageCircle } from "lucide-react"
import { PageHero } from "@/components/layout/page-hero"
import { PrimaryCTA } from "@/components/cta/primary-cta"
import { WhatsAppLink } from "@/components/whatsapp-link"
import { ContactForm, OpenChatButton } from "@/components/forms/contact-form"

const CALENDLY_URL = "https://calendly.com/startbyglobal"
const EMAIL = "info@startbyglobal.com"

const CHANNEL =
  "group flex w-full items-center gap-4 rounded-2xl border border-border/50 bg-card/60 p-4 text-left transition-colors hover:border-primary/40"
const CHANNEL_ICON = "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl"

const MARKETS = [
  { name: "Rep. Dominicana", tz: "GMT-4" },
  { name: "España", tz: "GMT+1" },
  { name: "Latinoamérica", tz: "GMT-6 a GMT-3" },
  { name: "EE.UU.", tz: "GMT-5 a GMT-8" },
]

const RESPONSE = [
  { label: "WhatsApp y chat", value: "En horario laboral" },
  { label: "Email y formulario", value: "< 24 horas" },
  { label: "Propuesta con precio", value: "48 horas" },
]

export function ContactPageContent() {
  return (
    <>
      <PageHero
        badge="Contacto"
        title="Hablemos de tu proyecto"
        highlight="tu proyecto"
        size="lg"
        subtitle="La vía más rápida es WhatsApp. Si lo prefieres, escríbenos por el formulario o agenda una llamada de 30 minutos."
      >
        <PrimaryCTA segment="contacto_hero" />
      </PageHero>

      <section id="formulario" className="max-w-7xl mx-auto px-4 sm:px-6 pb-8 sm:pb-12 scroll-mt-20">
        <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-6">
          <div className="rounded-3xl border border-border/50 bg-card/60 p-6 sm:p-9">
            <ContactForm />
          </div>

          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-3">
              <WhatsAppLink segment="contacto_canal" className={CHANNEL}>
                <span className={`${CHANNEL_ICON} bg-[#25D366]/15 text-[#25D366]`}>
                  <MessageCircle className="h-5 w-5" />
                </span>
                <span>
                  <span className="block font-semibold text-foreground">WhatsApp</span>
                  <span className="block text-sm text-muted-foreground">La respuesta más rápida</span>
                </span>
              </WhatsAppLink>
              <a href={CALENDLY_URL} target="_blank" rel="noopener noreferrer" className={CHANNEL}>
                <span className={`${CHANNEL_ICON} bg-primary/10 text-primary`}>
                  <CalendarCheck className="h-5 w-5" />
                </span>
                <span>
                  <span className="block font-semibold text-foreground">Agendar una llamada</span>
                  <span className="block text-sm text-muted-foreground">30 minutos por Zoom o Meet</span>
                </span>
              </a>
              <a href={`mailto:${EMAIL}`} className={CHANNEL}>
                <span className={`${CHANNEL_ICON} bg-chart-2/15 text-chart-2`}>
                  <Mail className="h-5 w-5" />
                </span>
                <span>
                  <span className="block font-semibold text-foreground">Email</span>
                  <span className="block text-sm text-muted-foreground">{EMAIL}</span>
                </span>
              </a>
              <OpenChatButton className={CHANNEL}>
                <span className={`${CHANNEL_ICON} bg-[#7B61FF]/15 text-[#9d88ff]`}>
                  <Bot className="h-5 w-5" />
                </span>
                <span>
                  <span className="block font-semibold text-foreground">Chat del sitio</span>
                  <span className="block text-sm text-muted-foreground">Resuelve dudas al instante</span>
                </span>
              </OpenChatButton>
            </div>

            <div className="rounded-2xl border border-border/50 bg-card/60 p-5">
              <h2 className="font-display text-lg font-bold flex items-center gap-2">
                <Clock className="h-4 w-4 text-primary" />
                Tiempo de respuesta
              </h2>
              <dl className="mt-3 flex flex-col gap-2">
                {RESPONSE.map((r) => (
                  <div key={r.label} className="flex items-center justify-between gap-3 text-sm">
                    <dt className="text-muted-foreground">{r.label}</dt>
                    <dd className="font-semibold text-foreground">{r.value}</dd>
                  </div>
                ))}
              </dl>
            </div>

            <div className="rounded-2xl border border-border/50 bg-card/60 p-5">
              <h2 className="font-display text-lg font-bold">Trabajamos en remoto con</h2>
              <ul className="mt-3 grid grid-cols-2 gap-2">
                {MARKETS.map((m) => (
                  <li key={m.name} className="rounded-xl bg-secondary/40 px-3 py-2">
                    <span className="block text-sm font-semibold text-foreground">{m.name}</span>
                    <span className="block text-xs text-muted-foreground">{m.tz}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-3 text-xs text-muted-foreground">Base en Santo Domingo, Rep. Dominicana · +1 (849) 356-2247</p>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
