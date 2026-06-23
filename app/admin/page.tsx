"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import {
  MessageSquare, Lightbulb, Settings, BarChart3, LogOut,
  Plus, Pencil, Trash2, ToggleLeft, ToggleRight, Eye,
  ChevronLeft, ChevronRight, Loader2, CheckCircle2,
  XCircle, TrendingUp, TrendingDown, Mail, RefreshCw, Save, X,
  Search, Building2, Activity, Megaphone,
  FileText, Share2, MousePointerClick, Download, Target,
} from "lucide-react"
import { cn } from "@/lib/utils"
import type { SiteSettings } from "@/lib/site-settings"
import { blogPostsData } from "@/app/insights/[slug]/blog-data"

// ─── Types ────────────────────────────────────────────────────────────────────

interface Stats {
  total_conversations: number
  total_converted: number
  total_emails: number
  conversion_rate: string
  intent_distribution: { low: number; medium: number; high: number }
}

interface Conversation {
  id: string
  session_id: string
  email: string | null
  name: string | null
  intent_final: "low" | "medium" | "high"
  converted: boolean
  summary: string | null
  created_at: string
  analysis: {
    lead_quality?: string
    recommended_followup?: string
    objections?: string[]
    what_worked?: string[]
    extracted_insights?: unknown[]
  } | null
}

interface ConversationDetail extends Conversation {
  messages: Array<{ role: string; parts: [{ text: string }] }>
  page_url: string | null
}

interface SalesInsight {
  id: string
  type: "objection" | "pattern" | "opener" | "closer"
  trigger_phrase: string
  best_response: string
  context: string | null
  success_rate: number
  usage_count: number
  active: boolean
  created_at: string
}

interface PromptOverride {
  id: string
  key: string
  content: string
  active: boolean
  priority: number
  created_at: string
}

// ─── Constants ────────────────────────────────────────────────────────────────

const INTENT_COLORS = {
  low: "text-muted-foreground bg-secondary/60",
  medium: "text-chart-4 bg-chart-4/10",
  high: "text-chart-3 bg-chart-3/10",
}

const INTENT_LABELS = { low: "Frío", medium: "Tibio", high: "Caliente" }

const TYPE_COLORS = {
  objection: "text-destructive bg-destructive/10",
  pattern: "text-chart-2 bg-chart-2/10",
  opener: "text-primary bg-primary/10",
  closer: "text-chart-3 bg-chart-3/10",
}

// ─── API helper ───────────────────────────────────────────────────────────────

function useAdminAPI(password: string) {
  return useMemo(() => {
    const headers = { "Content-Type": "application/json", "x-admin-password": password }

    const get = (params: Record<string, string>) => {
      const qs = new URLSearchParams(params).toString()
      return fetch(`/api/admin?${qs}`, { headers }).then((r) => r.json())
    }

    const patch = (body: Record<string, unknown>) =>
      fetch("/api/admin", { method: "PATCH", headers, body: JSON.stringify(body) }).then((r) => r.json())

    const post = (body: Record<string, unknown>) =>
      fetch("/api/admin", { method: "POST", headers, body: JSON.stringify(body) }).then((r) => r.json())

    const del = (body: Record<string, unknown>) =>
      fetch("/api/admin", { method: "DELETE", headers, body: JSON.stringify(body) }).then((r) => r.json())

    return { get, patch, post, del }
  }, [password])
}

// ─── Login Screen ─────────────────────────────────────────────────────────────

function LoginScreen({ onLogin }: { onLogin: (pw: string) => void }) {
  const [pw, setPw] = useState("")
  const [error, setError] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const res = await fetch("/api/admin?resource=stats", {
      headers: { "x-admin-password": pw },
    })
    if (res.ok) { onLogin(pw) } else { setError(true) }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-sm glass-card rounded-2xl p-8 flex flex-col items-center gap-6">
        <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20">
          <Settings className="w-7 h-7 text-primary" />
        </div>
        <div className="text-center">
          <h1 className="font-display text-xl font-bold text-foreground">Admin Panel</h1>
          <p className="text-sm text-muted-foreground mt-1">Start By Global — Chat Intelligence</p>
        </div>
        <form onSubmit={handleSubmit} className="w-full space-y-3">
          <input
            type="password"
            placeholder="Contraseña de acceso"
            value={pw}
            onChange={(e) => { setPw(e.target.value); setError(false) }}
            className={cn(
              "w-full px-4 py-3 rounded-xl text-sm bg-secondary/50 border text-foreground",
              "placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/20 transition-all",
              error ? "border-destructive/50" : "border-border/50 focus:border-primary/50"
            )}
          />
          {error && <p className="text-xs text-destructive">Contraseña incorrecta</p>}
          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:shadow-lg hover:shadow-primary/25 transition-all"
          >
            Ingresar
          </button>
        </form>
      </div>
    </div>
  )
}

// ─── Stats Cards ──────────────────────────────────────────────────────────────

function StatsBar({ stats }: { stats: Stats }) {
  const cards = [
    { label: "Conversaciones", value: stats.total_conversations, icon: MessageSquare, color: "text-chart-2" },
    { label: "Emails capturados", value: stats.total_emails, icon: Mail, color: "text-primary" },
    { label: "Convertidos", value: stats.total_converted, icon: CheckCircle2, color: "text-chart-3" },
    { label: "Tasa conversión", value: `${stats.conversion_rate}%`, icon: TrendingUp, color: "text-chart-4" },
  ]

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((c) => {
        const Icon = c.icon
        return (
          <div key={c.label} className="glass-card rounded-xl p-4 flex items-center gap-3">
            <div className={cn("flex items-center justify-center w-10 h-10 rounded-lg bg-secondary/60", c.color)}>
              <Icon className="w-5 h-5" />
            </div>
            <div>
              <p className="font-display text-xl font-bold text-foreground">{c.value}</p>
              <p className="text-[10px] text-muted-foreground">{c.label}</p>
            </div>
          </div>
        )
      })}
    </div>
  )
}

// ─── Conversations Tab ────────────────────────────────────────────────────────

function ConversationsTab({ api }: { api: ReturnType<typeof useAdminAPI> }) {
  const [data, setData] = useState<Conversation[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [loadedPage, setLoadedPage] = useState(0)
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<ConversationDetail | null>(null)
  const [loadingDetail, setLoadingDetail] = useState(false)

  useEffect(() => {
    if (loadedPage === page && data.length > 0) return

    let active = true
    const fetchConversations = async () => {
      setLoading(true)
      const res = await api.get({ resource: "conversations", page: String(page) })
      if (!active) return
      setData(res.data ?? [])
      setTotal(res.total ?? 0)
      setLoadedPage(page)
      setLoading(false)
    }

    fetchConversations()
    return () => { active = false }
  }, [api, page, data.length])

  const openDetail = async (id: string) => {
    setLoadingDetail(true)
    const res = await api.get({ resource: "conversation", id })
    setSelected(res.data)
    setLoadingDetail(false)
  }

  const toggleConverted = async (conv: Conversation) => {
    await api.patch({ resource: "conversation", id: conv.id, converted: !conv.converted })
    setData((prev) => prev.map((c) => c.id === conv.id ? { ...c, converted: !c.converted } : c))
  }

  const totalPages = Math.ceil(total / 20)

  return (
    <div className="space-y-4">
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <>
          <div className="glass-card rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/50 bg-secondary/30">
                  {["Fecha", "Email / Nombre", "Intención", "Estado", "Resumen", ""].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-[11px] uppercase tracking-wider text-muted-foreground font-medium">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.map((conv) => (
                  <tr key={conv.id} className="border-b border-border/30 hover:bg-secondary/20 transition-colors">
                    <td className="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap">
                      {new Date(conv.created_at).toLocaleDateString("es-DO", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}
                    </td>
                    <td className="px-4 py-3">
                      {conv.email
                        ? <div><p className="text-xs font-medium text-foreground">{conv.email}</p>
                          {conv.name && <p className="text-[10px] text-muted-foreground">{conv.name}</p>}</div>
                        : <span className="text-[10px] text-muted-foreground italic">Anónimo</span>
                      }
                    </td>
                    <td className="px-4 py-3">
                      <span className={cn("text-[10px] font-semibold px-2 py-0.5 rounded-full", INTENT_COLORS[conv.intent_final])}>
                        {INTENT_LABELS[conv.intent_final]}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        type="button"
                        onClick={() => toggleConverted(conv)}
                        className={cn("text-[10px] font-semibold px-2 py-0.5 rounded-full transition-colors",
                          conv.converted ? "text-chart-3 bg-chart-3/10" : "text-muted-foreground bg-secondary/60 hover:bg-secondary"
                        )}
                      >
                        {conv.converted ? "✓ Convertido" : "Sin convertir"}
                      </button>
                    </td>
                    <td className="px-4 py-3 max-w-[200px]">
                      <p className="text-xs text-muted-foreground truncate">{conv.summary ?? "—"}</p>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        type="button"
                        onClick={() => openDetail(conv.id)}
                        disabled={loadingDetail}
                        className="p-1.5 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>{total} conversaciones en total</span>
            <div className="flex items-center gap-2">
              <button type="button" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}
                className="p-1.5 rounded-lg hover:bg-secondary disabled:opacity-30 transition-colors">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span>{page} / {totalPages || 1}</span>
              <button type="button" onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page >= totalPages}
                className="p-1.5 rounded-lg hover:bg-secondary disabled:opacity-30 transition-colors">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </>
      )}

      {/* Detail Modal */}
      {selected && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-start justify-center p-4 pt-16 overflow-y-auto">
          <div className="w-full max-w-2xl glass-card rounded-2xl p-6 space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="font-display font-bold text-foreground">Detalle de conversación</h3>
              <button type="button" onClick={() => setSelected(null)}>
                <X className="w-5 h-5 text-muted-foreground hover:text-foreground" />
              </button>
            </div>

            {/* Meta */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              {[
                ["Email", selected.email ?? "—"],
                ["Nombre", selected.name ?? "—"],
                ["Intención", INTENT_LABELS[selected.intent_final]],
                ["Convertido", selected.converted ? "Sí" : "No"],
                ["URL", selected.page_url ?? "—"],
                ["Fecha", new Date(selected.created_at).toLocaleString("es-DO")],
              ].map(([k, v]) => (
                <div key={k} className="bg-secondary/30 rounded-lg px-3 py-2">
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wide mb-0.5">{k}</p>
                  <p className="text-foreground font-medium truncate">{v}</p>
                </div>
              ))}
            </div>

            {/* Analysis */}
            {selected.analysis && (
              <div className="space-y-3">
                <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Análisis IA</h4>
                <div className="grid grid-cols-2 gap-3">
                  {selected.analysis.objections?.length ? (
                    <div className="bg-destructive/5 border border-destructive/20 rounded-lg p-3">
                      <p className="text-[10px] text-destructive font-semibold mb-1.5">Objeciones</p>
                      {selected.analysis.objections.map((o, i) => (
                        <p key={i} className="text-xs text-muted-foreground">• {o}</p>
                      ))}
                    </div>
                  ) : null}
                  {selected.analysis.what_worked?.length ? (
                    <div className="bg-chart-3/5 border border-chart-3/20 rounded-lg p-3">
                      <p className="text-[10px] text-chart-3 font-semibold mb-1.5">Qué funcionó</p>
                      {selected.analysis.what_worked.map((w, i) => (
                        <p key={i} className="text-xs text-muted-foreground">• {w}</p>
                      ))}
                    </div>
                  ) : null}
                </div>
                {selected.analysis.recommended_followup && (
                  <div className="bg-primary/5 border border-primary/20 rounded-lg p-3">
                    <p className="text-[10px] text-primary font-semibold mb-1">Seguimiento recomendado</p>
                    <p className="text-xs text-foreground">{selected.analysis.recommended_followup}</p>
                  </div>
                )}
              </div>
            )}

            {/* Messages */}
            <div className="space-y-2 max-h-72 overflow-y-auto">
              <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Mensajes</h4>
              {selected.messages.map((msg, i) => (
                <div key={i} className={cn("text-xs rounded-xl px-3.5 py-2.5 max-w-[85%]",
                  msg.role === "user"
                    ? "ml-auto bg-primary text-primary-foreground"
                    : "bg-secondary/60 text-foreground border border-border/30"
                )}>
                  <p className="text-[9px] opacity-60 mb-0.5">{msg.role === "user" ? "Cliente" : "Asistente"}</p>
                  {msg.parts[0].text}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Insights Tab ─────────────────────────────────────────────────────────────

function InsightsTab({ api }: { api: ReturnType<typeof useAdminAPI> }) {
  const [data, setData] = useState<SalesInsight[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<SalesInsight | null>(null)
  const [creating, setCreating] = useState(false)
  const [form, setForm] = useState({ type: "objection", trigger_phrase: "", best_response: "", context: "", success_rate: 50 })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (data.length > 0) return

    let active = true
    const fetchInsights = async () => {
      setLoading(true)
      const res = await api.get({ resource: "insights" })
      if (!active) return
      setData(res.data ?? [])
      setLoading(false)
    }

    fetchInsights()
    return () => { active = false }
  }, [api, data.length])

  const toggleActive = async (insight: SalesInsight) => {
    await api.patch({ resource: "insight", id: insight.id, active: !insight.active })
    setData((prev) => prev.map((i) => i.id === insight.id ? { ...i, active: !i.active } : i))
  }

  const deleteInsight = async (id: string) => {
    if (!confirm("¿Eliminar este insight?")) return
    await api.del({ resource: "insight", id })
    setData((prev) => prev.filter((i) => i.id !== id))
  }

  const saveInsight = async () => {
    setSaving(true)
    if (editing) {
      const res = await api.patch({ resource: "insight", id: editing.id, ...form })
      setData((prev) => prev.map((i) => i.id === editing.id ? res.data : i))
      setEditing(null)
    } else {
      const res = await api.post({ resource: "insight", ...form })
      setData((prev) => [res.data, ...prev])
      setCreating(false)
    }
    setSaving(false)
    setForm({ type: "objection", trigger_phrase: "", best_response: "", context: "", success_rate: 50 })
  }

  const startEdit = (insight: SalesInsight) => {
    setEditing(insight)
    setCreating(false)
    setForm({
      type: insight.type, trigger_phrase: insight.trigger_phrase,
      best_response: insight.best_response, context: insight.context ?? "", success_rate: insight.success_rate,
    })
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button type="button"
          onClick={() => { setCreating(true); setEditing(null); setForm({ type: "objection", trigger_phrase: "", best_response: "", context: "", success_rate: 50 }) }}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:shadow-lg hover:shadow-primary/25 transition-all"
        >
          <Plus className="w-4 h-4" /> Nuevo Insight
        </button>
      </div>

      {/* Form */}
      {(creating || editing) && (
        <div className="glass-card rounded-xl p-5 space-y-4">
          <h3 className="font-semibold text-sm text-foreground">{editing ? "Editar insight" : "Nuevo insight"}</h3>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1 block">Tipo</label>
              <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}
                className="w-full px-3 py-2 rounded-lg text-sm bg-secondary/50 border border-border/50 text-foreground focus:outline-none focus:border-primary/50">
                {["objection", "pattern", "opener", "closer"].map((t) => (
                  <option key={t} value={t} className="bg-card">{t}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1 block">Éxito estimado (%)</label>
              <input type="number" min="0" max="100" value={form.success_rate}
                onChange={(e) => setForm({ ...form, success_rate: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-lg text-sm bg-secondary/50 border border-border/50 text-foreground focus:outline-none focus:border-primary/50" />
            </div>
          </div>
          <div>
            <label className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1 block">Frase del cliente (trigger)</label>
            <input type="text" value={form.trigger_phrase} onChange={(e) => setForm({ ...form, trigger_phrase: e.target.value })}
              placeholder="ej: es muy caro"
              className="w-full px-3 py-2 rounded-lg text-sm bg-secondary/50 border border-border/50 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50" />
          </div>
          <div>
            <label className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1 block">Mejor respuesta</label>
            <textarea rows={3} value={form.best_response} onChange={(e) => setForm({ ...form, best_response: e.target.value })}
              placeholder="Cómo debe responder el agente..."
              className="w-full px-3 py-2 rounded-lg text-sm bg-secondary/50 border border-border/50 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 resize-none" />
          </div>
          <div>
            <label className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1 block">Contexto (opcional)</label>
            <input type="text" value={form.context} onChange={(e) => setForm({ ...form, context: e.target.value })}
              placeholder="Cuándo aplica este insight"
              className="w-full px-3 py-2 rounded-lg text-sm bg-secondary/50 border border-border/50 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50" />
          </div>
          <div className="flex gap-2 justify-end">
            <button type="button" onClick={() => { setCreating(false); setEditing(null) }}
              className="px-4 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-secondary/60 transition-colors">
              Cancelar
            </button>
            <button type="button" onClick={saveInsight} disabled={saving || !form.trigger_phrase || !form.best_response}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold disabled:opacity-40 hover:shadow-md transition-all">
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              Guardar
            </button>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <div className="space-y-2">
          {data.map((insight) => (
            <div key={insight.id} className={cn("glass-card rounded-xl p-4 transition-opacity", !insight.active && "opacity-50")}>
              <div className="flex items-start gap-3">
                <span className={cn("text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0 mt-0.5", TYPE_COLORS[insight.type])}>
                  {insight.type}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground">"{insight.trigger_phrase}"</p>
                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{insight.best_response}</p>
                  {insight.context && (
                    <p className="text-[11px] text-muted-foreground/60 mt-1 italic">{insight.context}</p>
                  )}
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <div className="text-right">
                    <p className={cn("text-sm font-bold font-display", insight.success_rate >= 70 ? "text-chart-3" : insight.success_rate >= 50 ? "text-chart-4" : "text-muted-foreground")}>
                      {insight.success_rate}%
                    </p>
                    <p className="text-[9px] text-muted-foreground">{insight.usage_count}x usado</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <button type="button" onClick={() => toggleActive(insight)} className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground transition-colors">
                      {insight.active ? <ToggleRight className="w-4 h-4 text-chart-3" /> : <ToggleLeft className="w-4 h-4" />}
                    </button>
                    <button type="button" onClick={() => startEdit(insight)} className="p-1.5 rounded-lg text-muted-foreground hover:text-primary transition-colors">
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button type="button" onClick={() => deleteInsight(insight.id)} className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive transition-colors">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ─── Overrides Tab ────────────────────────────────────────────────────────────

function OverridesTab({ api }: { api: ReturnType<typeof useAdminAPI> }) {
  const [data, setData] = useState<PromptOverride[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<PromptOverride | null>(null)
  const [creating, setCreating] = useState(false)
  const [form, setForm] = useState({ key: "", content: "", priority: 0 })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (data.length > 0) return

    let active = true
    const fetchOverrides = async () => {
      setLoading(true)
      const res = await api.get({ resource: "overrides" })
      if (!active) return
      setData(res.data ?? [])
      setLoading(false)
    }

    fetchOverrides()
    return () => { active = false }
  }, [api, data.length])

  const toggleActive = async (o: PromptOverride) => {
    await api.patch({ resource: "override", id: o.id, active: !o.active })
    setData((prev) => prev.map((item) => item.id === o.id ? { ...item, active: !item.active } : item))
  }

  const deleteOverride = async (id: string) => {
    if (!confirm("¿Eliminar este override?")) return
    await api.del({ resource: "override", id })
    setData((prev) => prev.filter((item) => item.id !== id))
  }

  const saveOverride = async () => {
    setSaving(true)
    if (editing) {
      const res = await api.patch({ resource: "override", id: editing.id, ...form })
      setData((prev) => prev.map((item) => item.id === editing.id ? res.data : item))
      setEditing(null)
    } else {
      const res = await api.post({ resource: "override", ...form })
      setData((prev) => [res.data, ...prev])
      setCreating(false)
    }
    setSaving(false)
    setForm({ key: "", content: "", priority: 0 })
  }

  const startEdit = (o: PromptOverride) => {
    setEditing(o); setCreating(false)
    setForm({ key: o.key, content: o.content, priority: o.priority })
  }

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between gap-4">
        <div className="glass-card rounded-xl p-4 flex-1 text-sm text-muted-foreground leading-relaxed">
          <p className="font-semibold text-foreground text-xs mb-1">¿Qué son los overrides?</p>
          Son instrucciones que se inyectan directamente al system prompt del agente en cada conversación.
          Úsalos para ofertas temporales, contexto de temporada, noticias de la empresa o cualquier instrucción urgente.
        </div>
        <button type="button"
          onClick={() => { setCreating(true); setEditing(null); setForm({ key: "", content: "", priority: 0 }) }}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:shadow-lg hover:shadow-primary/25 transition-all shrink-0"
        >
          <Plus className="w-4 h-4" /> Nuevo Override
        </button>
      </div>

      {(creating || editing) && (
        <div className="glass-card rounded-xl p-5 space-y-4">
          <h3 className="font-semibold text-sm text-foreground">{editing ? "Editar override" : "Nuevo override"}</h3>
          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-2">
              <label className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1 block">Clave única</label>
              <input type="text" value={form.key} onChange={(e) => setForm({ ...form, key: e.target.value })}
                placeholder="ej: special_offer_abril"
                className="w-full px-3 py-2 rounded-lg text-sm bg-secondary/50 border border-border/50 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50" />
            </div>
            <div>
              <label className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1 block">Prioridad</label>
              <input type="number" value={form.priority} onChange={(e) => setForm({ ...form, priority: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-lg text-sm bg-secondary/50 border border-border/50 text-foreground focus:outline-none focus:border-primary/50" />
            </div>
          </div>
          <div>
            <label className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1 block">Instrucción para el agente</label>
            <textarea rows={4} value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })}
              placeholder="Escribe la instrucción exacta que recibirá el agente de ventas..."
              className="w-full px-3 py-2 rounded-lg text-sm bg-secondary/50 border border-border/50 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 resize-none" />
          </div>
          <div className="flex gap-2 justify-end">
            <button type="button" onClick={() => { setCreating(false); setEditing(null) }}
              className="px-4 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-secondary/60 transition-colors">
              Cancelar
            </button>
            <button type="button" onClick={saveOverride} disabled={saving || !form.key || !form.content}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold disabled:opacity-40 hover:shadow-md transition-all">
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              Guardar
            </button>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <div className="space-y-2">
          {data.map((o) => (
            <div key={o.id} className={cn("glass-card rounded-xl p-4 transition-opacity", !o.active && "opacity-50")}>
              <div className="flex items-start gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-[10px] font-mono font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded">{o.key}</span>
                    <span className="text-[10px] text-muted-foreground">prioridad: {o.priority}</span>
                    {!o.active && <span className="text-[10px] text-muted-foreground italic">inactivo</span>}
                  </div>
                  <p className="text-sm text-foreground leading-relaxed">{o.content}</p>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button type="button" onClick={() => toggleActive(o)} className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground transition-colors">
                    {o.active ? <ToggleRight className="w-4 h-4 text-chart-3" /> : <ToggleLeft className="w-4 h-4" />}
                  </button>
                  <button type="button" onClick={() => startEdit(o)} className="p-1.5 rounded-lg text-muted-foreground hover:text-primary transition-colors">
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                  <button type="button" onClick={() => deleteOverride(o.id)} className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive transition-colors">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ─── SEO & Métricas Tab ───────────────────────────────────────────────────────

const fieldInputCls =
  "w-full px-3 py-2 rounded-lg text-sm bg-secondary/50 border border-border/50 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50"

function FieldLabel({ children }: { children: React.ReactNode }) {
  return <label className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1 block">{children}</label>
}

function SeoTab({ api }: { api: ReturnType<typeof useAdminAPI> }) {
  const [settings, setSettings] = useState<SiteSettings | null>(null)
  const [keywordsStr, setKeywordsStr] = useState("")
  const [sameAsStr, setSameAsStr] = useState("")
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    let active = true
    const fetchSeo = async () => {
      setLoading(true)
      setError("")
      try {
        const res = await api.get({ resource: "seo" })
        if (!active) return
        if (res.data) {
          setSettings(res.data)
          setKeywordsStr((res.data.seo.keywords ?? []).join(", "))
          setSameAsStr((res.data.organization.sameAs ?? []).join("\n"))
        } else {
          setError(res.error || "No se pudieron cargar los datos de SEO.")
        }
      } catch {
        if (active) setError("Error de conexión al cargar los datos.")
      } finally {
        if (active) setLoading(false)
      }
    }
    fetchSeo()
    return () => { active = false }
  }, [api])

  const setSeo = <K extends keyof SiteSettings["seo"]>(key: K, value: SiteSettings["seo"][K]) =>
    setSettings((s) => (s ? { ...s, seo: { ...s.seo, [key]: value } } : s))
  const setOrg = <K extends keyof SiteSettings["organization"]>(key: K, value: SiteSettings["organization"][K]) =>
    setSettings((s) => (s ? { ...s, organization: { ...s.organization, [key]: value } } : s))
  const setPixel = <K extends keyof SiteSettings["pixels"]>(key: K, value: SiteSettings["pixels"][K]) =>
    setSettings((s) => (s ? { ...s, pixels: { ...s.pixels, [key]: value } } : s))

  const save = async () => {
    if (!settings) return
    setSaving(true)
    setError("")
    try {
      const payload: SiteSettings = {
        ...settings,
        seo: {
          ...settings.seo,
          keywords: keywordsStr.split(",").map((k) => k.trim()).filter(Boolean),
        },
        organization: {
          ...settings.organization,
          sameAs: sameAsStr.split("\n").map((u) => u.trim()).filter(Boolean),
        },
      }
      const res = await api.patch({ resource: "seo", data: payload })
      if (res.data) {
        setSettings(res.data)
        setSaved(true)
        setTimeout(() => setSaved(false), 2500)
      } else {
        setError(res.error || "No se pudo guardar.")
      }
    } catch {
      setError("Ocurrió un error inesperado al guardar.")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (!settings) {
    return (
      <div className="glass-card rounded-xl p-6 text-center space-y-3">
        <p className="text-sm text-destructive">{error || "No se pudieron cargar los datos de SEO."}</p>
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-semibold hover:shadow-md transition-all"
        >
          Recargar página
        </button>
      </div>
    )
  }

  const { seo, organization: org, pixels } = settings

  return (
    <div className="space-y-4">
      <div className="glass-card rounded-xl p-4 text-sm text-muted-foreground leading-relaxed">
        <p className="font-semibold text-foreground text-xs mb-1">Configuración global del sitio</p>
        Cambios en SEO, datos de la organización (rich snippets) y pixels de medición. Se aplican a
        todo el sitio al guardar — la metadata, el sitemap y los scripts de analítica se regeneran automáticamente.
      </div>

      {/* ── SEO general ── */}
      <div className="glass-card rounded-xl p-5 space-y-4">
        <h3 className="flex items-center gap-2 font-semibold text-sm text-foreground">
          <Search className="w-4 h-4 text-primary" /> SEO general
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <FieldLabel>Nombre del sitio</FieldLabel>
            <input className={fieldInputCls} value={seo.siteName} onChange={(e) => setSeo("siteName", e.target.value)} />
          </div>
          <div>
            <FieldLabel>URL canónica base</FieldLabel>
            <input className={fieldInputCls} value={seo.canonicalBase} onChange={(e) => setSeo("canonicalBase", e.target.value)} placeholder="https://startbyglobal.com" />
          </div>
        </div>
        <div>
          <FieldLabel>Título por defecto</FieldLabel>
          <input className={fieldInputCls} value={seo.titleDefault} onChange={(e) => setSeo("titleDefault", e.target.value)} />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <FieldLabel>Plantilla de título (%s = título de página)</FieldLabel>
            <input className={fieldInputCls} value={seo.titleTemplate} onChange={(e) => setSeo("titleTemplate", e.target.value)} placeholder="%s | Start By Global" />
          </div>
          <div>
            <FieldLabel>Idioma (locale)</FieldLabel>
            <input className={fieldInputCls} value={seo.locale} onChange={(e) => setSeo("locale", e.target.value)} placeholder="es_DO" />
          </div>
        </div>
        <div>
          <FieldLabel>Meta descripción</FieldLabel>
          <textarea rows={2} className={cn(fieldInputCls, "resize-none")} value={seo.description} onChange={(e) => setSeo("description", e.target.value)} />
        </div>
        <div>
          <FieldLabel>Palabras clave (separadas por coma)</FieldLabel>
          <input className={fieldInputCls} value={keywordsStr} onChange={(e) => setKeywordsStr(e.target.value)} placeholder="marketing digital, desarrollo web, SEO" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <FieldLabel>Imagen Open Graph por defecto</FieldLabel>
            <input className={fieldInputCls} value={seo.defaultOgImage} onChange={(e) => setSeo("defaultOgImage", e.target.value)} placeholder="/og-image.jpg" />
          </div>
          <div>
            <FieldLabel>Handle de Twitter/X</FieldLabel>
            <input className={fieldInputCls} value={seo.twitterHandle} onChange={(e) => setSeo("twitterHandle", e.target.value)} placeholder="@startbyglobal" />
          </div>
        </div>
        <button
          type="button"
          onClick={() => setSeo("indexable", !seo.indexable)}
          className="flex items-center gap-2 text-sm text-foreground"
        >
          {seo.indexable ? <ToggleRight className="w-5 h-5 text-chart-3" /> : <ToggleLeft className="w-5 h-5 text-muted-foreground" />}
          <span>Permitir indexación por buscadores {seo.indexable ? "(activado)" : "(bloqueado: noindex + robots disallow)"}</span>
        </button>
      </div>

      {/* ── Organización / JSON-LD ── */}
      <div className="glass-card rounded-xl p-5 space-y-4">
        <h3 className="flex items-center gap-2 font-semibold text-sm text-foreground">
          <Building2 className="w-4 h-4 text-primary" /> Organización (datos estructurados)
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <FieldLabel>Nombre</FieldLabel>
            <input className={fieldInputCls} value={org.name} onChange={(e) => setOrg("name", e.target.value)} />
          </div>
          <div>
            <FieldLabel>Razón social (legal)</FieldLabel>
            <input className={fieldInputCls} value={org.legalName} onChange={(e) => setOrg("legalName", e.target.value)} />
          </div>
          <div>
            <FieldLabel>Email</FieldLabel>
            <input className={fieldInputCls} value={org.email} onChange={(e) => setOrg("email", e.target.value)} />
          </div>
          <div>
            <FieldLabel>Teléfono</FieldLabel>
            <input className={fieldInputCls} value={org.telephone} onChange={(e) => setOrg("telephone", e.target.value)} placeholder="+18493562247" />
          </div>
          <div>
            <FieldLabel>Logo (URL o ruta)</FieldLabel>
            <input className={fieldInputCls} value={org.logo} onChange={(e) => setOrg("logo", e.target.value)} />
          </div>
          <div>
            <FieldLabel>Ciudad</FieldLabel>
            <input className={fieldInputCls} value={org.city} onChange={(e) => setOrg("city", e.target.value)} />
          </div>
          <div>
            <FieldLabel>Calle / dirección</FieldLabel>
            <input className={fieldInputCls} value={org.streetAddress} onChange={(e) => setOrg("streetAddress", e.target.value)} />
          </div>
          <div>
            <FieldLabel>Región / provincia</FieldLabel>
            <input className={fieldInputCls} value={org.region} onChange={(e) => setOrg("region", e.target.value)} />
          </div>
          <div>
            <FieldLabel>Código postal</FieldLabel>
            <input className={fieldInputCls} value={org.postalCode} onChange={(e) => setOrg("postalCode", e.target.value)} />
          </div>
          <div>
            <FieldLabel>País (código ISO)</FieldLabel>
            <input className={fieldInputCls} value={org.country} onChange={(e) => setOrg("country", e.target.value)} placeholder="DO" />
          </div>
        </div>
        <div>
          <FieldLabel>Perfiles sociales (sameAs — una URL por línea)</FieldLabel>
          <textarea rows={3} className={cn(fieldInputCls, "resize-none")} value={sameAsStr} onChange={(e) => setSameAsStr(e.target.value)} placeholder={"https://www.instagram.com/startbyglobal/\nhttps://www.linkedin.com/company/..."} />
        </div>
      </div>

      {/* ── Pixels & Métricas ── */}
      <div className="glass-card rounded-xl p-5 space-y-4">
        <h3 className="flex items-center gap-2 font-semibold text-sm text-foreground">
          <Activity className="w-4 h-4 text-primary" /> Pixels & Métricas
        </h3>
        <p className="text-xs text-muted-foreground -mt-2">Deja un campo vacío para no cargar ese script.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <FieldLabel>Google Analytics 4 (G-XXXX)</FieldLabel>
            <input className={fieldInputCls} value={pixels.ga4Id} onChange={(e) => setPixel("ga4Id", e.target.value)} placeholder="G-XXXXXXX" />
          </div>
          <div>
            <FieldLabel>Google Tag Manager (GTM-XXXX)</FieldLabel>
            <input className={fieldInputCls} value={pixels.gtmId} onChange={(e) => setPixel("gtmId", e.target.value)} placeholder="GTM-XXXXXX" />
          </div>
          <div>
            <FieldLabel>Meta (Facebook) Pixel ID</FieldLabel>
            <input className={fieldInputCls} value={pixels.metaPixelId} onChange={(e) => setPixel("metaPixelId", e.target.value)} placeholder="1376104130939852" />
          </div>
          <div>
            <FieldLabel>TikTok Pixel ID</FieldLabel>
            <input className={fieldInputCls} value={pixels.tiktokPixelId} onChange={(e) => setPixel("tiktokPixelId", e.target.value)} />
          </div>
          <div>
            <FieldLabel>Microsoft Clarity ID</FieldLabel>
            <input className={fieldInputCls} value={pixels.clarityId} onChange={(e) => setPixel("clarityId", e.target.value)} placeholder="92s8orl5ov" />
          </div>
          <div>
            <FieldLabel>Google Search Console (verificación)</FieldLabel>
            <input className={fieldInputCls} value={pixels.googleSiteVerification} onChange={(e) => setPixel("googleSiteVerification", e.target.value)} />
          </div>
        </div>
      </div>

      {/* Acciones */}
      <div className="flex items-center justify-end gap-3 sticky bottom-4">
        {error && <span className="text-xs text-destructive">{error}</span>}
        {saved && <span className="flex items-center gap-1 text-xs text-chart-3"><CheckCircle2 className="w-3.5 h-3.5" /> Guardado</span>}
        <button
          type="button"
          onClick={save}
          disabled={saving}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold disabled:opacity-40 hover:shadow-lg hover:shadow-primary/25 transition-all"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Guardar cambios
        </button>
      </div>
    </div>
  )
}

// ─── Atribución Tab ───────────────────────────────────────────────────────────

interface AttributionStats {
  total: number
  total_leads: number
  total_contacts: number
  by_channel: Record<string, number>
  by_source: Record<string, number>
  by_variant: Record<string, number>
  by_segment: Record<string, number>
  top_campaigns: Array<{ campaign: string; count: number }>
  recent: Array<{
    event_name: string
    source_type: string
    channel: string
    email: string | null
    name: string | null
    utm_campaign: string | null
    capi_status: string | null
    created_at: string
  }>
  days: number
}

const CHANNEL_META: Record<string, { label: string; color: string }> = {
  organic: { label: "Orgánico", color: "bg-chart-3" },
  paid: { label: "Ads / Pago", color: "bg-primary" },
  referral: { label: "Referido", color: "bg-chart-2" },
  direct: { label: "Directo", color: "bg-chart-4" },
  unknown: { label: "Desconocido", color: "bg-muted-foreground" },
}

const SOURCE_LABELS: Record<string, string> = {
  contact_form: "Formulario",
  chat_email: "Chat (email)",
  whatsapp: "WhatsApp",
}

const SEGMENT_LABELS: Record<string, string> = {
  sin_presencia: "Sin presencia digital",
  web_no_genera: "Web que no vende",
  outsourcing: "Outsourcing / agencias",
  hero_cta: "Hero (CTA principal)",
  nav: "Navegación",
  form: "Formulario",
}

function AttributionTab({ api }: { api: ReturnType<typeof useAdminAPI> }) {
  const [stats, setStats] = useState<AttributionStats | null>(null)
  const [days, setDays] = useState(30)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    let active = true
    const fetchStats = async () => {
      setLoading(true)
      setError("")
      try {
        const res = await api.get({ resource: "attribution", days: String(days) })
        if (!active) return
        if (res.data) setStats(res.data)
        else setError(res.error || "No se pudieron cargar los datos.")
      } catch {
        if (active) setError("Error de conexión.")
      } finally {
        if (active) setLoading(false)
      }
    }
    fetchStats()
    return () => { active = false }
  }, [api, days])

  const channelTotal = stats ? Object.values(stats.by_channel).reduce((a, b) => a + b, 0) : 0

  return (
    <div className="space-y-4">
      {/* Rango de fechas */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <p className="text-xs text-muted-foreground">
          Atribución de leads y contactos por canal y campaña (modelo first-touch).
        </p>
        <div className="flex gap-1 p-1 bg-secondary/40 rounded-lg">
          {[7, 30, 90].map((d) => (
            <button
              key={d}
              type="button"
              onClick={() => setDays(d)}
              className={cn(
                "px-3 py-1 rounded-md text-xs font-medium transition-all",
                days === d ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
              )}
            >
              {d}d
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        </div>
      ) : error ? (
        <div className="glass-card rounded-xl p-6 text-center text-sm text-destructive">{error}</div>
      ) : stats ? (
        <>
          {/* Tarjetas resumen */}
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: "Eventos totales", value: stats.total, icon: Activity, color: "text-chart-2" },
              { label: "Leads", value: stats.total_leads, icon: TrendingUp, color: "text-chart-3" },
              { label: "Contactos", value: stats.total_contacts, icon: Mail, color: "text-primary" },
            ].map((c) => {
              const Icon = c.icon
              return (
                <div key={c.label} className="glass-card rounded-xl p-4 flex items-center gap-3">
                  <div className={cn("flex items-center justify-center w-10 h-10 rounded-lg bg-secondary/60", c.color)}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-display text-xl font-bold text-foreground">{c.value}</p>
                    <p className="text-[10px] text-muted-foreground">{c.label}</p>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Desglose por canal */}
          <div className="glass-card rounded-xl p-5">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
              Por canal
            </p>
            {channelTotal === 0 ? (
              <p className="text-xs text-muted-foreground italic">Sin datos en este rango.</p>
            ) : (
              <div className="space-y-2.5">
                {Object.entries(stats.by_channel)
                  .sort((a, b) => b[1] - a[1])
                  .map(([channel, count]) => {
                    const meta = CHANNEL_META[channel] ?? CHANNEL_META.unknown
                    const pct = Math.round((count / channelTotal) * 100)
                    return (
                      <div key={channel}>
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="font-medium text-foreground">{meta.label}</span>
                          <span className="text-muted-foreground">{count} ({pct}%)</span>
                        </div>
                        <div className="h-2 rounded-full bg-secondary overflow-hidden">
                          <div className={cn("h-full rounded-full transition-all", meta.color)} style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                    )
                  })}
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Por fuente */}
            <div className="glass-card rounded-xl p-5">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Por fuente</p>
              {Object.keys(stats.by_source).length === 0 ? (
                <p className="text-xs text-muted-foreground italic">Sin datos.</p>
              ) : (
                <div className="space-y-2">
                  {Object.entries(stats.by_source).sort((a, b) => b[1] - a[1]).map(([src, count]) => (
                    <div key={src} className="flex items-center justify-between text-sm">
                      <span className="text-foreground">{SOURCE_LABELS[src] ?? src}</span>
                      <span className="text-muted-foreground">{count}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Top campañas */}
            <div className="glass-card rounded-xl p-5">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Top campañas (UTM)</p>
              {stats.top_campaigns.length === 0 ? (
                <p className="text-xs text-muted-foreground italic">Sin campañas etiquetadas.</p>
              ) : (
                <div className="space-y-2">
                  {stats.top_campaigns.map((c) => (
                    <div key={c.campaign} className="flex items-center justify-between text-sm">
                      <span className="text-foreground truncate mr-2">{c.campaign}</span>
                      <span className="text-muted-foreground shrink-0">{c.count}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* A/B de navegación y caminos del hero */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="glass-card rounded-xl p-5">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Por variante (A/B nav)</p>
              {Object.keys(stats.by_variant).length === 0 ? (
                <p className="text-xs text-muted-foreground italic">Sin datos.</p>
              ) : (
                <div className="space-y-2">
                  {Object.entries(stats.by_variant).sort((a, b) => b[1] - a[1]).map(([v, count]) => (
                    <div key={v} className="flex items-center justify-between text-sm">
                      <span className="text-foreground">{v === "a" ? "A · Sidebar" : v === "b" ? "B · Nav horizontal" : v}</span>
                      <span className="text-muted-foreground">{count}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="glass-card rounded-xl p-5">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Por camino (segmento)</p>
              {Object.keys(stats.by_segment).length === 0 ? (
                <p className="text-xs text-muted-foreground italic">Sin datos.</p>
              ) : (
                <div className="space-y-2">
                  {Object.entries(stats.by_segment).sort((a, b) => b[1] - a[1]).map(([s, count]) => (
                    <div key={s} className="flex items-center justify-between text-sm">
                      <span className="text-foreground">{SEGMENT_LABELS[s] ?? s}</span>
                      <span className="text-muted-foreground">{count}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Eventos recientes */}
          <div className="glass-card rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/50 bg-secondary/30">
                  {["Fecha", "Evento", "Canal", "Fuente", "Campaña", "CAPI"].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-[11px] uppercase tracking-wider text-muted-foreground font-medium">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {stats.recent.length === 0 ? (
                  <tr><td colSpan={6} className="px-4 py-6 text-center text-xs text-muted-foreground italic">Aún no hay eventos registrados.</td></tr>
                ) : stats.recent.map((r, i) => {
                  const meta = CHANNEL_META[r.channel] ?? CHANNEL_META.unknown
                  return (
                    <tr key={i} className="border-b border-border/30 hover:bg-secondary/20 transition-colors">
                      <td className="px-4 py-2.5 text-xs text-muted-foreground whitespace-nowrap">
                        {new Date(r.created_at).toLocaleDateString("es-DO", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}
                      </td>
                      <td className="px-4 py-2.5 text-xs text-foreground">{r.event_name}</td>
                      <td className="px-4 py-2.5">
                        <span className="inline-flex items-center gap-1.5 text-xs text-foreground">
                          <span className={cn("w-2 h-2 rounded-full", meta.color)} />{meta.label}
                        </span>
                      </td>
                      <td className="px-4 py-2.5 text-xs text-muted-foreground">{SOURCE_LABELS[r.source_type] ?? r.source_type}</td>
                      <td className="px-4 py-2.5 text-xs text-muted-foreground truncate max-w-[140px]">{r.utm_campaign ?? "—"}</td>
                      <td className="px-4 py-2.5">
                        <span className={cn("text-[10px] font-medium px-1.5 py-0.5 rounded",
                          r.capi_status === "sent" ? "text-chart-3 bg-chart-3/10"
                          : r.capi_status === "error" ? "text-destructive bg-destructive/10"
                          : "text-muted-foreground bg-secondary/60")}>
                          {r.capi_status ?? "—"}
                        </span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </>
      ) : null}
    </div>
  )
}

// ─── Blog / Orgánico Tab ──────────────────────────────────────────────────────

interface ArticleStat {
  slug: string
  views: number
  sessions: number
  read_complete: number
  avg_engaged: number
  cta_clicks: number
  shares: number
  conversions: number
  top_channel: string
}

interface BlogStats {
  total_views: number
  total_cta: number
  total_shares: number
  total_conversions: number
  articles: ArticleStat[]
  days: number
}

interface GscRow {
  query: string
  clicks: number
  impressions: number
  ctr: number
  position: number
}

const ARTICLE_TITLES: Record<string, string> = Object.fromEntries(
  Object.entries(blogPostsData).map(([slug, p]) => [slug, p.title])
)

function fmtTime(seconds: number): string {
  if (!seconds) return "0s"
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return m > 0 ? `${m}m ${s}s` : `${s}s`
}

function BlogTab({ api }: { api: ReturnType<typeof useAdminAPI> }) {
  const [stats, setStats] = useState<BlogStats | null>(null)
  const [gscOn, setGscOn] = useState(false)
  const [days, setDays] = useState(30)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  // GSC drilldown
  const [gscSlug, setGscSlug] = useState<string | null>(null)
  const [gscRows, setGscRows] = useState<GscRow[]>([])
  const [gscLoading, setGscLoading] = useState(false)
  const [gscMsg, setGscMsg] = useState("")

  useEffect(() => {
    let active = true
    const fetchStats = async () => {
      setLoading(true)
      setError("")
      try {
        const res = await api.get({ resource: "blog", days: String(days) })
        if (!active) return
        if (res.data) { setStats(res.data); setGscOn(Boolean(res.gsc)) }
        else setError(res.error || "No se pudieron cargar los datos.")
      } catch {
        if (active) setError("Error de conexión.")
      } finally {
        if (active) setLoading(false)
      }
    }
    fetchStats()
    return () => { active = false }
  }, [api, days])

  const openGsc = async (slug: string) => {
    setGscSlug(slug)
    setGscRows([])
    setGscMsg("")
    setGscLoading(true)
    try {
      const res = await api.get({ resource: "gsc", slug, days: String(days) })
      const d = res.data
      if (!d || d.configured === false) {
        setGscMsg("Search Console no está configurado. Añade GSC_SERVICE_ACCOUNT_JSON y GSC_SITE_URL en el entorno.")
      } else if (d.rows?.length) {
        setGscRows(d.rows)
      } else {
        setGscMsg("Sin datos de keywords para este artículo en el rango seleccionado.")
      }
    } catch {
      setGscMsg("Error al consultar Search Console.")
    } finally {
      setGscLoading(false)
    }
  }

  const exportCsv = () => {
    if (!stats) return
    const header = ["Artículo", "slug", "Vistas", "Sesiones", "Leyeron completo", "Tiempo medio (s)", "CTAs", "Compartidos", "Conversiones", "Tasa conversión %", "Canal top"]
    const lines = stats.articles.map((a) => [
      `"${(ARTICLE_TITLES[a.slug] ?? a.slug).replace(/"/g, '""')}"`,
      a.slug, a.views, a.sessions, a.read_complete, a.avg_engaged, a.cta_clicks, a.shares, a.conversions,
      a.sessions ? ((a.conversions / a.sessions) * 100).toFixed(1) : "0", a.top_channel,
    ].join(","))
    const csv = [header.join(","), ...lines].join("\n")
    const blob = new Blob([`﻿${csv}`], { type: "text/csv;charset=utf-8" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `blog-organico-${days}d.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <p className="text-xs text-muted-foreground">
          Rendimiento orgánico de los artículos: vistas, profundidad de lectura, tiempo, CTAs, compartidos y conversiones atribuidas.
        </p>
        <div className="flex items-center gap-2">
          <button type="button" onClick={exportCsv} disabled={!stats?.articles.length}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-secondary/60 disabled:opacity-40 transition-colors">
            <Download className="w-3.5 h-3.5" /> CSV
          </button>
          <div className="flex gap-1 p-1 bg-secondary/40 rounded-lg">
            {[7, 30, 90].map((d) => (
              <button key={d} type="button" onClick={() => setDays(d)}
                className={cn("px-3 py-1 rounded-md text-xs font-medium transition-all",
                  days === d ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground")}>
                {d}d
              </button>
            ))}
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        </div>
      ) : error ? (
        <div className="glass-card rounded-xl p-6 text-center text-sm text-destructive">{error}</div>
      ) : stats ? (
        <>
          {/* Tarjetas resumen */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: "Vistas totales", value: stats.total_views, icon: Eye, color: "text-chart-2" },
              { label: "Clics a CTA", value: stats.total_cta, icon: MousePointerClick, color: "text-primary" },
              { label: "Compartidos", value: stats.total_shares, icon: Share2, color: "text-chart-4" },
              { label: "Conversiones", value: stats.total_conversions, icon: TrendingUp, color: "text-chart-3" },
            ].map((c) => {
              const Icon = c.icon
              return (
                <div key={c.label} className="glass-card rounded-xl p-4 flex items-center gap-3">
                  <div className={cn("flex items-center justify-center w-10 h-10 rounded-lg bg-secondary/60", c.color)}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-display text-xl font-bold text-foreground">{c.value}</p>
                    <p className="text-[10px] text-muted-foreground">{c.label}</p>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Tabla por artículo */}
          <div className="glass-card rounded-xl overflow-x-auto">
            <table className="w-full text-sm min-w-[820px]">
              <thead>
                <tr className="border-b border-border/50 bg-secondary/30">
                  {["Artículo", "Vistas", "Sesiones", "Leído", "T. medio", "CTA", "Comp.", "Conv.", "CR", "Canal", ""].map((h) => (
                    <th key={h} className="px-3 py-3 text-left text-[11px] uppercase tracking-wider text-muted-foreground font-medium whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {stats.articles.length === 0 ? (
                  <tr><td colSpan={11} className="px-4 py-6 text-center text-xs text-muted-foreground italic">Aún no hay datos de tráfico orgánico.</td></tr>
                ) : stats.articles.map((a) => {
                  const readRate = a.views ? Math.round((a.read_complete / a.views) * 100) : 0
                  const convRate = a.sessions ? (a.conversions / a.sessions) * 100 : 0
                  const meta = CHANNEL_META[a.top_channel] ?? null
                  return (
                    <tr key={a.slug} className="border-b border-border/30 hover:bg-secondary/20 transition-colors">
                      <td className="px-3 py-2.5 max-w-[260px]">
                        <p className="text-xs font-medium text-foreground truncate">{ARTICLE_TITLES[a.slug] ?? a.slug}</p>
                        <p className="text-[10px] text-muted-foreground truncate">/{a.slug}</p>
                      </td>
                      <td className="px-3 py-2.5 text-xs text-foreground">{a.views}</td>
                      <td className="px-3 py-2.5 text-xs text-muted-foreground">{a.sessions}</td>
                      <td className="px-3 py-2.5 text-xs">
                        <span className={cn(readRate >= 50 ? "text-chart-3" : readRate >= 25 ? "text-chart-4" : "text-muted-foreground")}>
                          {readRate}%
                        </span>
                      </td>
                      <td className="px-3 py-2.5 text-xs text-muted-foreground whitespace-nowrap">{fmtTime(a.avg_engaged)}</td>
                      <td className="px-3 py-2.5 text-xs text-foreground">{a.cta_clicks}</td>
                      <td className="px-3 py-2.5 text-xs text-foreground">{a.shares}</td>
                      <td className="px-3 py-2.5 text-xs">
                        <span className={cn("font-semibold", a.conversions > 0 ? "text-chart-3" : "text-muted-foreground")}>{a.conversions}</span>
                      </td>
                      <td className="px-3 py-2.5 text-xs">
                        <span className={cn(convRate >= 2 ? "text-chart-3 font-semibold" : convRate > 0 ? "text-chart-4" : "text-muted-foreground")}>
                          {convRate.toFixed(1)}%
                        </span>
                      </td>
                      <td className="px-3 py-2.5">
                        {meta
                          ? <span className="inline-flex items-center gap-1.5 text-xs text-foreground"><span className={cn("w-2 h-2 rounded-full", meta.color)} />{meta.label}</span>
                          : <span className="text-xs text-muted-foreground">{a.top_channel}</span>}
                      </td>
                      <td className="px-3 py-2.5">
                        <button type="button" onClick={() => openGsc(a.slug)} title="Keywords (Search Console)"
                          className="p-1.5 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors">
                          <Search className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {!gscOn && (
            <p className="text-[11px] text-muted-foreground flex items-center gap-1.5">
              <Target className="w-3.5 h-3.5" />
              Search Console no configurado — añade <code className="text-foreground">GSC_SERVICE_ACCOUNT_JSON</code> y <code className="text-foreground">GSC_SITE_URL</code> para ver keywords y posiciones.
            </p>
          )}
        </>
      ) : null}

      {/* GSC keyword modal */}
      {gscSlug && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-start justify-center p-4 pt-16 overflow-y-auto"
          onClick={() => setGscSlug(null)}>
          <div className="w-full max-w-2xl glass-card rounded-2xl p-6 space-y-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <h3 className="font-display font-bold text-foreground flex items-center gap-2"><Search className="w-4 h-4 text-primary" /> Keywords en Google</h3>
                <p className="text-xs text-muted-foreground truncate">{ARTICLE_TITLES[gscSlug] ?? gscSlug}</p>
              </div>
              <button type="button" onClick={() => setGscSlug(null)}>
                <X className="w-5 h-5 text-muted-foreground hover:text-foreground" />
              </button>
            </div>

            {gscLoading ? (
              <div className="flex items-center justify-center py-10"><Loader2 className="w-6 h-6 animate-spin text-muted-foreground" /></div>
            ) : gscMsg ? (
              <p className="text-sm text-muted-foreground text-center py-6">{gscMsg}</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border/50 bg-secondary/30">
                      {["Consulta", "Pos.", "Clics", "Impr.", "CTR"].map((h) => (
                        <th key={h} className="px-3 py-2 text-left text-[11px] uppercase tracking-wider text-muted-foreground font-medium">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {gscRows.map((r, i) => (
                      <tr key={i} className="border-b border-border/30">
                        <td className="px-3 py-2 text-xs text-foreground max-w-[260px] truncate">{r.query}</td>
                        <td className="px-3 py-2 text-xs">
                          <span className={cn("font-semibold", r.position <= 3 ? "text-chart-3" : r.position <= 10 ? "text-chart-4" : "text-muted-foreground")}>
                            {r.position.toFixed(1)}
                          </span>
                        </td>
                        <td className="px-3 py-2 text-xs text-foreground">{r.clicks}</td>
                        <td className="px-3 py-2 text-xs text-muted-foreground">{r.impressions}</td>
                        <td className="px-3 py-2 text-xs text-muted-foreground">{(r.ctr * 100).toFixed(1)}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Main Dashboard ───────────────────────────────────────────────────────────

export default function AdminDashboard() {
  const [password, setPassword] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<"conversations" | "insights" | "overrides" | "seo" | "attribution" | "blog">("conversations")
  const [stats, setStats] = useState<Stats | null>(null)
  const [loadingStats, setLoadingStats] = useState(false)

  const api = useAdminAPI(password ?? "")

  const loadStats = useCallback(async () => {
    if (!password) return
    setLoadingStats(true)
    const res = await api.get({ resource: "stats" })
    setStats(res)
    setLoadingStats(false)
  }, [password, api])

  useEffect(() => { if (password) loadStats() }, [password, loadStats])

  if (!password) {
    return <LoginScreen onLogin={(pw) => setPassword(pw)} />
  }

  const tabs = [
    { id: "conversations" as const, label: "Conversaciones", icon: MessageSquare },
    { id: "insights" as const, label: "Insights IA", icon: Lightbulb },
    { id: "overrides" as const, label: "Prompt Overrides", icon: Settings },
    { id: "seo" as const, label: "SEO & Métricas", icon: Search },
    { id: "attribution" as const, label: "Atribución", icon: Megaphone },
    { id: "blog" as const, label: "Blog / Orgánico", icon: FileText },
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border/50 bg-background/90 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10">
              <BarChart3 className="w-4 h-4 text-primary" />
            </div>
            <div>
              <p className="text-sm font-bold text-foreground font-display">Chat Intelligence</p>
              <p className="text-[10px] text-muted-foreground">Start By Global Admin</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button type="button" onClick={loadStats} disabled={loadingStats}
              className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary/60 transition-colors">
              <RefreshCw className={cn("w-4 h-4", loadingStats && "animate-spin")} />
            </button>
            <button type="button" onClick={() => setPassword(null)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs text-muted-foreground hover:text-foreground hover:bg-secondary/60 transition-colors">
              <LogOut className="w-3.5 h-3.5" />
              Salir
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Stats */}
        {stats && <StatsBar stats={stats} />}

        {/* Intent distribution */}
        {stats && (
          <div className="glass-card rounded-xl p-4">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Distribución de intención</p>
            <div className="flex gap-3">
              {(["low", "medium", "high"] as const).map((level) => {
                const count = stats.intent_distribution[level]
                const total = Object.values(stats.intent_distribution).reduce((a, b) => a + b, 0)
                const pct = total > 0 ? Math.round((count / total) * 100) : 0
                return (
                  <div key={level} className="flex-1">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className={cn("font-medium", INTENT_COLORS[level].split(" ")[0])}>{INTENT_LABELS[level]}</span>
                      <span className="text-muted-foreground">{count} ({pct}%)</span>
                    </div>
                    <div className="h-2 rounded-full bg-secondary overflow-hidden">
                      <div className="h-full rounded-full bg-primary transition-all"
                        style={{ width: `${pct}%`, opacity: level === "high" ? 1 : level === "medium" ? 0.6 : 0.3 }} />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-1 p-1 bg-secondary/40 rounded-xl w-fit">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all",
                  activeTab === tab.id
                    ? "bg-card text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            )
          })}
        </div>

        {/* Tab content */}
        {activeTab === "conversations" && <ConversationsTab api={api} />}
        {activeTab === "insights" && <InsightsTab api={api} />}
        {activeTab === "overrides" && <OverridesTab api={api} />}
        {activeTab === "seo" && <SeoTab api={api} />}
        {activeTab === "attribution" && <AttributionTab api={api} />}
        {activeTab === "blog" && <BlogTab api={api} />}
      </main>
    </div>
  )
}