"use client"

import React from "react"
import { TrendingUp, TrendingDown, Users, Eye, MousePointer, DollarSign, Globe, Target } from "lucide-react"
import { useEffect, useRef } from "react"

const kpiCards = [
  { label: "Visitantes Mensuales", value: 245000, suffix: "", prefix: "", format: "compact", icon: Eye, trend: 12.5, color: "primary" as const },
  { label: "Leads Generados", value: 1842, suffix: "", prefix: "", format: "standard", icon: Users, trend: 23.1, color: "chart-2" as const },
  { label: "Tasa de Clics (CTR)", value: 4.8, suffix: "%", prefix: "", format: "decimal", icon: MousePointer, trend: -2.3, color: "chart-4" as const },
  { label: "Ingresos Generados", value: 892, suffix: "K", prefix: "$", format: "standard", icon: DollarSign, trend: 18.7, color: "chart-3" as const },
]

const regionData = [
  { region: "Rep. Dominicana", clients: 45, revenue: "120K", growth: 28 },
  { region: "Espana", clients: 32, revenue: "210K", growth: 15 },
  { region: "Latinoamerica", clients: 58, revenue: "180K", growth: 34 },
  { region: "EE.UU.", clients: 27, revenue: "350K", growth: 22 },
]

const channelPerformance = [
  { channel: "SEO Organico", sessions: 45, color: "bg-primary" },
  { channel: "Redes Sociales", sessions: 25, color: "bg-chart-2" },
  { channel: "Email Marketing", sessions: 18, color: "bg-chart-4" },
  { channel: "Publicidad PPC", sessions: 12, color: "bg-chart-3" },
]

function formatValue(value: number, format: string, prefix: string, suffix: string): string {
  if (format === "compact") {
    if (value >= 1000) return `${prefix}${(value / 1000).toFixed(1)}K${suffix}`
    return `${prefix}${value}${suffix}`
  }
  if (format === "decimal") return `${prefix}${value.toFixed(1)}${suffix}`
  return `${prefix}${value.toLocaleString()}${suffix}`
}

function animateCountUp(
  el: HTMLElement,
  end: number,
  format: string,
  prefix: string,
  suffix: string,
  duration: number = 2000
): void {
  const startTime = Date.now()
  const timer = setInterval(() => {
    const elapsed = Date.now() - startTime
    const progress = Math.min(elapsed / duration, 1)
    const eased = 1 - Math.pow(1 - progress, 3)
    const current = Math.floor(eased * end)
    const displayValue =
      format === "decimal"
        ? formatValue(current / 10, format, prefix, suffix)
        : formatValue(current, format, prefix, suffix)
    el.textContent = displayValue
    if (progress >= 1) clearInterval(timer)
  }, 16)
}

export function MetricsSection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const hasAnimated = useRef(false)

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true
          kpiCards.forEach((kpi) => {
            const el = section.querySelector(`[data-kpi="${kpi.label}"]`)
            if (!el) return
            const endValue =
              kpi.format === "decimal" ? Math.floor(kpi.value * 10) : kpi.value
            animateCountUp(
              el as HTMLElement,
              endValue,
              kpi.format,
              kpi.prefix,
              kpi.suffix
            )
          })
        }
      },
      { threshold: 0.2 }
    )
    observer.observe(section)
    return () => observer.disconnect()
  }, [])

  return (
    <section id="metrics" ref={sectionRef} className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-2xl font-bold text-foreground">
            Rendimiento Global
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Vista general de metricas en tiempo real
          </p>
        </div>
        <div className="hidden sm:flex items-center gap-2 text-xs text-muted-foreground">
          <div className="w-2 h-2 rounded-full bg-chart-3 animate-pulse" />
          Actualizado en tiempo real
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {kpiCards.map((kpi) => {
          const Icon = kpi.icon
          const isPositive = kpi.trend > 0
          const initialValue = formatValue(0, kpi.format, kpi.prefix, kpi.suffix)

          return (
            <div
              key={kpi.label}
              className="glass-card rounded-xl p-5 flex flex-col gap-3 hover:border-primary/30 transition-all duration-300 group"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center justify-center w-10 h-10 rounded-lg" style={{ backgroundColor: `hsl(var(--${kpi.color}) / 0.1)` }}>
                  <Icon className="w-5 h-5" style={{ color: `hsl(var(--${kpi.color}))` }} />
                </div>
                <div
                  className={`flex items-center gap-1 text-xs font-medium ${isPositive ? "text-chart-3" : "text-destructive"}`}
                >
                  {isPositive ? (
                    <TrendingUp className="w-3 h-3" />
                  ) : (
                    <TrendingDown className="w-3 h-3" />
                  )}
                  {isPositive ? "+" : ""}
                  {kpi.trend}%
                </div>
              </div>
              <div>
                <span
                  className="font-display text-2xl font-bold text-foreground"
                  data-kpi={kpi.label}
                >
                  {initialValue}
                </span>
                <p className="text-xs text-muted-foreground mt-1">{kpi.label}</p>
              </div>
            </div>
          )
        })}
      </div>

      {/* Second row: Region map + Channel performance */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        {/* Region Performance */}
        <div className="lg:col-span-3 glass-card rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-semibold text-foreground flex items-center gap-2">
              <Globe className="w-4 h-4 text-primary" />
              Rendimiento por Region
            </h3>
          </div>
          <div className="flex flex-col gap-3">
            {regionData.map((r) => (
              <div
                key={r.region}
                className="flex items-center gap-4 p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors"
              >
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">
                    {r.region}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {r.clients} clientes activos
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold font-display text-foreground">
                    ${r.revenue}
                  </p>
                  <p className="text-xs text-chart-3">+{r.growth}%</p>
                </div>
                <div className="hidden sm:block w-24 h-2 rounded-full bg-secondary overflow-hidden">
                  <div
                    className="h-full rounded-full bg-primary transition-all duration-1000"
                    style={{ width: `${(r.growth / 40) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Channel Performance */}
        <div className="lg:col-span-2 glass-card rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-semibold text-foreground flex items-center gap-2">
              <Target className="w-4 h-4 text-primary" />
              Canales de Trafico
            </h3>
          </div>

          {/* Donut-like circle */}
          <div className="flex items-center justify-center mb-6">
            <div className="relative w-36 h-36">
              <svg
                viewBox="0 0 100 100"
                className="w-full h-full -rotate-90"
                aria-hidden="true"
              >
                {channelPerformance.reduce<{
                  offset: number
                  elements: React.ReactNode[]
                }>(
                  (acc, ch, i) => {
                    const circumference = 2 * Math.PI * 40
                    const strokeLen = (ch.sessions / 100) * circumference
                    const gap = 3
                    acc.elements.push(
                      <circle
                        key={ch.channel}
                        cx="50"
                        cy="50"
                        r="40"
                        fill="none"
                        stroke={
                          i === 0
                            ? "hsl(var(--primary))"
                            : i === 1
                              ? "hsl(var(--chart-2))"
                              : i === 2
                                ? "hsl(var(--chart-4))"
                                : "hsl(var(--chart-3))"
                        }
                        strokeWidth="10"
                        strokeDasharray={`${strokeLen - gap} ${circumference - strokeLen + gap}`}
                        strokeDashoffset={`${-acc.offset}`}
                        strokeLinecap="round"
                        className="transition-all duration-1000"
                      />
                    )
                    acc.offset += strokeLen
                    return acc
                  },
                  { offset: 0, elements: [] }
                ).elements}
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="font-display text-xl font-bold text-foreground">
                  100%
                </span>
                <span className="text-[10px] text-muted-foreground">
                  Sesiones
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2.5">
            {channelPerformance.map((ch) => (
              <div key={ch.channel} className="flex items-center gap-3">
                <div className={`w-2.5 h-2.5 rounded-full ${ch.color}`} />
                <span className="flex-1 text-xs text-muted-foreground">
                  {ch.channel}
                </span>
                <span className="text-xs font-semibold text-foreground">
                  {ch.sessions}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
