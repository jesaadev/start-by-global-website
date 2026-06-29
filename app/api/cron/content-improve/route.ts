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

export async function GET(request: Request) {
  if (!authorized(request)) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 })
  }
  try {
    const result = await runImproveRoutine(1)
    console.log("[cron/content-improve]", JSON.stringify(result))
    return NextResponse.json({ ok: true, ...result })
  } catch (e) {
    console.error("[cron/content-improve] error:", e)
    return NextResponse.json({ error: e instanceof Error ? e.message : "Error interno." }, { status: 500 })
  }
}
