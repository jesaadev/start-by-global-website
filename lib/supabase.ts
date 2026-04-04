import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

// Cliente server-side con service_role (nunca exponer al cliente)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { persistSession: false },
})

// ─── Types ────────────────────────────────────────────────────────────────────

export interface Conversation {
  id: string
  session_id: string
  messages: Array<{ role: string; parts: [{ text: string }] }>
  email: string | null
  name: string | null
  intent_final: "low" | "medium" | "high"
  converted: boolean
  summary: string | null
  analysis: ConversationAnalysis | null
  page_url: string | null
  created_at: string
  updated_at: string
}

export interface ConversationAnalysis {
  objections: string[]
  what_worked: string[]
  what_failed: string[]
  lead_quality: "hot" | "warm" | "cold"
  recommended_followup: string
  extracted_insights: ExtractedInsight[]
}

export interface ExtractedInsight {
  type: "objection" | "pattern" | "opener" | "closer"
  trigger_phrase: string
  best_response: string
  context: string
}

export interface SalesInsight {
  id: string
  type: "objection" | "pattern" | "opener" | "closer"
  trigger_phrase: string
  best_response: string
  context: string | null
  success_rate: number
  usage_count: number
  active: boolean
  created_at: string
  updated_at: string
}

export interface PromptOverride {
  id: string
  key: string
  content: string
  active: boolean
  priority: number
  created_at: string
  updated_at: string
}

// ─── Queries ──────────────────────────────────────────────────────────────────

export async function getActiveInsights(): Promise<SalesInsight[]> {
  const { data, error } = await supabaseAdmin
    .from("sales_insights")
    .select("*")
    .eq("active", true)
    .order("success_rate", { ascending: false })
    .limit(20)

  if (error) {
    console.error("[Supabase] getActiveInsights error:", error)
    return []
  }
  return data ?? []
}

export async function getActiveOverrides(): Promise<PromptOverride[]> {
  const { data, error } = await supabaseAdmin
    .from("prompt_overrides")
    .select("*")
    .eq("active", true)
    .order("priority", { ascending: false })

  if (error) {
    console.error("[Supabase] getActiveOverrides error:", error)
    return []
  }
  return data ?? []
}

export async function saveConversation(payload: {
  session_id: string
  messages: Array<{ role: string; parts: [{ text: string }] }>
  email?: string | null
  name?: string | null
  intent_final: "low" | "medium" | "high"
  converted: boolean
  summary?: string | null
  analysis?: ConversationAnalysis | null
  page_url?: string | null
}): Promise<string | null> {
  const { data, error } = await supabaseAdmin
    .from("conversations")
    .insert(payload)
    .select("id")
    .single()

  if (error) {
    console.error("[Supabase] saveConversation error:", error)
    return null
  }
  return data?.id ?? null
}

export async function upsertInsight(insight: ExtractedInsight): Promise<void> {
  // Intentar incrementar si ya existe una entrada similar
  const { data: existing } = await supabaseAdmin
    .from("sales_insights")
    .select("id, usage_count")
    .ilike("trigger_phrase", `%${insight.trigger_phrase.slice(0, 30)}%`)
    .single()

  if (existing) {
    await supabaseAdmin
      .from("sales_insights")
      .update({ usage_count: (existing.usage_count ?? 0) + 1 })
      .eq("id", existing.id)
  } else {
    await supabaseAdmin.from("sales_insights").insert({
      type: insight.type,
      trigger_phrase: insight.trigger_phrase,
      best_response: insight.best_response,
      context: insight.context,
      success_rate: 50,
      usage_count: 1,
      active: true,
    })
  }
}

// ─── Prompt builder ───────────────────────────────────────────────────────────

export function buildDynamicPromptBlock(
  insights: SalesInsight[],
  overrides: PromptOverride[]
): string {
  if (insights.length === 0 && overrides.length === 0) return ""

  const lines: string[] = [
    "",
    "════════════════════════════════════",
    "CONTEXTO DINÁMICO (actualizado automáticamente):",
    "════════════════════════════════════",
  ]

  if (overrides.length > 0) {
    lines.push("\nCONTEXTO ACTUAL:")
    overrides.forEach((o) => lines.push(`• ${o.content}`))
  }

  const objections = insights.filter((i) => i.type === "objection")
  const patterns = insights.filter((i) => i.type === "pattern")
  const closers = insights.filter((i) => i.type === "closer")

  if (objections.length > 0) {
    lines.push("\nOBJECIONES FRECUENTES Y CÓMO MANEJARLAS:")
    objections.forEach((i) => {
      lines.push(`• Cuando digan "${i.trigger_phrase}":`)
      lines.push(`  → ${i.best_response}`)
    })
  }

  if (patterns.length > 0) {
    lines.push("\nPATRONES QUE CONVIERTEN:")
    patterns.forEach((i) => {
      lines.push(`• Si detectas "${i.trigger_phrase}": ${i.best_response}`)
    })
  }

  if (closers.length > 0) {
    lines.push("\nFRASES DE CIERRE EFECTIVAS:")
    closers.forEach((i) => {
      lines.push(`• ${i.trigger_phrase}: "${i.best_response}"`)
    })
  }

  return lines.join("\n")
}