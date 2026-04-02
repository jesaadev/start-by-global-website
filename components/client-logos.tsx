"use client"

import { AnimateIn } from "@/components/animate-in"

const clientLogos = [
  {
    name: "TechCorp",
    industry: "Tecnología",
    logo: (
      <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20 flex items-center justify-center">
        <span className="text-primary font-bold text-sm">TC</span>
      </div>
    )
  },
  {
    name: "GlobalFinance",
    industry: "Finanzas",
    logo: (
      <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-chart-2/20 to-chart-2/5 border border-chart-2/20 flex items-center justify-center">
        <span className="text-chart-2 font-bold text-sm">GF</span>
      </div>
    )
  },
  {
    name: "HealthPlus",
    industry: "Salud",
    logo: (
      <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-chart-3/20 to-chart-3/5 border border-chart-3/20 flex items-center justify-center">
        <span className="text-chart-3 font-bold text-sm">HP</span>
      </div>
    )
  },
  {
    name: "EduLearn",
    industry: "Educación",
    logo: (
      <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-chart-4/20 to-chart-4/5 border border-chart-4/20 flex items-center justify-center">
        <span className="text-chart-4 font-bold text-sm">EL</span>
      </div>
    )
  },
  {
    name: "RetailMax",
    industry: "Retail",
    logo: (
      <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary/15 to-chart-2/10 border border-primary/15 flex items-center justify-center">
        <span className="text-primary font-bold text-sm">RM</span>
      </div>
    )
  },
  {
    name: "LogiFlow",
    industry: "Logística",
    logo: (
      <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-chart-4/15 to-chart-3/10 border border-chart-4/15 flex items-center justify-center">
        <span className="text-chart-4 font-bold text-sm">LF</span>
      </div>
    )
  }
]

export function ClientLogos() {
  return (
    <AnimateIn delay={600}>
      <div className="flex flex-col items-center gap-4 py-6">
        <p className="text-xs text-muted-foreground font-medium">
          Confían en nosotros
        </p>
        <div className="flex items-center gap-4 flex-wrap justify-center">
          {clientLogos.map((client, index) => (
            <div
              key={client.name}
              className="group flex flex-col items-center gap-2 opacity-60 hover:opacity-100 transition-opacity duration-300"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="transition-transform duration-300 group-hover:scale-110">
                {client.logo}
              </div>
              <div className="text-center">
                <p className="text-[10px] font-medium text-muted-foreground">
                  {client.name}
                </p>
                <p className="text-[9px] text-muted-foreground/70">
                  {client.industry}
                </p>
              </div>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-2 mt-2">
          <div className="flex -space-x-1">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="w-6 h-6 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 border-2 border-background flex items-center justify-center"
              >
                <span className="text-[8px] font-bold text-primary">★</span>
              </div>
            ))}
          </div>
          <span className="text-[10px] text-muted-foreground">
            +150 empresas satisfechas
          </span>
        </div>
      </div>
    </AnimateIn>
  )
}