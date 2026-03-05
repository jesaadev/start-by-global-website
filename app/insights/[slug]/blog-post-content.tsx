"use client"

import Link from "next/link"
import { AnimateIn } from "@/components/animate-in"
import {
  ArrowLeft,
  Calendar,
  Clock,
  User,
  Twitter,
  Linkedin,
  Link as LinkIcon,
  ChevronRight,
  Tag,
} from "lucide-react"
import { blogPostsData } from "./blog-data"

const categoryColors: Record<string, string> = {
  "Marketing Digital": "bg-chart-1/10 text-chart-1 border-chart-1/20",
  "Desarrollo Web":    "bg-chart-2/10 text-chart-2 border-chart-2/20",
  "Tendencias Tech":   "bg-chart-4/10 text-chart-4 border-chart-4/20",
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
              Volver a Insights
            </Link>
          </div>
        </AnimateIn>
      </div>
    )
  }

  const colorClass = categoryColors[post.category] ?? "bg-muted text-muted-foreground border-border"

  return (
    <div className="max-w-4xl mx-auto space-y-8">

      {/* Back */}
      <AnimateIn>
        <Link
          href="/insights"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver a Insights
        </Link>
      </AnimateIn>

      {/* Header */}
      <AnimateIn delay={0.1}>
        <div className="space-y-5">
          {/* Category + meta row */}
          <div className="flex flex-wrap items-center gap-3 text-sm">
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg border text-xs font-semibold ${colorClass}`}>
              <Tag className="w-3 h-3" />
              {post.category}
            </span>
            <span className="flex items-center gap-1.5 text-muted-foreground">
              <Calendar className="w-3.5 h-3.5" />
              {post.date}
            </span>
            <span className="flex items-center gap-1.5 text-muted-foreground">
              <Clock className="w-3.5 h-3.5" />
              {post.readTime} de lectura
            </span>
            <span className="flex items-center gap-1.5 text-muted-foreground">
              <User className="w-3.5 h-3.5" />
              {post.author}
            </span>
          </div>

          {/* Title */}
          <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-balance leading-tight">
            {post.title}
          </h1>

          {/* Excerpt / Lead */}
          <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed text-balance border-l-4 border-primary/40 pl-5">
            {post.excerpt}
          </p>

          {/* Share */}
          <div className="flex items-center gap-3 pt-2 border-t border-border/50">
            <span className="text-xs text-muted-foreground font-medium uppercase tracking-wide">Compartir</span>
            <div className="flex items-center gap-2">
              {[
                { icon: Twitter,   label: "Twitter"  },
                { icon: Linkedin,  label: "LinkedIn" },
                { icon: LinkIcon,  label: "Copiar enlace" },
              ].map(({ icon: Icon, label }) => (
                <button
                  key={label}
                  aria-label={label}
                  className="p-2 rounded-lg bg-card hover:bg-secondary border border-border/50 text-muted-foreground hover:text-foreground transition-all"
                >
                  <Icon className="w-3.5 h-3.5" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </AnimateIn>

      {/* Hero Image */}
      <AnimateIn delay={0.2}>
        <div className="relative h-[280px] sm:h-[420px] rounded-2xl overflow-hidden">
          <img
            src={post.image}
            alt={post.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent" />
        </div>
      </AnimateIn>

      {/* Article Body */}
      <AnimateIn delay={0.3}>
        <article className="glass-card rounded-2xl p-6 sm:p-10">
          {/*
            Prose-style rendering.
            The HTML strings use semantic tags: h2, h3, p, ul, ol, li, blockquote, strong, a, code.
            We apply explicit Tailwind classes via the prose-* variant set.
          */}
          <div
            className="
              prose prose-invert max-w-none

              /* paragraphs */
              prose-p:text-muted-foreground prose-p:leading-[1.85] prose-p:mb-5 prose-p:text-base

              /* headings */
              prose-headings:font-display prose-headings:font-bold prose-headings:text-foreground prose-headings:text-balance
              prose-h2:text-2xl prose-h2:sm:text-3xl prose-h2:mt-10 prose-h2:mb-4 prose-h2:pb-2 prose-h2:border-b prose-h2:border-border/40
              prose-h3:text-lg prose-h3:sm:text-xl prose-h3:mt-7 prose-h3:mb-3

              /* links */
              prose-a:text-primary prose-a:font-medium prose-a:underline prose-a:underline-offset-2 prose-a:decoration-primary/40 hover:prose-a:decoration-primary

              /* blockquote */
              prose-blockquote:not-italic prose-blockquote:border-l-4 prose-blockquote:border-primary/60
              prose-blockquote:pl-5 prose-blockquote:py-1
              prose-blockquote:text-foreground prose-blockquote:font-medium prose-blockquote:text-lg
              prose-blockquote:bg-primary/5 prose-blockquote:rounded-r-xl prose-blockquote:my-8

              /* lists */
              prose-ul:text-muted-foreground prose-ul:my-4 prose-ul:pl-5
              prose-ol:text-muted-foreground prose-ol:my-4 prose-ol:pl-5
              prose-li:my-2 prose-li:leading-relaxed

              /* inline code */
              prose-code:text-primary prose-code:bg-primary/10 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-code:text-sm prose-code:font-mono prose-code:before:content-none prose-code:after:content-none

              /* strong */
              prose-strong:text-foreground prose-strong:font-semibold
            "
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </article>
      </AnimateIn>

      {/* Author Card */}
      <AnimateIn delay={0.4}>
        <div className="glass-card rounded-2xl p-6 sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4">Sobre el autor</p>
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary to-chart-2 flex items-center justify-center text-xl font-bold text-white shrink-0 font-display">
              {post.author.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-display text-lg font-bold">{post.author}</h3>
              <p className="text-sm text-primary mb-2">{post.authorRole} · Start By Global</p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Especialista en {post.category} con amplia experiencia ayudando a empresas en
                República Dominicana, España y Latinoamérica a crecer en el entorno digital.
              </p>
            </div>
          </div>
        </div>
      </AnimateIn>

      {/* CTA */}
      <AnimateIn delay={0.5}>
        <div className="rounded-2xl p-8 sm:p-10 text-center relative overflow-hidden border border-primary/20"
          style={{ background: "linear-gradient(135deg, hsl(16 85% 55% / 0.08) 0%, hsl(190 70% 50% / 0.05) 100%)" }}
        >
          <div className="relative z-10 space-y-4">
            <p className="text-xs font-semibold uppercase tracking-widest text-primary">Start By Global</p>
            <h3 className="font-display text-2xl sm:text-3xl font-bold text-balance">
              ¿Listo para Aplicar Estas Estrategias?
            </h3>
            <p className="text-muted-foreground max-w-xl mx-auto leading-relaxed">
              Nuestro equipo puede ayudarte a implementar lo que acabas de leer, adaptado a tu negocio
              y mercado específico.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
              <Link
                href="/contacto"
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-primary text-primary-foreground font-bold hover:shadow-lg hover:shadow-primary/25 transition-all"
              >
                Agenda una Consultoría Gratuita
                <ChevronRight className="w-4 h-4" />
              </Link>
              <Link
                href="/insights"
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-card border border-border/50 text-foreground font-medium hover:border-primary/30 transition-all"
              >
                <ArrowLeft className="w-4 h-4" />
                Más Artículos
              </Link>
            </div>
          </div>
        </div>
      </AnimateIn>
    </div>
  )
}
