"use client"

import { useState } from "react"
import Link from "next/link"
import { DashboardLayout } from "@/components/dashboard-layout"
import { AnimateIn } from "@/components/animate-in"
import { Footer } from "@/components/footer"
import { ContactSection } from "@/components/contact-section"
import {
  ArrowRight, Megaphone, Search, Music2, Linkedin, Crosshair,
  Gauge, BarChart3, Plus, CheckCircle2,
} from "lucide-react"

import { US_ADS_FAQS } from "./faqs"

const PLATFORMS = [
  { icon: Search, name: "Google Ads", desc: "Search, Display and Performance Max to capture active demand for your product or service." },
  { icon: Megaphone, name: "Meta Ads", desc: "Facebook and Instagram prospecting and retargeting that fill your pipeline." },
  { icon: Music2, name: "TikTok Ads", desc: "Native creatives that scale reach at low CPA." },
  { icon: Linkedin, name: "LinkedIn Ads", desc: "B2B targeting by role, industry and company for high-ticket offers." },
]

const STEPS = [
  { icon: Search, title: "Free audit", desc: "We review your accounts, tracking and funnel — and show you where budget is leaking." },
  { icon: Crosshair, title: "Strategy", desc: "Audiences, offer, creatives and goals defined per platform." },
  { icon: Megaphone, title: "Launch", desc: "Campaigns go live with pixel + CAPI tracking and a structure ready to scale." },
  { icon: Gauge, title: "Optimize", desc: "Data-driven iteration: CPA down, ROAS up, week over week." },
]

const RESULTS = [
  { value: "$400", label: "From, monthly management" },
  { value: "Pixel + CAPI", label: "Real conversion tracking" },
  { value: "100%", label: "Account ownership stays with you" },
  { value: "24/7", label: "Tracking & reporting" },
]

export function GoogleAdsContent() {
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  return (
    <DashboardLayout>
      {/* Hero */}
      <AnimateIn>
        <section className="glass-card rounded-2xl p-8 sm:p-12 relative overflow-hidden">
          <div
            className="absolute inset-0 opacity-60"
            style={{ background: "linear-gradient(135deg, hsl(350 89% 60% / 0.12) 0%, transparent 65%)" }}
          />
          <div className="relative z-10 max-w-3xl space-y-5">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/25 text-xs font-semibold text-rose-600 dark:text-rose-400">
              <Megaphone className="w-3.5 h-3.5" />
              Paid media management
            </span>
            <h1 className="font-display text-3xl sm:text-5xl font-bold text-balance leading-[1.12] tracking-tight">
              Ads that bring customers, not just clicks
            </h1>
            <p className="text-muted-foreground text-lg leading-relaxed max-w-2xl">
              We plan, launch and optimize Google and Meta campaigns for U.S. businesses with real
              conversion measurement (pixel + CAPI). Management from $400/month — you own the
              accounts, we own the results.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 pt-1">
              <Link
                href="/us/contact"
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-primary text-primary-foreground font-bold hover:shadow-lg hover:shadow-primary/25 transition-all"
              >
                Request your free audit
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

      {/* Results */}
      <AnimateIn delay={0.1}>
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {RESULTS.map((r) => (
            <div key={r.label} className="glass-card rounded-xl p-5 text-center">
              <p className="font-display text-2xl sm:text-3xl font-bold text-primary">{r.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{r.label}</p>
            </div>
          ))}
        </section>
      </AnimateIn>

      {/* Platforms */}
      <AnimateIn delay={0.15}>
        <section className="space-y-4">
          <div>
            <h2 className="font-display text-2xl font-bold text-foreground">Platforms we manage</h2>
            <p className="text-sm text-muted-foreground mt-1">The right mix for your audience and offer</p>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            {PLATFORMS.map((p, i) => {
              const Icon = p.icon
              return (
                <AnimateIn key={p.name} delay={i * 80}>
                  <div className="glass-card rounded-xl p-6 flex items-start gap-4 h-full">
                    <div className="flex items-center justify-center w-11 h-11 rounded-lg bg-primary/10 border border-primary/20 shrink-0">
                      <Icon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-display font-semibold text-foreground">{p.name}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed mt-1">{p.desc}</p>
                    </div>
                  </div>
                </AnimateIn>
              )
            })}
          </div>
        </section>
      </AnimateIn>

      {/* Process */}
      <AnimateIn delay={0.2}>
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-primary" />
            <h2 className="font-display text-2xl font-bold text-foreground">How we run your campaigns</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {STEPS.map((s, i) => {
              const Icon = s.icon
              return (
                <AnimateIn key={s.title} delay={i * 80}>
                  <div className="glass-card rounded-xl p-5 space-y-2.5 h-full">
                    <div className="flex items-center gap-2.5">
                      <span className="font-display text-xs font-bold text-primary">0{i + 1}</span>
                      <Icon className="w-4 h-4 text-primary" />
                    </div>
                    <h3 className="text-sm font-semibold text-foreground">{s.title}</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">{s.desc}</p>
                  </div>
                </AnimateIn>
              )
            })}
          </div>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            {["Free account audit", "No long-term contracts", "Transparent monthly reporting"].map((f) => (
              <span key={f} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <CheckCircle2 className="w-3.5 h-3.5 text-chart-3" />
                {f}
              </span>
            ))}
          </div>
        </section>
      </AnimateIn>

      {/* FAQ */}
      <AnimateIn delay={0.25}>
        <section id="faq" className="space-y-4">
          <h2 className="font-display text-2xl font-bold text-foreground">Frequently asked questions</h2>
          <div className="space-y-2">
            {US_ADS_FAQS.map((f, i) => (
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
