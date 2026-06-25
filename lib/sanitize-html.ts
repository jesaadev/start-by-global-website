import DOMPurify from "isomorphic-dompurify"

// Sanitiza el subset de HTML que renderiza ArticleBody. El contenido ya no se
// escribe a mano (puede venir del LLM o del editor del admin) y se inyecta con
// dangerouslySetInnerHTML, así que lo limpiamos SIEMPRE antes de persistir y en
// la vista previa del admin.
//
// Usa DOMPurify (isomorphic: jsdom en server, DOM nativo en cliente) con una
// allowlist estricta de etiquetas y solo `href` validado por esquema. DOMPurify
// ya bloquea por defecto on*-handlers y esquemas peligrosos (javascript:, data:),
// incluso ofuscados con entidades.

const ALLOWED_TAGS = ["h2", "h3", "p", "ul", "ol", "li", "blockquote", "strong", "em", "a", "code", "br"]
const ALLOWED_ATTR = ["href"]
// Solo http(s), mailto, tel, rutas relativas y anclas.
const ALLOWED_URI_REGEXP = /^(?:https?:|mailto:|tel:|\/|#)/i

export function sanitizeArticleHtml(input: string): string {
  if (!input) return ""
  return DOMPurify.sanitize(input, {
    ALLOWED_TAGS,
    ALLOWED_ATTR,
    ALLOWED_URI_REGEXP,
    FORBID_TAGS: ["style"],
  }).trim()
}
