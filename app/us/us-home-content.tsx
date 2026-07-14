"use client"

import Link from "next/link"
import { DashboardLayout } from "@/components/dashboard-layout"
import { AnimateIn } from "@/components/animate-in"
import { Footer } from "@/components/footer"
import { ContactSection } from "@/components/contact-section"
import {
  ArrowRight, Code2, Megaphone, Search, Cpu, ShieldCheck, Clock3,
  DollarSign, Languages, TrendingUp, CheckCircle2,
} from "lucide-react"

const SERVICES = [
  {
    icon: Code2,
    title: "Website Design & Development",
    desc: "Conversion-focused websites, landing pages and e-commerce built on Next.js and WordPress — fast, SEO-ready and built to sell.",
    href: "/us/website-design",
    cta: "Explore website design",
  },
  {
    icon: Megaphone,
    title: "Google & Meta Ads",
    desc: "Full-funnel paid campaigns with real measurement (pixel + CAPI). We optimize for leads and revenue, not clicks.",
    href: "/us/google-ads",
    cta: "Explore ads management",
  },
  {
    icon: Search,
    title: "SEO & Content",
    desc: "Technical SEO, content strategy and internal linking that compound into steady organic pipeline.",
    href: "/us/contact",
    cta: "Ask about SEO",
  },
  {
    icon: Cpu,
    title: "Automation & AI",
    desc: "Chatbots, AI agents and Make/N8N/Zapier workflows that answer, qualify and follow up while you sleep.",
    href: "/us/contact",
    cta: "Ask about automation",
  },
]

const WHY_US = [
  { icon: Clock3, title: "Your time zone", desc: "Teams in GMT-4 to GMT-6 — we're online when you are, from Miami to L.A." },
  { icon: DollarSign, title: "Senior work, sensible rates", desc: "Agency-level strategy and execution at rates well below typical U.S. agencies." },
  { icon: Languages, title: "English-first communication", desc: "Clear reporting, fast replies and a single point of contact in English." },
  { icon: ShieldCheck, title: "You own everything", desc: "Your domains, your ad accounts, your data. No lock-in, ever." },
]

const RESULTS = [
  { value: "380%", label: "Average campaign ROI" },
  { value: "< 2s", label: "Site load targets" },
  { value: "4", label: "Countries served" },
  { value: "24/7", label: "Tracking & reporting" },
]

export function UsHomeContent() {
  return (
    <DashboardLayout>
      {/* Hero */}
      <AnimateIn>
        <section id="hero" className="glass-card rounded-2xl p-8 sm:p-12 relative overflow-hidden">
          <div
            className="absolute inset-0 opacity-60"
            style={{ background: "linear-gradient(135deg, hsl(16 85% 55% / 0.10) 0%, hsl(190 70% 50% / 0.05) 60%, transparent 100%)" }}
          />
          <div className="relative z-10 max-w-3xl space-y-6">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/25 text-xs font-semibold text-primary">
              <TrendingUp className="w-3.5 h-3.5" />
              For U.S. businesses
            </span>
            <h1 className="font-display text-3xl sm:text-5xl font-bold text-balance leading-[1.12] tracking-tight">
              Websites and ads that turn visitors into customers
            </h1>
            <p className="text-muted-foreground text-lg leading-relaxed max-w-2xl">
              Start By Global is a senior nearshore team working in U.S. time zones. We design, build
              and market high-converting websites — with transparent USD pricing that makes agency
              quality affordable for growing businesses.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 pt-1">
              <Link
                href="/us/contact"
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-primary text-primary-foreground font-bold hover:shadow-lg hover:shadow-primary/25 transition-all"
              >
                Get a free consultation
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/us/website-design"
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-card border border-border/50 text-foreground font-medium hover:border-primary/30 transition-all"
              >
                See website design
              </Link>
            </div>
          </div>
        </section>
      </AnimateIn>

      {/* Results */}
      <AnimateIn delay={0.1}>
        <section id="results" className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {RESULTS.map((r) => (
            <div key={r.label} className="glass-card rounded-xl p-5 text-center">
              <p className="font-display text-2xl sm:text-3xl font-bold text-primary">{r.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{r.label}</p>
            </div>
          ))}
        </section>
      </AnimateIn>

      {/* Services */}
      <AnimateIn delay={0.15}>
        <section id="services" className="space-y-4">
          <div>
            <h2 className="font-display text-2xl font-bold text-foreground">What we do</h2>
            <p className="text-sm text-muted-foreground mt-1">Everything your business needs to win online</p>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            {SERVICES.map((s, i) => {
              const Icon = s.icon
              return (
                <AnimateIn key={s.title} delay={i * 80}>
                  <Link href={s.href} className="glass-card-hover rounded-xl p-6 flex flex-col gap-3 h-full group">
                    <div className="flex items-center justify-center w-11 h-11 rounded-lg bg-primary/10 border border-primary/20">
                      <Icon className="w-5 h-5 text-primary" />
                    </div>
                    <h3 className="font-display font-semibold text-foreground">{s.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
                    <span className="mt-auto pt-2 inline-flex items-center gap-1.5 text-sm text-primary font-medium">
                      {s.cta}
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </Link>
                </AnimateIn>
              )
            })}
          </div>
        </section>
      </AnimateIn>

      {/* Why us */}
      <AnimateIn delay={0.2}>
        <section id="why-us" className="glass-card rounded-2xl p-6 sm:p-8 space-y-5">
          <div>
            <h2 className="font-display text-2xl font-bold text-foreground">Why U.S. companies choose us</h2>
            <p className="text-sm text-muted-foreground mt-1">Nearshore advantages without the offshore headaches</p>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            {WHY_US.map((w) => {
              const Icon = w.icon
              return (
                <div key={w.title} className="flex items-start gap-3 p-4 rounded-xl bg-secondary/30">
                  <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-primary/10 shrink-0">
                    <Icon className="w-4.5 h-4.5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{w.title}</p>
                    <p className="text-xs text-muted-foreground leading-relaxed mt-0.5">{w.desc}</p>
                  </div>
                </div>
              )
            })}
          </div>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 pt-1">
            {["Free initial consultation", "USD pricing, no surprises", "Response within 24 hours"].map((f) => (
              <span key={f} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <CheckCircle2 className="w-3.5 h-3.5 text-chart-3" />
                {f}
              </span>
            ))}
          </div>
        </section>
      </AnimateIn>

      {/* Contact */}
      <AnimateIn delay={0.25}>
        <ContactSection />
      </AnimateIn>

      <Footer locale="en" />
    </DashboardLayout>
  )
}
