"use client"

import Link from "next/link"
import Image from "next/image"
import {
  ArrowLeft,
  Calendar,
  Clock,
  User,
  Tag,
  BookOpen,
} from "lucide-react"
import type { BlogPostView, RelatedPost } from "@/lib/blog-posts"
import { ShareButtons } from "@/components/blog/share-buttons"
import { ArticleCta } from "@/components/blog/article-cta"

const categoryColors: Record<string, string> = {
  "Marketing Digital": "bg-chart-1/10 text-chart-1 border-chart-1/20",
  "Desarrollo Web":    "bg-chart-2/10 text-chart-2 border-chart-2/20",
  "Tendencias Tech":   "bg-chart-4/10 text-chart-4 border-chart-4/20",
}

// Textos del chrome del artículo por locale.
const ARTICLE_TEXT = {
  es: {
    base: "/insights",
    back: "Volver a Insights",
    readTime: "de lectura",
    readNext: "Leer también",
    aboutAuthor: "Sobre el autor",
    authorBlurb: (category: string) =>
      `Especialista en ${category} en Start By Global. Ayuda a empresas de República Dominicana, España y Latinoamérica a crecer en el entorno digital.`,
    keepReading: "Sigue leyendo",
  },
  en: {
    base: "/us/insights",
    back: "Back to Insights",
    readTime: "read",
    readNext: "Read next",
    aboutAuthor: "About the author",
    authorBlurb: (category: string) =>
      `${category} specialist at Start By Global, helping businesses in the U.S. and Latin America grow online.`,
    keepReading: "Keep reading",
  },
} as const

interface BlogPostContentProps {
  post: BlogPostView
  related: RelatedPost[]
  locale?: "es" | "en"
}

// ---------------------------------------------------------------------------
// Minimal HTML → React renderer
// Converts the HTML strings in blog-data into JSX with explicit Tailwind
// classes so typography renders correctly without @tailwindcss/typography.
// ---------------------------------------------------------------------------
function ArticleBody({
  html,
  readNextLabel = "Leer también",
  inlineCta,
}: {
  html: string
  readNextLabel?: string
  /** Bloque de conversión que se inserta a mitad del artículo. */
  inlineCta?: React.ReactNode
}) {
  // Split on block-level tags we care about
  const segments: React.ReactNode[] = []
  // El CTA va antes del 3.er H2 (tras dos secciones de valor); si el artículo
  // tiene menos secciones, a la mitad del contenido.
  let h2Count = 0
  let ctaPlaced = false

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
          <p key={key++} className="text-muted-foreground leading-[1.95] text-[1.0625rem] my-6">
            <InlineHtml html={between} />
          </p>
        )
      }
    }
    lastIndex = match.index + fullMatch.length

    if (tag === "h2") {
      h2Count++
      if (h2Count === 3 && inlineCta && !ctaPlaced) {
        segments.push(<div key={key++}>{inlineCta}</div>)
        ctaPlaced = true
      }
      segments.push(
        <h2
          key={key++}
          className="font-display text-2xl sm:text-[1.75rem] font-bold text-foreground mt-16 mb-7 pb-3 border-b border-border/40 leading-snug tracking-tight"
          // biome-ignore lint/security/noDangerouslySetInnerHtml: safe – controlled content
          dangerouslySetInnerHTML={{ __html: inner }}
        />
      )
    } else if (tag === "h3") {
      segments.push(
        <h3
          key={key++}
          className="font-display text-lg sm:text-xl font-semibold text-foreground mt-11 mb-4 leading-snug"
          // biome-ignore lint/security/noDangerouslySetInnerHtml: safe – controlled content
          dangerouslySetInnerHTML={{ __html: inner }}
        />
      )
    } else if (tag === "p") {
      // Párrafo que recomienda otro artículo del blog (enlace a /insights/…):
      // se muestra como callout diferenciado del texto de lectura.
      const isReadNext = /href\s*=\s*["']\/insights\//i.test(inner)
      if (isReadNext) {
        segments.push(
          <aside key={key++} className="my-8 flex items-start gap-3.5 rounded-xl border border-primary/25 bg-primary/[0.06] px-5 py-4">
            <BookOpen className="w-5 h-5 text-primary shrink-0 mt-0.5" />
            <div>
              <span className="block text-[11px] font-semibold uppercase tracking-widest text-primary mb-1">{readNextLabel}</span>
              <p className="text-foreground/90 leading-relaxed text-[0.975rem]">
                <InlineHtml html={inner} />
              </p>
            </div>
          </aside>
        )
      } else {
        segments.push(
          <p key={key++} className="text-muted-foreground leading-[1.95] text-[1.0625rem] my-6">
            <InlineHtml html={inner} />
          </p>
        )
      }
    } else if (tag === "blockquote") {
      const text = inner.replace(/<[^>]+>/g, "").trim()
      segments.push(
        <blockquote
          key={key++}
          className="my-10 pl-5 pr-4 py-5 border-l-4 border-primary/70 bg-primary/5 rounded-r-xl text-foreground font-medium text-lg sm:text-xl leading-relaxed italic"
        >
          {text}
        </blockquote>
      )
    } else if (tag === "ul") {
      const items = extractListItems(inner)
      segments.push(
        <ul key={key++} className="my-7 space-y-3 pl-1">
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
        <ol key={key++} className="my-7 space-y-3.5 pl-1">
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

  if (inlineCta && !ctaPlaced && segments.length >= 4) {
    segments.splice(Math.floor(segments.length / 2), 0, <div key={key++}>{inlineCta}</div>)
  }

  return <div className="[&>:first-child]:mt-0">{segments}</div>
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

export function BlogPostContent({ post, related, locale = "es" }: BlogPostContentProps) {
  const colorClass =
    categoryColors[post.category] ?? "bg-muted text-muted-foreground border-border"
  const t = ARTICLE_TEXT[locale]

  return (
    <div className="max-w-4xl mx-auto space-y-8">

      {/* Back */}
      <Link
        href={t.base}
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        {t.back}
      </Link>

      {/* Header */}
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
            {post.readTime} {t.readTime}
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
        <div className="pt-1 border-t border-border/50">
          <ShareButtons title={post.title} />
        </div>
      </div>

      {/* Hero Image */}
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

      {/* Article Body */}
      <article className="glass-card rounded-2xl p-7 sm:p-12">
        <ArticleBody
          html={post.content}
          readNextLabel={t.readNext}
          inlineCta={<ArticleCta category={post.category} locale={locale} variant="inline" />}
        />
      </article>

      {/* Author */}
      <div className="glass-card rounded-2xl p-6 sm:p-8">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-4">
          {t.aboutAuthor}
        </p>
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary to-chart-2 flex items-center justify-center text-xl font-bold text-white shrink-0 font-display">
            {post.author.charAt(0)}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-display text-lg font-bold">{post.author}</h3>
            <p className="text-sm text-primary mb-2">{post.authorRole} · Start By Global</p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {t.authorBlurb(post.category)}
            </p>
          </div>
        </div>
      </div>

      {/* Artículos relacionados (enlazado interno de clúster) */}
      {related.length > 0 && (
        <section aria-labelledby="related-heading" className="space-y-4">
          <h2 id="related-heading" className="font-display text-xl sm:text-2xl font-bold tracking-tight">
            {t.keepReading}
          </h2>
          <div className="grid sm:grid-cols-3 gap-4">
            {related.map((r) => {
              const rColor = categoryColors[r.category] ?? "bg-muted text-muted-foreground border-border"
              return (
                <Link
                  key={r.slug}
                  href={`${t.base}/${r.slug}`}
                  className="group glass-card rounded-2xl p-5 flex flex-col gap-3 hover:border-primary/30 transition-all"
                >
                  <span className={`inline-flex w-fit items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[11px] font-semibold ${rColor}`}>
                    <Tag className="w-3 h-3" />
                    {r.category}
                  </span>
                  <h3 className="font-display text-base font-bold leading-snug text-balance group-hover:text-primary transition-colors">
                    {r.title}
                  </h3>
                  <span className="mt-auto flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Clock className="w-3.5 h-3.5" />
                    {r.readTime} {t.readTime}
                  </span>
                </Link>
              )
            })}
          </div>
        </section>
      )}

      {/* CTA final */}
      <ArticleCta category={post.category} locale={locale} variant="final" />
    </div>
  )
}
