"use client"

import { ArrowRight, Zap } from "lucide-react"
import Link from "next/link"
import { AnimateIn } from "@/components/animate-in"

export function CtaBanner() {
  return (
    <AnimateIn>
      <section className="relative overflow-hidden rounded-2xl border border-primary/20 glow-accent-lg">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-primary/5 to-chart-2/10" />
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-chart-2/10 rounded-full blur-3xl" />

        <div className="relative flex flex-col lg:flex-row items-center gap-6 p-8 lg:p-12">
          <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/15 border border-primary/20 shrink-0">
            <Zap className="w-7 h-7 text-primary" />
          </div>

          <div className="flex-1 text-center lg:text-left">
            <h2 className="font-display text-xl lg:text-2xl font-bold text-foreground text-balance">
              Listo para transformar tu presencia digital?
            </h2>
            <p className="text-sm text-muted-foreground mt-2 max-w-xl leading-relaxed">
              Agenda una consulta gratuita y descubre como Start By Global puede llevar tu negocio al siguiente nivel en cualquier mercado.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Link
              href="/contacto"
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-sm transition-all duration-300 hover:shadow-lg hover:shadow-primary/25 hover:scale-[1.02] active:scale-[0.98]"
            >
              Agendar Consulta
              <ArrowRight className="w-4 h-4" />
            </Link>
            <a
              href="mailto:info@startbyglobal.com"
              className="hidden sm:flex items-center gap-2 px-5 py-3 rounded-xl bg-transparent border border-border text-foreground text-sm font-medium hover:bg-secondary transition-colors"
            >
              Escribenos
            </a>
          </div>
        </div>
      </section>
    </AnimateIn>
  )
}
