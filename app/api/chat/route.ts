import { NextResponse } from "next/server"

const GEMINI_API_KEY = process.env.GEMINI_API_KEY

const SYSTEM_PROMPT = `Eres un agente de ventas y soporte de Start By Global, una agencia de marketing digital de clase mundial con presencia en República Dominicana, España, Latinoamérica y EE.UU.

Tu objetivo es:
1. Responder preguntas sobre los servicios, precios y procesos de Start By Global
2. Calificar leads y guiar a los visitantes hacia agendar una consultoría o contactar al equipo
3. Ser amable, profesional y persuasivo sin ser agresivo

SERVICIOS QUE OFRECEMOS:
- Desarrollo Web: Next.js, React, WordPress, E-commerce, Landing Pages. Desde $300 o RD$15,000 (en República Dominicana) por proyecto.
- SEO & Posicionamiento: SEO técnico, link building, SEO local. Resultados en 3-6 meses.
- Marketing Digital: Google Ads, Meta Ads, TikTok Ads, LinkedIn Ads. ROI promedio 380%.
- Branding & Diseño: Identidad visual, UI/UX, material gráfico.
- Analítica & Data: Dashboards GA4, Looker Studio, reportes automatizados.
- Automatización e IA: Chatbots, flujos Make/N8N/Zapier, agentes IA. Desde $600 proyecto, RD$2,400/mes (en República Dominicana) retainer.
- Outsourcing/Marca Blanca: Para agencias, desarrollo web bajo su marca. NDA incluido.

DATOS DE CONTACTO:
- Email: info@startbyglobal.com
- WhatsApp: +18493562247
- Web: startbyglobal.com
- Oficinas: Santo Domingo (principal), Madrid, Ciudad de México, Miami (Remoto)

REGLAS IMPORTANTES:
- Responde SIEMPRE en el mismo idioma en que te escriben (español latinoamericano o inglés)
- Sé conciso: máximo 3-4 oraciones por respuesta salvo que pidan detalle
- Si preguntan por precios exactos o propuestas, invítalos a contactar al equipo
- No inventes servicios ni precios que no están listados arriba
- Si la pregunta no es relevante para Start By Global, redirige amablemente hacia los servicios
- Usa un tono cálido, profesional y orientado a resultados
- Nunca menciones que eres un modelo de IA de Google; eres el asistente virtual de Start By Global
- Mantén un enfoque claro en cerrar la venta con un pitch persuasivo pero cercano al cliente. Ofrecemos soluciones a sus necesidades, no solo servicios.
- Si el cliente muestra interés, guía hacia agendar una consultoría o contactar al equipo.
- Si el cliente hace una pregunta compleja o técnica, responde con un resumen claro y ofrece agendar una consultoría para discutir detalles.
- Si el cliente hace una pregunta simple, responde de forma directa y amigable, e invita a conocer más sobre nuestros servicios.
- Evalúa la calidad del lead según su interés y necesidades, y adapta tu respuesta para maximizar la probabilidad de conversión.

DETECCIÓN DE INTENCIÓN DE COMPRA:
Al final de CADA respuesta tuya, incluye en una línea separada uno de estos marcadores:
[INTENT:low] — el usuario solo está explorando o haciendo preguntas generales
[INTENT:medium] — el usuario pregunta por precios, procesos, tiempos o casos de éxito
[INTENT:high] — el usuario menciona presupuesto, quiere empezar, pide una propuesta, menciona un proyecto concreto, o pregunta cómo contratar

Este marcador es INTERNO. Será eliminado antes de mostrar la respuesta al usuario. No lo menciones ni expliques.`

// ─── Helpers ──────────────────────────────────────────────────────────────────

function assessComplexity(message: string): "simple" | "complex" {
  const complexIndicators = [
    /\b(arquitectura|integrar|api|base de datos|escalab|infraestructura|rendimiento|migrar|customiz)\b/i,
    /\b(estrategia|plan|roadmap|presupuesto|roi|comparar|diferencia entre|mejor opción)\b/i,
    /[?]{2,}|\b(además|también|y cómo|y qué|y cuánto|asimismo)\b/i,
  ]
  const isLong = message.trim().split(" ").length > 25
  const hasComplexIndicator = complexIndicators.some((r) => r.test(message))
  return isLong || hasComplexIndicator ? "complex" : "simple"
}

function extractIntent(raw: string): {
  text: string
  intent: "low" | "medium" | "high"
} {
  const match = raw.match(/\[INTENT:(low|medium|high)\]/i)
  const intent = (match?.[1] ?? "low") as "low" | "medium" | "high"
  const text = raw.replace(/\[INTENT:(low|medium|high)\]/gi, "").trim()
  return { text, intent }
}

function detectHighIntentFromMessage(message: string): boolean {
  const patterns = [
    /\b(presupuesto|cotización|cotizar|cuánto cuesta|precio|propuesta|contratar|empezar|comenzar|quiero|necesito|proyecto)\b/i,
    /\b(budget|quote|pricing|how much|proposal|hire|start|begin|want|need|project)\b/i,
  ]
  return patterns.some((r) => r.test(message))
}

// ─── Route handler ─────────────────────────────────────────────────────────────

export async function POST(request: Request) {
  try {
    if (!GEMINI_API_KEY) {
      return NextResponse.json(
        { error: "Servicio de chat no configurado." },
        { status: 500 }
      )
    }

    const body = await request.json()
    const { messages, messageCount } = body as {
      messages: Array<{ role: "user" | "model"; parts: [{ text: string }] }>
      messageCount?: number
    }

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: "Mensajes inválidos." }, { status: 400 })
    }

    const lastUserMessage = [...messages].reverse().find((m) => m.role === "user")
    const lastText = lastUserMessage?.parts?.[0]?.text ?? ""
    const complexity = assessComplexity(lastText)
    const clientHighIntent = detectHighIntentFromMessage(lastText)

    // Modelo único: gemini-2.5-flash-lite (estable, sin preview)
    const model = "gemini-2.5-flash-lite"

    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`

    const payload = {
      system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
      contents: messages,
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: complexity === "complex" ? 800 : 400,
        topP: 0.9,
      },
      safetySettings: [
        { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
        { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
      ],
    }

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      const errBody = await response.json().catch(() => null)
      console.error("[Chat API] Gemini error:", response.status, response.statusText, errBody)
      return NextResponse.json(
        {
          error: "Error al procesar tu mensaje. Intenta de nuevo.",
          details: errBody,
          providerStatus: response.status,
          providerStatusText: response.statusText,
        },
        { status: 502 }
      )
    }

    const data = await response.json()
    const raw = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? ""

    if (!raw) {
      return NextResponse.json(
        { error: "No se pudo generar una respuesta." },
        { status: 500 }
      )
    }

    const { text, intent: geminiIntent } = extractIntent(raw)
    const highIntent = geminiIntent === "high" || clientHighIntent
    const mediumIntent = geminiIntent === "medium"
    const shouldAskEmail = (messageCount ?? 0) >= 3

    return NextResponse.json({
      text,
      model,
      intent: highIntent ? "high" : mediumIntent ? "medium" : "low",
      shouldAskEmail,
    })
  } catch (error) {
    console.error("[Chat API] Unexpected error:", error)
    return NextResponse.json(
      { error: "Error interno del servidor." },
      { status: 500 }
    )
  }
}