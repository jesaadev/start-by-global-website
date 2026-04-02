"use client"

import { ArrowRight, Play, Sparkles } from "lucide-react"
import { useState, useEffect } from "react"
import Link from "next/link"
import { AnimateIn } from "@/components/animate-in"
import { SocialProofTicker } from "@/components/social-proof-ticker"
import { ClientLogos } from "@/components/client-logos"

const words = ["impulsan", "transforman", "escalan", "potencian"]

export function HeroSection() {
  const [hovering, setHovering] = useState(false)
  const [wordIndex, setWordIndex] = useState(0)
  const [displayText, setDisplayText] = useState(words[0])
  const [isTyping, setIsTyping] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setIsTyping(true)
      setTimeout(() => {
        setWordIndex((prev) => (prev + 1) % words.length)
        setIsTyping(false)
      }, 400)
    }, 3500)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    setDisplayText(words[wordIndex])
  }, [wordIndex])

  return (
    <section id="hero" className="relative overflow-hidden rounded-2xl glass-card glow-accent-lg">
      {/* Animated background elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-chart-2/5" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-chart-2/5 rounded-full blur-3xl animate-float" style={{ animationDelay: "3s" }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/3 rounded-full blur-[100px]" />

      {/* Dot grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: "radial-gradient(circle, hsl(var(--foreground)) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />

      <div className="relative flex flex-col lg:flex-row items-center gap-8 lg:gap-12 p-5 sm:p-8 lg:p-12 w-full min-w-0">
        {/* Left content */}
        <div className="flex-1 min-w-0 flex flex-col gap-6 w-full">
          <AnimateIn delay={0}>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-medium">
                <Sparkles className="w-3 h-3" />
                Disponible para nuevos proyectos
              </span>
            </div>
          </AnimateIn>

          <AnimateIn delay={100}>
            <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight text-balance text-foreground">
              Soluciones Web que{" "}
              <span className={`text-primary inline-block transition-all duration-400 ${isTyping ? "opacity-0 translate-y-2" : "opacity-100 translate-y-0"}`}>
                {displayText}
              </span>{" "}
              tu negocio global
            </h1>
          </AnimateIn>

          <AnimateIn delay={200}>
            <p className="text-muted-foreground text-base lg:text-lg leading-relaxed max-w-xl">
              En Start By Global transformamos ideas en experiencias digitales excepcionales. Presencia activa en
              Rep. Dominicana, Espana, Latinoamerica y EE.UU.
            </p>
          </AnimateIn>

          <AnimateIn delay={300}>
            <div className="flex flex-wrap items-center gap-3">
              <Link
                href="/contacto"
                onMouseEnter={() => setHovering(true)}
                onMouseLeave={() => setHovering(false)}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-sm transition-all duration-300 hover:shadow-lg hover:shadow-primary/25 hover:scale-[1.02] active:scale-[0.98]"
              >
                Iniciar Proyecto
                <ArrowRight className={`w-4 h-4 transition-transform duration-300 ${hovering ? "translate-x-1" : ""}`} />
              </Link>
              <Link
                href="/portafolio"
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-transparent border border-border text-foreground font-semibold text-sm transition-all duration-200 hover:bg-secondary hover:border-border/80"
              >
                <Play className="w-4 h-4" />
                Ver Portafolio
              </Link>
            </div>
          </AnimateIn>

          {/* Social Proof Ticker */}
          <SocialProofTicker />

          {/* Quick stats row */}
          <AnimateIn delay={400}>
            <div className="grid grid-cols-4 gap-3 pt-4 mt-2 border-t border-border/50">
              {[
                { value: "150+", label: "Proyectos" },
                { value: "12", label: "Paises" },
                { value: "98%", label: "Satisfaccion" },
                { value: "5", label: "Anos" },
              ].map((stat) => (
                <div key={stat.label} className="flex flex-col">
                  <span className="font-display text-lg sm:text-xl font-bold text-foreground">{stat.value}</span>
                  <span className="text-[11px] sm:text-xs text-muted-foreground">{stat.label}</span>
                </div>
              ))}
            </div>
          </AnimateIn>

          {/* Client Logos */}
          <ClientLogos />

        </div>

        {/* Right visual - dashboard preview card */}
        <AnimateIn direction="right" delay={200} className="w-full lg:w-[400px] xl:w-[460px] lg:shrink-0">
          <div className="relative rounded-2xl bg-card border border-border/50 overflow-hidden animate-pulse-glow">
            <div className="p-4">
              <div className="flex items-center justify-between mb-4 gap-2">
                <div className="flex items-center gap-2 shrink-0">
                  <div className="w-2.5 h-2.5 rounded-full bg-destructive/80" />
                  <div className="w-2.5 h-2.5 rounded-full bg-chart-4/80" />
                  <div className="w-2.5 h-2.5 rounded-full bg-chart-3/80" />
                </div>
                <span className="text-[10px] text-muted-foreground font-mono truncate">dashboard.sbg.com</span>
              </div>

              {/* Animated analytics bars */}
              <div className="flex items-end gap-1.5 h-28 mb-4">
                {[40, 65, 45, 80, 55, 90, 70, 85, 60, 95, 75, 50].map((h, i) => (
                  <div
                    key={`bar-${h}-${i}`}
                    className="flex-1 rounded-t-sm transition-all duration-1000 ease-out"
                    style={{
                      height: `${h}%`,
                      background: i === 9
                        ? "hsl(var(--primary))"
                        : `hsl(var(--muted-foreground) / ${0.12 + i * 0.03})`,
                      animationDelay: `${i * 150}ms`,
                    }}
                  />
                ))}
              </div>

              {/* Mock metrics grid */}
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "Tasa de Conversion", val: "4.8%", trend: "+12%" },
                  { label: "Trafico Web", val: "24.5K", trend: "+8%" },
                  { label: "Leads Generados", val: "342", trend: "+23%" },
                  { label: "ROI", val: "285%", trend: "+15%" },
                ].map((metric) => (
                  <div key={metric.label} className="rounded-lg bg-secondary/50 p-3">
                    <p className="text-[10px] text-muted-foreground mb-1">{metric.label}</p>
                    <div className="flex items-baseline gap-2">
                      <span className="text-sm font-bold font-display text-foreground">{metric.val}</span>
                      <span className="text-[10px] text-chart-3 font-medium">{metric.trend}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </AnimateIn>
      </div>
    </section>
  )
}
