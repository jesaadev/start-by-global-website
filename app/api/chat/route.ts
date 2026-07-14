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

// Versión para el mercado de EE.UU. (visitantes de /us): mismo playbook con
// mensajes y precios orientados a US.
const BASE_SYSTEM_PROMPT_EN = `You are a sales and support agent for Start By Global, a world-class digital marketing and web development agency serving businesses in the United States, the Dominican Republic, Spain, and Latin America.

Your goals:
1. Answer questions about Start By Global's services, pricing, and processes
2. Qualify leads and guide visitors toward booking a consultation or contacting the team
3. Be friendly, professional, and persuasive without being pushy

SERVICES WE OFFER:
- Web Development: Next.js, React, WordPress, E-commerce, Landing Pages. From $300 per project.
- SEO & Rankings: technical SEO, link building, local SEO. Results in 3-6 months.
- Digital Marketing: Google Ads, Meta Ads, TikTok Ads, LinkedIn Ads. Average ROI 380%.
- Branding & Design: visual identity, UI/UX, graphic assets.
- Analytics & Data: GA4 dashboards, Looker Studio, automated reporting.
- Automation & AI: chatbots, Make/N8N/Zapier flows, AI agents. From $600 per project.

VALUE FOR US CLIENTS: senior nearshore team in the same time zones as the US, fast turnaround, USD pricing well below typical US agency rates, English-speaking support.

CONTACT:
- Email: info@startbyglobal.com
- WhatsApp: +18493562247
- Web: startbyglobal.com/us
- Offices: Santo Domingo (HQ), Madrid, Mexico City, Miami (remote)

IMPORTANT RULES:
- ALWAYS reply in the same language the user writes in (default to English)
- Be concise: 3-4 sentences max unless asked for detail
- For exact quotes or proposals, invite them to contact the team
- Never invent services or prices not listed above
- If the question is off-topic, kindly steer back to our services
- Warm, professional, results-oriented tone
- Never mention you are a Google AI model; you are Start By Global's virtual assistant
- If the visitor shows interest, guide them to book a free consultation or contact the team

PURCHASE INTENT DETECTION:
At the end of EVERY reply include on a separate line:
[INTENT:low] if they are just exploring or asking general questions
[INTENT:medium] if they ask about pricing, process, timelines, or case studies
[INTENT:high] if they mention budget, want to start, or ask for a proposal
This marker is INTERNAL and removed before display. Never mention it.`

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
    const { messages, messageCount, locale } = body as {
      messages: Array<{ role: "user" | "model"; parts: [{ text: string }] }>
      messageCount?: number
      locale?: string
    }

    if (!messages?.length) {
      return NextResponse.json({ error: "Mensajes inválidos." }, { status: 400 })
    }

    const lastText = [...messages].reverse().find((m) => m.role === "user")?.parts?.[0]?.text ?? ""
    const complexity = assessComplexity(lastText)
    const clientHighIntent = detectHighIntent(lastText)

    // Prompt dinámico desde Supabase
    let systemPrompt = locale === "en" ? BASE_SYSTEM_PROMPT_EN : BASE_SYSTEM_PROMPT
    try {
      const [insights, overrides] = await Promise.all([getActiveInsights(), getActiveOverrides()])
      const block = buildDynamicPromptBlock(insights, overrides)
      if (block) systemPrompt += block
    } catch (e) {
      console.warn("[Chat] Dynamic prompt failed, using base:", e)
    }

    const model = "gemini-2.5-flash-lite"
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`

    const requestBody = JSON.stringify({
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
    })

    // Un 429 (cuota/ráfaga) suele ser transitorio: reintentamos una vez con un
    // pequeño backoff. Capturamos también fallos de red (DNS, timeout) para que
    // caigan en la degradación elegante en vez de en un 500 que pierde el lead.
    const callGemini = () =>
      fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: requestBody,
      })

    let response: Response | null = null
    try {
      response = await callGemini()
      if (response.status === 429) {
        await new Promise((r) => setTimeout(r, 700))
        response = await callGemini()
      }
    } catch (fetchError) {
      console.error("[Chat] Gemini fetch failed:", fetchError)
    }

    if (!response || !response.ok) {
      const errBody = response ? await response.json().catch(() => null) : null
      console.error("[Chat] Gemini error:", response?.status ?? "network", errBody)

      // Degradación elegante: en vez de un error seco que pierde el lead,
      // derivamos a un humano (WhatsApp/email) y marcamos alta intención para
      // que la UI muestre el CTA de WhatsApp.
      return NextResponse.json({
        text:
          "Justo ahora tengo mucha demanda y no puedo responderte al instante 🙏. " +
          "Para no hacerte esperar, escríbenos por WhatsApp y te atendemos enseguida, " +
          "o déjanos tu email y un especialista te contacta. ¿Te parece?",
        model: "fallback",
        intent: "high",
        degraded: true,
        shouldAskEmail: true,
      })
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