import Anthropic from "@anthropic-ai/sdk"
import { getSiteSettings } from "@/lib/site-settings"

// Capa de IA intercambiable para las rutinas de contenido. Soporta dos
// proveedores —Claude (Anthropic) y Gemini (Google)— y elige el activo según
// la preferencia guardada en los settings del sitio (editable desde el admin),
// cayendo al primero que tenga su API key configurada.

export type AiProvider = "claude" | "gemini"

const CLAUDE_MODEL = process.env.CLAUDE_CONTENT_MODEL || "claude-sonnet-4-6"
const GEMINI_MODEL = process.env.GEMINI_CONTENT_MODEL || "gemini-2.5-flash"

export function providerConfigured(p: AiProvider): boolean {
  if (p === "claude") return Boolean(process.env.ANTHROPIC_API_KEY)
  if (p === "gemini") return Boolean(process.env.GEMINI_API_KEY)
  return false
}

export function configuredProviders(): AiProvider[] {
  return (["claude", "gemini"] as AiProvider[]).filter(providerConfigured)
}

export function anyProviderConfigured(): boolean {
  return configuredProviders().length > 0
}

/** Proveedor activo: el guardado en settings si tiene key, si no el primero disponible. */
export async function getActiveProvider(): Promise<AiProvider | null> {
  const configured = configuredProviders()
  if (!configured.length) return null
  try {
    const settings = await getSiteSettings()
    const pref = settings.ai?.provider as AiProvider | undefined
    if (pref && configured.includes(pref)) return pref
  } catch {
    /* usa el fallback */
  }
  return configured[0]
}

// ─── Parseo JSON tolerante (code fences, prosa alrededor) ────────────────────

function parseJsonLoose<T>(text: string): T {
  const trimmed = text.trim()
  try {
    return JSON.parse(trimmed) as T
  } catch {
    /* sigue */
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

// ─── Claude ──────────────────────────────────────────────────────────────────

let claudeClient: Anthropic | null = null
async function claudeText(system: string, prompt: string, maxTokens: number): Promise<string> {
  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) throw new Error("ANTHROPIC_API_KEY no está configurada")
  if (!claudeClient) claudeClient = new Anthropic({ apiKey })
  const res = await claudeClient.messages.create({
    model: CLAUDE_MODEL,
    max_tokens: maxTokens,
    system,
    messages: [{ role: "user", content: prompt }],
  })
  return res.content
    .filter((b): b is Anthropic.TextBlock => b.type === "text")
    .map((b) => b.text)
    .join("")
}

// ─── Gemini ──────────────────────────────────────────────────────────────────

async function geminiText(system: string, prompt: string, maxTokens: number): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) throw new Error("GEMINI_API_KEY no está configurada")
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${apiKey}`

  const call = (jsonMode: boolean): Promise<Response> =>
    fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: system }] },
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: maxTokens,
          // Desactiva el "thinking" del 2.5-flash (activo por defecto): respuesta
          // directa, más rápida y fiable para JSON; evita 5xx en generaciones largas.
          thinkingConfig: { thinkingBudget: 0 },
          ...(jsonMode ? { responseMimeType: "application/json" } : {}),
        },
      }),
    })

  // Intento + reintento ante errores transitorios (429/5xx); como último
  // recurso, sin modo-JSON (parseJsonLoose tolera el JSON dentro de texto).
  let res = await call(true)
  if (res.status === 429 || res.status >= 500) {
    await new Promise((r) => setTimeout(r, 800))
    res = await call(true)
  }
  if (res.status >= 500) {
    res = await call(false)
  }

  if (!res.ok) {
    const body = await res.text().catch(() => "")
    console.error("[AI] Gemini error", res.status, body.slice(0, 500))
    throw new Error(`Gemini ${res.status}: ${body.slice(0, 200)}`)
  }
  const data = (await res.json()) as {
    candidates?: Array<{ content?: { parts?: Array<{ text?: string }> }; finishReason?: string }>
    promptFeedback?: { blockReason?: string }
  }
  const text = data?.candidates?.[0]?.content?.parts?.map((p) => p.text ?? "").join("") ?? ""
  if (!text) {
    const reason = data?.candidates?.[0]?.finishReason || data?.promptFeedback?.blockReason || "desconocido"
    console.error("[AI] Gemini sin contenido, finishReason:", reason)
    throw new Error(`Gemini no devolvió contenido (motivo: ${reason}).`)
  }
  return text
}

// ─── Entry point ──────────────────────────────────────────────────────────────

export interface AiJsonOptions {
  system: string
  prompt: string
  maxTokens?: number
  provider?: AiProvider
}

/** Llama al proveedor activo (o el indicado) y devuelve la respuesta como JSON. */
export async function aiJson<T>(opts: AiJsonOptions): Promise<T> {
  const provider = opts.provider ?? (await getActiveProvider())
  if (!provider) {
    throw new Error("No hay proveedor de IA configurado (ANTHROPIC_API_KEY o GEMINI_API_KEY).")
  }
  const system =
    opts.system +
    "\n\nIMPORTANTE: responde ÚNICAMENTE con JSON válido, sin texto adicional, sin explicaciones y sin code fences."
  const maxTokens = opts.maxTokens ?? 8000
  const text =
    provider === "gemini"
      ? await geminiText(system, opts.prompt, maxTokens)
      : await claudeText(system, opts.prompt, maxTokens)
  return parseJsonLoose<T>(text)
}
