import { NextResponse } from "next/server"
import { runImproveRoutine } from "@/lib/content-routines"
import { getSiteSettings } from "@/lib/site-settings"
import { safeEqual } from "@/lib/request-guards"

// Cron diario 06:00 UTC (más fiable en Vercel Hobby). Los días en que realmente
// actúa y cuántos artículos mejora se configuran desde el admin (settings.ai.schedule).
// Vercel inyecta `Authorization: Bearer <CRON_SECRET>`; ?key=<CRON_SECRET> sirve
// para pruebas manuales; ?force=1 ignora la compuerta de día.
export const dynamic = "force-dynamic"
export const maxDuration = 60

function authorized(request: Request): boolean {
  const secret = process.env.CRON_SECRET
  if (!secret) return false
  // Comparaciones en tiempo constante (evita timing attacks sobre el secret).
  if (safeEqual(request.headers.get("authorization"), `Bearer ${secret}`)) return true
  return safeEqual(new URL(request.url, "http://localhost").searchParams.get("key"), secret)
}

export async function GET(request: Request) {
  if (!authorized(request)) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 })
  }
  const params = new URL(request.url, "http://localhost").searchParams
  const force = params.get("force") === "1"
  const locale = params.get("locale") === "en" ? "en" as const : "es" as const
  const { schedule } = (await getSiteSettings()).ai
  const day = new Date().getUTCDay()
  if (!force && !schedule.improveDays.includes(day)) {
    return NextResponse.json({ ok: true, skipped: `no es día programado (hoy=${day}, días=[${schedule.improveDays.join(",")}])` })
  }
  try {
    const result = await runImproveRoutine(Math.max(1, schedule.improveCount || 1), locale)
    console.log("[cron/content-improve]", JSON.stringify(result))
    if (result.errors.length > 0 || result.skipped === "sin proveedor de IA") {
      return NextResponse.json({ ok: false, ...result }, { status: 500 })
    }
    return NextResponse.json({ ok: true, ...result })
  } catch (e) {
    console.error("[cron/content-improve] error:", e)
    return NextResponse.json({ error: e instanceof Error ? e.message : "Error interno." }, { status: 500 })
  }
}
