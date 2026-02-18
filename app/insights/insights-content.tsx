"use client"

import { useState } from "react"
import Link from "next/link"
import { AnimateIn } from "@/components/animate-in"
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

const blogPosts = [
  {
    slug: "ia-marketing-digital-2026",
    title: "IA en Marketing Digital: 5 Tendencias que Dominarán 2026",
    excerpt: "La inteligencia artificial está redefiniendo cómo las marcas se conectan con sus audiencias. Descubre las estrategias que liderarán el próximo año.",
    category: "marketing",
    author: "María González",
    date: "2026-02-15",
    readTime: "8 min",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&q=80",
    featured: true,
  },
  {
    slug: "next-js-15-novedades",
    title: "Next.js 15: Las Nuevas Características que Debes Conocer",
    excerpt: "Exploramos las últimas actualizaciones del framework más popular de React y cómo pueden mejorar tu flujo de desarrollo.",
    category: "desarrollo",
    author: "Carlos Méndez",
    date: "2026-02-12",
    readTime: "6 min",
    image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&q=80",
    featured: false,
  },
  {
    slug: "optimizacion-seo-local",
    title: "SEO Local: Estrategias Avanzadas para República Dominicana",
    excerpt: "Posiciona tu negocio en las búsquedas locales con estas tácticas probadas específicas para el mercado dominicano.",
    category: "marketing",
    author: "Ana Rodríguez",
    date: "2026-02-10",
    readTime: "7 min",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80",
    featured: false,
  },
  {
    slug: "typescript-tips-2026",
    title: "TypeScript: 10 Tips Avanzados para Código Más Robusto",
    excerpt: "Mejora la calidad de tu código con estas técnicas avanzadas de TypeScript que todo desarrollador debería conocer.",
    category: "desarrollo",
    author: "Luis Pérez",
    date: "2026-02-08",
    readTime: "10 min",
    image: "https://images.unsplash.com/photo-1619410283995-43d9134e7656?w=800&q=80",
    featured: false,
  },
  {
    slug: "futuro-web3-empresas",
    title: "Web3 y Blockchain: ¿El Futuro de los Negocios Digitales?",
    excerpt: "Analizamos cómo la descentralización puede impactar tu modelo de negocio y qué oportunidades presenta.",
    category: "tendencias",
    author: "Roberto Santos",
    date: "2026-02-05",
    readTime: "9 min",
    image: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800&q=80",
    featured: false,
  },
  {
    slug: "email-marketing-roi",
    title: "Email Marketing en 2026: Cómo Maximizar tu ROI",
    excerpt: "El email sigue siendo uno de los canales más rentables. Descubre las estrategias que generan resultados reales.",
    category: "marketing",
    author: "Patricia Núñez",
    date: "2026-02-03",
    readTime: "5 min",
    image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&q=80",
    featured: false,
  },
]

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
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                    isActive
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
                  <img
                    src={featuredPost.image}
                    alt={featuredPost.title}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
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
                      {new Date(featuredPost.date).toLocaleDateString("es", { 
                        day: "numeric", 
                        month: "long", 
                        year: "numeric" 
                      })}
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
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
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
                      {new Date(post.date).toLocaleDateString("es", { 
                        day: "numeric", 
                        month: "short" 
                      })}
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
