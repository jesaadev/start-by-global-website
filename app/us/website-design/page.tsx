import type { Metadata } from "next"
import { pageMetadata, hreflangFor } from "@/lib/seo"
import { ServiceJsonLd, BreadcrumbJsonLd, FaqJsonLd } from "@/components/seo-jsonld"
import { listPublishedShowcase } from "@/lib/showcase"
import { MarketingLayout } from "@/components/layout/marketing-layout"
import { WebsiteDesignContent } from "./website-design-content"
import { US_WEB_FAQS } from "./faqs"

export const metadata: Metadata = pageMetadata({
  title: "Website Design for U.S. Small Businesses — from $600",
  description:
    "Conversion-focused website design and development for U.S. businesses: corporate sites, landing pages and e-commerce built for speed, SEO and sales. Nearshore team in U.S. time zones, from $600.",
  path: "/us/website-design",
  keywords: [
    "website design for small business",
    "affordable website design agency",
    "conversion focused web design",
    "nearshore web development",
    "landing page design agency",
    "how much does a website cost",
  ],
  languages: hreflangFor("/us/website-design"),
  ogLocale: "en_US",
})

export default async function WebsiteDesignPage() {
  const work = await listPublishedShowcase("web", 1)
  return (
    <>
      <ServiceJsonLd
        name="Website Design & Development"
        serviceType="Web design / Web development"
        description="Conversion-focused corporate websites, landing pages and e-commerce optimized for SEO and speed."
        path="/us/website-design"
      />
      <BreadcrumbJsonLd
        items={[
          { name: "US Home", path: "/us" },
          { name: "Website Design", path: "/us/website-design" },
        ]}
      />
      <FaqJsonLd faqs={US_WEB_FAQS} />
      <MarketingLayout ctaSegment="us_web_sticky" locale="en" ctaSecondary={{ href: "#contact", label: "Get a free quote" }}>
        <WebsiteDesignContent work={work} />
      </MarketingLayout>
    </>
  )
}
