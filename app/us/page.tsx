import type { Metadata } from "next"
import { pageMetadata, hreflangFor } from "@/lib/seo"
import { BreadcrumbJsonLd } from "@/components/seo-jsonld"
import { UsHomeContent } from "./us-home-content"

export const metadata: Metadata = pageMetadata({
  title: "Web Design & Digital Marketing Agency for U.S. Businesses",
  description:
    "Senior nearshore team in U.S. time zones: conversion-focused websites, Google & Meta Ads, SEO and automation — agency quality at rates well below typical U.S. pricing.",
  path: "/us",
  keywords: [
    "web design agency for small business",
    "nearshore digital marketing agency",
    "google ads management agency",
    "affordable web design agency USA",
    "conversion focused website design",
  ],
  languages: hreflangFor("/us"),
  ogLocale: "en_US",
})

export default function UsHomePage() {
  return (
    <>
      <BreadcrumbJsonLd items={[{ name: "US Home", path: "/us" }]} />
      <UsHomeContent />
    </>
  )
}
