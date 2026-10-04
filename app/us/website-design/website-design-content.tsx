import type { ShowcaseItem } from "@/lib/showcase"
import { PageFunnelTracker } from "@/components/analytics/page-funnel-tracker"
import { PageHero } from "@/components/layout/page-hero"
import { LinkCTA } from "@/components/cta/link-cta"
import { SecondaryCTA } from "@/components/cta/secondary-cta"
import { ClosingCTA } from "@/components/cta/closing-cta"
import { PersonaVisual } from "@/components/landings/persona-visual"
import { HomeIncluded } from "@/components/home-v2/included"
import { ProcessSection } from "@/components/sections/process-section"
import { PlansSection, type Plan } from "@/components/sections/plans-section"
import { FaqSection } from "@/components/sections/faq-section"
import { US_WEB_FAQS } from "./faqs"

const CALENDLY_URL = "https://calendly.com/startbyglobal"

const PLANS: Plan[] = [
  {
    name: "Landing page",
    pricePrefix: "From",
    price: "$600",
    desc: "A single-goal page engineered for ad campaigns and lead capture.",
    points: ["One clear call to action", "Conversion-first copy guidance", "Pixel + Conversions API tracking", "Ships in 1–2 weeks"],
    cta: "Get this quote",
  },
  {
    name: "Corporate website",
    pricePrefix: "From",
    price: "$1,200",
    desc: "A fast, credible multi-page site that makes you the obvious choice.",
    points: ["Custom multi-page design", "Technical SEO + structured data", "Blog and analytics", "Ships in 3–4 weeks"],
    featured: true,
    cta: "Get this quote",
  },
  {
    name: "E-commerce",
    pricePrefix: "From",
    price: "$2,500",
    desc: "A store that loads fast, ranks and converts.",
    points: ["Payments and shipping wired in", "Catalog management", "Conversion optimization", "Ships in 4–8 weeks"],
    cta: "Get this quote",
  },
]

const STEPS = [
  { title: "Discovery", desc: "We map your goals, audience and competitors before a single pixel is drawn." },
  { title: "Design", desc: "Conversion-first UX and a visual identity that builds instant trust. You see it before we build it." },
  { title: "Build", desc: "Next.js or WordPress, Core Web Vitals in the green, tracking installed." },
  { title: "Launch & grow", desc: "We ship, measure and iterate, so your site keeps improving after launch." },
]

export function WebsiteDesignContent({ work }: { work: ShowcaseItem[] }) {
  return (
    <>
      <PageFunnelTracker landingKey="us_web" />

      <PageHero
        badge="Website design & development"
        title="A website that sells, not just a pretty brochure"
        highlight="that sells"
        subtitle="We design and build websites for U.S. businesses with one goal: turning visitors into leads and sales. U.S. time zones, fixed USD pricing."
        note={<><span className="font-semibold text-foreground">From $600.</span> Fixed quote, in writing, before we start.</>}
        aside={<PersonaVisual visual="web" work={work} locale="en" />}
      >
        <LinkCTA href="#contact" label="Get your fixed quote" />
        <SecondaryCTA label="See pricing" href="#pricing" />
      </PageHero>

      <PlansSection
        id="pricing"
        title="Fixed pricing, in USD"
        subtitle="Starting prices. Your final quote is fixed and in writing before we start: no hourly surprises."
        plans={PLANS}
        featuredLabel="Most popular"
        href="#contact"
      />

      <HomeIncluded locale="en" />

      <ProcessSection eyebrow="How we work" title="From discovery to launch, no black boxes" steps={STEPS} />

      <FaqSection faqs={US_WEB_FAQS} title="Frequently asked questions" jsonLd={false} />

      <ClosingCTA
        id="contact"
        title="Get your fixed quote"
        text="Tell us what you need. We'll reply within 24 hours with a fixed price and a delivery date."
        segment="us_web_final"
        cta={<LinkCTA href={CALENDLY_URL} label="Book a 30-min call" external />}
        formIntro="Or request your quote here:"
        form={{
          landingKey: "us_web",
          landingName: "EE.UU. · Website Design",
          locale: "en",
          button: "Get my quote",
          qualifierLabel: "What do you need? (landing, website, store…)",
        }}
      />
    </>
  )
}
