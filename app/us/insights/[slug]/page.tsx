import { MarketingLayout } from "@/components/layout/marketing-layout"
import { BlogPostContent } from "@/app/insights/[slug]/blog-post-content"
import { ArticleTracker } from "@/components/blog/article-tracker"
import { getPublishedSlugs, getPublishedPostBySlug, getRelatedPublished } from "@/lib/blog-posts"
import { notFound } from "next/navigation"

// ISR: igual que el blog en español; revalidación on-demand al publicar/editar.
export const revalidate = 3600

const BASE = "https://startbyglobal.com"

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params
  const post = await getPublishedPostBySlug(slug, "en")
  if (!post) return {}

  return {
    title: `${post.title} | Insights`,
    description: post.excerpt,
    keywords: post.keywords,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      locale: "en_US",
      publishedTime: post.dateISO,
      modifiedTime: post.lastModifiedISO,
      authors: [post.author],
      images: [{ url: post.image, width: 1200, height: 630, alt: post.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
      images: [post.image],
    },
    alternates: {
      canonical: `${BASE}/us/insights/${slug}`,
    },
  }
}

export async function generateStaticParams() {
  const slugs = await getPublishedSlugs("en")
  return slugs.map((slug) => ({ slug }))
}

export default async function UsBlogPostPage({ params }: Props) {
  const { slug } = await params
  const post = await getPublishedPostBySlug(slug, "en")
  if (!post) notFound()

  const related = await getRelatedPublished(slug, post.category, 3, "en")

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    image: post.image,
    datePublished: post.dateISO,
    dateModified: post.lastModifiedISO || post.dateISO,
    author: {
      "@type": "Person",
      name: post.author,
      url: `${BASE}/nosotros`,
    },
    publisher: {
      "@type": "Organization",
      name: "Start By Global",
      logo: {
        "@type": "ImageObject",
        url: `${BASE}/logo-black.svg`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${BASE}/us/insights/${slug}`,
    },
    keywords: post.keywords?.join(", "),
    articleSection: post.category,
    inLanguage: "en-US",
    url: `${BASE}/us/insights/${slug}`,
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ArticleTracker slug={slug} />
      <MarketingLayout ctaSegment="us_article_sticky" locale="en">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
          <BlogPostContent post={post} related={related} locale="en" />
        </div>
      </MarketingLayout>
    </>
  )
}
