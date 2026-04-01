"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { MessageCircle, X, Send, Minimize2, Bot, User, Loader2, Sparkles, Zap } from "lucide-react"
import { cn } from "@/lib/utils"

interface Message {
  id: string
  role: "user" | "model"
  text: string
  model?: string
  timestamp: Date
}

const SUGGESTED_QUESTIONS = [
  "¿Qué servicios ofrecen?",
  "¿Cuánto cuesta una web?",
  "¿Trabajan con clientes fuera de RD?",
  "Quiero una consultoría gratis",
]

const WELCOME_MESSAGE: Message = {
  id: "welcome",
  role: "model",
  text: "¡Hola! 👋 Soy el asistente virtual de **Start By Global**. Estoy aquí para ayudarte con información sobre nuestros servicios, precios y cómo podemos impulsar tu negocio digital.\n\n¿En qué te puedo ayudar hoy?",
  timestamp: new Date(),
}

function formatText(text: string) {
  // Bold **text**
  const parts = text.split(/(\*\*[^*]+\*\*)/g)
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={i} className="font-semibold text-foreground">{part.slice(2, -2)}</strong>
    }
    // Handle line breaks
    return part.split("\n").map((line, j, arr) => (
      <span key={`${i}-${j}`}>
        {line}
        {j < arr.length - 1 && <br />}
      </span>
    ))
  })
}

export function ChatWidget() {
  const [open, setOpen] = useState(false)
  const [minimized, setMinimized] = useState(false)
  const [messages, setMessages] = useState<Message[]>([WELCOME_MESSAGE])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [hasNewMessage, setHasNewMessage] = useState(false)
  const [activeModel, setActiveModel] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const chatHistory = useRef<Array<{ role: "user" | "model"; parts: [{ text: string }] }>>([])

  useEffect(() => {
    if (open && !minimized) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages, open, minimized])

  useEffect(() => {
    if (open) {
      setHasNewMessage(false)
      setMinimized(false)
      setTimeout(() => inputRef.current?.focus(), 300)
    }
  }, [open])

  const sendMessage = useCallback(async (text: string) => {
    const trimmed = text.trim()
    if (!trimmed || loading) return

    const userMsg: Message = {
      id: crypto.randomUUID(),
      role: "user",
      text: trimmed,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMsg])
    setInput("")
    setLoading(true)

    // Agregar al historial para Gemini
    chatHistory.current.push({ role: "user", parts: [{ text: trimmed }] })

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: chatHistory.current }),
      })

      const data = await res.json()

      if (!res.ok || data.error) {
        throw new Error(data.error || "Error desconocido")
      }

      const modelMsg: Message = {
        id: crypto.randomUUID(),
        role: "model",
        text: data.text,
        model: data.model,
        timestamp: new Date(),
      }

      chatHistory.current.push({ role: "model", parts: [{ text: data.text }] })
      setMessages((prev) => [...prev, modelMsg])
      setActiveModel(data.model)

      if (minimized || !open) {
        setHasNewMessage(true)
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: "model",
          text: "Lo siento, tuve un problema al procesar tu mensaje. Por favor intenta de nuevo o escríbenos a **info@startbyglobal.com**",
          timestamp: new Date(),
        },
      ])
    } finally {
      setLoading(false)
    }
  }, [loading, minimized, open])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      sendMessage(input)
    }
  }

  const modelLabel = activeModel?.includes("2.5") ? "Gemini 2.5 Flash" : "Gemini 2.0 Flash"
  const isAdvanced = activeModel?.includes("2.5")

  return (
    <>
      {/* Floating button */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
        {/* Unread badge bubble */}
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
            "relative flex items-center justify-center w-14 h-14 rounded-full shadow-xl transition-all duration-300",
            "bg-primary text-primary-foreground hover:scale-110 active:scale-95",
            "hover:shadow-2xl hover:shadow-primary/40",
            open && "rotate-0 scale-100"
          )}
        >
          {open ? (
            <X className="w-6 h-6" />
          ) : (
            <MessageCircle className="w-6 h-6" />
          )}
          {hasNewMessage && !open && (
            <span className="absolute top-0 right-0 w-3.5 h-3.5 bg-chart-3 rounded-full border-2 border-background animate-pulse" />
          )}
        </button>
      </div>

      {/* Chat window */}
      <div
        className={cn(
          "fixed bottom-24 right-6 z-50 w-[360px] max-w-[calc(100vw-24px)] flex flex-col",
          "rounded-2xl border border-border/50 bg-card/95 backdrop-blur-xl shadow-2xl",
          "transition-all duration-300 origin-bottom-right",
          open && !minimized
            ? "opacity-100 scale-100 translate-y-0 pointer-events-auto"
            : open && minimized
              ? "opacity-100 scale-100 translate-y-0 pointer-events-auto"
              : "opacity-0 scale-95 translate-y-4 pointer-events-none"
        )}
        style={{ maxHeight: minimized ? "auto" : "520px" }}
      >
        {/* Header */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-border/50 bg-primary/5 rounded-t-2xl shrink-0">
          <div className="relative flex items-center justify-center w-9 h-9 rounded-full bg-primary/15 border border-primary/25">
            <Bot className="w-4.5 h-4.5 text-primary" />
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-chart-3 rounded-full border-2 border-card" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-foreground">Asistente SBG</p>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] text-muted-foreground">En línea</span>
              {activeModel && (
                <>
                  <span className="text-[10px] text-muted-foreground">·</span>
                  <span className={cn(
                    "flex items-center gap-0.5 text-[10px] font-medium",
                    isAdvanced ? "text-chart-4" : "text-chart-2"
                  )}>
                    {isAdvanced ? <Sparkles className="w-2.5 h-2.5" /> : <Zap className="w-2.5 h-2.5" />}
                    {modelLabel}
                  </span>
                </>
              )}
            </div>
          </div>
          <button
            type="button"
            onClick={() => setMinimized((v) => !v)}
            className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary/60 transition-colors"
            aria-label={minimized ? "Expandir chat" : "Minimizar chat"}
          >
            <Minimize2 className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Body — oculto al minimizar */}
        {!minimized && (
          <>
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-0" style={{ maxHeight: "340px" }}>
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={cn(
                    "flex gap-2.5 items-end",
                    msg.role === "user" ? "flex-row-reverse" : "flex-row"
                  )}
                >
                  {/* Avatar */}
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

                  {/* Bubble */}
                  <div className={cn(
                    "max-w-[80%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed",
                    msg.role === "user"
                      ? "bg-primary text-primary-foreground rounded-br-sm"
                      : "bg-secondary/60 text-foreground rounded-bl-sm border border-border/30"
                  )}>
                    {formatText(msg.text)}

                    {/* Model badge en mensajes del bot */}
                    {msg.role === "model" && msg.model && (
                      <div className={cn(
                        "flex items-center gap-1 mt-1.5 text-[9px] font-medium opacity-60",
                        msg.model.includes("2.5") ? "text-chart-4" : "text-chart-2"
                      )}>
                        {msg.model.includes("2.5")
                          ? <Sparkles className="w-2 h-2" />
                          : <Zap className="w-2 h-2" />
                        }
                        {msg.model.includes("2.5") ? "2.5 Flash" : "2.0 Flash"}
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {/* Loading indicator */}
              {loading && (
                <div className="flex gap-2.5 items-end">
                  <div className="flex items-center justify-center w-7 h-7 rounded-full bg-secondary border border-border/50 shrink-0">
                    <Bot className="w-3.5 h-3.5 text-muted-foreground" />
                  </div>
                  <div className="bg-secondary/60 border border-border/30 px-4 py-3 rounded-2xl rounded-bl-sm">
                    <div className="flex gap-1 items-center">
                      <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: "0ms" }} />
                      <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: "150ms" }} />
                      <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Suggested questions — solo al inicio */}
            {messages.length === 1 && !loading && (
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
                  placeholder="Escribe tu mensaje..."
                  rows={1}
                  disabled={loading}
                  className={cn(
                    "flex-1 resize-none px-3.5 py-2.5 rounded-xl text-sm",
                    "bg-secondary/50 border border-border/50 text-foreground placeholder:text-muted-foreground/50",
                    "focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20",
                    "disabled:opacity-50 transition-all max-h-24 min-h-[40px]"
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
                  disabled={!input.trim() || loading}
                  className={cn(
                    "flex items-center justify-center w-10 h-10 rounded-xl shrink-0",
                    "bg-primary text-primary-foreground transition-all duration-200",
                    "hover:shadow-lg hover:shadow-primary/25 hover:scale-105 active:scale-95",
                    "disabled:opacity-40 disabled:pointer-events-none"
                  )}
                  aria-label="Enviar mensaje"
                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                </button>
              </div>
              <p className="text-[10px] text-muted-foreground/50 text-center mt-2">
                Powered by Gemini AI · Start By Global
              </p>
            </div>
          </>
        )}
      </div>
    </>
  )
}