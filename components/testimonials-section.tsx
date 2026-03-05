"use client"

import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react"
import { useState, useEffect } from "react"
import { AnimateIn } from "@/components/animate-in"

const testimonials = [
  {
    name: "Carlos Martinez",
    role: "CEO, TechVentures RD",
    region: "Rep. Dominicana",
    quote: "Start By Global transformo nuestra presencia digital por completo. Nuestro trafico web aumento un 300% en solo 6 meses y las conversiones se triplicaron.",
    rating: 5,
    metric: "+300% trafico",
  },
  {
    name: "Maria Elena Torres",
    role: "Directora de Marketing, Finanzas Plus",
    region: "Espana",
    quote: "Profesionalismo excepcional. El equipo entendio nuestras necesidades desde el primer dia y los resultados superaron todas nuestras expectativas.",
    rating: 5,
    metric: "+62% conversiones",
  },
  {
    name: "Alejandro Gomez",
    role: "Fundador, GreenTech Solutions",
    region: "Mexico",
    quote: "La mejor inversion que hemos hecho en marketing digital. Su enfoque basado en datos nos ayudo a escalar de manera sostenible en toda la region.",
    rating: 5,
    metric: "4x ROI",
  },
  {
    name: "Sarah Johnson",
    role: "VP Marketing, CloudBase Inc.",
    region: "EE.UU.",
    quote: "Working with Start By Global was a game-changer for our Latin American expansion. Their bilingual team and regional expertise are unmatched.",
    rating: 5,
    metric: "+180% leads",
  },
  {
    name: "Ana Lucia Fernandez",
    role: "COO, Caribe Hotels Group",
    region: "Rep. Dominicana",
    quote: "Desde la estrategia hasta la ejecucion, todo fue impecable. Ahora tenemos un sistema de reservas online que genera el 60% de nuestros ingresos.",
    rating: 5,
    metric: "60% revenue online",
  },
]

export function TestimonialsSection() {
  const [current, setCurrent] = useState(0)
  const [transitioning, setTransitioning] = useState(false)

  const switchTo = (index: number) => {
    setTransitioning(true)
    setTimeout(() => {
      setCurrent(index)
      setTransitioning(false)
    }, 200)
  }

  const next = () => switchTo((current + 1) % testimonials.length)
  const prev = () => switchTo((current - 1 + testimonials.length) % testimonials.length)

  // Auto-advance
  useEffect(() => {
    const timer = setInterval(next, 7000)
    return () => clearInterval(timer)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current])

  const t = testimonials[current]

  return (
    <section id="testimonials" className="flex flex-col gap-6">
      <AnimateIn>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-display text-2xl font-bold text-foreground">Testimonios</h2>
            <p className="text-sm text-muted-foreground mt-1">Lo que dicen nuestros clientes</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={prev}
              className="flex items-center justify-center w-8 h-8 rounded-lg bg-secondary/60 text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
              aria-label="Testimonio anterior"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-xs text-muted-foreground font-mono">
              {String(current + 1).padStart(2, "0")} / {String(testimonials.length).padStart(2, "0")}
            </span>
            <button
              type="button"
              onClick={next}
              className="flex items-center justify-center w-8 h-8 rounded-lg bg-secondary/60 text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
              aria-label="Siguiente testimonio"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </AnimateIn>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        {/* Featured testimonial */}
        <AnimateIn direction="left" className="lg:col-span-3">
          <div className="glass-card rounded-xl p-6 lg:p-8 flex flex-col gap-5 relative overflow-hidden h-full">
            <Quote className="absolute top-4 right-4 w-20 h-20 text-primary/5" />

            {/* Progress bar */}
            <div className="flex gap-1.5">
              {testimonials.map((_, i) => (
                <div key={`progress-${i}`} className="flex-1 h-1 rounded-full overflow-hidden bg-secondary/60">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      i === current ? "bg-primary w-full" : i < current ? "bg-primary/40 w-full" : "w-0"
                    }`}
                  />
                </div>
              ))}
            </div>

            <div className={`transition-all duration-200 ${transitioning ? "opacity-0 translate-y-2" : "opacity-100 translate-y-0"}`}>
              <div className="flex items-center gap-1 mb-4">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star key={`star-${i}`} className="w-4 h-4 fill-chart-4 text-chart-4" />
                ))}
              </div>

              <blockquote className="text-foreground text-base lg:text-lg leading-relaxed font-medium relative z-10">
                &ldquo;{t.quote}&rdquo;
              </blockquote>

              <div className="flex items-center gap-4 pt-5 mt-5 border-t border-border/50">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary font-display font-bold text-sm border border-primary/20">
                  {t.name.split(" ").map((n) => n[0]).join("")}
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.role}</p>
                </div>
                <div className="ml-auto flex flex-col items-end gap-1">
                  <span className="px-2.5 py-1 rounded-full bg-secondary/60 text-[10px] text-muted-foreground font-medium">
                    {t.region}
                  </span>
                  <span className="text-xs font-bold text-chart-3">{t.metric}</span>
                </div>
              </div>
            </div>
          </div>
        </AnimateIn>

        {/* Side panel */}
        <AnimateIn direction="right" delay={150} className="lg:col-span-2">
          <div className="glass-card rounded-xl p-4 flex flex-col gap-2 h-full">
            <h3 className="text-xs uppercase tracking-wider text-muted-foreground mb-2 px-1">Todos los testimonios</h3>
            {testimonials.map((item, i) => (
              <button
                key={item.name}
                type="button"
                onClick={() => switchTo(i)}
                className={`flex items-center gap-3 p-3 rounded-lg text-left transition-all duration-200 ${
                  i === current
                    ? "bg-primary/10 border border-primary/20"
                    : "hover:bg-secondary/50 border border-transparent"
                }`}
              >
                <div className={`flex items-center justify-center w-8 h-8 rounded-full text-xs font-bold shrink-0 transition-colors duration-200 ${
                  i === current ? "bg-primary text-primary-foreground" : "bg-secondary/60 text-muted-foreground"
                }`}>
                  {item.name.split(" ").map((n) => n[0]).join("")}
                </div>
                <div className="flex-1 min-w-0 overflow-hidden">
                  <p className="text-xs font-medium text-foreground truncate">{item.name}</p>
                  <p className="text-[10px] text-muted-foreground truncate">{item.region}</p>
                </div>
                <span className="text-[10px] font-bold text-chart-3 shrink-0">{item.metric}</span>
              </button>
            ))}
          </div>
        </AnimateIn>
      </div>
    </section>
  )
}
