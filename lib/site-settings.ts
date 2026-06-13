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

export interface SiteSettings {
  seo: SeoSettings
  organization: OrganizationSettings
  pixels: PixelSettings
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
