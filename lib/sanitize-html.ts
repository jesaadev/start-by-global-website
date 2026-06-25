// Sanitizador del subset de HTML que renderiza ArticleBody. El contenido ya no
// se escribe a mano (puede venir del LLM o del editor del admin) y se inyecta
// con dangerouslySetInnerHTML, así que lo limpiamos SIEMPRE antes de persistir
// y también en la vista previa del admin.
//
// Implementación SIN dependencias a propósito: isomorphic-dompurify arrastra
// jsdom, que no carga en el runtime serverless de Vercel (ERR_REQUIRE_ESM) y
// tumbaba /api/admin y /admin. Este sanitizador funciona igual en server y
// cliente.
//
// Enfoque por ALLOWLIST (más seguro que denylist):
//  - Solo se conservan etiquetas de una lista corta; cualquier otra se elimina.
//  - El único atributo permitido es `href` en <a>, validado por esquema DESPUÉS
//    de decodificar entidades (así `javascript:` ofuscado no evade).
//  - Se eliminan bloques peligrosos (script/style/iframe…) y caracteres de
//    control.

const ALLOWED_TAGS = new Set([
  "h2", "h3", "p", "ul", "ol", "li", "blockquote", "strong", "em", "a", "code", "br",
])

const NAMED_ENTITIES: Record<string, string> = {
  amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", "#39": "'",
}

// Rangos de control construidos con escapes \x (fuente ASCII, sin bytes de
// control literales). CONTROL_RE preserva tab/LF/CR; WS_CTRL_RE quita todo
// espacio y control (para validar hrefs).
const CONTROL_RE = new RegExp("[\\x00-\\x08\\x0B\\x0C\\x0E-\\x1F]", "g")
const WS_CTRL_RE = new RegExp("[\\x00-\\x20]", "g")

/** Decodifica entidades numéricas/hex/nombradas (para validar hrefs ofuscados). */
function decodeEntities(s: string): string {
  return s
    .replace(/&#x([0-9a-f]+);?/gi, (_, h) => {
      const n = parseInt(h, 16)
      // Rango Unicode válido: fuera de él String.fromCodePoint lanza RangeError.
      return n >= 0 && n <= 0x10ffff ? String.fromCodePoint(n) : ""
    })
    .replace(/&#(\d+);?/g, (_, d) => {
      const n = parseInt(d, 10)
      return n >= 0 && n <= 0x10ffff ? String.fromCodePoint(n) : ""
    })
    .replace(/&([a-z0-9#]+);/gi, (m, name) => NAMED_ENTITIES[name.toLowerCase()] ?? m)
}

function escapeAttr(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
}

/** Devuelve un href seguro o null si no se permite. */
function safeHref(attrs: string): string | null {
  const m = attrs.match(/(?:\s|^)href\s*=\s*("([^"]*)"|'([^']*)'|([^\s>]+))/i)
  if (!m) return null
  const raw = (m[2] ?? m[3] ?? m[4] ?? "").trim()
  if (!raw) return null
  // Validación sobre el valor decodificado y sin espacios/control internos, así
  // un esquema ofuscado (entidades, tabs, saltos) no evade el chequeo.
  const probe = decodeEntities(raw).replace(WS_CTRL_RE, "").toLowerCase()
  if (/^(javascript|data|vbscript):/i.test(probe)) return null
  if (!/^(https?:\/\/|\/|#|mailto:|tel:)/i.test(probe)) return null
  return escapeAttr(raw)
}

export function sanitizeArticleHtml(input: string): string {
  if (!input) return ""
  let html = input

  // 0. Quitar caracteres de control/nulos (se usan para romper parsers),
  //    preservando tab/salto de línea/retorno.
  html = html.replace(CONTROL_RE, "")

  // 1. Eliminar comentarios y bloques peligrosos completos (con su contenido).
  html = html.replace(/<!--[\s\S]*?-->/g, "")
  html = html.replace(/<(script|style|iframe|object|embed|svg|math|template|noscript)\b[\s\S]*?<\/\1>/gi, "")
  // Variantes sin cierre y constructos no-tag (<!doctype, <?php…).
  html = html.replace(/<(script|style|iframe|object|embed|svg|math|template|noscript)\b[^>]*>/gi, "")
  html = html.replace(/<[!?][^>]*>/g, "")

  // 2. Recorrer cada etiqueta: descartar las no permitidas (conservando el texto
  //    interno) y limpiar atributos de las permitidas.
  html = html.replace(/<\/?\s*([a-zA-Z][a-zA-Z0-9]*)\b([^>]*)>/g, (full, rawName: string, attrs: string) => {
    const name = rawName.toLowerCase()
    if (!ALLOWED_TAGS.has(name)) return ""
    const isClosing = /^<\s*\//.test(full)
    if (isClosing) return `</${name}>`
    if (name === "br") return "<br>"
    if (name === "a") {
      const href = safeHref(attrs)
      return href ? `<a href="${href}">` : "<a>"
    }
    return `<${name}>`
  })

  // 3. Neutralizar cualquier "<" suelto que haya quedado sin formar etiqueta.
  html = html.replace(/<(?![/a-zA-Z])/g, "&lt;")

  return html.trim()
}
