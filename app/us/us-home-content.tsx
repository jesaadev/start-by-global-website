import Link from "next/link"
import { ArrowRight, Clock3, Code2, Cpu, DollarSign, Languages, Megaphone, Search, ShieldCheck } from "lucide-react"
import type { ShowcaseItem } from "@/lib/showcase"
import { PageFunnelTracker } from "@/components/analytics/page-funnel-tracker"
import { AnimateIn } from "@/components/animate-in"
import { PageHero } from "@/components/layout/page-hero"
import { LinkCTA } from "@/components/cta/link-cta"
import { SecondaryCTA } from "@/components/cta/secondary-cta"
import { ClosingCTA } from "@/components/cta/closing-cta"
import { PersonaVisual } from "@/components/landings/persona-visual"
import { PlatformsStrip } from "@/components/home-v2/platforms-strip"
import { AdFlow } from "@/components/home-v2/ad-flow"
import { HomeIncluded } from "@/components/home-v2/included"
import { ProcessSection } from "@/components/sections/process-section"
import SpotlightCard from "@/components/reactbits/SpotlightCard"

// Real-data rule: what we do and how, no invented results or track record.

const CALENDLY_URL = "https://calendly.com/startbyglobal"

const SERVICES = [
  { icon: Code2, title: "Website design & development", desc: "Conversion-focused websites, landing pages and e-commerce on Next.js or WordPress: fast, SEO-ready and built to sell.", href: "/us/website-design", cta: "Explore website design" },
  { icon: Megaphone, title: "Google & Meta Ads", desc: "Paid campaigns optimized for leads and revenue, not clicks, with real measurement (pixel + Conversions API).", href: "/us/google-ads", cta: "Explore ads management" },
  { icon: Search, title: "SEO & content", desc: "Technical SEO, content strategy and internal linking that compound into a steady organic pipeline.", href: "#contact", cta: "Ask about SEO" },
  { icon: Cpu, title: "Automation & AI", desc: "Chatbots, AI agents and Make / n8n / Zapier workflows that answer, qualify and follow up for you.", href: "#contact", cta: "Ask about automation" },
]

const WHY_US = [
  { icon: Clock3, title: "Your time zone", desc: "We work in GMT-4 to GMT-6, so we're online during your business day, from Miami to L.A." },
  { icon: DollarSign, title: "Agency quality, sensible rates", desc: "Strategy and execution at rates well below typical U.S. agency pricing. Fixed quotes in USD." },
  { icon: Languages, title: "English-first communication", desc: "Clear reporting, fast replies and a single point of contact in English." },
  { icon: ShieldCheck, title: "You own everything", desc: "Your domains, your ad accounts, your data. No lock-in, ever." },
]

const STEPS = [
  { title: "Free consultation", desc: "We review your website, ads and tracking. You leave with a concrete list of fixes, whether you hire us or not." },
  { title: "Fixed quote", desc: "What we'll do, what we won't, the price and the delivery date. In writing, before we start." },
  { title: "Build & launch", desc: "You see progress along the way. Website and campaigns ready to take traffic." },
  { title: "Measure & improve", desc: "Pixel, Conversions API and analytics connected: every lead has a source and decisions are made with data." },
]

export function UsHomeContent({ work }: { work: ShowcaseItem[] }) {
  return (
    <>
      <PageFunnelTracker landingKey="us_home" />

      <PageHero
        badge="For U.S. businesses"
        title="Websites and ads that turn visitors into customers"
        highlight="into customers"
        subtitle="A nearshore team working in U.S. time zones. We design, build and market high-converting websites, with transparent USD pricing."
        note="Free consultation · Fixed USD pricing · Reply within 24 hours"
        aside={<PersonaVisual visual="web" work={work} locale="en" />}
      >
        <LinkCTA href="#contact" label="Get a free quote" />
        <SecondaryCTA label="See website design" href="/us/website-design" />
      </PageHero>

      <PlatformsStrip label="We work with" />

      {/* Services */}
      <section id="services" className="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-20 scroll-mt-20">
        <h2 className="font-display text-3xl sm:text-5xl font-bold tracking-tight leading-[1.05] text-balance max-w-3xl">
          Everything your business needs to win online
        </h2>
        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-4">
          {SERVICES.map((s, i) => {
            const Icon = s.icon
            return (
              <AnimateIn key={s.title} delay={(i % 2) * 90} className="h-full">
                <SpotlightCard spotlightColor="rgba(242, 109, 61, 0.18)" className="h-full !p-7 flex flex-col">
                  <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Icon className="h-6 w-6" />
                  </span>
                  <h3 className="font-display text-2xl font-bold mt-5">{s.title}</h3>
                  <p className="text-base text-foreground/70 leading-relaxed mt-2">{s.desc}</p>
                  <Link href={s.href} className="group mt-auto pt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-foreground hover:text-primary transition-colors">
                    {s.cta}
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none" />
                  </Link>
                </SpotlightCard>
              </AnimateIn>
            )
          })}
        </div>
      </section>

      <AdFlow locale="en" id="ads" ctaLabel="I want campaigns like this" ctaHref="#contact" />

      {/* Why us */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
        <h2 className="font-display text-3xl sm:text-5xl font-bold tracking-tight leading-[1.05] text-balance max-w-3xl">
          Why U.S. companies work with us
        </h2>
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {WHY_US.map((w) => {
            const Icon = w.icon
            return (
              <div key={w.title} className="rounded-2xl border border-border/50 bg-card/60 p-6">
                <Icon className="h-7 w-7 text-primary" />
                <h3 className="font-display text-xl font-bold mt-4">{w.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed mt-2">{w.desc}</p>
              </div>
            )
          })}
        </div>
      </section>

      <ProcessSection eyebrow="How we work" title="From free consultation to your first lead, no black boxes" steps={STEPS} />

      <HomeIncluded locale="en" />

      <ClosingCTA
        id="contact"
        title="Let's talk about your next customer"
        text="Tell us about your business. We'll reply within 24 hours with what we'd fix first on your website and ads, no strings attached."
        segment="us_home_final"
        cta={<LinkCTA href={CALENDLY_URL} label="Book a 30-min call" external />}
        formIntro="Or get your free quote here:"
        form={{ landingKey: "us_home", landingName: "EE.UU. · Home", locale: "en" }}
      />
    </>
  )
}
