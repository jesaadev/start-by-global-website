"use client"

import { useParams } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard-layout"
import { BlogPostContent } from "./blog-post-content"

export default function BlogPostPage() {
  const params = useParams()
  const slug = params.slug as string

  return (
    <DashboardLayout>
      <BlogPostContent slug={slug} />
    </DashboardLayout>
  )
}
