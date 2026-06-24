// Sanitizador del subset de HTML que renderiza ArticleBody. El contenido ya no
// se escribe a mano (puede venir del LLM o del editor del admin) y se inyecta
// con dangerouslySetInnerHTML, así que lo limpiamos SIEMPRE antes de persistir.
//
// Política: allowlist de etiquetas, se eliminan atributos salvo href en <a>
// (validado), y se eliminan por completo bloques peligrosos (script/style/iframe…).

const ALLOWED_TAGS = new Set([
  "h2", "h3", "p", "ul", "ol", "li", "blockquote", "strong", "em", "a", "code", "br",
])

function escapeAttr(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
}

/** Devuelve un href seguro o null si no se permite. */
function safeHref(attrs: string): string | null {
  const m = attrs.match(/\bhref\s*=\s*("([^"]*)"|'([^']*)'|([^\s>]+))/i)
  if (!m) return null
  const raw = (m[2] ?? m[3] ?? m[4] ?? "").trim()
  if (!raw) return null
  // Bloquear esquemas peligrosos explícitamente.
  if (/^\s*(javascript|data|vbscript):/i.test(raw)) return null
  // Permitir solo relativas, anclas, http(s), mailto y tel.
  if (!/^(https?:\/\/|\/|#|mailto:|tel:)/i.test(raw)) return null
  return escapeAttr(raw)
}

export function sanitizeArticleHtml(input: string): string {
  if (!input) return ""
  let html = input

  // 1. Eliminar comentarios y bloques peligrosos completos (con su contenido).
  html = html.replace(/<!--[\s\S]*?-->/g, "")
  html = html.replace(/<(script|style|iframe|object|embed|svg|math|template)\b[\s\S]*?<\/\1>/gi, "")
  // Variante sin cierre (defensivo).
  html = html.replace(/<(script|style|iframe|object|embed|svg|math|template)\b[^>]*>/gi, "")

  // 2. Recorrer cada etiqueta: descartar las no permitidas (conservando el texto
  //    interno) y limpiar atributos de las permitidas.
  html = html.replace(/<\/?([a-zA-Z][a-zA-Z0-9]*)\b([^>]*)>/g, (full, rawName: string, attrs: string) => {
    const name = rawName.toLowerCase()
    if (!ALLOWED_TAGS.has(name)) return ""
    const isClosing = full.startsWith("</")
    if (isClosing) return `</${name}>`
    if (name === "br") return "<br>"
    if (name === "a") {
      const href = safeHref(attrs)
      return href ? `<a href="${href}">` : "<a>"
    }
    return `<${name}>`
  })

  return html.trim()
}
