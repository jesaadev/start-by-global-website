import { CalendarCheck, ShoppingCart } from "lucide-react"

// Pantallas ilustrativas en HTML (sin imágenes ni cifras) para los mockups de
// las landings cuando aún no hay trabajo real vinculado en el Showcase.

/** Tienda online: catálogo + carrito + checkout. */
export function MiniStore() {
  return (
    <div className="absolute inset-0 flex flex-col bg-gradient-to-b from-[#141922] to-[#0d1117] text-white">
      <div className="flex items-center justify-between border-b border-white/5 px-5 py-3">
        <div className="flex items-center gap-1.5">
          <span className="h-4 w-4 rounded-md bg-[#25D366]" />
          <span className="h-2 w-16 rounded-full bg-white/70" />
        </div>
        <span className="flex items-center gap-1.5 rounded-full bg-white/10 px-2.5 py-1 text-[9px] font-semibold">
          <ShoppingCart className="h-3 w-3" /> Carrito
        </span>
      </div>
      <div className="grid flex-1 grid-cols-3 gap-3 p-5">
        {["from-[#f26d3d] to-[#c2410c]", "from-[#25D366] to-[#128C7E]", "from-[#7B61FF] to-[#4c3bb3]"].map((g, i) => (
          <div key={g} className="flex flex-col overflow-hidden rounded-lg border border-white/5 bg-white/[0.04]">
            <div className={`flex-1 bg-gradient-to-br ${g} opacity-80`} />
            <div className="space-y-1.5 p-2">
              <span className="block h-1.5 w-4/5 rounded-full bg-white/40" />
              <span className="block h-1.5 w-2/5 rounded-full bg-white/20" />
              <span className={`mt-1 block rounded-md py-1 text-center text-[8px] font-bold ${i === 1 ? "bg-[#25D366] text-white" : "bg-white/10 text-white/70"}`}>
                Añadir
              </span>
            </div>
          </div>
        ))}
      </div>
      {/* barra de checkout: los pasos donde se suele perder la compra */}
      <div className="mx-5 mb-4 flex items-center gap-2 rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-[9px]">
        <span className="font-semibold">Checkout</span>
        {["Datos", "Envío", "Pago"].map((p, i) => (
          <span key={p} className={`rounded-full px-2 py-0.5 ${i < 2 ? "bg-[#25D366]/20 text-[#25D366]" : "bg-white/10 text-white/60"}`}>{p}</span>
        ))}
      </div>
    </div>
  )
}

/** Panel de medición con datos de demostración (rotulado como tal). */
export function MiniDashboard() {
  const bars = [38, 52, 45, 61, 58, 72, 80]
  return (
    <div className="absolute inset-0 flex flex-col gap-3 bg-[#0d1117] p-5 text-white">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-semibold">Panel de marketing</span>
        <span className="rounded-full bg-[#F4A261]/15 px-2 py-0.5 text-[8px] font-semibold text-[#F4A261]">Datos de ejemplo</span>
      </div>
      <div className="grid grid-cols-3 gap-2">
        {["Inversión", "Leads calificados", "Oportunidades"].map((k, i) => (
          <div key={k} className="rounded-lg border border-white/5 bg-white/[0.04] p-2">
            <p className="text-[8px] text-white/50">{k}</p>
            <span className={`mt-1.5 block h-2.5 rounded-full ${["w-3/5 bg-[#0074D9]", "w-4/5 bg-[#25D366]", "w-2/5 bg-primary"][i]}`} />
          </div>
        ))}
      </div>
      <div className="flex flex-1 items-end gap-2 rounded-lg border border-white/5 bg-white/[0.03] p-3">
        {bars.map((h, i) => (
          <span key={i} className="flex-1 rounded-t bg-gradient-to-t from-[#0074D9]/60 to-[#3b9cff]" style={{ height: `${h}%` }} />
        ))}
      </div>
      <div className="flex gap-2 text-[8px] text-white/55">
        <span className="rounded bg-white/5 px-1.5 py-0.5">Meta</span>
        <span className="rounded bg-white/5 px-1.5 py-0.5">Google</span>
        <span className="rounded bg-white/5 px-1.5 py-0.5">CRM</span>
        <span className="ml-auto">Una sola fuente de verdad</span>
      </div>
    </div>
  )
}

/** Sitio de un profesional/consultor: posicionamiento + agenda. */
export function MiniPersonal() {
  return (
    <div className="absolute inset-0 flex flex-col bg-gradient-to-b from-[#16131f] to-[#0d1117] text-white">
      <div className="flex items-center justify-between border-b border-white/5 px-5 py-3">
        <span className="h-2 w-20 rounded-full bg-white/70" />
        <div className="flex gap-3">
          <span className="h-1.5 w-8 rounded-full bg-white/20" />
          <span className="h-1.5 w-8 rounded-full bg-white/20" />
        </div>
      </div>
      <div className="flex flex-1 items-center gap-5 px-6">
        <span className="h-20 w-20 shrink-0 rounded-full bg-gradient-to-br from-[#F4A261] to-primary ring-4 ring-white/10" />
        <div className="flex flex-col gap-2">
          <p className="font-display text-lg font-bold leading-tight">Tu nombre</p>
          <p className="text-[10px] text-white/60">Consultor · Especialista en tu sector</p>
          <span className="mt-1 inline-flex w-fit items-center gap-1 rounded-lg bg-primary px-2.5 py-1.5 text-[9px] font-bold">
            <CalendarCheck className="h-3 w-3" /> Agenda una llamada
          </span>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-2 px-5 pb-4">
        {["Artículo", "Caso", "Guía"].map((t) => (
          <div key={t} className="rounded-lg border border-white/5 bg-white/[0.04] p-2">
            <p className="text-[8px] text-white/50">{t}</p>
            <span className="mt-1 block h-1.5 w-4/5 rounded-full bg-white/25" />
          </div>
        ))}
      </div>
    </div>
  )
}
