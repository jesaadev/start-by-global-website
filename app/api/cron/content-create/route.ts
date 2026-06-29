import { NextResponse } from "next/server"
import { runCreateRoutine } from "@/lib/content-routines"

// Cron semanal: propone temas y genera un borrador de artículo nuevo.
// Protegido con CRON_SECRET (Vercel inyecta el Bearer); falla cerrada si falta.
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
    const result = await runCreateRoutine()
    console.log("[cron/content-create]", JSON.stringify(result))
    // Devolvemos no-2xx ante fallos para que el monitor de crons los detecte.
    if (result.error) {
      return NextResponse.json({ ok: false, ...result }, { status: 500 })
    }
    return NextResponse.json({ ok: true, ...result })
  } catch (e) {
    console.error("[cron/content-create] error:", e)
    return NextResponse.json({ error: e instanceof Error ? e.message : "Error interno." }, { status: 500 })
  }
}
