import { ClosingCTA } from "@/components/cta/closing-cta"

/** Cierre: CTA principal gigante + formulario de 3 campos como alternativa. */
export function HomeFinalCTA() {
  return (
    <ClosingCTA
      title="Hablemos de tu próximo cliente"
      text="Escríbenos por WhatsApp y te decimos, sin compromiso, qué cambiarías primero en tu web y tus anuncios."
      segment="final_cta"
      form={{ landingKey: "home", landingName: "Home (página principal)" }}
    />
  )
}
