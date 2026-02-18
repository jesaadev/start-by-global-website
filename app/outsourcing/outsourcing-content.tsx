"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowRight, CheckCircle2, Code2, Rocket, Shield, Zap, Globe2, TrendingUp, Lock, Award, ArrowUpRight, ChevronDown } from "lucide-react"
import { AnimateIn } from "@/components/animate-in"

export function OutsourcingContent() {
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  return (
    <div className="min-h-screen bg-[#1A1A1A]">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-[#1A1A1A]/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <img src="/logo-black.svg" alt="Start By Global" className="h-8 invert" />
          </Link>
          <div className="flex items-center gap-6">
            <Link href="/#servicios" className="text-sm text-white/70 hover:text-[#0074D9] transition-colors">
              Servicios
            </Link>
            <Link href="/#portafolio" className="text-sm text-white/70 hover:text-[#0074D9] transition-colors">
              Portafolio
            </Link>
            <Link href="/contacto" className="text-sm text-white/70 hover:text-[#0074D9] transition-colors">
              Contacto
            </Link>
            <a
              href="#partner-kit"
              className="px-4 py-2 rounded-lg bg-[#0074D9] text-white text-sm font-semibold hover:bg-[#0074D9]/90 transition-all hover:shadow-lg hover:shadow-[#0074D9]/25"
            >
              Solicitar Kit Partner
            </a>
          </div>
        </div>
      </nav>

      {/* Hero Section - Deep Tech Luxury */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
        {/* Radial gradient background */}
        <div className="absolute inset-0 bg-gradient-radial from-[#001F3F] via-[#1A1A1A] to-[#1A1A1A]" />
        
        {/* Geometric grid overlay */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `linear-gradient(#0074D9 1px, transparent 1px), linear-gradient(90deg, #0074D9 1px, transparent 1px)`,
            backgroundSize: '80px 80px'
          }} />
        </div>

        {/* Abstract geometric shapes */}
        <div className="absolute top-20 right-20 w-96 h-96 bg-[#0074D9]/5 rounded-full blur-3xl animate-pulse-glow" />
        <div className="absolute bottom-20 left-20 w-80 h-80 bg-[#001F3F]/30 rounded-full blur-3xl" />

        <div className="relative z-10 max-w-6xl mx-auto px-6 text-center">
          <AnimateIn delay={0.1}>
            <div className="inline-block px-4 py-1.5 rounded-full bg-[#0074D9]/10 border border-[#0074D9]/20 text-[#0074D9] text-xs font-semibold mb-6 backdrop-blur-sm">
              Start By Global · Partner Edition 2026
            </div>
          </AnimateIn>

          <AnimateIn delay={0.2}>
            <h1 className="font-display text-6xl md:text-7xl lg:text-8xl font-bold text-white mb-6 leading-[1.1] text-balance">
              Tu Departamento de
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0074D9] to-[#39CCCC]">
                Desarrollo Web
              </span>
            </h1>
          </AnimateIn>

          <AnimateIn delay={0.3}>
            <p className="text-xl md:text-2xl text-[#DDDDDD] mb-4 max-w-3xl mx-auto text-balance">
              In-House, pero fuera de casa.
            </p>
          </AnimateIn>

          <AnimateIn delay={0.4}>
            <p className="text-base md:text-lg text-white/60 mb-10 max-w-2xl mx-auto">
              Escalabilidad inmediata para Agencias y Consultores. Nosotros codificamos la excelencia, tú te llevas el crédito.
            </p>
          </AnimateIn>

          <AnimateIn delay={0.5}>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="#modelos"
                className="group px-8 py-4 rounded-xl bg-[#0074D9] text-white font-semibold text-lg transition-all hover:shadow-2xl hover:shadow-[#0074D9]/40 hover:scale-[1.02] active:scale-[0.98] flex items-center gap-2"
              >
                Ver Modelos de Alianza
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </a>
              <a
                href="#calculadora"
                className="px-8 py-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 text-white font-semibold text-lg transition-all hover:bg-white/10 hover:border-white/20"
              >
                Calcular ROI
              </a>
            </div>
          </AnimateIn>

          {/* Trust indicators */}
          <AnimateIn delay={0.6}>
            <div className="mt-16 flex flex-wrap items-center justify-center gap-8 text-sm text-white/50">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#39CCCC]" />
                <span>NDA Garantizado</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#39CCCC]" />
                <span>Marca Blanca 100%</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#39CCCC]" />
                <span>Cobertura RD · VE · ES</span>
              </div>
            </div>
          </AnimateIn>
        </div>
      </section>

      {/* Problem/Solution Section */}
      <section className="py-24 bg-[#1A1A1A] relative">
        <div className="max-w-7xl mx-auto px-6">
          <AnimateIn>
            <div className="text-center mb-16">
              <h2 className="font-display text-4xl md:text-5xl font-bold text-white mb-6">
                ¿Rechazas clientes por falta de{" "}
                <span className="text-[#0074D9]">capacidad técnica</span>?
              </h2>
              <p className="text-lg text-[#DDDDDD] max-w-3xl mx-auto">
                Sabemos que no ves la segunda página de Google, y tus clientes tampoco. Deja de perder contratos por falta de tiempo o equipo técnico.
              </p>
            </div>
          </AnimateIn>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Before: Traditional Agency */}
            <AnimateIn delay={0.2}>
              <div className="relative p-8 rounded-2xl bg-gradient-to-br from-red-900/10 to-red-950/5 border border-red-500/20 backdrop-blur-sm">
                <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-red-500/20 text-red-400 text-xs font-semibold">
                  Modelo Tradicional
                </div>
                <h3 className="font-display text-2xl font-bold text-white mb-6 mt-4">
                  Agencia Sin Partner
                </h3>
                <ul className="space-y-4">
                  {[
                    "Costos fijos elevados (nómina, oficina, equipos)",
                    "Capacidad limitada = Clientes rechazados",
                    "Dependencia de freelancers sin garantías",
                    "Entrega inconsistente y retrabajos",
                    "Riesgo reputacional con cada proyecto"
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-white/70">
                      <div className="w-5 h-5 rounded-full bg-red-500/20 flex items-center justify-center shrink-0 mt-0.5">
                        <div className="w-2 h-2 bg-red-500 rounded-full" />
                      </div>
                      <span className="text-sm">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </AnimateIn>

            {/* After: With Start By Global */}
            <AnimateIn delay={0.3}>
              <div className="relative p-8 rounded-2xl bg-gradient-to-br from-[#0074D9]/10 to-[#39CCCC]/5 border border-[#0074D9]/20 backdrop-blur-sm">
                <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-[#0074D9]/20 text-[#39CCCC] text-xs font-semibold">
                  Con Start By Global
                </div>
                <h3 className="font-display text-2xl font-bold text-white mb-6 mt-4">
                  Partner Start By Global
                </h3>
                <ul className="space-y-4">
                  {[
                    "Costos variables: Solo pagas por proyecto entregado",
                    "Escalabilidad infinita sin límites de capacidad",
                    "Equipo técnico certificado en tu back-office",
                    "Calidad garantizada con Core Web Vitals optimizados",
                    "Tu marca, tu reputación, nuestro código"
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-white/70">
                      <CheckCircle2 className="w-5 h-5 text-[#39CCCC] shrink-0 mt-0.5" />
                      <span className="text-sm">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </AnimateIn>
          </div>
        </div>
      </section>

      {/* Services Section - Glassmorphism Cards */}
      <section id="modelos" className="py-24 bg-gradient-to-b from-[#1A1A1A] to-[#001F3F]/30 relative">
        <div className="max-w-7xl mx-auto px-6">
          <AnimateIn>
            <div className="text-center mb-16">
              <h2 className="font-display text-4xl md:text-5xl font-bold text-white mb-6">
                Portafolio B2B <span className="text-[#0074D9]">Simplificado</span>
              </h2>
              <p className="text-lg text-[#DDDDDD] max-w-2xl mx-auto">
                Tres servicios clave diseñados para que puedas revender con márgenes premium
              </p>
            </div>
          </AnimateIn>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: Rocket,
                title: "Desarrollo Web & MVP",
                description: "Sitios de alto impacto para PYMES y Startups. Desde corporativos hasta landing pages de conversión.",
                features: ["Diseño responsivo", "SEO On-Page incluido", "Optimización Core Web Vitals", "Entrega en 7-14 días"],
                color: "#0074D9"
              },
              {
                icon: Globe2,
                title: "E-Commerce Ready",
                description: "Tiendas en línea con pasarelas locales y optimización de conversión para RD, VE y España.",
                features: ["Pasarelas de pago locales", "Inventario automatizado", "Multi-moneda", "Marketing integrado"],
                color: "#39CCCC"
              },
              {
                icon: Shield,
                title: "Soporte & Rescate",
                description: "Eliminación de penalizaciones, limpieza de malware y mantenimiento preventivo para sitios críticos.",
                features: ["Monitoreo 24/7", "Limpieza de malware", "Backup automático", "Actualizaciones seguras"],
                color: "#0074D9"
              }
            ].map((service, i) => (
              <AnimateIn key={i} delay={0.1 * (i + 1)}>
                <div className="group relative p-8 rounded-2xl bg-white/[0.02] backdrop-blur-xl border border-white/10 hover:border-[#0074D9]/30 transition-all duration-500 hover:scale-[1.02]">
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#0074D9]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  <div className="relative">
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#0074D9]/20 to-[#39CCCC]/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                      <service.icon className="w-7 h-7 text-[#0074D9]" />
                    </div>

                    <h3 className="font-display text-2xl font-bold text-white mb-3">
                      {service.title}
                    </h3>

                    <p className="text-white/70 text-sm mb-6 leading-relaxed">
                      {service.description}
                    </p>

                    <ul className="space-y-2.5 mb-6">
                      {service.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center gap-2 text-white/60 text-xs">
                          <div className="w-1.5 h-1.5 rounded-full bg-[#39CCCC]" />
                          {feature}
                        </li>
                      ))}
                    </ul>

                    <button className="w-full py-3 rounded-lg bg-white/5 border border-white/10 text-white text-sm font-semibold hover:bg-[#0074D9]/10 hover:border-[#0074D9]/30 transition-all group-hover:shadow-lg group-hover:shadow-[#0074D9]/10">
                      Ver Detalles
                    </button>
                  </div>
                </div>
              </AnimateIn>
            ))}
          </div>
        </div>
      </section>

      {/* Guarantee Section - Navy Blue Solid */}
      <section className="py-24 bg-[#001F3F] relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, #0074D9 1px, transparent 0)`,
            backgroundSize: '40px 40px'
          }} />
        </div>

        <div className="relative max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <AnimateIn>
              <div>
                <div className="inline-block px-3 py-1 rounded-full bg-[#39CCCC]/10 border border-[#39CCCC]/20 text-[#39CCCC] text-xs font-semibold mb-4">
                  Nuestra Garantía
                </div>
                <h2 className="font-display text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
                  Calidad de Clase Mundial,{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0074D9] to-[#39CCCC]">
                    Marca Blanca
                  </span>
                </h2>
                <p className="text-lg text-white/80 mb-8 leading-relaxed">
                  Optimizamos los Core Web Vitals para llevar el negocio de tu cliente al siguiente nivel. Tu marca es lo único que ellos verán.
                </p>

                <div className="space-y-4">
                  {[
                    { icon: Lock, text: "NDA firmado antes de iniciar cualquier proyecto" },
                    { icon: Award, text: "Reportes sin marca o con tu logo corporativo" },
                    { icon: Code2, text: "Código limpio y documentado, listo para tu equipo" },
                    { icon: Zap, text: "Performance garantizado: Score 90+ en Lighthouse" }
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-lg bg-[#0074D9]/10 flex items-center justify-center shrink-0">
                        <item.icon className="w-5 h-5 text-[#0074D9]" />
                      </div>
                      <p className="text-white/70 pt-2">{item.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            </AnimateIn>

            <AnimateIn delay={0.2}>
              <div className="relative">
                <div className="relative p-8 rounded-2xl bg-white/[0.03] backdrop-blur-xl border border-white/10">
                  <div className="space-y-6">
                    <div className="flex items-center justify-between pb-4 border-b border-white/10">
                      <span className="text-white/60 text-sm">Performance Score</span>
                      <span className="text-2xl font-bold text-[#39CCCC]">96/100</span>
                    </div>
                    <div className="flex items-center justify-between pb-4 border-b border-white/10">
                      <span className="text-white/60 text-sm">Core Web Vitals</span>
                      <span className="text-2xl font-bold text-[#39CCCC]">✓ Aprobado</span>
                    </div>
                    <div className="flex items-center justify-between pb-4 border-b border-white/10">
                      <span className="text-white/60 text-sm">SEO Optimization</span>
                      <span className="text-2xl font-bold text-[#39CCCC]">100/100</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-white/60 text-sm">Tiempo de Carga</span>
                      <span className="text-2xl font-bold text-[#39CCCC]">{'< 1.2s'}</span>
                    </div>
                  </div>
                </div>
                <div className="absolute -top-4 -right-4 w-24 h-24 bg-[#0074D9]/20 rounded-full blur-2xl" />
                <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-[#39CCCC]/10 rounded-full blur-3xl" />
              </div>
            </AnimateIn>
          </div>
        </div>
      </section>

      {/* ROI Calculator Section */}
      <section id="calculadora" className="py-24 bg-[#1A1A1A]">
        <div className="max-w-4xl mx-auto px-6">
          <AnimateIn>
            <div className="text-center mb-12">
              <h2 className="font-display text-4xl md:text-5xl font-bold text-white mb-6">
                Calcula tu <span className="text-[#0074D9]">ROI Instantáneo</span>
              </h2>
              <p className="text-lg text-[#DDDDDD]">
                Descubre cuánto puedes ahorrar y ganar al asociarte con Start By Global
              </p>
            </div>
          </AnimateIn>

          <AnimateIn delay={0.2}>
            <div className="p-8 rounded-2xl bg-white/[0.02] backdrop-blur-xl border border-white/10">
              <div className="grid md:grid-cols-2 gap-8 mb-8">
                <div>
                  <label className="block text-white/70 text-sm mb-2">Proyectos Web al Mes</label>
                  <input 
                    type="number" 
                    defaultValue="3" 
                    className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white focus:border-[#0074D9] focus:outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-white/70 text-sm mb-2">Precio Promedio por Proyecto</label>
                  <input 
                    type="number" 
                    defaultValue="2500" 
                    className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white focus:border-[#0074D9] focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <div className="pt-6 border-t border-white/10">
                <div className="grid md:grid-cols-3 gap-6 mb-6">
                  <div className="text-center p-4 rounded-lg bg-[#0074D9]/5 border border-[#0074D9]/20">
                    <div className="text-3xl font-bold text-[#0074D9] mb-1">$4,500</div>
                    <div className="text-xs text-white/60">Ahorro Mensual en Costos</div>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-[#39CCCC]/5 border border-[#39CCCC]/20">
                    <div className="text-3xl font-bold text-[#39CCCC] mb-1">+65%</div>
                    <div className="text-xs text-white/60">Aumento en Capacidad</div>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-[#0074D9]/5 border border-[#0074D9]/20">
                    <div className="text-3xl font-bold text-[#0074D9] mb-1">$54K</div>
                    <div className="text-xs text-white/60">Ahorro Anual</div>
                  </div>
                </div>

                <button className="w-full py-4 rounded-xl bg-gradient-to-r from-[#0074D9] to-[#39CCCC] text-white font-semibold text-lg hover:shadow-2xl hover:shadow-[#0074D9]/30 transition-all hover:scale-[1.01]">
                  Solicitar Análisis Personalizado
                </button>
              </div>
            </div>
          </AnimateIn>
        </div>
      </section>

      {/* CTA Section - Partner Kit */}
      <section id="partner-kit" className="py-24 bg-gradient-to-b from-[#1A1A1A] to-[#001F3F] relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#0074D9]/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#39CCCC]/10 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-5xl mx-auto px-6 text-center">
          <AnimateIn>
            <h2 className="font-display text-4xl md:text-6xl font-bold text-white mb-6">
              El motor invisible de las{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0074D9] to-[#39CCCC]">
                mejores agencias
              </span>
            </h2>
          </AnimateIn>

          <AnimateIn delay={0.2}>
            <p className="text-xl text-white/80 mb-10 max-w-3xl mx-auto">
              Únete a Start By Global Partner Edition y recibe acceso exclusivo al Kit de Partner 2026: contratos tipo, calculadoras de pricing y material de venta listo para usar.
            </p>
          </AnimateIn>

          <AnimateIn delay={0.3}>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/contacto"
                className="group px-10 py-5 rounded-xl bg-[#0074D9] text-white font-bold text-lg transition-all hover:shadow-2xl hover:shadow-[#0074D9]/50 hover:scale-[1.02] active:scale-[0.98] flex items-center gap-3"
              >
                Solicitar Acceso al Kit Partner
                <ArrowUpRight className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </Link>
              <a
                href="mailto:info@startbyglobal.com"
                className="px-10 py-5 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 text-white font-bold text-lg transition-all hover:bg-white/10 hover:border-white/20"
              >
                info@startbyglobal.com
              </a>
            </div>
          </AnimateIn>

          <AnimateIn delay={0.4}>
            <div className="mt-12 flex flex-wrap items-center justify-center gap-8 text-sm text-white/50">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-[#39CCCC]" />
                <span>Sin cuota de membresía</span>
              </div>
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-[#39CCCC]" />
                <span>NDA incluido</span>
              </div>
              <div className="flex items-center gap-2">
                <Globe2 className="w-4 h-4 text-[#39CCCC]" />
                <span>Soporte multiregión</span>
              </div>
            </div>
          </AnimateIn>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-[#0A0A0A] border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-white/40 text-sm">
            <div className="flex items-center gap-2">
              <img src="/logo-black.svg" alt="Start By Global" className="h-6 invert opacity-40" />
              <span>Start By Global Partner Edition</span>
            </div>
            <div className="flex items-center gap-6">
              <Link href="/" className="hover:text-[#0074D9] transition-colors">
                Inicio
              </Link>
              <Link href="/contacto" className="hover:text-[#0074D9] transition-colors">
                Contacto
              </Link>
              <a href="mailto:info@startbyglobal.com" className="hover:text-[#0074D9] transition-colors">
                info@startbyglobal.com
              </a>
            </div>
            <span>© 2026 · RD / VE / ES</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
