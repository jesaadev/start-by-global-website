import { Bot, CalendarCheck, Clock, Mail } from "lucide-react"
import { PageHero } from "@/components/layout/page-hero"
import { LinkCTA } from "@/components/cta/link-cta"
import { ContactForm, OpenChatButton } from "@/components/forms/contact-form"

const CALENDLY_URL = "https://calendly.com/startbyglobal"
const EMAIL = "info@startbyglobal.com"

const CHANNEL =
  "group flex w-full items-center gap-4 rounded-2xl border border-border/50 bg-card/60 p-4 text-left transition-colors hover:border-primary/40"
const CHANNEL_ICON = "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl"

const RESPONSE = [
  { label: "Chat", value: "During business hours" },
  { label: "Email & form", value: "< 24 hours" },
  { label: "Fixed quote", value: "48 hours" },
]

export function UsContactContent() {
  return (
    <>
      <PageHero
        badge="Contact"
        title="Let's talk about growing your business"
        highlight="growing your business"
        size="lg"
        subtitle="Book a 30-minute call, chat with us or send a message. We reply within 24 hours, in English."
      >
        <LinkCTA href={CALENDLY_URL} label="Book a 30-min call" external />
      </PageHero>

      <section id="form" className="max-w-7xl mx-auto px-4 sm:px-6 pb-8 sm:pb-12 scroll-mt-20">
        <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-6">
          <div className="rounded-3xl border border-border/50 bg-card/60 p-6 sm:p-9">
            <ContactForm locale="en" />
          </div>

          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-3">
              <a href={CALENDLY_URL} target="_blank" rel="noopener noreferrer" className={CHANNEL}>
                <span className={`${CHANNEL_ICON} bg-primary/10 text-primary`}>
                  <CalendarCheck className="h-5 w-5" />
                </span>
                <span>
                  <span className="block font-semibold text-foreground">Book a call</span>
                  <span className="block text-sm text-muted-foreground">30 minutes over Zoom or Meet</span>
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
                  <span className="block font-semibold text-foreground">Live chat</span>
                  <span className="block text-sm text-muted-foreground">Quick answers, right now</span>
                </span>
              </OpenChatButton>
            </div>

            <div className="rounded-2xl border border-border/50 bg-card/60 p-5">
              <h2 className="font-display text-lg font-bold flex items-center gap-2">
                <Clock className="h-4 w-4 text-primary" />
                Response times
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
              <h2 className="font-display text-lg font-bold">We work in your time zone</h2>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                Our team works in GMT-4 to GMT-6, the same range as U.S. Eastern to Central time, remotely with
                businesses across the U.S.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
