"use client"

import Link from "next/link"
import { AnimateIn } from "@/components/animate-in"
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  User, 
  Share2,
  Twitter,
  Linkedin,
  Facebook,
  Link as LinkIcon,
  ChevronRight
} from "lucide-react"

// Sample blog post data - in production this would come from a CMS or API
const blogPostsData: Record<string, any> = {
  "ia-marketing-digital-2026": {
    title: "IA en Marketing Digital: 5 Tendencias que Dominarán 2026",
    excerpt: "La inteligencia artificial está redefiniendo cómo las marcas se conectan con sus audiencias.",
    author: "María González",
    date: "2026-02-15",
    readTime: "8 min",
    category: "Marketing Digital",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200&q=80",
    content: `
      <h2>El Futuro del Marketing es Ahora</h2>
      <p>La inteligencia artificial ha dejado de ser una promesa futurista para convertirse en una herramienta esencial en el arsenal de cualquier estratega de marketing digital. En 2026, veremos cómo estas tecnologías transforman completamente la forma en que las marcas interactúan con sus audiencias.</p>

      <h3>1. Personalización Hipersegmentada en Tiempo Real</h3>
      <p>Los algoritmos de IA ahora pueden analizar miles de puntos de datos en milisegundos para ofrecer experiencias completamente personalizadas a cada usuario. Desde el contenido que ven hasta los productos que se les recomiendan, todo se adapta dinámicamente.</p>

      <blockquote>
        "La personalización ya no es una ventaja competitiva, es una expectativa básica del consumidor moderno."
      </blockquote>

      <h3>2. Generación de Contenido Asistida por IA</h3>
      <p>Las herramientas de IA generativa están permitiendo a los equipos de marketing producir contenido de alta calidad a escala. Desde copy publicitario hasta imágenes personalizadas, la IA acelera el proceso creativo sin sacrificar calidad.</p>

      <h3>3. Análisis Predictivo Avanzado</h3>
      <p>Los modelos de machine learning pueden predecir con precisión el comportamiento del consumidor, permitiendo a las marcas anticiparse a las necesidades y optimizar sus estrategias antes de que sea demasiado tarde.</p>

      <h3>4. Chatbots y Asistentes Virtuales Mejorados</h3>
      <p>La nueva generación de chatbots powered by IA ofrece conversaciones naturales que son prácticamente indistinguibles de las humanas, mejorando dramáticamente la experiencia del cliente.</p>

      <h3>5. Optimización Automática de Campañas</h3>
      <p>Las plataformas de IA pueden ahora optimizar campañas publicitarias en tiempo real, ajustando presupuestos, audiencias y creatividades basándose en el rendimiento instantáneo.</p>

      <h2>Conclusión</h2>
      <p>La integración de IA en el marketing digital no es opcional: es imperativa. Las empresas que adopten estas tecnologías ahora estarán mejor posicionadas para liderar en sus industrias. En Start By Global, ayudamos a nuestros clientes a navegar esta transformación con estrategias personalizadas y tecnología de punta.</p>
    `,
  },
}

interface BlogPostContentProps {
  slug: string
}

export function BlogPostContent({ slug }: BlogPostContentProps) {
  const post = blogPostsData[slug]

  if (!post) {
    return (
      <div className="max-w-4xl mx-auto">
        <AnimateIn>
          <div className="glass-card rounded-2xl p-12 text-center">
            <h1 className="font-display text-3xl font-bold mb-4">Artículo no encontrado</h1>
            <p className="text-muted-foreground mb-6">
              El artículo que buscas no existe o ha sido movido.
            </p>
            <Link
              href="/insights"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold hover:shadow-lg hover:shadow-primary/25 transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
              Volver al Blog
            </Link>
          </div>
        </AnimateIn>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Back Button */}
      <AnimateIn>
        <Link
          href="/insights"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver al Blog
        </Link>
      </AnimateIn>

      {/* Article Header */}
      <AnimateIn delay={0.1}>
        <div className="space-y-6">
          {/* Meta */}
          <div className="flex flex-wrap items-center gap-4 text-sm">
            <span className="px-3 py-1 rounded-lg bg-primary/10 text-primary font-medium border border-primary/20">
              {post.category}
            </span>
            <span className="flex items-center gap-1.5 text-muted-foreground">
              <Calendar className="w-4 h-4" />
              {new Date(post.date).toLocaleDateString("es", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </span>
            <span className="flex items-center gap-1.5 text-muted-foreground">
              <Clock className="w-4 h-4" />
              {post.readTime}
            </span>
            <span className="flex items-center gap-1.5 text-muted-foreground">
              <User className="w-4 h-4" />
              {post.author}
            </span>
          </div>

          {/* Title */}
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-balance leading-tight">
            {post.title}
          </h1>

          {/* Excerpt */}
          <p className="text-xl text-muted-foreground text-balance">
            {post.excerpt}
          </p>

          {/* Share */}
          <div className="flex items-center gap-3 pt-4 border-t border-border/50">
            <span className="text-sm text-muted-foreground font-medium">Compartir:</span>
            <div className="flex items-center gap-2">
              <button className="p-2 rounded-lg bg-card hover:bg-card/80 border border-border/50 transition-colors">
                <Twitter className="w-4 h-4" />
              </button>
              <button className="p-2 rounded-lg bg-card hover:bg-card/80 border border-border/50 transition-colors">
                <Linkedin className="w-4 h-4" />
              </button>
              <button className="p-2 rounded-lg bg-card hover:bg-card/80 border border-border/50 transition-colors">
                <Facebook className="w-4 h-4" />
              </button>
              <button className="p-2 rounded-lg bg-card hover:bg-card/80 border border-border/50 transition-colors">
                <LinkIcon className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </AnimateIn>

      {/* Featured Image */}
      <AnimateIn delay={0.2}>
        <div className="relative h-[400px] sm:h-[500px] rounded-2xl overflow-hidden">
          <img
            src={post.image}
            alt={post.title}
            className="w-full h-full object-cover"
          />
        </div>
      </AnimateIn>

      {/* Article Content */}
      <AnimateIn delay={0.3}>
        <div className="glass-card rounded-2xl p-6 sm:p-10">
          <div
            className="prose prose-invert prose-lg max-w-none
              prose-headings:font-display prose-headings:font-bold prose-headings:text-foreground
              prose-h2:text-3xl prose-h2:mt-8 prose-h2:mb-4
              prose-h3:text-2xl prose-h3:mt-6 prose-h3:mb-3
              prose-p:text-muted-foreground prose-p:leading-relaxed prose-p:mb-4
              prose-a:text-primary prose-a:no-underline hover:prose-a:underline
              prose-blockquote:border-l-4 prose-blockquote:border-primary prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-foreground
              prose-strong:text-foreground prose-strong:font-semibold
              prose-ul:text-muted-foreground prose-ol:text-muted-foreground
              prose-li:my-1"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </div>
      </AnimateIn>

      {/* Author Card */}
      <AnimateIn delay={0.4}>
        <div className="glass-card rounded-2xl p-6 sm:p-8">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-chart-2 flex items-center justify-center text-2xl font-bold text-white shrink-0">
              {post.author.charAt(0)}
            </div>
            <div className="flex-1">
              <h3 className="font-display text-xl font-bold mb-1">
                Escrito por {post.author}
              </h3>
              <p className="text-sm text-muted-foreground mb-3">
                Especialista en {post.category} con más de 10 años de experiencia ayudando a empresas a transformar su presencia digital.
              </p>
              <div className="flex gap-2">
                <button className="p-1.5 rounded-lg bg-card hover:bg-card/80 border border-border/50 transition-colors">
                  <Twitter className="w-4 h-4" />
                </button>
                <button className="p-1.5 rounded-lg bg-card hover:bg-card/80 border border-border/50 transition-colors">
                  <Linkedin className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </AnimateIn>

      {/* CTA */}
      <AnimateIn delay={0.5}>
        <div className="glass-card rounded-2xl p-8 sm:p-10 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-chart-2/10 opacity-50" />
          <div className="relative z-10">
            <h3 className="font-display text-2xl sm:text-3xl font-bold mb-3">
              ¿Listo para Transformar tu Negocio?
            </h3>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Implementa estas estrategias con el apoyo de nuestro equipo de expertos
            </p>
            <Link
              href="/contacto"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-primary text-primary-foreground font-bold text-lg hover:shadow-lg hover:shadow-primary/25 transition-all"
            >
              Agenda tu Consultoría Gratuita
              <ChevronRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </AnimateIn>
    </div>
  )
}
