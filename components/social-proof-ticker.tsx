"use client"

import { useState, useEffect } from "react"
import { TrendingUp, Users, Calendar, Star } from "lucide-react"
import { AnimateIn } from "@/components/animate-in"

const socialProofMessages = [
  { icon: Users, text: "3 empresas agendaron consultoría esta semana", color: "text-chart-3" },
  { icon: TrendingUp, text: "ROI promedio del 285% en proyectos", color: "text-primary" },
  { icon: Calendar, text: "12 países con presencia activa", color: "text-chart-4" },
  { icon: Star, text: "98% de satisfacción cliente", color: "text-chart-2" },
]

export function SocialProofTicker() {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % socialProofMessages.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [])

  const currentMessage = socialProofMessages[currentIndex]
  const Icon = currentMessage.icon

  return (
    <AnimateIn delay={500}>
      <div className="flex items-center justify-center py-4">
        <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-secondary/30 border border-border/50 backdrop-blur-sm">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-chart-3 animate-pulse" />
            <Icon className={`w-4 h-4 ${currentMessage.color}`} />
          </div>
          <span className="text-sm text-muted-foreground font-medium">
            {currentMessage.text}
          </span>
          <div className="flex gap-1 ml-2">
            {socialProofMessages.map((_, i) => (
              <div
                key={i}
                className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                  i === currentIndex ? "bg-primary scale-125" : "bg-muted-foreground/30"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </AnimateIn>
  )
}