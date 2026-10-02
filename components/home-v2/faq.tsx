import { FaqSection } from "@/components/sections/faq-section"
import { FAQS } from "@/lib/home-content"

/** Objeciones frecuentes (con FAQPage JSON-LD para rich snippets). */
export function HomeFaq() {
  return <FaqSection faqs={FAQS} />
}
