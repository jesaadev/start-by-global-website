import { NextResponse } from "next/server"
import { getActiveInsights, getActiveOverrides, buildDynamicPromptBlock } from "@/lib/supabase"
import { enforceRateLimit } from "@/lib/rate-limit"
import { sameOriginOk } from "@/lib/request-guards"

const GEMINI_API_KEY = process.env.GEMINI_API_KEY

const BASE_SYSTEM_PROMPT = `Eres un agente de ventas y soporte de Start By Global, una agencia de marketing digital de clase mundial con presencia en República Dominicana, España, Latinoamérica y EE.UU.

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
- Automatización e IA: Chatbots, flujos Make/N8N/Zapier, agentes IA. Desde $600 proyecto, RD$2,400/mes retainer.
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
- Mantén un enfoque claro en cerrar la venta con un pitch persuasivo pero cercano al cliente
- Si el cliente muestra interés, guía hacia agendar una consultoría o contactar al equipo
- Evalúa la calidad del lead según su interés y necesidades, adapta tu respuesta para maximizar conversión

DETECCIÓN DE INTENCIÓN DE COMPRA:
Al final de CADA respuesta tuya incluye en una línea separada:
[INTENT:low] si solo explora o hace preguntas generales
[INTENT:medium] si pregunta por precios, procesos, tiempos o casos de éxito
[INTENT:high] si menciona presupuesto, quiere empezar, pide propuesta o proyecto concreto
Este marcador es INTERNO, se elimina antes de mostrarlo. No lo menciones.`

function assessComplexity(message: string): "simple" | "complex" {
  const indicators = [
    /\b(arquitectura|integrar|api|base de datos|escalab|infraestructura|rendimiento|migrar|customiz)\b/i,
    /\b(estrategia|plan|roadmap|presupuesto|roi|comparar|diferencia entre|mejor opción)\b/i,
    /[?]{2,}|\b(además|también|y cómo|y qué|y cuánto|asimismo)\b/i,
  ]
  return message.trim().split(" ").length > 25 || indicators.some((r) => r.test(message))
    ? "complex" : "simple"
}

function extractIntent(raw: string): { text: string; intent: "low" | "medium" | "high" } {
  const match = raw.match(/\[INTENT:(low|medium|high)\]/i)
  const intent = (match?.[1] ?? "low") as "low" | "medium" | "high"
  return { text: raw.replace(/\[INTENT:(low|medium|high)\]/gi, "").trim(), intent }
}

function detectHighIntent(message: string): boolean {
  return [
    /\b(presupuesto|cotización|cotizar|cuánto cuesta|precio|propuesta|contratar|empezar|comenzar|quiero|necesito|proyecto)\b/i,
    /\b(budget|quote|pricing|how much|proposal|hire|start|begin|want|need|project)\b/i,
  ].some((r) => r.test(message))
}

export async function POST(request: Request) {
  try {
    // Anti-abuso: límite por IP (protege el coste de la API) y origen.
    const limited = enforceRateLimit(request, "chat", 30, 60 * 1000)
    if (limited) return limited
    if (!sameOriginOk(request)) {
      return NextResponse.json({ error: "Origen no permitido." }, { status: 403 })
    }

    if (!GEMINI_API_KEY) {
      return NextResponse.json({ error: "Servicio de chat no configurado." }, { status: 500 })
    }

    const body = await request.json()
    const { messages, messageCount } = body as {
      messages: Array<{ role: "user" | "model"; parts: [{ text: string }] }>
      messageCount?: number
    }

    if (!messages?.length) {
      return NextResponse.json({ error: "Mensajes inválidos." }, { status: 400 })
    }

    const lastText = [...messages].reverse().find((m) => m.role === "user")?.parts?.[0]?.text ?? ""
    const complexity = assessComplexity(lastText)
    const clientHighIntent = detectHighIntent(lastText)

    // Prompt dinámico desde Supabase
    let systemPrompt = BASE_SYSTEM_PROMPT
    try {
      const [insights, overrides] = await Promise.all([getActiveInsights(), getActiveOverrides()])
      const block = buildDynamicPromptBlock(insights, overrides)
      if (block) systemPrompt += block
    } catch (e) {
      console.warn("[Chat] Dynamic prompt failed, using base:", e)
    }

    const model = "gemini-2.5-flash-lite"
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: systemPrompt }] },
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
      }),
    })

    if (!response.ok) {
      const errBody = await response.json().catch(() => null)
      console.error("[Chat] Gemini error:", response.status, errBody)
      return NextResponse.json(
        { error: "Error al procesar tu mensaje.", details: errBody },
        { status: 502 }
      )
    }

    const data = await response.json()
    const raw = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? ""
    if (!raw) return NextResponse.json({ error: "Sin respuesta del modelo." }, { status: 500 })

    const { text, intent: geminiIntent } = extractIntent(raw)
    const highIntent = geminiIntent === "high" || clientHighIntent

    return NextResponse.json({
      text,
      model,
      intent: highIntent ? "high" : geminiIntent === "medium" ? "medium" : "low",
      shouldAskEmail: (messageCount ?? 0) >= 3,
    })
  } catch (error) {
    console.error("[Chat] Unexpected error:", error)
    return NextResponse.json({ error: "Error interno del servidor." }, { status: 500 })
  }
}