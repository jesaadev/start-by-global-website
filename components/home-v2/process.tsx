import { ProcessSection } from "@/components/sections/process-section"
import { PROCESS } from "@/lib/home-content"

/** Proceso en 4 pasos: transparencia de proceso en lugar de promesas de resultado. */
export function HomeProcess() {
  return <ProcessSection title="Del diagnóstico a tu primer lead, sin cajas negras" steps={PROCESS} />
}
