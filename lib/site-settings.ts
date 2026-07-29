import { cache } from "react"
import { supabaseAdmin } from "@/lib/supabase"

// ─── Types ────────────────────────────────────────────────────────────────────

export interface SeoSettings {
  siteName: string
  titleDefault: string
  titleTemplate: string
  description: string
  keywords: string[]
  canonicalBase: string
  defaultOgImage: string
  twitterHandle: string
  locale: string
  indexable: boolean
}

export interface OrganizationSettings {
  name: string
  legalName: string
  logo: string
  email: string
  telephone: string
  sameAs: string[]
  streetAddress: string
  city: string
  region: string
  postalCode: string
  country: string
}

export interface PixelSettings {
  ga4Id: string
  gtmId: string
  metaPixelId: string
  clarityId: string
  tiktokPixelId: string
  googleSiteVerification: string
}

export interface AiScheduleSettings {
  // Días (UTC, 0=domingo … 6=sábado) en que cada rutina actúa, y cuántos
  // artículos procesa por ejecución. Los crons corren a diario 06:00 UTC pero
  // solo actúan si el día está en la lista. Lista vacía = rutina desactivada.
  improveDays: number[]
  improveCount: number
  createDays: number[]
  createCount: number
}

export interface AiSettings {
  // Proveedor activo para las rutinas de contenido (mejorar/proponer/generar).
  provider: "claude" | "gemini"
  schedule: AiScheduleSettings
  // Directrices de estilo/SEO editables que se añaden al prompt base de cada
  // rutina (además de las reglas fijas de formato HTML).
  improvePrompt: string
  createPrompt: string
  // Directriz de estilo visual para la imagen destacada generada con IA. Se
  // inserta en el prompt de imagen; las garantías (sin texto, 16:9) son fijas.
  imagePrompt: string
}

export const DEFAULT_IMPROVE_PROMPT =
  "Aplica las mejores prácticas de SEO y contenido orgánico. Escribe original y específico: ejemplos concretos, datos y casos del mercado hispano (RD, España, LatAm). Refuerza E-E-A-T. Evita muletillas y clichés típicos de IA como \"En conclusión\", \"En resumen\", \"En el mundo actual\", \"En la era digital\" o cierres genéricos vacíos; termina con algo útil (pasos accionables, checklist o preguntas frecuentes). Cuando recomiendes otro artículo del blog, ponlo en un párrafo propio con el enlace a /insights/… (se mostrará como bloque destacado)."

export const DEFAULT_CREATE_PROMPT =
  "Aplica las mejores prácticas de SEO y contenido orgánico: intención de búsqueda clara, encabezados escaneables, ejemplos concretos y datos del mercado hispano (RD, España, LatAm), y enlaces internos naturales. Escribe original y con voz propia; evita clichés de IA como \"En conclusión\", \"En resumen\", \"En el mundo actual\", \"En la era digital\" y los cierres genéricos. Termina con una sección práctica (pasos, checklist o FAQ), no con una conclusión de relleno. Cuando recomiendes otro artículo del blog, ponlo en un párrafo propio con el enlace a /insights/…."

export const DEFAULT_IMAGE_PROMPT =
  "Ilustración editorial moderna, limpia y minimalista, con gradientes suaves y sensación de profundidad. Paleta cálida de naranjas y corales sobre un fondo neutro claro. Estilo profesional, nítido y de alta calidad, adecuado como portada de artículo."

export interface SiteSettings {
  seo: SeoSettings
  organization: OrganizationSettings
  pixels: PixelSettings
  ai: AiSettings
}

// ─── Defaults ───────────────────────────────────────────────────────────────
// Se usan cuando la tabla aún no existe o Supabase falla, para que el sitio
// nunca se quede sin metadata. Reflejan los valores actuales del código.

export const DEFAULT_SETTINGS: SiteSettings = {
  seo: {
    siteName: "Start By Global",
    titleDefault: "Start By Global | Soluciones Web & Marketing Digital",
    titleTemplate: "%s | Start By Global",
    description:
      "Agencia de marketing digital con presencia en Rep. Dominicana, España, Latinoamérica y EE.UU. Soluciones web innovadoras para impulsar tu negocio.",
    keywords: ["marketing digital", "desarrollo web", "SEO", "Rep. Dominicana", "agencia digital"],
    canonicalBase: "https://startbyglobal.com",
    defaultOgImage: "/logo-black.svg",
    twitterHandle: "",
    locale: "es_DO",
    indexable: true,
  },
  organization: {
    name: "Start By Global",
    legalName: "Start By Global",
    logo: "/logo-black.svg",
    email: "info@startbyglobal.com",
    telephone: "+18493562247",
    sameAs: ["https://www.instagram.com/startbyglobal/"],
    streetAddress: "",
    city: "Santo Domingo",
    region: "",
    postalCode: "",
    country: "DO",
  },
  pixels: {
    ga4Id: process.env.NEXT_PUBLIC_GA_ID ?? "",
    gtmId: "",
    metaPixelId: "",
    clarityId: "",
    tiktokPixelId: "",
    googleSiteVerification: "",
  },
  ai: {
    provider: "claude",
    schedule: {
      improveDays: [1], // lunes
      improveCount: 1,
      createDays: [4], // jueves
      createCount: 1,
    },
    improvePrompt: DEFAULT_IMPROVE_PROMPT,
    createPrompt: DEFAULT_CREATE_PROMPT,
    imagePrompt: DEFAULT_IMAGE_PROMPT,
  },
}

// ─── Merge ──────────────────────────────────────────────────────────────────
// Combina datos parciales guardados sobre los defaults, sección por sección,
// para tolerar settings incompletos o claves nuevas añadidas en el código.

export function mergeSettings(partial: unknown): SiteSettings {
  const p = (partial ?? {}) as Partial<SiteSettings>
  return {
    seo: { ...DEFAULT_SETTINGS.seo, ...(p.seo ?? {}) },
    organization: { ...DEFAULT_SETTINGS.organization, ...(p.organization ?? {}) },
    pixels: { ...DEFAULT_SETTINGS.pixels, ...(p.pixels ?? {}) },
    ai: {
      ...DEFAULT_SETTINGS.ai,
      ...(p.ai ?? {}),
      schedule: { ...DEFAULT_SETTINGS.ai.schedule, ...((p.ai as Partial<AiSettings> | undefined)?.schedule ?? {}) },
    },
  }
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const FALLBACK_BASE = "https://startbyglobal.com"

/**
 * Normaliza la URL base canónica editable desde el admin. Si es inválida o le
 * falta el protocolo (p. ej. "startbyglobal.com"), cae a un fallback seguro
 * para no generar canonicals, sitemap, robots ni JSON-LD con URLs rotas.
 */
export function safeBaseUrl(raw: string): string {
  try {
    return new URL(raw).toString().replace(/\/$/, "")
  } catch {
    console.warn(`[SiteSettings] canonicalBase inválida ("${raw}"), usando ${FALLBACK_BASE}`)
    return FALLBACK_BASE
  }
}

// ─── Reads ────────────────────────────────────────────────────────────────────

// Lectura directa sin caché (para el admin, que necesita ver lo más reciente).
export async function readSiteSettings(): Promise<SiteSettings> {
  try {
    const { data, error } = await supabaseAdmin
      .from("site_settings")
      .select("data")
      .eq("id", "global")
      .single()

    if (error || !data) return DEFAULT_SETTINGS
    return mergeSettings(data.data)
  } catch (e) {
    console.warn("[SiteSettings] read failed, using defaults:", e)
    return DEFAULT_SETTINGS
  }
}

// Lectura memoizada por request (React cache): el layout, el JSON-LD, el sitemap
// y robots comparten una sola consulta por render. Las ediciones del admin se
// reflejan en el siguiente request, sin invalidación manual.
export const getSiteSettings = cache(readSiteSettings)

// ─── Write ────────────────────────────────────────────────────────────────────

export async function saveSiteSettings(partial: unknown): Promise<SiteSettings> {
  const merged = mergeSettings(partial)
  const { error } = await supabaseAdmin
    .from("site_settings")
    .upsert({ id: "global", data: merged, updated_at: new Date().toISOString() })

  if (error) {
    console.error("[SiteSettings] save error:", error)
    throw error
  }
  return merged
}
