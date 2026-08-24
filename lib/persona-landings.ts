// Sistema de landing pages por buyer persona (v1). Arquitectura fija de 9
// bloques; la diferenciación va en el copy, no en la estructura. Cada landing
// es un objeto de datos que alimenta el mismo componente <PersonaLanding/>.
// Módulo plano (sin "use client") para poder importarlo desde el server
// (metadata + FaqJsonLd) y desde el cliente (la plantilla).

export interface PersonaLandingData {
  slug: string // sin barra inicial: "web-que-genera-clientes"
  persona: string
  segment: string // etiqueta de tracking: "landing_a"…
  seo: { title: string; description: string; keywords?: string[] }
  breadcrumb: string // nombre corto para el breadcrumb JSON-LD
  serviceName: string // para el Service JSON-LD
  // Bloque 1
  hero: { badge: string; h1: string; subtitle: string; ctaLabel: string; microcopy: string }
  // Bloque 2
  pain: { h2: string; bullets: string[]; closing?: string }
  // Bloque 3
  mechanism: { h2: string; items: { title: string; desc: string }[] }
  // Bloque 4
  includes: { h2: string; bullets: string[] }
  // Bloque 5 (prueba de método — bloqueado hasta dato real)
  proof: { h2: string; bullets: string[] }
  // Bloque 6
  faqs: { q: string; a: string }[]
  // Bloque 7
  process: { steps: { title: string; desc: string }[] }
  // Bloque 8 (CTA + formulario de 3 campos)
  form: {
    h2: string
    text: string
    button: string
    nameLabel: string
    contactLabel: string
    qualifierLabel: string
  }
  // Bloque 9 (lead magnet)
  leadMagnet: { h3: string; desc: string; button: string; asset: string }
}

const LANDING_A: PersonaLandingData = {
  slug: "web-que-genera-clientes",
  persona: "Dueño de PYME",
  segment: "landing_a",
  seo: {
    // Sin la marca: la plantilla del layout añade "| Start By Global".
    title: "Diseño web que genera clientes para PYMES",
    description:
      "Sitios web construidos como canal de captación, no como folleto. Diagnóstico gratuito de tu web actual.",
    keywords: [
      "diseño web para pymes",
      "web que genera clientes",
      "página web para captar clientes",
      "diseño web república dominicana",
    ],
  },
  breadcrumb: "Web que genera clientes",
  serviceName: "Diseño web de captación para PYMES",
  hero: {
    badge: "Diseño y desarrollo web",
    h1: "Tu web puede traerte clientes. Hoy solo te está informando.",
    subtitle:
      "Construimos sitios pensados como canal de captación: rápidos, medidos y con un camino claro desde la visita hasta la conversación de WhatsApp.",
    ctaLabel: "Pedir diagnóstico gratuito",
    microcopy: "30 minutos. Sin compromiso. Salís con el diagnóstico aunque no trabajemos juntos.",
  },
  pain: {
    h2: "Si te suena familiar, no es tu impresión",
    bullets: [
      "Pagaste por una web hace un tiempo y no sabés cuántas personas la visitan.",
      "Tenés servicios listados, pero nadie escribe desde ahí.",
      "En el celular tarda en cargar y el botón de contacto está escondido.",
      "Cuando alguien te busca en Google, aparece antes tu competencia.",
      "Los clientes siguen llegando por referidos, y los meses buenos dependen de la suerte.",
    ],
    closing: "Ninguno de esos es un problema de diseño. Son problemas de arquitectura comercial.",
  },
  mechanism: {
    h2: "La diferencia entre una web que informa y una que trabaja",
    items: [
      { title: "Velocidad", desc: "Cada segundo de carga en móvil te cuesta visitantes que ya estaban interesados. Optimizamos peso, imágenes y estructura antes de pensar en estética." },
      { title: "Camino de conversión", desc: "Una sola acción principal por página. El visitante nunca tiene que preguntarse qué hacer después." },
      { title: "Medición desde el día uno", desc: "Píxel, eventos y panel conectado. Si no se mide, no se puede mejorar ni invertir con criterio." },
      { title: "Base para publicidad", desc: "Si más adelante vas a invertir en anuncios, el sitio ya está preparado para recibir ese tráfico y registrarlo correctamente." },
    ],
  },
  includes: {
    h2: "Qué recibís",
    bullets: [
      "Sitio desarrollado a medida, optimizado para velocidad en móvil.",
      "Estructura de conversión: llamadas a la acción, formularios y enlace directo a WhatsApp Business.",
      "SEO técnico y ficha de Google Business configurada.",
      "Píxel de Meta y medición de eventos instalados y verificados.",
      "Panel simple para que veas visitas y contactos sin depender de nadie.",
      "Accesos y dominio a tu nombre. Documentado y entregado.",
      "Capacitación de uso grabada.",
    ],
  },
  proof: {
    h2: "Cómo se ve lo que entregamos",
    bullets: [
      "Captura del panel de medición que recibe cada cliente.",
      "Ejemplo anonimizado del documento de entrega y traspaso de accesos.",
      "Comparativa de velocidad antes/después sobre un sitio propio o demo.",
    ],
  },
  faqs: [
    { q: "¿Cuánto cuesta?", a: "Depende del alcance. Un sitio de captación para un negocio de servicios y una plataforma con integraciones no son el mismo proyecto. En el diagnóstico te damos un rango concreto antes de cualquier propuesta formal." },
    { q: "Ya tengo una web. ¿Hay que empezar de cero?", a: "No siempre. En bastantes casos el problema es de estructura y velocidad, no de plataforma. El diagnóstico define si conviene corregir o reconstruir, y te decimos cuál de las dos es más barata para vos." },
    { q: "¿Cuánto tarda?", a: "Los proyectos de captación estándar se entregan en semanas, no en meses. En el diagnóstico definimos fecha concreta y queda por escrito." },
    { q: "¿Y si no quiero invertir en publicidad todavía?", a: "Perfecto. El sitio queda preparado para cuando decidas. No es un requisito." },
    { q: "¿Quién queda dueño de todo?", a: "Vos. Dominio, hosting, accesos y contenido a tu nombre desde el inicio. No trabajamos con retención de accesos." },
  ],
  process: {
    steps: [
      { title: "Diagnóstico (30 min)", desc: "Revisamos tu sitio actual, tu forma de captar clientes y qué se está midiendo." },
      { title: "Propuesta con alcance y fecha", desc: "Qué se hace, qué no, cuánto cuesta y cuándo se entrega." },
      { title: "Construcción con revisiones", desc: "Ves avances, no una caja negra de tres semanas." },
      { title: "Entrega documentada", desc: "Accesos, capacitación y medición funcionando y verificada." },
    ],
  },
  form: {
    h2: "Empezá por saber qué está fallando",
    text: "El diagnóstico es gratuito y no depende de que contrates nada. Salís con una lista concreta de qué corregir en tu sitio, la apliques con nosotros o por tu cuenta.",
    button: "Agendar mi diagnóstico",
    nameLabel: "Nombre",
    contactLabel: "WhatsApp",
    qualifierLabel: "¿A qué se dedica tu negocio?",
  },
  leadMagnet: {
    h3: "¿Todavía no querés hablar con nadie?",
    desc: "Descargá el checklist de 12 puntos para revisar tu web hoy mismo.",
    button: "Descargar checklist",
    asset: "Checklist de web (12 puntos)",
  },
}

export const PERSONA_LANDINGS: Record<string, PersonaLandingData> = {
  [LANDING_A.slug]: LANDING_A,
}

export function getPersonaLanding(slug: string): PersonaLandingData | undefined {
  return PERSONA_LANDINGS[slug]
}
