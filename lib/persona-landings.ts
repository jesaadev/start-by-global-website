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
  serviceType: string // tipo de servicio (Service JSON-LD)
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
  serviceType: "Diseño y desarrollo web",
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

const LANDING_D: PersonaLandingData = {
  slug: "optimizacion-ecommerce",
  persona: "E-commerce",
  segment: "landing_d",
  seo: {
    title: "Optimización de conversión para e-commerce",
    description:
      "Auditoría de las fugas que te están costando ventas: velocidad, checkout y ficha de producto. Auditoría grabada de tu tienda.",
    keywords: [
      "optimización de conversión ecommerce",
      "auditoría de conversión tienda online",
      "abandono de checkout",
      "cro ecommerce",
    ],
  },
  breadcrumb: "Optimización e-commerce",
  serviceName: "Optimización de conversión para e-commerce",
  serviceType: "Optimización de conversión (CRO)",
  hero: {
    badge: "Optimización de conversión",
    h1: "Ya estás pagando por ese tráfico. Recuperemos el que se te está yendo.",
    subtitle:
      "Auditamos velocidad, checkout y ficha de producto para encontrar dónde se pierden las visitas que ya compraste. Antes de que subas el presupuesto.",
    ctaLabel: "Pedir auditoría de conversión",
    microcopy: "Recibís una auditoría grabada de tu tienda con las correcciones priorizadas.",
  },
  pain: {
    h2: "Los síntomas que ya conocés",
    bullets: [
      "El tráfico sube y las ventas no acompañan.",
      "El carrito se llena y el checkout se abandona.",
      "Subís presupuesto y el retorno baja en lugar de escalar.",
      "Media docena de anuncios “distintos” que en realidad son el mismo concepto compitiendo entre sí.",
      "Cierres que se hacen a mano por mensajería, sin registro ni seguimiento.",
    ],
    closing: "Casi nunca es el presupuesto. Casi siempre es la ruta de compra.",
  },
  mechanism: {
    h2: "Dónde se pierde el dinero, en orden de impacto",
    items: [
      { title: "Velocidad en móvil", desc: "El costo doble: perdés la visita y encarecés el CPA, porque la plataforma optimiza sobre menos conversiones registradas." },
      { title: "Fricción de checkout", desc: "Costo de envío revelado tarde, campos innecesarios, compra como invitado deshabilitada. Cada uno es una caída medible." },
      { title: "Ficha de producto que no responde objeciones", desc: "Sin prueba social, sin política de devolución visible, sin las respuestas que el comprador busca antes de pagar." },
      { title: "Estructura de creativos", desc: "El algoritmo de Meta decide a quién mostrar el anuncio leyendo el creativo. Varias piezas semejantes se agrupan como una sola y compiten entre ellas en vez de ampliar alcance. La palanca es diversidad real de conceptos, no más inversión." },
      { title: "Automatización de lo repetitivo", desc: "Las preguntas frecuentes y el seguimiento de carrito no necesitan una persona. El cierre consultivo sí." },
    ],
  },
  includes: {
    h2: "Qué recibís en la auditoría",
    bullets: [
      "Video grabado recorriendo tu tienda en móvil, con las fugas señaladas en pantalla.",
      "Reporte de velocidad con las correcciones priorizadas por impacto y esfuerzo.",
      "Revisión del checkout paso a paso, con los puntos de abandono identificados.",
      "Diagnóstico de estructura de creativos: cuántos conceptos genuinamente distintos tenés vivos.",
      "Verificación de eventos y de la API de Conversiones.",
      "Plan de corrección con estimación de esfuerzo por punto.",
    ],
  },
  proof: {
    h2: "Cómo se ve lo que entregamos",
    bullets: [
      "Auditoría de ejemplo completa sobre una tienda propia o de demostración.",
      "Antes/después de velocidad sobre un activo propio, con la herramienta de medición a la vista.",
    ],
  },
  faqs: [
    { q: "¿Trabajan con mi plataforma?", a: "Trabajamos con las plataformas de comercio más usadas y con desarrollos a medida. La auditoría es independiente de la plataforma; el plan de corrección se adapta a lo que uses." },
    { q: "¿La auditoría tiene costo?", a: "La primera auditoría de conversión no tiene costo y se entrega grabada. Es un entregable real, no una llamada comercial disfrazada." },
    { q: "Ya tengo quien me lleva los anuncios.", a: "Bien. La mayor parte de lo que auditamos está fuera de la cuenta publicitaria: velocidad, checkout y ficha de producto. Se puede corregir sin cambiar de proveedor de medios." },
    { q: "¿Cuánto tarda la corrección?", a: "Depende de qué encontremos. Las mejoras de velocidad y de checkout suelen ser las más rápidas y las de mayor efecto. El plan te da la estimación por punto." },
    { q: "¿Puedo aplicar las correcciones con mi equipo?", a: "Sí. El plan se entrega con suficiente detalle técnico para que lo ejecute cualquier desarrollador." },
  ],
  process: {
    steps: [
      { title: "Acceso de solo lectura", desc: "A tu tienda y a tu cuenta publicitaria." },
      { title: "Auditoría grabada", desc: "En 3–5 días hábiles." },
      { title: "Llamada de revisión", desc: "Para priorizar juntos." },
      { title: "Ejecución", desc: "Con tu equipo o con el nuestro." },
    ],
  },
  form: {
    h2: "Antes de subir el presupuesto, arreglá la ruta",
    text: "Pedí la auditoría, mirá el video y decidí qué corregir. Si lo hacés con tu equipo, también está bien.",
    button: "Pedir mi auditoría",
    nameLabel: "Nombre",
    contactLabel: "WhatsApp o correo",
    qualifierLabel: "URL de tu tienda",
  },
  leadMagnet: {
    h3: "Checklist de 6 fugas de conversión",
    desc: "Las que casi ninguna tienda revisa. Aplicable en una tarde.",
    button: "Descargar checklist",
    asset: "Checklist de 6 fugas de conversión",
  },
}

const LANDING_B: PersonaLandingData = {
  slug: "marketing-para-empresas",
  persona: "Gerente de Marketing",
  segment: "landing_b",
  seo: {
    title: "Marketing digital medible para empresas",
    description:
      "Web, campañas y analítica bajo un mismo equipo y un mismo indicador de éxito. Revisión de arquitectura de medición.",
    keywords: [
      "marketing digital medible",
      "arquitectura de medición",
      "atribución de marketing",
      "agencia de marketing para empresas",
    ],
  },
  breadcrumb: "Marketing medible",
  serviceName: "Marketing digital medible para empresas",
  serviceType: "Marketing digital y analítica",
  hero: {
    badge: "Marketing medible",
    h1: "Marketing que se puede defender en una reunión de dirección",
    subtitle:
      "Unificamos web, campañas y analítica bajo un solo equipo responsable, con un modelo de medición que conecta la inversión con el pipeline real.",
    ctaLabel: "Solicitar revisión de medición",
    microcopy: "Sesión técnica de 45 minutos con nuestro equipo de analítica.",
  },
  pain: {
    h2: "El problema no es la falta de datos. Es que no cierran.",
    bullets: [
      "Tres plataformas reportan tres números distintos para la misma campaña.",
      "El CRM y las herramientas de marketing no se hablan, y la reconciliación es manual.",
      "Cada proveedor reporta su tramo y ninguno responde por el resultado completo.",
      "El reporte mensual consume días de trabajo y aun así genera preguntas que no podés responder en el momento.",
      "Cuando algo no funciona, no hay forma limpia de saber en qué etapa se rompió.",
    ],
  },
  mechanism: {
    h2: "Cómo construimos medición defendible",
    items: [
      { title: "Modelo de medición antes que herramientas", desc: "Definimos qué es una oportunidad, qué es un lead calificado y en qué momento se cuenta cada cosa. Sin esa definición compartida, ninguna herramienta resuelve nada." },
      { title: "Nomenclatura y eventos unificados", desc: "Una sola convención de nombres entre campañas, sitio y CRM. Es trabajo poco vistoso y es la causa raíz de la mayoría de los reportes que no cuadran." },
      { title: "Medición del lado del servidor", desc: "API de Conversiones además del píxel, para que la pérdida de señal del navegador no distorsione la optimización ni el reporte." },
      { title: "Panel único", desc: "Un tablero vivo que responde las preguntas de dirección sin que nadie arme una presentación desde cero." },
      { title: "Un solo responsable", desc: "Web, campañas y analítica ejecutadas por el mismo equipo, con un indicador de éxito acordado por escrito." },
    ],
  },
  includes: {
    h2: "Entregables del proyecto",
    bullets: [
      "Auditoría de la arquitectura de medición actual, con hallazgos priorizados por impacto.",
      "Documento de definiciones: qué se mide, cómo y en qué momento.",
      "Implementación de eventos y API de Conversiones, verificada contra datos reales.",
      "Panel de KPIs conectado, con acceso para tu equipo y para dirección.",
      "Documento de gobernanza: quién es dueño de qué acceso y qué pasa al terminar el contrato.",
      "Revisión mensual de lectura de datos con tu equipo.",
    ],
  },
  proof: {
    h2: "Cómo se ve lo que entregamos",
    bullets: [
      "Panel de ejemplo con datos de demostración claramente identificados como tales.",
      "Extracto del documento de definiciones y del de gobernanza.",
      "Descripción del proceso de verificación de eventos.",
    ],
  },
  faqs: [
    { q: "Ya tenemos agencia. ¿Esto la reemplaza?", a: "No necesariamente. Varios proyectos empiezan como capa de medición sobre lo que ya existe. Si después conviene consolidar la ejecución, se plantea con datos, no como argumento de venta." },
    { q: "¿Trabajan con nuestro CRM?", a: "Trabajamos con los CRM más extendidos del mercado y con integraciones a medida cuando hace falta. En la sesión técnica confirmamos viabilidad antes de comprometer nada." },
    { q: "¿Cuánto tarda en verse el efecto?", a: "La medición correcta se ve de inmediato: cambia la calidad del reporte desde el primer ciclo. El efecto en rendimiento depende de qué se decida con esos datos, y eso lleva más tiempo." },
    { q: "¿Cómo manejan el traspaso si terminamos?", a: "Todos los accesos, cuentas y documentación quedan a nombre de la empresa. El documento de gobernanza define esto desde el inicio, no al final." },
    { q: "Necesitamos pasar por compras / licitación.", a: "Trabajamos con procesos formales de compra y entregamos la documentación técnica que el proceso requiera." },
  ],
  process: {
    steps: [
      { title: "Sesión técnica (45 min)", desc: "Revisión del stack actual, fuentes de datos y puntos de ruptura." },
      { title: "Informe de hallazgos", desc: "Priorizados por impacto y por esfuerzo, con recomendación explícita." },
      { title: "Propuesta", desc: "Con alcance, plazos y responsables." },
      { title: "Implementación por fases", desc: "Con verificación contra datos reales en cada una." },
      { title: "Operación y revisión periódica", desc: "Lectura de datos recurrente con tu equipo." },
    ],
  },
  form: {
    h2: "Empecemos por auditar lo que ya tenés",
    text: "La sesión técnica es una revisión real de tu arquitectura de medición, no una llamada comercial. Salís con los hallazgos priorizados, decidas o no avanzar.",
    button: "Agendar sesión técnica",
    nameLabel: "Nombre y cargo",
    contactLabel: "Correo corporativo",
    qualifierLabel: "Empresa",
  },
  leadMagnet: {
    h3: "Plantilla de reporte de marketing para dirección",
    desc: "La estructura de reporte que conecta inversión con pipeline, lista para adaptar.",
    button: "Descargar plantilla",
    asset: "Plantilla de reporte de marketing",
  },
}

const LANDING_C: PersonaLandingData = {
  slug: "presencia-profesional",
  persona: "Marca personal",
  segment: "landing_c",
  seo: {
    title: "Presencia profesional para expertos y consultores",
    description:
      "Sitio propio, contenido posicionado y un camino claro para que te contraten. Diagnóstico de presencia profesional.",
    keywords: [
      "presencia profesional",
      "marca personal para consultores",
      "sitio web para expertos",
      "posicionamiento profesional",
    ],
  },
  breadcrumb: "Presencia profesional",
  serviceName: "Presencia profesional para expertos y consultores",
  serviceType: "Marca personal y presencia digital",
  hero: {
    badge: "Presencia profesional",
    h1: "Te googlean antes de escribirte. Que encuentren algo a tu altura.",
    subtitle:
      "Construimos la presencia profesional que convierte tu reputación entre colegas en clientes que llegan solos: sitio propio, contenido que posiciona y un camino claro para agendar.",
    ctaLabel: "Pedir diagnóstico de presencia",
    microcopy: "Revisamos qué aparece hoy cuando alguien busca tu nombre.",
  },
  pain: {
    h2: "Sos bueno en lo tuyo. Eso no está en discusión.",
    bullets: [
      "Tus colegas te recomiendan, pero quien no te conoce no encuentra razones para elegirte.",
      "Tu presencia digital es un perfil de red social y, con suerte, un enlace agrupado.",
      "Cotizás por debajo de lo que vale tu trabajo porque tenés que justificarlo en cada llamada.",
      "Publicás con constancia y ese esfuerzo no se acumula en ningún lado.",
      "Si mañana perdés el acceso a tu cuenta, perdés el canal completo.",
    ],
  },
  mechanism: {
    h2: "Qué construye autoridad consultable",
    items: [
      { title: "Sitio propio como sede", desc: "No un portafolio decorativo: una página que explica a quién ayudás, cómo trabajás y qué pasa si te contratan. Es el activo que sostiene la tarifa." },
      { title: "Contenido que responde lo que se busca", desc: "Los artículos indexados que responden dudas reales del cliente trabajan cuando vos no estás. Es el trabajo que se acumula, a diferencia del contenido efímero." },
      { title: "Prueba visible", desc: "Casos, credenciales y resultados presentados de forma verificable, no como declaración de principios." },
      { title: "Base de contactos propia", desc: "Los seguidores son audiencia alquilada. Una lista de correos es patrimonio recuperable." },
      { title: "Camino de agenda sin fricción", desc: "Del interés a la reunión en un clic, sin negociar horarios por mensaje." },
    ],
  },
  includes: {
    h2: "Qué recibís",
    bullets: [
      "Sitio profesional a medida, optimizado para móvil y para búsqueda por tu nombre.",
      "Arquitectura de contenido: qué escribir, en qué orden y para qué búsqueda.",
      "Sistema de captura de contactos con entrega automática.",
      "Integración de agenda con tu calendario.",
      "Configuración de tu identidad en buscadores y perfiles profesionales.",
      "Manual de uso para que publiques sin depender de nosotros.",
    ],
  },
  proof: {
    h2: "Cómo se ve lo que entregamos",
    bullets: [
      "Antes/después de resultados de búsqueda sobre un ejemplo propio o autorizado.",
      "Ejemplo de arquitectura de contenido entregada.",
      "Muestra del sistema de agenda funcionando.",
    ],
  },
  faqs: [
    { q: "No tengo tiempo para producir contenido.", a: "Es la objeción más frecuente y es válida. La arquitectura define un volumen sostenible, no un calendario ambicioso que abandonás en tres semanas. Menos piezas bien posicionadas rinden más que publicar todos los días sin criterio." },
    { q: "¿Necesito un sitio si ya tengo buena presencia en redes?", a: "Necesitás algo que sea tuyo. Las redes son excelentes para descubrimiento y pésimas como único canal: no controlás el alcance, ni el algoritmo, ni la permanencia de tu cuenta." },
    { q: "¿Esto me va a traer clientes?", a: "Te va a hacer visible y consultable para quien te busca, y te da un canal propio para capitalizar el trabajo que ya hacés. El cierre sigue dependiendo de tu propuesta y de tu conversación. No vendemos resultados garantizados." },
    { q: "Ya tengo un sitio hecho con una plantilla.", a: "Puede servir como base. En el diagnóstico revisamos si conviene corregirlo o rehacerlo, y te decimos cuál sale más barato." },
    { q: "¿Puedo mantenerlo yo después?", a: "Sí. Se entrega con capacitación grabada y accesos a tu nombre." },
  ],
  process: {
    steps: [
      { title: "Diagnóstico de presencia", desc: "Buscamos tu nombre y revisamos qué encuentra un desconocido." },
      { title: "Definición de posicionamiento", desc: "A quién servís, qué te diferencia, qué tarifa sostiene ese posicionamiento." },
      { title: "Construcción", desc: "Del sitio y la arquitectura de contenido." },
      { title: "Entrega con capacitación", desc: "Para que el activo siga creciendo sin depender de un proveedor." },
    ],
  },
  form: {
    h2: "Empecemos por ver qué encuentra alguien que te busca",
    text: "En el diagnóstico revisamos juntos tus resultados de búsqueda y te decimos qué falta. Sin costo y sin condición de contratación.",
    button: "Agendar mi diagnóstico",
    nameLabel: "Nombre",
    contactLabel: "WhatsApp o correo",
    qualifierLabel: "Tu profesión",
  },
  leadMagnet: {
    h3: "Qué debería aparecer cuando buscan tu nombre",
    desc: "Guía breve para auditar tu propia presencia profesional en 15 minutos.",
    button: "Descargar la guía",
    asset: "Guía de presencia profesional",
  },
}

const LANDING_E: PersonaLandingData = {
  slug: "agencias-white-label",
  persona: "Agencia white-label",
  segment: "landing_e",
  seo: {
    title: "Desarrollo web white-label para agencias",
    description:
      "Tu marca al frente, nuestro equipo detrás. Desarrollo, integraciones y analítica para agencias, con proceso documentado.",
    keywords: [
      "desarrollo web white label",
      "partner técnico para agencias",
      "subcontratación de desarrollo web",
      "white label agencia",
    ],
  },
  breadcrumb: "White-label para agencias",
  serviceName: "Desarrollo web white-label para agencias",
  serviceType: "Desarrollo web white-label",
  hero: {
    badge: "Desarrollo white-label",
    h1: "Vendé desarrollo sin contratar un equipo de desarrollo",
    subtitle:
      "Ejecutamos en modalidad white-label: tu marca al frente, nuestro equipo detrás, con plazos y documentación que podés comprometer ante tu cliente.",
    ctaLabel: "Agendar llamada de evaluación",
    microcopy: "Conversación entre equipos. Sin presentación comercial.",
  },
  pain: {
    h2: "La escena que ya viviste",
    bullets: [
      "El cliente pide una integración y tenés que decir “déjame ver”.",
      "Rechazás proyectos que estaban a tu alcance comercial pero no técnico.",
      "Subcontrataste y el freelance entregó tarde. El reclamo te llegó a vos.",
      "Alguien desapareció a mitad de proyecto y tuviste que explicarlo vos.",
      "Ganás el proyecto y el margen se evapora coordinando a un tercero.",
    ],
    closing: "En subcontratación, el riesgo reputacional no se delega. Se elige mejor.",
  },
  mechanism: {
    h2: "Cómo funciona la modalidad white-label",
    items: [
      { title: "Tu marca es la que se ve", desc: "Entregables, documentación y comunicación bajo tu identidad. Definimos por escrito quién habla con tu cliente y quién no." },
      { title: "Equipo, no una persona", desc: "Si alguien se enferma o se va, el proyecto sigue. Es la diferencia estructural frente a subcontratar a un freelance." },
      { title: "Alcance cerrado antes de empezar", desc: "Qué entra, qué no, qué pasa si el cliente pide algo fuera de alcance. El documento existe para protegerte a vos, no a nosotros." },
      { title: "Comunicación con cadencia fija", desc: "Un punto de contacto y una actualización pautada. Sin perseguir respuestas." },
      { title: "Documentación de traspaso", desc: "Todo lo que se construye se entrega documentado para que puedas mantenerlo o traspasarlo sin dependencia." },
    ],
  },
  includes: {
    h2: "En qué te respaldamos",
    bullets: [
      "Desarrollo web y de comercio electrónico (Next.js, React, WordPress y plataformas de e-commerce).",
      "Integraciones con sistemas de gestión, CRM y pasarelas de pago.",
      "Implementación de analítica y medición del lado del servidor.",
      "Migraciones y recuperación de proyectos heredados.",
      "Soporte técnico de preventa: te acompañamos a levantar requerimientos antes de que cotices.",
      "Documentación y entregables bajo tu marca.",
    ],
  },
  proof: {
    h2: "Cómo se ve lo que entregamos",
    bullets: [
      "Ejemplo anonimizado del documento de alcance y del de traspaso.",
      "Descripción del proceso de comunicación y de la cadencia de reporte.",
      "Fragmento del acuerdo de confidencialidad estándar.",
    ],
  },
  faqs: [
    { q: "¿Van a intentar quedarse con mi cliente?", a: "No, y está por escrito. El acuerdo incluye cláusula de no captación. Si tu cliente nos contacta directo, te lo derivamos a vos." },
    { q: "¿Cómo manejan los márgenes?", a: "Cotizamos costo neto. El margen que le sumes a tu cliente es tuyo y no lo conocemos ni lo discutimos." },
    { q: "¿Qué pasa si el cliente pide algo fuera del alcance?", a: "Se cotiza aparte. El documento de alcance está diseñado para que esa conversación no te caiga encima a mitad de proyecto." },
    { q: "¿Puedo llevarlos a una reunión con mi cliente?", a: "Sí, como parte de tu equipo y con tu identidad. También podemos quedarnos completamente detrás. Lo definís vos." },
    { q: "¿Trabajan con proyectos chicos?", a: "Sí. Buena parte de las relaciones de partnership empiezan con un proyecto pequeño para probar el proceso antes de comprometer algo grande." },
    { q: "¿Qué pasa si dejamos de trabajar juntos?", a: "Todo queda documentado y traspasable. No retenemos accesos ni conocimiento como mecanismo de retención." },
  ],
  process: {
    steps: [
      { title: "Llamada de evaluación", desc: "Qué tipo de proyectos te llegan y dónde se te traba." },
      { title: "Acuerdo marco", desc: "Confidencialidad, no captación, tarifas y proceso." },
      { title: "Proyecto piloto", desc: "Uno chico para probar la operación sin riesgo grande." },
      { title: "Operación continua", desc: "Con cadencia de comunicación y capacidad reservada." },
    ],
  },
  form: {
    h2: "Hablemos como equipos, no como proveedor y cliente",
    text: "Contanos qué proyectos estás dejando pasar. Si podemos ejecutarlos, te decimos cómo y cuánto. Si no, te lo decimos también.",
    button: "Agendar llamada de evaluación",
    nameLabel: "Nombre",
    contactLabel: "WhatsApp o correo",
    qualifierLabel: "Agencia",
  },
  leadMagnet: {
    h3: "Cómo cotizar un proyecto técnico que no vas a ejecutar vos",
    desc: "Guía de levantamiento de requerimientos y estructura de márgenes en subcontratación.",
    button: "Descargar la guía",
    asset: "Guía de cotización técnica (subcontratación)",
  },
}

export const PERSONA_LANDINGS: Record<string, PersonaLandingData> = {
  [LANDING_A.slug]: LANDING_A,
  [LANDING_D.slug]: LANDING_D,
  [LANDING_B.slug]: LANDING_B,
  [LANDING_C.slug]: LANDING_C,
  [LANDING_E.slug]: LANDING_E,
}

export function getPersonaLanding(slug: string): PersonaLandingData | undefined {
  return PERSONA_LANDINGS[slug]
}

/** Etiquetas por clave de analítica (segment) para la pestaña "Landings". */
export const LANDING_LABELS: Record<string, { persona: string; slug: string }> =
  Object.fromEntries(
    Object.values(PERSONA_LANDINGS).map((l) => [l.segment, { persona: l.persona, slug: l.slug }])
  )
