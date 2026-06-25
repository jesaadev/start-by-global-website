import Anthropic from "@anthropic-ai/sdk"

// Wrapper mínimo sobre el SDK oficial de Anthropic para las rutinas de
// contenido. Fail-safe: si no hay ANTHROPIC_API_KEY, claudeConfigured() es
// false y las rutinas degradan con elegancia en lugar de romper.
//
// Modelo configurable por CLAUDE_CONTENT_MODEL (default claude-sonnet-4-6:
// buena relación calidad/coste para redacción a volumen).

const MODEL = process.env.CLAUDE_CONTENT_MODEL || "claude-sonnet-4-6"

let cached: Anthropic | null = null
function getClient(): Anthropic | null {
  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) return null
  if (!cached) cached = new Anthropic({ apiKey })
  return cached
}

export function claudeConfigured(): boolean {
  return Boolean(process.env.ANTHROPIC_API_KEY)
}

/** Extrae el primer objeto JSON de un texto (tolera code fences y prosa). */
function parseJsonLoose<T>(text: string): T {
  const trimmed = text.trim()
  try {
    return JSON.parse(trimmed) as T
  } catch {
    /* sigue intentando */
  }
  const fence = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i)
  if (fence) {
    try {
      return JSON.parse(fence[1].trim()) as T
    } catch {
      /* sigue */
    }
  }
  const first = trimmed.indexOf("{")
  const last = trimmed.lastIndexOf("}")
  if (first !== -1 && last > first) {
    try {
      return JSON.parse(trimmed.slice(first, last + 1)) as T
    } catch {
      /* sigue */
    }
  }
  throw new Error("Respuesta del modelo no es JSON válido")
}

export interface ClaudeJsonOptions {
  system: string
  prompt: string
  maxTokens?: number
}

/** Llama a Claude y devuelve la respuesta parseada como JSON del tipo T. */
export async function claudeJson<T>(opts: ClaudeJsonOptions): Promise<T> {
  const client = getClient()
  if (!client) throw new Error("ANTHROPIC_API_KEY no está configurada")

  const res = await client.messages.create({
    model: MODEL,
    max_tokens: opts.maxTokens ?? 8000,
    system:
      opts.system +
      "\n\nIMPORTANTE: responde ÚNICAMENTE con JSON válido, sin texto adicional, sin explicaciones y sin code fences.",
    messages: [{ role: "user", content: opts.prompt }],
  })

  const text = res.content
    .filter((b): b is Anthropic.TextBlock => b.type === "text")
    .map((b) => b.text)
    .join("")

  return parseJsonLoose<T>(text)
}
