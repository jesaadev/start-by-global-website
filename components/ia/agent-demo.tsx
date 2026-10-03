"use client"

import { useEffect, useRef, useState } from "react"
import { motion, useInView } from "motion/react"
import { Bot, CalendarCheck, Database, BellRing, Check } from "lucide-react"
import { useReducedMotion } from "@/hooks/use-reduced-motion"
import { cn } from "@/lib/utils"

// Conversación ILUSTRATIVA (sin métricas): un agente de IA atiende, agenda y
// deja todo registrado sin intervención humana.
const MESSAGES = [
  { from: "user", text: "Hola, ¿tienen cita el sábado para una limpieza dental?" },
  { from: "bot", text: "¡Hola! 😊 El sábado tengo libre a las 10:00 y a las 11:30. ¿Cuál prefieres?" },
  { from: "user", text: "11:30, por favor" },
  { from: "bot", text: "Listo ✅ Te reservé el sábado a las 11:30. El viernes te escribo para recordártelo." },
] as const

const ACTIONS = [
  { icon: CalendarCheck, text: "Cita creada en el calendario" },
  { icon: Database, text: "Contacto guardado en el CRM" },
  { icon: BellRing, text: "Recordatorio programado" },
]

// Cada fase: mensajes visibles, si el bot está escribiendo y acciones hechas.
const PHASES = [
  { msgs: 1, typing: false, actions: 0 },
  { msgs: 1, typing: true, actions: 0 },
  { msgs: 2, typing: false, actions: 0 },
  { msgs: 3, typing: false, actions: 0 },
  { msgs: 3, typing: true, actions: 0 },
  { msgs: 4, typing: false, actions: 0 },
  { msgs: 4, typing: false, actions: 1 },
  { msgs: 4, typing: false, actions: 2 },
  { msgs: 4, typing: false, actions: 3 },
]
const PHASE_MS = 1150
const HOLD_MS = 3800

/**
 * Demo del hero de IA & Automatización. Avanza solo mientras está en pantalla;
 * con "reducir movimiento" se muestra completa y quieta.
 */
export function AgentDemo() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { amount: 0.3 })
  const reduced = useReducedMotion()
  const last = PHASES.length - 1
  const [phase, setPhase] = useState(last)

  // Arranca desde el principio la primera vez que entra en pantalla.
  const started = useRef(false)
  useEffect(() => {
    if (!inView || reduced || started.current) return
    started.current = true
    setPhase(0)
  }, [inView, reduced])

  useEffect(() => {
    if (!inView || reduced || !started.current) return
    const t = setTimeout(() => setPhase((p) => (p >= last ? 0 : p + 1)), phase >= last ? HOLD_MS : PHASE_MS)
    return () => clearTimeout(t)
  }, [phase, inView, reduced, last])

  const current = reduced ? PHASES[last] : PHASES[phase]
  const enter = reduced ? false : { opacity: 0, y: 10, scale: 0.97 }

  return (
    <div ref={ref} aria-hidden>
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#0d1117] shadow-2xl shadow-black/40">
        {/* cabecera del chat */}
        <div className="flex items-center gap-3 border-b border-white/5 bg-[#161b22] px-4 py-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-[#7B61FF] to-[#00C9C8] text-white">
            <Bot className="h-5 w-5" />
          </span>
          <span className="flex flex-col leading-tight">
            <span className="text-sm font-semibold text-white">Asistente IA · Clínica dental</span>
            <span className="text-[11px] text-[#00C9C8]">en línea</span>
          </span>
        </div>

        {/* conversación (alto fijo: sin saltos de layout) */}
        <div className="flex h-[300px] flex-col gap-2.5 p-4 text-[13px] leading-snug text-white">
          {/* Sin AnimatePresence: al reiniciar el bucle los mensajes se retiran al instante. */}
          {MESSAGES.slice(0, current.msgs).map((m) => (
            <motion.div
              key={m.text}
              initial={enter}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.28 }}
              className={cn(
                "max-w-[85%] rounded-2xl px-3.5 py-2",
                m.from === "user" ? "ml-auto rounded-tr-sm bg-[#005c4b]" : "rounded-tl-sm bg-[#1f2c34]"
              )}
            >
              {m.text}
            </motion.div>
          ))}
          {current.typing && (
            <motion.div
              key="typing"
              initial={enter}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className="flex w-fit gap-1 rounded-2xl rounded-tl-sm bg-[#1f2c34] px-3.5 py-3"
            >
              {[0, 1, 2].map((i) => (
                <span key={i} className="h-1.5 w-1.5 animate-bounce rounded-full bg-white/60" style={{ animationDelay: `${i * 140}ms` }} />
              ))}
            </motion.div>
          )}
        </div>

        {/* lo que el agente hizo por detrás */}
        <div className="grid grid-cols-1 gap-2 border-t border-white/5 bg-black/20 p-4 sm:grid-cols-3">
          {ACTIONS.map((a, i) => {
            const done = i < current.actions
            const Icon = a.icon
            return (
              <div
                key={a.text}
                className={cn(
                  "flex items-center gap-2 rounded-xl border px-3 py-2 text-[11px] font-medium transition-colors duration-300 motion-reduce:transition-none",
                  done ? "border-[#00C9C8]/40 bg-[#00C9C8]/10 text-white" : "border-white/5 bg-white/[0.02] text-white/35"
                )}
              >
                <span className={cn("flex h-5 w-5 shrink-0 items-center justify-center rounded-md", done ? "bg-[#00C9C8] text-[#0d1117]" : "bg-white/10")}>
                  {done ? <Check className="h-3 w-3" /> : <Icon className="h-3 w-3" />}
                </span>
                {a.text}
              </div>
            )
          })}
        </div>
      </div>
      <p className="mt-3 text-center text-[11px] text-muted-foreground lg:text-left">Ejemplo ilustrativo</p>
    </div>
  )
}
