"use client"

import { useRef, type ReactNode } from "react"
import { motion, useMotionValue, useSpring } from "motion/react"
import { useReducedMotion } from "@/hooks/use-reduced-motion"
import { cn } from "@/lib/utils"

const SPRING = { damping: 30, stiffness: 100, mass: 2 }

/**
 * Inclinación 3D que sigue al cursor (misma técnica que React Bits·TiltedCard,
 * pero envolviendo cualquier contenido, p. ej. un mockup). Estático en táctil
 * y con prefers-reduced-motion.
 */
export function Tilt({
  children,
  amplitude = 8,
  className,
}: {
  children: ReactNode
  amplitude?: number
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()
  const rotateX = useSpring(useMotionValue(0), SPRING)
  const rotateY = useSpring(useMotionValue(0), SPRING)

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (reduced || !ref.current) return
    const r = ref.current.getBoundingClientRect()
    const x = e.clientX - r.left - r.width / 2
    const y = e.clientY - r.top - r.height / 2
    rotateX.set((y / (r.height / 2)) * -amplitude)
    rotateY.set((x / (r.width / 2)) * amplitude)
  }
  const onLeave = () => {
    rotateX.set(0)
    rotateY.set(0)
  }

  return (
    <div ref={ref} onMouseMove={onMove} onMouseLeave={onLeave} className={cn("[perspective:1200px]", className)}>
      <motion.div style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}>{children}</motion.div>
    </div>
  )
}
