import { Check, Linkedin, Megaphone, Music2, Search } from "lucide-react"
import { PageFunnelTracker } from "@/components/analytics/page-funnel-tracker"
import { AnimateIn } from "@/components/animate-in"
import { PageHero } from "@/components/layout/page-hero"
import { LinkCTA } from "@/components/cta/link-cta"
import { SecondaryCTA } from "@/components/cta/secondary-cta"
import { ClosingCTA } from "@/components/cta/closing-cta"
import { AdFlow } from "@/components/home-v2/ad-flow"
import { ProcessSection } from "@/components/sections/process-section"
import { FaqSection } from "@/components/sections/faq-section"
import SpotlightCard from "@/components/reactbits/SpotlightCard"
import { US_ADS_FAQS } from "./faqs"

const CALENDLY_URL = "https://calendly.com/startbyglobal"

const PLATFORMS = [
  { icon: Search, name: "Google Ads", desc: "Search, Display and Performance Max to capture people already looking for what you sell." },
  { icon: Megaphone, name: "Meta Ads", desc: "Facebook and Instagram prospecting and retargeting that fill your pipeline with conversations." },
  { icon: Music2, name: "TikTok Ads", desc: "Native creatives that grow reach with a controlled cost per result." },
  { icon: Linkedin, name: "LinkedIn Ads", desc: "B2B targeting by role, industry and company for high-ticket offers." },
]

const STEPS = [
  { title: "Free audit", desc: "We review your accounts, tracking and funnel, and show you where budget is leaking." },
  { title: "Strategy", desc: "Audiences, offer, creatives and goals defined per platform." },
  { title: "Launch", desc: "Campaigns go live with pixel + Conversions API tracking and a structure ready to scale." },
  { title: "Optimize", desc: "Weekly, data-driven iteration to lower your cost per customer." },
]

const PROMISES = ["Free account audit", "No long-term contracts", "Transparent monthly reporting", "You own the ad accounts"]

export function GoogleAdsContent() {
  return (
    <>
      <PageFunnelTracker landingKey="us_ads" />

      <PageHero
        badge="Paid media management"
        title="Ads that bring customers, not just clicks"
        highlight="not just clicks"
        glow="#F43F5E"
        subtitle="We plan, launch and optimize Google and Meta campaigns for U.S. businesses, with real conversion measurement through pixel + Conversions API."
        note={<><span className="font-semibold text-foreground">Management from $400/month</span>, plus your ad spend. You own the accounts.</>}
      >
        <LinkCTA href="#contact" label="Request your free audit" />
        <SecondaryCTA label="Common questions" href="#faq" />
      </PageHero>

      <AdFlow locale="en" id="how-it-converts" ctaLabel="Request your free audit" ctaHref="#contact" showLink={false} />

      {/* Platforms */}
      <section id="platforms" className="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-20 scroll-mt-20">
        <h2 className="font-display text-3xl sm:text-5xl font-bold tracking-tight leading-[1.05] text-balance max-w-3xl">
          We advertise where your customers are
        </h2>
        <p className="text-lg text-muted-foreground mt-3 max-w-2xl">The right mix for your audience and offer, with one goal: ads that pay for themselves.</p>
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
        <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-3">
          {PROMISES.map((p) => (
            <li key={p} className="flex items-center gap-2 text-base text-foreground/85">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-chart-3/15">
                <Check className="h-4 w-4 text-chart-3" />
              </span>
              {p}
            </li>
          ))}
        </ul>
      </section>

      <ProcessSection eyebrow="How we work" title="How we run your campaigns" steps={STEPS} />

      <FaqSection faqs={US_ADS_FAQS} title="Frequently asked questions" jsonLd={false} />

      <ClosingCTA
        id="contact"
        title="Request your free audit"
        text="We review your accounts, tracking and funnel, and show you where budget is leaking, whether or not you hire us."
        segment="us_ads_final"
        cta={<LinkCTA href={CALENDLY_URL} label="Book a 30-min call" external />}
        formIntro="Or request your audit here:"
        form={{
          landingKey: "us_ads",
          landingName: "EE.UU. · Google & Meta Ads",
          locale: "en",
          button: "Get my free audit",
          qualifierLabel: "What's your monthly ad spend?",
        }}
      />
    </>
  )
}
