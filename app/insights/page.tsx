import { DashboardLayout } from "@/components/dashboard-layout"
import { InsightsContent } from "./insights-content"
import { blogPostsData } from "./[slug]/blog-data"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Insights & Blog | Start By Global",
  description:
    "Tendencias, estrategias y análisis del mundo digital. Marketing, desarrollo web y tecnología para impulsar tu negocio en RD, España y Latinoamérica.",
  keywords: [
    "marketing digital blog",
    "desarrollo web insights",
    "tendencias tecnología 2026",
    "SEO República Dominicana",
    "agencia digital blog",
    "Start By Global",
  ],
  openGraph: {
    title: "Insights & Blog | Start By Global",
    description: "Tendencias, estrategias y análisis del mundo digital.",
    type: "website",
    url: "https://startbyglobal.com/insights",
  },
  alternates: { canonical: "https://startbyglobal.com/insights" },
}

export default function InsightsPage() {
  const articles = Object.entries(blogPostsData).map(([slug, post]) => ({
    "@type": "ListItem",
    position: Object.keys(blogPostsData).indexOf(slug) + 1,
    url: `https://startbyglobal.com/insights/${slug}`,
    name: post.title,
  }))

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "Start By Global Insights",
    description: "Blog de marketing digital, desarrollo web y tecnología",
    url: "https://startbyglobal.com/insights",
    publisher: {
      "@type": "Organization",
      name: "Start By Global",
      url: "https://startbyglobal.com",
      logo: {
        "@type": "ImageObject",
        url: "https://startbyglobal.com/logo-black.svg",
      },
    },
    inLanguage: "es",
    blogPost: Object.entries(blogPostsData).map(([slug, post]) => ({
      "@type": "BlogPosting",
      headline: post.title,
      description: post.excerpt,
      url: `https://startbyglobal.com/insights/${slug}`,
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
        <InsightsContent />
      </DashboardLayout>
    </>
  )
}
