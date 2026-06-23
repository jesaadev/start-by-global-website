import { NextResponse } from "next/server"
import { logBlogEvent, type BlogEventType } from "@/lib/blog-events"
import { enforceRateLimit } from "@/lib/rate-limit"
import { sameOriginOk } from "@/lib/request-guards"
import type { Attribution } from "@/lib/attribution"

const VALID: BlogEventType[] = ["view", "scroll", "engaged", "cta_click", "share", "read_complete"]

interface Body {
  slug: string
  event_type: BlogEventType
  value?: number | null
  target?: string | null
  session_id?: string | null
  attribution?: Attribution | null
}

export async function POST(request: Request) {
  try {
    const limited = enforceRateLimit(request, "blog-track", 120, 60 * 1000)
    if (limited) return limited
    if (!sameOriginOk(request)) {
      return NextResponse.json({ error: "Origen no permitido." }, { status: 403 })
    }

    const body = (await request.json()) as Body
    if (!body?.slug || !VALID.includes(body.event_type)) {
      return NextResponse.json({ error: "Datos inválidos." }, { status: 400 })
    }

    await logBlogEvent({
      slug: body.slug,
      event_type: body.event_type,
      value: typeof body.value === "number" ? body.value : null,
      target: body.target ?? null,
      session_id: body.session_id ?? null,
      attribution: body.attribution ?? null,
    })

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error("[blog-track] error:", error)
    return NextResponse.json({ error: "Error interno." }, { status: 500 })
  }
}
