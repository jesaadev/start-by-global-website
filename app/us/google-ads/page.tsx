import type { Metadata } from "next"
import { pageMetadata, hreflangFor } from "@/lib/seo"
import { ServiceJsonLd, BreadcrumbJsonLd, FaqJsonLd } from "@/components/seo-jsonld"
import { GoogleAdsContent } from "./google-ads-content"
import { US_ADS_FAQS } from "./faqs"

export const metadata: Metadata = pageMetadata({
  title: "Google Ads & Meta Ads Management for U.S. Businesses",
  description:
    "Performance-driven Google Ads and Meta (Facebook/Instagram) campaign management for U.S. businesses. Real measurement with pixel + CAPI, optimization for leads and revenue — management from $400/mo.",
  path: "/us/google-ads",
  keywords: [
    "google ads management agency",
    "meta ads agency",
    "facebook ads management for small business",
    "ppc management services",
    "google ads agency pricing",
  ],
  languages: hreflangFor("/us/google-ads"),
  ogLocale: "en_US",
})

export default function GoogleAdsPage() {
  return (
    <>
      <ServiceJsonLd
        name="Google Ads & Meta Ads Management"
        serviceType="Digital advertising / PPC"
        description="Google Ads and Meta (Facebook/Instagram) campaigns with strategy, creative and real conversion measurement."
        path="/us/google-ads"
      />
      <BreadcrumbJsonLd
        items={[
          { name: "US Home", path: "/us" },
          { name: "Google & Meta Ads", path: "/us/google-ads" },
        ]}
      />
      <FaqJsonLd faqs={US_ADS_FAQS} />
      <GoogleAdsContent />
    </>
  )
}
