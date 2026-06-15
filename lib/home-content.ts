// Contenido editable de la home (Fase 2 del rediseño). Copy on-brand basado en
// el lenguaje real de Start By Global (embudo, "web que vende", outsourcing).

export const PAINS = [
  {
    title: "Tu web es un folleto digital, no un vendedor",
    desc: "Se ve bien, pero no genera leads ni ventas. Una mala web cuesta clientes; una buena los multiplica.",
  },
  {
    title: "Quemas presupuesto en Ads sin retorno",
    desc: "Llega tráfico, pero no convierte porque el sitio no está preparado para vender.",
  },
  {
    title: "Desarrollar y mantener no es tu core",
    desc: "Tu equipo no da abasto. Necesitas un partner que entregue webs y marketing bajo tu marca.",
  },
] as const

// Marco propio: "El Embudo de Ventas Digital".
export const FUNNEL_STAGES = [
  { stage: "Atracción", desc: "Ads y SEO que traen al público correcto.", tag: "Tráfico" },
  { stage: "Interés", desc: "Web y contenido que enganchan y explican el valor.", tag: "Web" },
  { stage: "Deseo", desc: "Oferta clara y prueba social que generan confianza.", tag: "Oferta" },
  { stage: "Acción", desc: "CTAs y embudos que convierten visitas en clientes.", tag: "Venta" },
] as const

// "Tu web en 5 pasos" — reduce el riesgo percibido.
export const PROCESS_STEPS = [
  { step: "01", title: "Briefing", desc: "Entendemos tu negocio, objetivos y cliente ideal." },
  { step: "02", title: "Diseño", desc: "UI/UX orientado a conversión, alineado a tu marca." },
  { step: "03", title: "Desarrollo", desc: "Sitio rápido, optimizado y escalable." },
  { step: "04", title: "SEO", desc: "Base técnica para posicionar y atraer tráfico." },
  { step: "05", title: "Lanzamiento", desc: "Publicación, medición y mejora continua." },
] as const

export const OUTSOURCING_BENEFITS = [
  "Desarrollo white-label bajo tu marca",
  "Acuerdo de confidencialidad (NDA)",
  "Briefing claro y entregas puntuales",
  "Diseño y desarrollo ágil y optimizado",
] as const

export const FAQS = [
  {
    q: "¿Cuánto cuesta un proyecto?",
    a: "Los proyectos arrancan desde $400 y el precio final depende del alcance. Tras una breve conversación te enviamos una propuesta clara, sin sorpresas.",
  },
  {
    q: "¿Cuánto tardan en entregar?",
    a: "Trabajamos por un proceso de 5 pasos que nos permite lanzar webs en días, no en meses, sin sacrificar calidad.",
  },
  {
    q: "¿Trabajan con agencias (marca blanca)?",
    a: "Sí. Ofrecemos outsourcing white-label con NDA: desarrollamos bajo tu marca para que entregues más sin aumentar tu equipo.",
  },
  {
    q: "Ya tengo web, pero no me genera. ¿Pueden ayudar?",
    a: "Sí. Hacemos una auditoría de conversión y optimizamos diseño, velocidad y SEO para que tu sitio empiece a vender.",
  },
  {
    q: "¿Atienden fuera de República Dominicana?",
    a: "Sí. Trabajamos con clientes en Rep. Dominicana, España, Latinoamérica y EE.UU. de forma 100% remota.",
  },
] as const
