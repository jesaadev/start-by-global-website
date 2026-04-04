import { NextResponse } from "next/server"
import { saveConversation, upsertInsight, type ConversationAnalysis } from "@/lib/supabase"

const GEMINI_API_KEY = process.env.GEMINI_API_KEY

const ANALYSIS_PROMPT = `Eres un analista de ventas experto. Analiza esta conversación de chat de una agencia de marketing digital y extrae insights accionables.

Devuelve ÚNICAMENTE un JSON válido con esta estructura exacta (sin markdown, sin explicaciones):
{
  "objections": ["objeción 1", "objeción 2"],
  "what_worked": ["qué funcionó 1", "qué funcionó 2"],
  "what_failed": ["qué falló 1"],
  "lead_quality": "hot|warm|cold",
  "recommended_followup": "acción de seguimiento recomendada",
  "extracted_insights": [
    {
      "type": "objection|pattern|opener|closer",
      "trigger_phrase": "frase del cliente que activa esto",
      "best_response": "respuesta óptima para este caso",
      "context": "contexto de cuándo usar esto"
    }
  ]
}

Criterios de calidad del lead:
- hot: preguntó precios, mencionó proyecto concreto, quiere empezar pronto
- warm: mostró interés real, hizo preguntas específicas
- cold: solo exploró sin compromiso o preguntó cosas irrelevantes`

async function analyzeWithGemini(
  messages: Array<{ role: string; parts: [{ text: string }] }>
): Promise<ConversationAnalysis | null> {
  if (!GEMINI_API_KEY) return null

  const conversationText = messages
    .map((m) => `${m.role === "user" ? "Cliente" : "Asistente"}: ${m.parts[0].text}`)
    .join("\n")

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: ANALYSIS_PROMPT }] },
          contents: [{ role: "user", parts: [{ text: conversationText }] }],
          generationConfig: { temperature: 0.3, maxOutputTokens: 1000 },
        }),
      }
    )

    if (!response.ok) return null

    const data = await response.json()
    const raw = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? ""

    // Limpiar markdown si Gemini lo envuelve
    const clean = raw.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim()
    return JSON.parse(clean) as ConversationAnalysis
  } catch (e) {
    console.error("[Chat/Save] Analysis failed:", e)
    return null
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const {
      session_id,
      messages,
      email,
      name,
      intent_final,
      converted,
      summary,
      page_url,
    } = body as {
      session_id: string
      messages: Array<{ role: string; parts: [{ text: string }] }>
      email?: string | null
      name?: string | null
      intent_final: "low" | "medium" | "high"
      converted: boolean
      summary?: string | null
      page_url?: string | null
    }

    if (!session_id || !messages?.length) {
      return NextResponse.json({ error: "Datos inválidos." }, { status: 400 })
    }

    // Analizar conversación con Gemini (solo si tiene 3+ mensajes del usuario)
    const userMessages = messages.filter((m) => m.role === "user")
    let analysis: ConversationAnalysis | null = null

    if (userMessages.length >= 2) {
      analysis = await analyzeWithGemini(messages)

      // Guardar insights extraídos en Supabase
      if (analysis?.extracted_insights?.length) {
        await Promise.allSettled(
          analysis.extracted_insights.map((insight) => upsertInsight(insight))
        )
      }
    }

    // Guardar conversación completa
    const id = await saveConversation({
      session_id,
      messages,
      email: email ?? null,
      name: name ?? null,
      intent_final,
      converted,
      summary: summary ?? null,
      analysis,
      page_url: page_url ?? null,
    })

    return NextResponse.json({ success: true, id, analyzed: analysis !== null })
  } catch (error) {
    console.error("[Chat/Save] Unexpected error:", error)
    return NextResponse.json({ error: "Error interno." }, { status: 500 })
  }
}