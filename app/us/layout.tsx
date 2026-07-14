import type { ReactNode } from "react"
import { SetHtmlLang } from "@/components/set-html-lang"

// Sección en inglés para el mercado de EE.UU. El chrome global (chat, pixels,
// consentimiento) viene del layout raíz; aquí solo corregimos el lang del
// documento. La metadata (title/OG en inglés + hreflang) la define cada página.
export default function UsLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <SetHtmlLang lang="en" />
      {children}
    </>
  )
}
