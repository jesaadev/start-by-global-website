"use client"

import Link from "next/link"
import Image from "next/image"
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

// ---------------------------------------------------------------------------
// Minimal HTML → React renderer
// Converts the HTML strings in blog-data into JSX with explicit Tailwind
// classes so typography renders correctly without @tailwindcss/typography.
// ---------------------------------------------------------------------------
function ArticleBody({ html }: { html: string }) {
  // Split on block-level tags we care about
  const segments: React.ReactNode[] = []

  // We process the raw HTML string into logical blocks line-by-line.
  // Supported tags: h2, h3, p, ul, ol, blockquote, (li handled inside ul/ol)
  const blockRegex =
    /<(h2|h3|p|ul|ol|blockquote)([^>]*)>([\s\S]*?)<\/\1>/g

  let lastIndex = 0
  let match: RegExpExecArray | null
  let key = 0

  // biome-ignore lint/suspicious/noAssignInExpressions: intentional pattern
  while ((match = blockRegex.exec(html)) !== null) {
    const [fullMatch, tag, , inner] = match

    // Any raw text between blocks (shouldn't exist but just in case)
    if (match.index > lastIndex) {
      const between = html.slice(lastIndex, match.index).trim()
      if (between) {
        segments.push(
          <p key={key++} className="text-muted-foreground leading-[1.9] text-[1.0625rem]">
            <InlineHtml html={between} />
          </p>
        )
      }
    }
    lastIndex = match.index + fullMatch.length

    if (tag === "h2") {
      segments.push(
        <h2
          key={key++}
          className="font-display text-2xl sm:text-[1.75rem] font-bold text-foreground mt-12 mb-5 pb-3 border-b border-border/40 leading-snug tracking-tight"
          // biome-ignore lint/security/noDangerouslySetInnerHtml: safe – controlled content
          dangerouslySetInnerHTML={{ __html: inner }}
        />
      )
    } else if (tag === "h3") {
      segments.push(
        <h3
          key={key++}
          className="font-display text-lg sm:text-xl font-semibold text-foreground mt-8 mb-3 leading-snug"
          // biome-ignore lint/security/noDangerouslySetInnerHtml: safe – controlled content
          dangerouslySetInnerHTML={{ __html: inner }}
        />
      )
    } else if (tag === "p") {
      segments.push(
        <p key={key++} className="text-muted-foreground leading-[1.9] text-[1.0625rem] mb-1">
          <InlineHtml html={inner} />
        </p>
      )
    } else if (tag === "blockquote") {
      const text = inner.replace(/<[^>]+>/g, "").trim()
      segments.push(
        <blockquote
          key={key++}
          className="my-8 pl-5 pr-4 py-4 border-l-4 border-primary/70 bg-primary/5 rounded-r-xl text-foreground font-medium text-lg sm:text-xl leading-relaxed italic"
        >
          {text}
        </blockquote>
      )
    } else if (tag === "ul") {
      const items = extractListItems(inner)
      segments.push(
        <ul key={key++} className="mt-4 mb-6 space-y-2.5 pl-1">
          {items.map((item, i) => (
            <li key={i} className="flex items-start gap-3 text-muted-foreground leading-relaxed text-[1.0625rem]">
              <span className="mt-[0.35rem] w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
              <span><InlineHtml html={item} /></span>
            </li>
          ))}
        </ul>
      )
    } else if (tag === "ol") {
      const items = extractListItems(inner)
      segments.push(
        <ol key={key++} className="mt-4 mb-6 space-y-3 pl-1">
          {items.map((item, i) => (
            <li key={i} className="flex items-start gap-3 text-muted-foreground leading-relaxed text-[1.0625rem]">
              <span className="mt-0.5 flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold shrink-0 font-display">
                {i + 1}
              </span>
              <span><InlineHtml html={item} /></span>
            </li>
          ))}
        </ol>
      )
    }
  }

  return <div className="space-y-2">{segments}</div>
}

/** Extracts <li> inner HTML strings from a list block */
function extractListItems(html: string): string[] {
  const items: string[] = []
  const liRegex = /<li[^>]*>([\s\S]*?)<\/li>/g
  let m: RegExpExecArray | null
  // biome-ignore lint/suspicious/noAssignInExpressions: intentional pattern
  while ((m = liRegex.exec(html)) !== null) {
    items.push(m[1].trim())
  }
  return items
}

/** Renders inline HTML (strong, em, a, code) safely */
function InlineHtml({ html }: { html: string }) {
  // Replace inline tags with spans carrying explicit classes
  const processed = html
    .replace(
      /<strong>([\s\S]*?)<\/strong>/g,
      '<strong class="font-semibold text-foreground">$1</strong>'
    )
    .replace(
      /<em>([\s\S]*?)<\/em>/g,
      '<em class="italic">$1</em>'
    )
    .replace(
      /<code>([\s\S]*?)<\/code>/g,
      '<code class="font-mono text-primary bg-primary/10 px-1.5 py-0.5 rounded-md text-sm">$1</code>'
    )
    .replace(
      /<a href="([^"]*)">([\s\S]*?)<\/a>/g,
      '<a href="$1" class="text-primary font-medium underline underline-offset-4 decoration-primary/40 hover:decoration-primary transition-colors">$2</a>'
    )

  return (
    <span
      // biome-ignore lint/security/noDangerouslySetInnerHtml: safe – controlled inline content
      dangerouslySetInnerHTML={{ __html: processed }}
    />
  )
}

// ---------------------------------------------------------------------------

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

  const colorClass =
    categoryColors[post.category] ?? "bg-muted text-muted-foreground border-border"

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
        <div className="space-y-6">
          {/* Category + meta */}
          <div className="flex flex-wrap items-center gap-3">
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg border text-xs font-semibold ${colorClass}`}
            >
              <Tag className="w-3 h-3" />
              {post.category}
            </span>
            <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <Calendar className="w-3.5 h-3.5" />
              {post.date}
            </span>
            <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <Clock className="w-3.5 h-3.5" />
              {post.readTime} de lectura
            </span>
            <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <User className="w-3.5 h-3.5" />
              {post.author}
            </span>
          </div>

          {/* Title */}
          <h1 className="font-display text-3xl sm:text-4xl lg:text-[2.75rem] font-bold text-balance leading-[1.15] tracking-tight">
            {post.title}
          </h1>

          {/* Lead */}
          <p className="text-lg sm:text-xl text-muted-foreground leading-[1.75] border-l-4 border-primary/50 pl-5 text-balance">
            {post.excerpt}
          </p>

          {/* Share */}
          <div className="flex items-center gap-3 pt-1 border-t border-border/50">
            <span className="text-xs text-muted-foreground font-medium uppercase tracking-widest">
              Compartir
            </span>
            <div className="flex items-center gap-2">
              {[
                { icon: Twitter,  label: "Twitter"  },
                { icon: Linkedin, label: "LinkedIn" },
                { icon: LinkIcon, label: "Copiar enlace" },
              ].map(({ icon: Icon, label }) => (
                <button
                  key={label}
                  type="button"
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
        <div className="relative h-[260px] sm:h-[420px] rounded-2xl overflow-hidden">
          <Image
            src={post.image}
            alt={post.title}
            fill
            priority
            sizes="(max-width: 768px) 100vw, 1200px"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent" />
        </div>
      </AnimateIn>

      {/* Article Body */}
      <AnimateIn delay={0.3}>
        <article className="glass-card rounded-2xl p-7 sm:p-12">
          <ArticleBody html={post.content} />
        </article>
      </AnimateIn>

      {/* Author */}
      <AnimateIn delay={0.4}>
        <div className="glass-card rounded-2xl p-6 sm:p-8">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-4">
            Sobre el autor
          </p>
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
        <div
          className="rounded-2xl p-8 sm:p-12 text-center relative overflow-hidden border border-primary/20"
          style={{
            background:
              "linear-gradient(135deg, hsl(16 85% 55% / 0.07) 0%, hsl(190 70% 50% / 0.04) 100%)",
          }}
        >
          <div className="relative z-10 space-y-5">
            <p className="text-xs font-semibold uppercase tracking-widest text-primary">
              Start By Global
            </p>
            <h3 className="font-display text-2xl sm:text-3xl font-bold text-balance">
              ¿Listo para Aplicar Estas Estrategias?
            </h3>
            <p className="text-muted-foreground max-w-xl mx-auto leading-relaxed">
              Nuestro equipo puede ayudarte a implementar lo que acabas de leer, adaptado
              a tu negocio y mercado específico.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-1">
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
