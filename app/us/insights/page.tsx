import { DashboardLayout } from "@/components/dashboard-layout"
import { InsightsContent } from "@/app/insights/insights-content"
import { getAllPublished } from "@/lib/blog-posts"
import { pageMetadata, hreflangFor } from "@/lib/seo"
import type { Metadata } from "next"

// ISR: el listado se regenera cada hora y on-demand al publicar/editar.
export const revalidate = 3600

const BASE = "https://startbyglobal.com"

export const metadata: Metadata = pageMetadata({
  title: "Insights & Blog",
  description:
    "Practical articles on web design, Google & Meta Ads, SEO and automation to help U.S. businesses grow online.",
  path: "/us/insights",
  keywords: [
    "digital marketing blog",
    "web design insights",
    "google ads tips for small business",
    "seo blog",
  ],
  languages: hreflangFor("/us/insights"),
  ogLocale: "en_US",
})

export default async function UsInsightsPage() {
  const posts = await getAllPublished("en")

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "Start By Global Insights",
    description: "Digital marketing, web design and technology blog",
    url: `${BASE}/us/insights`,
    publisher: {
      "@type": "Organization",
      name: "Start By Global",
      url: BASE,
      logo: {
        "@type": "ImageObject",
        url: `${BASE}/logo-black.svg`,
      },
    },
    inLanguage: "en-US",
    blogPost: posts.map((post) => ({
      "@type": "BlogPosting",
      headline: post.title,
      description: post.excerpt,
      url: `${BASE}/us/insights/${post.slug}`,
      datePublished: post.dateISO,
      author: { "@type": "Person", name: post.author },
      image: post.image,
      keywords: post.keywords?.join(", "),
    })),
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <DashboardLayout>
        <InsightsContent posts={posts} locale="en" />
      </DashboardLayout>
    </>
  )
}
