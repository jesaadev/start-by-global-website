"use client"

import { useState } from "react"
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
} from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
  { id: "hero", label: "Dashboard", icon: LayoutDashboard },
  { id: "metrics", label: "Rendimiento", icon: BarChart3 },
  { id: "services", label: "Servicios", icon: Briefcase },
  { id: "portfolio", label: "Portafolio", icon: FolderOpen },
  { id: "testimonials", label: "Testimonios", icon: MessageSquareQuote },
  { id: "contact", label: "Contacto", icon: Mail },
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
  const [activeSection, setActiveSection] = useState("hero")

  const handleNavClick = (id: string) => {
    setActiveSection(id)
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
        <div className={cn("flex items-center gap-3 px-4 h-16 border-b border-border/50", collapsed && "justify-center")}>
          <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-primary text-primary-foreground font-bold font-display text-sm shrink-0">
            SG
          </div>
          {!collapsed && (
            <div className="flex flex-col">
              <span className="font-display font-bold text-sm text-foreground leading-tight">Start By Global</span>
              <span className="text-[10px] text-muted-foreground leading-tight">Marketing Digital</span>
            </div>
          )}
        </div>

        {/* Nav Items */}
        <nav className="flex-1 py-4 px-2 flex flex-col gap-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = activeSection === item.id
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNavClick(item.id)}
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
              </button>
            )
          })}
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
                className="flex items-center justify-center rounded-md bg-secondary/60 text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
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
