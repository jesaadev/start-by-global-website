"use client"

import { useState } from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import {
  LayoutDashboard,
  Briefcase,
  FolderOpen,
  MessageSquareQuote,
  Mail,
  BarChart3,
  Globe,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  Users,
  BookOpen,
} from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/servicios", label: "Servicios", icon: Briefcase },
  { href: "/portafolio", label: "Portafolio", icon: FolderOpen },
  { href: "/nosotros", label: "Nosotros", icon: Users },
  { href: "/insights", label: "Insights", icon: BookOpen },
  { href: "/contacto", label: "Contacto", icon: Mail },
]

const dashboardScrollItems = [
  { id: "hero", label: "Inicio" },
  { id: "metrics", label: "Rendimiento" },
  { id: "services", label: "Servicios" },
  { id: "portfolio", label: "Portafolio" },
  { id: "testimonials", label: "Testimonios" },
  { id: "contact", label: "Contacto" },
]

const regions = [
  { flag: "DO", label: "Rep. Dominicana" },
  { flag: "ES", label: "Espana" },
  { flag: "MX", label: "Latinoamerica" },
  { flag: "US", label: "EE.UU." },
]

export function SidebarNav() {
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const pathname = usePathname()
  const isHome = pathname === "/"

  const handleScrollTo = (id: string) => {
    setMobileOpen(false)
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" })
    }
  }

  return (
    <>
      {/* Mobile toggle */}
      <button
        type="button"
        onClick={() => setMobileOpen(!mobileOpen)}
        className="fixed top-4 left-4 z-50 lg:hidden flex items-center justify-center w-10 h-10 rounded-lg bg-card/80 backdrop-blur-xl border border-border/50 text-foreground"
        aria-label={mobileOpen ? "Cerrar menu" : "Abrir menu"}
      >
        {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-30 bg-background/60 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileOpen(false)}
          onKeyDown={(e) => e.key === "Escape" && setMobileOpen(false)}
          role="button"
          tabIndex={0}
          aria-label="Cerrar menu"
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-40 h-screen flex flex-col border-r border-border/50 bg-sidebar transition-all duration-300",
          collapsed ? "w-[72px]" : "w-[240px]",
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        {/* Logo */}
        <div className={cn("flex items-center gap-3 px-4 h-16 border-b border-border/50", collapsed && "justify-center px-2")}>
          <Link href="/" className="flex items-center gap-3" onClick={() => setMobileOpen(false)}>
            <img 
              src="/logo-black.svg" 
              alt="Start By Global" 
              className={cn("shrink-0 transition-all invert", collapsed ? "h-8" : "h-10")}
            />
          </Link>
        </div>

        {/* Main Navigation */}
        <nav className="flex-1 py-4 px-2 flex flex-col gap-1 overflow-y-auto">
          <div className={cn("px-1 mb-2", collapsed && "hidden")}>
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Navegacion</p>
          </div>

          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200 group",
                  collapsed && "justify-center px-0",
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                )}
                title={collapsed ? item.label : undefined}
              >
                <Icon className={cn("w-5 h-5 shrink-0", isActive && "text-primary")} />
                {!collapsed && <span className="truncate">{item.label}</span>}
                {isActive && !collapsed && (
                  <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary" />
                )}
              </Link>
            )
          })}

          {/* Dashboard scroll links - only on home */}
          {isHome && (
            <>
              <div className={cn("px-1 mt-4 mb-2", collapsed && "hidden")}>
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Secciones</p>
              </div>
              {dashboardScrollItems.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleScrollTo(item.id)}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-lg text-xs transition-all duration-200 text-muted-foreground hover:bg-secondary hover:text-foreground",
                    collapsed && "justify-center px-0"
                  )}
                  title={collapsed ? item.label : undefined}
                >
                  <BarChart3 className="w-3.5 h-3.5 shrink-0" />
                  {!collapsed && <span className="truncate">{item.label}</span>}
                </button>
              ))}
            </>
          )}
        </nav>

        {/* Regions */}
        <div className={cn("px-3 py-3 border-t border-border/50", collapsed && "px-2")}>
          {!collapsed && (
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-2 px-1">Regiones</p>
          )}
          <div className={cn("flex gap-1.5 flex-wrap", collapsed && "flex-col items-center")}>
            {regions.map((r) => (
              <div
                key={r.flag}
                className="flex items-center justify-center rounded-md bg-secondary/60 text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors cursor-pointer"
                title={r.label}
              >
                <Globe className={cn("w-4 h-4", collapsed ? "m-2" : "m-1.5")} />
                {!collapsed && <span className="text-[10px] pr-2">{r.flag}</span>}
              </div>
            ))}
          </div>
        </div>

        {/* Collapse toggle (desktop) */}
        <div className="hidden lg:flex px-2 py-3 border-t border-border/50">
          <button
            type="button"
            onClick={() => setCollapsed(!collapsed)}
            className="w-full flex items-center justify-center gap-2 py-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors text-xs"
            aria-label={collapsed ? "Expandir menu" : "Colapsar menu"}
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            {!collapsed && <span>Colapsar</span>}
          </button>
        </div>
      </aside>
    </>
  )
}
