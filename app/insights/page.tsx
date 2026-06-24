import { DashboardLayout } from "@/components/dashboard-layout"
import { InsightsContent } from "./insights-content"
import { getAllPublished } from "@/lib/blog-posts"
import type { Metadata } from "next"

// ISR: el listado se regenera cada hora y on-demand al publicar/editar.
export const revalidate = 3600

const BASE = "https://startbyglobal.com"

export const metadata: Metadata = {
  title: "Insights & Blog",
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
    url: "/insights",
  },
  alternates: { canonical: "/insights" },
}

export default async function InsightsPage() {
  const posts = await getAllPublished()

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "Start By Global Insights",
    description: "Blog de marketing digital, desarrollo web y tecnología",
    url: `${BASE}/insights`,
    publisher: {
      "@type": "Organization",
      name: "Start By Global",
      url: BASE,
      logo: {
        "@type": "ImageObject",
        url: `${BASE}/logo-black.svg`,
      },
    },
    inLanguage: "es",
    blogPost: posts.map((post) => ({
      "@type": "BlogPosting",
      headline: post.title,
      description: post.excerpt,
      url: `${BASE}/insights/${post.slug}`,
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
        <InsightsContent posts={posts} />
      </DashboardLayout>
    </>
  )
}
