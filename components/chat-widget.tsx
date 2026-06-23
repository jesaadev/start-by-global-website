"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import {
  MessageCircle, X, Send, Minimize2, Bot, User,
  Loader2, Sparkles, Mail, CheckCircle2,
  Phone, ArrowRight, AlertCircle,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { fireLead, fireContact } from "@/lib/track-client"

// ─── Types ────────────────────────────────────────────────────────────────────

type Intent = "low" | "medium" | "high"

interface Message {
  id: string
  role: "user" | "model"
  text: string
  model?: string
  intent?: Intent
}

type ChatPhase = "chat" | "ask-email" | "email-captured"

// ─── Constants ────────────────────────────────────────────────────────────────

const WHATSAPP_NUMBER = "18493562247"
const CHAT_ENABLED = true // Cambiar a false para desactivar el chat temporalmente

const SUGGESTED_QUESTIONS = [
  "¿Qué servicios ofrecen?",
  "¿Cuánto cuesta una web?",
  "¿Trabajan con clientes fuera de RD?",
  "Quiero una consultoría gratis",
]

const WELCOME_TEXT =
  "¡Hola! 👋 Soy el asistente virtual de **Start By Global**. Estoy aquí para ayudarte con información sobre nuestros servicios, precios y cómo podemos impulsar tu negocio digital.\n\n¿En qué te puedo ayudar hoy?"

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatText(text: string) {
  return text.split(/(\*\*[^*]+\*\*)/g).map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={i} className="font-semibold text-foreground">
          {part.slice(2, -2)}
        </strong>
      )
    }
    return part.split("\n").map((line, j, arr) => (
      <span key={`${i}-${j}`}>
        {line}
        {j < arr.length - 1 && <br />}
      </span>
    ))
  })
}

function buildWhatsAppUrl(summary: string): string {
  const msg = encodeURIComponent(
    `Hola Start By Global! Vengo del chat de su sitio web.\n\nResumen de mi consulta: ${summary}`
  )
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`
}

const WhatsAppIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
)

// ─── Email Capture Panel ──────────────────────────────────────────────────────

function EmailCapture({
  onSubmit,
  onSkip,
}: {
  onSubmit: (email: string, name: string) => void
  onSkip: () => void
}) {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [error, setError] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      setError("Ingresa un email válido")
      return
    }
    onSubmit(email, name)
  }

  return (
    <div className="p-4 space-y-3">
      <div className="flex items-start gap-2.5">
        <div className="flex items-center justify-center w-7 h-7 rounded-full bg-secondary border border-border/50 shrink-0 mt-0.5">
          <Bot className="w-3.5 h-3.5 text-muted-foreground" />
        </div>
        <div className="bg-secondary/60 text-foreground rounded-2xl rounded-bl-sm border border-border/30 px-3.5 py-2.5 text-sm leading-relaxed max-w-[85%]">
          Para enviarte una propuesta personalizada, ¿me compartes tu email? 📩
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-2 pl-9">
        <input
          type="text"
          placeholder="Tu nombre (opcional)"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={cn(
            "w-full px-3 py-2 rounded-lg text-sm",
            "bg-secondary/50 border border-border/50 text-foreground",
            "placeholder:text-muted-foreground",
            "focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all"
          )}
        />
        <input
          type="email"
          placeholder="tu@email.com *"
          value={email}
          onChange={(e) => { setEmail(e.target.value); setError("") }}
          className={cn(
            "w-full px-3 py-2 rounded-lg text-sm",
            "bg-secondary/50 border text-foreground",
            "placeholder:text-muted-foreground",
            "focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all",
            error ? "border-destructive/50" : "border-border/50"
          )}
        />
        {error && (
          <p className="flex items-center gap-1 text-[11px] text-destructive">
            <AlertCircle className="w-3 h-3" />{error}
          </p>
        )}
        <div className="flex gap-2">
          <button
            type="submit"
            className={cn(
              "flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg",
              "bg-primary text-primary-foreground text-xs font-semibold",
              "hover:shadow-md hover:shadow-primary/25 transition-all"
            )}
          >
            <Mail className="w-3.5 h-3.5" />
            Enviar
          </button>
          <button
            type="button"
            onClick={onSkip}
            className="px-3 py-2 rounded-lg text-xs text-muted-foreground hover:text-foreground hover:bg-secondary/60 transition-colors"
          >
            Omitir
          </button>
        </div>
        <p className="text-[10px] text-muted-foreground leading-relaxed">
          Al enviar aceptas nuestra{" "}
          <a href="/privacidad" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
            Política de Privacidad
          </a>.
        </p>
      </form>
    </div>
  )
}

// ─── WhatsApp CTA Panel ───────────────────────────────────────────────────────

function WhatsAppCTA({
  summary,
  onDismiss,
}: {
  summary: string
  onDismiss: () => void
}) {
  return (
    <div className="mx-3 mb-3 p-3.5 rounded-xl border border-[#25D366]/30 bg-[#25D366]/8">
      <div className="flex items-start gap-2.5">
        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-[#25D366]/15 border border-[#25D366]/25 shrink-0">
          <WhatsAppIcon className="w-4 h-4 text-[#25D366]" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold text-foreground mb-0.5">
            ¿Hablamos directamente?
          </p>
          <p className="text-[11px] text-muted-foreground leading-relaxed">
            Un especialista puede atenderte ahora mismo por WhatsApp.
          </p>
        </div>
        <button
          type="button"
          onClick={onDismiss}
          className="text-muted-foreground hover:text-foreground transition-colors shrink-0"
          aria-label="Cerrar"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
      <a
        href={buildWhatsAppUrl(summary)}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => fireContact()}
        className={cn(
          "mt-3 flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-xl",
          "bg-[#25D366] text-white text-sm font-semibold",
          "hover:bg-[#25D366]/90 hover:shadow-lg hover:shadow-[#25D366]/25",
          "transition-all active:scale-[0.98]"
        )}
      >
        <WhatsAppIcon className="w-4 h-4 text-white shrink-0" />
        Abrir WhatsApp ahora
        <ArrowRight className="w-3.5 h-3.5" />
      </a>
    </div>
  )
}

// ─── Chat inactivo ────────────────────────────────────────────────────────────

function ChatInactive() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-4" style={{ minHeight: "220px" }}>
      <div className="flex items-center justify-center w-12 h-12 rounded-full bg-secondary/60 border border-border/50">
        <Bot className="w-6 h-6 text-muted-foreground" />
      </div>
      <div className="space-y-2">
        <h3 className="text-sm font-semibold text-foreground">Chat temporalmente inactivo</h3>
        <p className="text-xs text-muted-foreground leading-relaxed">
          Estamos trabajando en mejoras para ofrecerte una mejor experiencia.
          Mientras tanto, puedes contactarnos directamente.
        </p>
      </div>
      <div className="flex flex-col gap-2 w-full max-w-[200px]">
        <button
          type="button"
          onClick={() => window.open("mailto:info@startbyglobal.com?subject=Consulta desde el sitio web", "_blank")}
          className={cn(
            "flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium",
            "bg-primary text-primary-foreground transition-all duration-200",
            "hover:shadow-lg hover:shadow-primary/25 hover:scale-105 active:scale-95"
          )}
        >
          <Mail className="w-4 h-4" />
          Enviar correo
        </button>
        <a
          href={buildWhatsAppUrl("consulta general")}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => fireContact()}
          className={cn(
            "flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium",
            "bg-[#25D366] text-white transition-all duration-200",
            "hover:bg-[#25D366]/90 hover:scale-105 active:scale-95"
          )}
        >
          <WhatsAppIcon className="w-4 h-4 text-white" />
          WhatsApp
        </a>
      </div>
    </div>
  )
}

// ─── Main Widget ──────────────────────────────────────────────────────────────

function ChatWidgetInner() {
  const [open, setOpen] = useState(false)
  const [minimized, setMinimized] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    { id: "welcome", role: "model", text: WELCOME_TEXT },
  ])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [hasNewMessage, setHasNewMessage] = useState(false)

  // Lead capture
  const [phase, setPhase] = useState<ChatPhase>("chat")
  const [capturedEmail, setCapturedEmail] = useState<string | null>(null)
  const [showWhatsApp, setShowWhatsApp] = useState(false)
  const [emailAsked, setEmailAsked] = useState(false)
  const [whatsAppShown, setWhatsAppShown] = useState(false)
  const [conversationSummary, setConversationSummary] = useState("")
  const [userMessageCount, setUserMessageCount] = useState(0)

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const chatHistory = useRef<Array<{ role: "user" | "model"; parts: [{ text: string }] }>>([])
  const sessionId = useRef(`session-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`)
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const savedRef = useRef(false)
  const latestIntent = useRef<"low" | "medium" | "high">("low")
  const capturedEmailRef = useRef<string | null>(null)
  const capturedNameRef = useRef<string | null>(null)


  const saveConversationToSupabase = useCallback(async (converted = false) => {
    if (savedRef.current || chatHistory.current.length < 2) return
    savedRef.current = true
    try {
      await fetch("/api/chat/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          session_id: sessionId.current,
          messages: chatHistory.current,
          email: capturedEmailRef.current,
          name: capturedNameRef.current,
          intent_final: latestIntent.current,
          converted,
          summary: conversationSummary || null,
          page_url: window.location.href,
        }),
      })
    } catch { savedRef.current = false }
  }, [conversationSummary])

  // Auto-save tras 3 min de inactividad
  const resetSaveTimer = useCallback(() => {
    if (saveTimer.current) clearTimeout(saveTimer.current)
    saveTimer.current = setTimeout(() => saveConversationToSupabase(false), 3 * 60 * 1000)
  }, [saveConversationToSupabase])

  // Scroll al fondo
  useEffect(() => {
    if (open && !minimized) {
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
      }, 50)
    }
  }, [messages, open, minimized, phase, showWhatsApp])

  // Focus y reset notificación al abrir
  useEffect(() => {
    if (open) {
      setHasNewMessage(false)
      setMinimized(false)
      setTimeout(() => inputRef.current?.focus(), 300)
    }
  }, [open])

  // Guardar al cerrar el chat
  useEffect(() => {
    if (!open && chatHistory.current.length >= 2) {
      saveConversationToSupabase(false)
    }
  }, [open, saveConversationToSupabase])

  // Guardar al cerrar la pestaña
  useEffect(() => {
    const handler = () => saveConversationToSupabase(false)
    window.addEventListener("beforeunload", handler)
    return () => window.removeEventListener("beforeunload", handler)
  }, [saveConversationToSupabase])

  // Escuchar evento global para abrir el chat desde otras partes del sitio
  useEffect(() => {
    const handler = () => { setOpen(true); setMinimized(false) }
    window.addEventListener("openChatWidget", handler)
    return () => window.removeEventListener("openChatWidget", handler)
  }, [])

  // Enviar lead al CRM
  const sendLeadToCRM = useCallback(async (email: string, name: string, summary: string) => {
    try {
      const tracking = fireLead("chat_email")
      await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name || "Visitante del Chat",
          email,
          message: `Lead capturado desde el Chat Widget.\n\nResumen de la conversación:\n${summary}`,
          service: "Chat Widget Lead",
          ...tracking,
        }),
      })
    } catch {
      // Silencioso — no interrumpir la UX
    }
  }, [])

  const sendMessage = useCallback(
    async (text: string) => {
      const trimmed = text.trim()
      if (!trimmed || loading || phase === "ask-email") return

      const newCount = userMessageCount + 1
      setUserMessageCount(newCount)

      const userMsg: Message = { id: `u-${Date.now()}`, role: "user", text: trimmed }
      setMessages((prev) => [...prev, userMsg])
      setInput("")
      setLoading(true)

      chatHistory.current.push({ role: "user", parts: [{ text: trimmed }] })
      setConversationSummary((prev) =>
        prev ? `${prev} | ${trimmed.slice(0, 60)}` : trimmed.slice(0, 60)
      )

      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ messages: chatHistory.current, messageCount: newCount }),
        })

        const data = await res.json()
        if (!res.ok || data.error) throw new Error(data.error || "Error")

        const modelMsg: Message = {
          id: `m-${Date.now()}`,
          role: "model",
          text: data.text,
          model: data.model,
          intent: data.intent,
        }

        chatHistory.current.push({ role: "model", parts: [{ text: data.text }] })
        setMessages((prev) => [...prev, modelMsg])

        // Pedir email tras el 3er mensaje, o cuando el servidor lo indique
        // (p. ej. en la respuesta de degradación elegante ante un fallo de IA).
        if ((data.shouldAskEmail || newCount >= 3) && !emailAsked && !capturedEmail) {
          setEmailAsked(true)
          setTimeout(() => setPhase("ask-email"), 600)
        }

        // Mostrar WhatsApp si alta intención
        if (data.intent === "high" && !whatsAppShown) {
          setWhatsAppShown(true)
          setTimeout(() => setShowWhatsApp(true), 800)
        }

        if (minimized || !open) setHasNewMessage(true)
      } catch {
        setMessages((prev) => [
          ...prev,
          {
            id: `err-${Date.now()}`,
            role: "model",
            text: "Lo siento, tuve un problema. Por favor intenta de nuevo o escríbenos a **info@startbyglobal.com**",
          },
        ])
      } finally {
        setLoading(false)
      }
    },
    [loading, phase, minimized, open, userMessageCount, emailAsked, capturedEmail, whatsAppShown]
  )

  const handleEmailSubmit = useCallback(
    (email: string, name: string) => {
      setCapturedEmail(email)
      capturedEmailRef.current = email
      capturedNameRef.current = name
      savedRef.current = false // allow re-save with email
      setPhase("email-captured")

      const confirmMsg: Message = {
        id: `confirm-${Date.now()}`,
        role: "model",
        text: `¡Perfecto${name ? `, ${name}` : ""}! 🎉 Hemos registrado tu email **${email}**. Un especialista de nuestro equipo se pondrá en contacto contigo pronto.\n\n¿Hay algo más en lo que pueda ayudarte?`,
      }
      setMessages((prev) => [...prev, confirmMsg])
      sendLeadToCRM(email, name, conversationSummary)
      setTimeout(() => setPhase("chat"), 300)
    },
    [conversationSummary, sendLeadToCRM]
  )

  const handleEmailSkip = useCallback(() => {
    setPhase("chat")
    setTimeout(() => inputRef.current?.focus(), 200)
  }, [])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      sendMessage(input)
    }
  }

  return (
    <>
      {/* ── Botón flotante ─────────────────────────────────────────────── */}
      <div className="fixed bottom-6 right-6 z-[9999] flex flex-col items-end gap-3">
        {hasNewMessage && !open && (
          <div className="animate-bounce bg-primary text-primary-foreground text-xs font-semibold px-3 py-1.5 rounded-full shadow-lg shadow-primary/30">
            Nueva respuesta
          </div>
        )}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Cerrar chat" : "Abrir chat"}
          className={cn(
            "relative flex items-center justify-center w-14 h-14 rounded-full shadow-xl",
            "bg-primary text-primary-foreground",
            "transition-all duration-300 hover:scale-110 active:scale-95",
            "hover:shadow-2xl hover:shadow-primary/40"
          )}
        >
          {open ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
          {hasNewMessage && !open && (
            <span className="absolute top-0 right-0 w-3.5 h-3.5 bg-chart-3 rounded-full border-2 border-background animate-pulse" />
          )}
        </button>
      </div>

      {/* ── Ventana del chat ───────────────────────────────────────────── */}
      <div
        className={cn(
          "fixed bottom-24 right-6 z-[9998]",
          "w-[360px] max-w-[calc(100vw-24px)]",
          "flex flex-col rounded-2xl border border-border/50",
          "bg-card/95 backdrop-blur-xl shadow-2xl",
          "transition-all duration-300 origin-bottom-right",
          open && !minimized
            ? "opacity-100 scale-100 translate-y-0 pointer-events-auto"
            : open && minimized
              ? "opacity-100 scale-100 pointer-events-auto"
              : "opacity-0 scale-95 translate-y-4 pointer-events-none"
        )}
      >
        {/* Header */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-border/50 bg-primary/5 rounded-t-2xl shrink-0">
          <div className="relative flex items-center justify-center w-9 h-9 rounded-full bg-primary/15 border border-primary/25 shrink-0">
            <Bot className="w-4 h-4 text-primary" />
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-chart-3 rounded-full border-2 border-card" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <p className="text-sm font-semibold text-foreground">Asistente SBG</p>
              {capturedEmail && (
                <span className="flex items-center gap-1 text-[10px] text-chart-3 font-medium">
                  <CheckCircle2 className="w-3 h-3" />
                  Lead
                </span>
              )}
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] text-muted-foreground">En línea</span>
              {CHAT_ENABLED && (
                <>
                  <span className="text-[10px] text-muted-foreground">·</span>
                  <span className="flex items-center gap-0.5 text-[10px] font-medium text-chart-4">
                    <Sparkles className="w-2.5 h-2.5" />
                    Gemini 2.5 Flash Lite
                  </span>
                </>
              )}
            </div>
          </div>
          <div className="flex items-center gap-1">
            {/* WhatsApp directo desde header */}
            <a
              href={buildWhatsAppUrl(conversationSummary || "consulta general")}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => fireContact()}
              className="p-1.5 rounded-lg text-muted-foreground hover:text-[#25D366] hover:bg-[#25D366]/10 transition-colors"
              aria-label="Abrir WhatsApp"
              title="Hablar por WhatsApp"
            >
              <Phone className="w-3.5 h-3.5" />
            </a>
            <button
              type="button"
              onClick={() => setMinimized((v) => !v)}
              className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary/60 transition-colors"
              aria-label={minimized ? "Expandir" : "Minimizar"}
            >
              <Minimize2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Body */}
        {!minimized && (
          <>
            {!CHAT_ENABLED ? (
              <ChatInactive />
            ) : (
              <>
                {/* Mensajes */}
                <div className="overflow-y-auto p-4 space-y-3" style={{ height: "300px" }}>
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={cn(
                        "flex gap-2.5 items-end",
                        msg.role === "user" ? "flex-row-reverse" : "flex-row"
                      )}
                    >
                      <div className={cn(
                        "flex items-center justify-center w-7 h-7 rounded-full shrink-0 mb-0.5",
                        msg.role === "user"
                          ? "bg-primary/15 text-primary border border-primary/20"
                          : "bg-secondary text-muted-foreground border border-border/50"
                      )}>
                        {msg.role === "user"
                          ? <User className="w-3.5 h-3.5" />
                          : <Bot className="w-3.5 h-3.5" />
                        }
                      </div>
                      <div className={cn(
                        "max-w-[80%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed",
                        msg.role === "user"
                          ? "bg-primary text-primary-foreground rounded-br-sm"
                          : "bg-secondary/60 text-foreground rounded-bl-sm border border-border/30"
                      )}>
                        {formatText(msg.text)}
                        {msg.role === "model" && msg.model && (
                          <div className="flex items-center gap-1 mt-1.5 text-[9px] font-medium opacity-50 text-chart-4">
                            <Sparkles className="w-2 h-2" />
                            2.5 Flash Lite
                          </div>
                        )}
                      </div>
                    </div>
                  ))}

                  {/* Typing indicator */}
                  {loading && (
                    <div className="flex gap-2.5 items-end">
                      <div className="flex items-center justify-center w-7 h-7 rounded-full bg-secondary border border-border/50 shrink-0">
                        <Bot className="w-3.5 h-3.5 text-muted-foreground" />
                      </div>
                      <div className="bg-secondary/60 border border-border/30 px-4 py-3 rounded-2xl rounded-bl-sm">
                        <div className="flex gap-1 items-center h-4">
                          <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: "0ms" }} />
                          <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: "150ms" }} />
                          <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: "300ms" }} />
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Email capture */}
                {phase === "ask-email" && (
                  <EmailCapture onSubmit={handleEmailSubmit} onSkip={handleEmailSkip} />
                )}

                {/* WhatsApp CTA */}
                {showWhatsApp && phase !== "ask-email" && (
                  <WhatsAppCTA
                    summary={conversationSummary}
                    onDismiss={() => setShowWhatsApp(false)}
                  />
                )}

                {/* Preguntas sugeridas — solo al inicio */}
                {messages.length === 1 && !loading && phase === "chat" && (
                  <div className="px-4 pb-2 flex flex-wrap gap-1.5">
                    {SUGGESTED_QUESTIONS.map((q) => (
                      <button
                        key={q}
                        type="button"
                        onClick={() => sendMessage(q)}
                        className="text-[11px] px-2.5 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 transition-colors font-medium"
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                )}

                {/* Input */}
                <div className="p-3 border-t border-border/50 shrink-0">
                  <div className="flex gap-2 items-end">
                    <textarea
                      ref={inputRef}
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder={
                        phase === "ask-email"
                          ? "Completa el formulario de arriba..."
                          : "Escribe tu mensaje..."
                      }
                      rows={1}
                      disabled={loading || phase === "ask-email"}
                      className={cn(
                        "flex-1 resize-none px-3.5 py-2.5 rounded-xl text-sm",
                        "bg-secondary/50 border border-border/50 text-foreground",
                        "placeholder:text-muted-foreground",
                        "focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20",
                        "disabled:opacity-50 transition-all min-h-[40px] max-h-24"
                      )}
                      style={{ height: "40px" }}
                      onInput={(e) => {
                        const t = e.currentTarget
                        t.style.height = "40px"
                        t.style.height = Math.min(t.scrollHeight, 96) + "px"
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => sendMessage(input)}
                      disabled={!input.trim() || loading || phase === "ask-email"}
                      aria-label="Enviar"
                      className={cn(
                        "flex items-center justify-center w-10 h-10 rounded-xl shrink-0",
                        "bg-primary text-primary-foreground transition-all duration-200",
                        "hover:shadow-lg hover:shadow-primary/25 hover:scale-105 active:scale-95",
                        "disabled:opacity-40 disabled:pointer-events-none"
                      )}
                    >
                      {loading
                        ? <Loader2 className="w-4 h-4 animate-spin" />
                        : <Send className="w-4 h-4" />
                      }
                    </button>
                  </div>
                  <p className="text-[10px] text-muted-foreground text-center mt-2">
                    Powered by Gemini AI · Start By Global
                  </p>
                </div>
              </>
            )}
          </>
        )}
      </div>
    </>
  )
}

// ─── Mounted guard + export ───────────────────────────────────────────────────

export function ChatWidget() {
  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])
  if (!mounted) return null
  return <ChatWidgetInner />
}

// Función global para abrir el chat desde cualquier parte del sitio
if (typeof window !== "undefined") {
  ;(window as any).openChatWidget = () => {
    window.dispatchEvent(new CustomEvent("openChatWidget"))
  }
}