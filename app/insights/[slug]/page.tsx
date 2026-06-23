import { DashboardLayout } from "@/components/dashboard-layout"
import { BlogPostContent } from "./blog-post-content"
import { ArticleTracker } from "@/components/blog/article-tracker"
import { blogPostsData } from "./blog-data"
import { notFound } from "next/navigation"

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params
  const post = blogPostsData[slug]
  if (!post) return {}

  return {
    title: `${post.title} | Insights`,
    description: post.excerpt,
    keywords: post.keywords,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      publishedTime: post.dateISO,
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
      canonical: `https://startbyglobal.com/insights/${slug}`,
    },
  }
}

export async function generateStaticParams() {
  return Object.keys(blogPostsData).map((slug) => ({ slug }))
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params
  const post = blogPostsData[slug]
  if (!post) notFound()

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    image: post.image,
    datePublished: post.dateISO,
    dateModified: post.dateISO,
    author: {
      "@type": "Person",
      name: post.author,
      url: "https://startbyglobal.com/nosotros",
    },
    publisher: {
      "@type": "Organization",
      name: "Start By Global",
      logo: {
        "@type": "ImageObject",
        url: "https://startbyglobal.com/logo-black.svg",
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://startbyglobal.com/insights/${slug}`,
    },
    keywords: post.keywords?.join(", "),
    articleSection: post.category,
    inLanguage: "es",
    url: `https://startbyglobal.com/insights/${slug}`,
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ArticleTracker slug={slug} />
      <DashboardLayout>
        <BlogPostContent slug={slug} />
      </DashboardLayout>
    </>
  )
}
