"use client"

import type { ReactNode } from "react"
import { SidebarNav } from "@/components/sidebar-nav"

interface DashboardLayoutProps {
  children: ReactNode
  title: string
  subtitle: string
}

export function DashboardLayout({ children, title, subtitle }: DashboardLayoutProps) {
  return (
    <div className="flex min-h-screen bg-background">
      <SidebarNav />
      <main className="flex-1 lg:ml-[240px] transition-all duration-300">
        <div className="flex flex-col gap-6 p-4 sm:p-6 lg:p-8 max-w-[1400px] mx-auto">
          <header className="flex items-center justify-between pl-12 lg:pl-0">
            <div>
              <h1 className="font-display text-2xl font-bold text-foreground">{title}</h1>
              <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-card border border-border/50">
                <div className="w-2 h-2 rounded-full bg-chart-3" />
                <span className="text-xs text-muted-foreground">Online</span>
              </div>
              <div className="flex items-center justify-center w-9 h-9 rounded-full bg-primary/10 text-primary font-display font-bold text-xs border border-primary/20">
                SG
              </div>
            </div>
          </header>
          {children}
        </div>
      </main>
    </div>
  )
}
