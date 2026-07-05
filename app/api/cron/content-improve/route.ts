import { NextResponse } from "next/server"
import { runImproveRoutine } from "@/lib/content-routines"

// Cron semanal: genera un borrador de mejora del artículo más antiguo.
// Vercel inyecta `Authorization: Bearer <CRON_SECRET>` cuando CRON_SECRET está
// configurado. Sin el secret, la ruta falla cerrada (no es invocable).
export const dynamic = "force-dynamic"
export const maxDuration = 60

function authorized(request: Request): boolean {
  const secret = process.env.CRON_SECRET
  if (!secret) return false
  return request.headers.get("authorization") === `Bearer ${secret}`
}

// El cron corre a diario (más fiable en Vercel Hobby) pero solo actúa el día
// objetivo. Lunes = 1. Con ?force=1 se ejecuta cualquier día (para pruebas).
const TARGET_DAY = 1

export async function GET(request: Request) {
  if (!authorized(request)) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 })
  }
  const force = new URL(request.url).searchParams.get("force") === "1"
  const day = new Date().getUTCDay()
  if (!force && day !== TARGET_DAY) {
    return NextResponse.json({ ok: true, skipped: `no es el día programado (hoy=${day}, objetivo=${TARGET_DAY})` })
  }
  try {
    const result = await runImproveRoutine(1)
    console.log("[cron/content-improve]", JSON.stringify(result))
    // No-2xx ante errores reales o falta de proveedor; un salto normal por
    // no haber candidatos sigue siendo 200 (no es un fallo).
    if (result.errors.length > 0 || result.skipped === "sin proveedor de IA") {
      return NextResponse.json({ ok: false, ...result }, { status: 500 })
    }
    return NextResponse.json({ ok: true, ...result })
  } catch (e) {
    console.error("[cron/content-improve] error:", e)
    return NextResponse.json({ error: e instanceof Error ? e.message : "Error interno." }, { status: 500 })
  }
}
