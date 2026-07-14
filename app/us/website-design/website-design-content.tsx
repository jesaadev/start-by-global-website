"use client"

import { useState } from "react"
import Link from "next/link"
import { DashboardLayout } from "@/components/dashboard-layout"
import { AnimateIn } from "@/components/animate-in"
import { Footer } from "@/components/footer"
import { ContactSection } from "@/components/contact-section"
import {
  ArrowRight, Code2, Gauge, Search, ShoppingCart, LayoutTemplate,
  Rocket, PenTool, TestTubes, Plus, CheckCircle2,
} from "lucide-react"

import { US_WEB_FAQS } from "./faqs"

const OFFERINGS = [
  { icon: LayoutTemplate, title: "Landing pages", desc: "Single-goal pages engineered for ad campaigns and lead capture. From $600." },
  { icon: Code2, title: "Corporate websites", desc: "Fast, credible multi-page sites that make your business the obvious choice. From $1,200." },
  { icon: ShoppingCart, title: "E-commerce", desc: "Stores that load fast, rank and convert — with payments, shipping and analytics wired in. From $2,500." },
]

const PROCESS = [
  { icon: Search, title: "Discovery", desc: "We map your goals, audience and competitors before a single pixel is drawn." },
  { icon: PenTool, title: "Design", desc: "Conversion-first UX and a visual identity that builds instant trust." },
  { icon: Code2, title: "Build", desc: "Next.js or WordPress, Core Web Vitals in the green, tracking installed." },
  { icon: Rocket, title: "Launch & grow", desc: "We ship, measure and iterate — your site keeps improving after launch." },
]

const INCLUDED = [
  "Mobile-first responsive design",
  "Core Web Vitals performance targets",
  "Technical SEO + structured data",
  "Analytics & conversion tracking (GA4, pixel + CAPI)",
  "Copywriting guidance in English",
  "30 days of post-launch support",
]

export function WebsiteDesignContent() {
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  return (
    <DashboardLayout>
      {/* Hero */}
      <AnimateIn>
        <section className="glass-card rounded-2xl p-8 sm:p-12 relative overflow-hidden">
          <div
            className="absolute inset-0 opacity-60"
            style={{ background: "linear-gradient(135deg, hsl(16 90% 50% / 0.12) 0%, transparent 65%)" }}
          />
          <div className="relative z-10 max-w-3xl space-y-5">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/25 text-xs font-semibold text-primary">
              <Code2 className="w-3.5 h-3.5" />
              Website design & development
            </span>
            <h1 className="font-display text-3xl sm:text-5xl font-bold text-balance leading-[1.12] tracking-tight">
              A website that sells — not just a pretty brochure
            </h1>
            <p className="text-muted-foreground text-lg leading-relaxed max-w-2xl">
              We design and build websites for U.S. businesses with one goal: turning visitors into
              leads and sales. Senior team, U.S. time zones, fixed USD pricing from $600.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 pt-1">
              <Link
                href="/us/contact"
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-primary text-primary-foreground font-bold hover:shadow-lg hover:shadow-primary/25 transition-all"
              >
                Get your fixed quote
                <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href="#faq"
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-card border border-border/50 text-foreground font-medium hover:border-primary/30 transition-all"
              >
                Common questions
              </a>
            </div>
          </div>
        </section>
      </AnimateIn>

      {/* Offerings */}
      <AnimateIn delay={0.1}>
        <section className="grid sm:grid-cols-3 gap-4">
          {OFFERINGS.map((o, i) => {
            const Icon = o.icon
            return (
              <AnimateIn key={o.title} delay={i * 80}>
                <div className="glass-card rounded-xl p-6 flex flex-col gap-3 h-full">
                  <div className="flex items-center justify-center w-11 h-11 rounded-lg bg-primary/10 border border-primary/20">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  <h2 className="font-display font-semibold text-foreground">{o.title}</h2>
                  <p className="text-sm text-muted-foreground leading-relaxed">{o.desc}</p>
                </div>
              </AnimateIn>
            )
          })}
        </section>
      </AnimateIn>

      {/* What's included */}
      <AnimateIn delay={0.15}>
        <section className="glass-card rounded-2xl p-6 sm:p-8 space-y-4">
          <div className="flex items-center gap-2">
            <Gauge className="w-5 h-5 text-primary" />
            <h2 className="font-display text-xl font-bold text-foreground">Included in every build</h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-x-6 gap-y-2.5">
            {INCLUDED.map((f) => (
              <span key={f} className="flex items-start gap-2 text-sm text-muted-foreground">
                <CheckCircle2 className="w-4 h-4 text-chart-3 shrink-0 mt-0.5" />
                {f}
              </span>
            ))}
          </div>
        </section>
      </AnimateIn>

      {/* Process */}
      <AnimateIn delay={0.2}>
        <section className="space-y-4">
          <h2 className="font-display text-2xl font-bold text-foreground">How we work</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {PROCESS.map((p, i) => {
              const Icon = p.icon
              return (
                <AnimateIn key={p.title} delay={i * 80}>
                  <div className="glass-card rounded-xl p-5 space-y-2.5 h-full">
                    <div className="flex items-center gap-2.5">
                      <span className="font-display text-xs font-bold text-primary">0{i + 1}</span>
                      <Icon className="w-4 h-4 text-primary" />
                    </div>
                    <h3 className="text-sm font-semibold text-foreground">{p.title}</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">{p.desc}</p>
                  </div>
                </AnimateIn>
              )
            })}
          </div>
        </section>
      </AnimateIn>

      {/* FAQ */}
      <AnimateIn delay={0.25}>
        <section id="faq" className="space-y-4">
          <div className="flex items-center gap-2">
            <TestTubes className="w-5 h-5 text-primary" />
            <h2 className="font-display text-2xl font-bold text-foreground">Frequently asked questions</h2>
          </div>
          <div className="space-y-2">
            {US_WEB_FAQS.map((f, i) => (
              <div key={f.q} className="glass-card rounded-xl overflow-hidden">
                <button
                  type="button"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between gap-3 px-5 py-4 text-left"
                >
                  <span className="text-sm font-medium text-foreground">{f.q}</span>
                  <Plus className={`w-4 h-4 text-primary shrink-0 transition-transform ${openFaq === i ? "rotate-45" : ""}`} />
                </button>
                {openFaq === i && (
                  <p className="px-5 pb-4 text-sm text-muted-foreground leading-relaxed">{f.a}</p>
                )}
              </div>
            ))}
          </div>
        </section>
      </AnimateIn>

      {/* Contact */}
      <AnimateIn delay={0.3}>
        <ContactSection />
      </AnimateIn>

      <Footer locale="en" />
    </DashboardLayout>
  )
}
