"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { MessageCircle, X, Send, Minimize2, Bot, User, Loader2, Sparkles, Zap } from "lucide-react"
import { cn } from "@/lib/utils"

interface Message {
  id: string
  role: "user" | "model"
  text: string
  model?: string
}

const SUGGESTED_QUESTIONS = [
  "¿Qué servicios ofrecen?",
  "¿Cuánto cuesta una web?",
  "¿Trabajan con clientes fuera de RD?",
  "Quiero una consultoría gratis",
]

const WELCOME_TEXT =
  "¡Hola! 👋 Soy el asistente virtual de **Start By Global**. Estoy aquí para ayudarte con información sobre nuestros servicios, precios y cómo podemos impulsar tu negocio digital.\n\n¿En qué te puedo ayudar hoy?"

function formatText(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g)
  return parts.map((part, i) => {
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

function ChatWidgetInner() {
  const [open, setOpen] = useState(false)
  const [minimized, setMinimized] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    { id: "welcome", role: "model", text: WELCOME_TEXT },
  ])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [hasNewMessage, setHasNewMessage] = useState(false)
  const [activeModel, setActiveModel] = useState<string | null>(null)

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const chatHistory = useRef<
    Array<{ role: "user" | "model"; parts: [{ text: string }] }>
  >([])

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

  const sendMessage = useCallback(
    async (text: string) => {
      const trimmed = text.trim()
      if (!trimmed || loading) return

      const userMsg: Message = {
        id: `u-${Date.now()}`,
        role: "user",
        text: trimmed,
      }

      setMessages((prev) => [...prev, userMsg])
      setInput("")
      setLoading(true)

      chatHistory.current.push({ role: "user", parts: [{ text: trimmed }] })

      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ messages: chatHistory.current }),
        })

        const data = await res.json()

        if (!res.ok || data.error) throw new Error(data.error || "Error")

        const modelMsg: Message = {
          id: `m-${Date.now()}`,
          role: "model",
          text: data.text,
          model: data.model,
        }

        chatHistory.current.push({ role: "model", parts: [{ text: data.text }] })
        setMessages((prev) => [...prev, modelMsg])
        setActiveModel(data.model)

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
    [loading, minimized, open]
  )

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      sendMessage(input)
    }
  }

  const modelLabel = activeModel ? "Gemini 2.5 Flash Lite" : ""
  const isAdvanced = true

  return (
    <>
      {/* ── Botón flotante ── */}
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

      {/* ── Ventana del chat ── */}
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
            <p className="text-sm font-semibold text-foreground">Asistente SBG</p>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] text-muted-foreground">En línea</span>
              {activeModel && (
                <>
                  <span className="text-[10px] text-muted-foreground">·</span>
                  <span
                    className={cn(
                      "flex items-center gap-0.5 text-[10px] font-medium",
                      isAdvanced ? "text-chart-4" : "text-chart-2"
                    )}
                  >
                    {isAdvanced ? (
                      <Sparkles className="w-2.5 h-2.5" />
                    ) : (
                      <Zap className="w-2.5 h-2.5" />
                    )}
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
            aria-label={minimized ? "Expandir" : "Minimizar"}
          >
            <Minimize2 className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Body */}
        {!minimized && (
          <>
            {/* Mensajes */}
            <div className="overflow-y-auto p-4 space-y-3" style={{ height: "320px" }}>
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={cn(
                    "flex gap-2.5 items-end",
                    msg.role === "user" ? "flex-row-reverse" : "flex-row"
                  )}
                >
                  <div
                    className={cn(
                      "flex items-center justify-center w-7 h-7 rounded-full shrink-0 mb-0.5",
                      msg.role === "user"
                        ? "bg-primary/15 text-primary border border-primary/20"
                        : "bg-secondary text-muted-foreground border border-border/50"
                    )}
                  >
                    {msg.role === "user" ? (
                      <User className="w-3.5 h-3.5" />
                    ) : (
                      <Bot className="w-3.5 h-3.5" />
                    )}
                  </div>

                  <div
                    className={cn(
                      "max-w-[80%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed",
                      msg.role === "user"
                        ? "bg-primary text-primary-foreground rounded-br-sm"
                        : "bg-secondary/60 text-foreground rounded-bl-sm border border-border/30"
                    )}
                  >
                    {formatText(msg.text)}
                    {msg.role === "model" && msg.model && (
                      <div
                        className={cn(
                          "flex items-center gap-1 mt-1.5 text-[9px] font-medium opacity-50",
                          msg.model.includes("2.5") ? "text-chart-4" : "text-chart-2"
                        )}
                      >
                        {msg.model.includes("2.5") ? (
                          <Sparkles className="w-2 h-2" />
                        ) : (
                          <Zap className="w-2 h-2" />
                        )}
                        {msg.model.includes("2.5") ? "2.5 Flash" : "2.0 Flash"}
                      </div>
                    )}
                  </div>
                </div>
              ))}

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

            {/* Preguntas sugeridas */}
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
                    "bg-secondary/50 border border-border/50 text-foreground",
                    "placeholder:text-muted-foreground/50",
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
                  disabled={!input.trim() || loading}
                  aria-label="Enviar"
                  className={cn(
                    "flex items-center justify-center w-10 h-10 rounded-xl shrink-0",
                    "bg-primary text-primary-foreground transition-all duration-200",
                    "hover:shadow-lg hover:shadow-primary/25 hover:scale-105 active:scale-95",
                    "disabled:opacity-40 disabled:pointer-events-none"
                  )}
                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                </button>
              </div>
              <p className="text-[10px] text-muted-foreground/40 text-center mt-2">
                Powered by Gemini AI · Start By Global
              </p>
            </div>
          </>
        )}
      </div>
    </>
  )
}

// Wrapper con mounted guard — resuelve hydration mismatch en Next.js App Router
export function ChatWidget() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return <ChatWidgetInner />
}