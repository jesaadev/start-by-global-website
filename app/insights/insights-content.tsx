"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { AnimateIn } from "@/components/animate-in"
import { blogPostsData } from "./[slug]/blog-data"
import {
  TrendingUp,
  Code,
  Megaphone,
  Sparkles,
  Clock,
  ArrowRight,
  Search,
  Filter,
  Calendar,
  User,
  Tag
} from "lucide-react"

const categories = [
  { id: "all", label: "Todos", icon: Sparkles },
  { id: "marketing", label: "Marketing Digital", icon: Megaphone },
  { id: "desarrollo", label: "Desarrollo Web", icon: Code },
  { id: "tendencias", label: "Tendencias Tech", icon: TrendingUp },
]

// Mapea la categoría (label de blog-data) al id del filtro de categorías.
const CATEGORY_ID: Record<string, string> = {
  "Tendencias Tech": "tendencias",
  "Desarrollo Web": "desarrollo",
  "Marketing Digital": "marketing",
}

const MONTHS_SHORT = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"]
function shortDate(iso: string): string {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ""
  return `${d.getUTCDate()} ${MONTHS_SHORT[d.getUTCMonth()]}`
}

// Fuente única: el listado se deriva de blogPostsData (mismas que las páginas
// de detalle). El primer artículo (más reciente) se marca como destacado.
const blogPosts = Object.entries(blogPostsData).map(([slug, p], i) => ({
  slug,
  title: p.title,
  excerpt: p.excerpt,
  category: CATEGORY_ID[p.category] ?? "tendencias",
  author: p.author,
  date: p.date,
  dateShort: shortDate(p.dateISO),
  readTime: p.readTime,
  image: p.image,
  featured: i === 0,
}))

export function InsightsContent() {
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")

  const filteredPosts = blogPosts.filter((post) => {
    const matchesCategory = selectedCategory === "all" || post.category === selectedCategory
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const featuredPost = blogPosts.find((p) => p.featured)
  const regularPosts = filteredPosts.filter((p) => !p.featured)

  return (
    <div className="space-y-8">
      {/* Header */}
      <AnimateIn>
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <h1 className="font-display text-4xl sm:text-5xl font-bold text-balance">
            Insights & Blog
          </h1>
          <p className="text-muted-foreground text-lg text-balance">
            Tendencias, estrategias y análisis del mundo digital para impulsar tu negocio
          </p>
        </div>
      </AnimateIn>

      {/* Search & Filters */}
      <AnimateIn delay={0.1}>
        <div className="glass-card rounded-2xl p-4 sm:p-6 space-y-4">
          {/* Search */}
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Buscar artículos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-background/50 border border-border/50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
            />
          </div>

          {/* Categories */}
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => {
              const Icon = cat.icon
              const isActive = selectedCategory === cat.id
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${isActive
                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                    : "bg-card/50 text-foreground hover:bg-card hover:border-primary/30 border border-border/50"
                    }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {cat.label}
                </button>
              )
            })}
          </div>
        </div>
      </AnimateIn>

      {/* Featured Post */}
      {selectedCategory === "all" && featuredPost && (
        <AnimateIn delay={0.2}>
          <Link href={`/insights/${featuredPost.slug}`}>
            <div className="glass-card-hover rounded-2xl overflow-hidden group">
              <div className="grid lg:grid-cols-2 gap-0">
                {/* Image */}
                <div className="relative h-64 lg:h-auto overflow-hidden">
                  <Image
                    src={featuredPost.image}
                    alt={featuredPost.title}
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-card/90 to-transparent" />
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-bold">
                      Featured
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 sm:p-8 flex flex-col justify-center">
                  <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-3 h-3" />
                      {featuredPost.date}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-3 h-3" />
                      {featuredPost.readTime}
                    </span>
                  </div>

                  <h2 className="font-display text-2xl sm:text-3xl font-bold mb-3 text-balance group-hover:text-primary transition-colors">
                    {featuredPost.title}
                  </h2>
                  <p className="text-muted-foreground mb-4 text-balance">
                    {featuredPost.excerpt}
                  </p>

                  <div className="flex items-center justify-between mt-auto">
                    <div className="flex items-center gap-2 text-sm">
                      <User className="w-4 h-4 text-muted-foreground" />
                      <span className="text-foreground font-medium">{featuredPost.author}</span>
                    </div>
                    <ArrowRight className="w-5 h-5 text-primary group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            </div>
          </Link>
        </AnimateIn>
      )}

      {/* Posts Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {regularPosts.map((post, index) => (
          <AnimateIn key={post.slug} delay={0.3 + index * 0.05}>
            <Link href={`/insights/${post.slug}`}>
              <div className="glass-card-hover rounded-2xl overflow-hidden h-full flex flex-col group">
                {/* Image */}
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-card/90 to-transparent" />
                  <div className="absolute bottom-3 left-3">
                    <span className="px-2.5 py-1 rounded-lg bg-card/80 backdrop-blur-sm text-xs font-medium border border-border/50">
                      {categories.find((c) => c.id === post.category)?.label}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 flex-1 flex flex-col">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {post.dateShort}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {post.readTime}
                    </span>
                  </div>

                  <h3 className="font-display text-lg font-bold mb-2 text-balance group-hover:text-primary transition-colors line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2 text-balance">
                    {post.excerpt}
                  </p>

                  <div className="flex items-center justify-between mt-auto pt-3 border-t border-border/50">
                    <div className="flex items-center gap-2 text-xs">
                      <User className="w-3.5 h-3.5 text-muted-foreground" />
                      <span className="text-foreground font-medium">{post.author}</span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-primary group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            </Link>
          </AnimateIn>
        ))}
      </div>

      {/* Empty State */}
      {filteredPosts.length === 0 && (
        <AnimateIn delay={0.3}>
          <div className="glass-card rounded-2xl p-12 text-center">
            <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
            <h3 className="font-display text-xl font-bold mb-2">No se encontraron artículos</h3>
            <p className="text-muted-foreground text-sm">
              Intenta con otra búsqueda o categoría
            </p>
          </div>
        </AnimateIn>
      )}

      {/* Newsletter CTA */}
      <AnimateIn delay={0.4}>
        <div className="glass-card rounded-2xl p-8 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-chart-2/10 opacity-50" />
          <div className="relative z-10">
            <Sparkles className="w-12 h-12 text-primary mx-auto mb-4" />
            <h3 className="font-display text-2xl font-bold mb-2">
              Mantente al Día
            </h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Recibe nuestros mejores insights directamente en tu inbox
            </p>
            <form className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
              <input
                type="email"
                placeholder="tu@email.com"
                className="flex-1 px-4 py-3 rounded-xl bg-background/50 border border-border/50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
              />
              <button
                type="submit"
                className="px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:shadow-lg hover:shadow-primary/25 transition-all"
              >
                Suscribirme
              </button>
            </form>
          </div>
        </div>
      </AnimateIn>
    </div>
  )
}
