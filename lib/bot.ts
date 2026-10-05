// Heurística mínima para no contar en la analítica 1st-party a los bots que
// ejecutan JavaScript (crawlers, navegadores headless, Lighthouse, previews de
// enlaces). Fuera de la UE el consentimiento viene concedido por defecto, así
// que sin este filtro inflan visitas y "lecturas completas".

const BOT_UA = /bot|crawl|spider|slurp|headless|lighthouse|pagespeed|chrome-lighthouse|facebookexternalhit|bingpreview|embedly|preview/i

export function isLikelyBot(): boolean {
  if (typeof navigator === "undefined") return true
  if (navigator.webdriver) return true
  return BOT_UA.test(navigator.userAgent)
}
