"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { AnimateIn } from "@/components/animate-in"
import { Footer } from "@/components/footer"
import { ContactSection } from "@/components/contact-section"
import { MessageCircle, Calendar, Video } from "lucide-react"

const CONTACT_METHODS = [
  {
    icon: MessageCircle,
    title: "Live Chat",
    desc: "Instant answers during business hours",
    action: "Start chatting",
    onClick: () => (window as unknown as { openChatWidget?: () => void }).openChatWidget?.(),
  },
  {
    icon: Calendar,
    title: "Book a Call",
    desc: "Reserve 30 minutes with an expert",
    action: "See calendar",
    onClick: () => window.open("https://calendly.com/startbyglobal", "_blank"),
  },
  {
    icon: Video,
    title: "Video Call",
    desc: "Free walkthrough over Zoom or Meet",
    action: "Request a demo",
    onClick: () => window.open("mailto:info@startbyglobal.com?subject=Video call demo request", "_blank"),
  },
]

export function UsContactContent() {
  return (
    <DashboardLayout title="Contact" subtitle="Let's talk about growing your business">
      {/* Contact methods */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {CONTACT_METHODS.map((method, i) => {
          const Icon = method.icon
          return (
            <AnimateIn key={method.title} delay={i * 80}>
              <div
                className="glass-card-hover rounded-xl p-5 flex flex-col gap-3 cursor-pointer group h-full"
                onClick={method.onClick}
              >
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-display font-semibold text-foreground text-sm">{method.title}</h3>
                <p className="text-xs text-muted-foreground">{method.desc}</p>
                <span className="text-xs text-primary font-medium mt-auto">{method.action}</span>
              </div>
            </AnimateIn>
          )
        })}
      </div>

      {/* Formulario + oficinas (ContactSection se auto-localiza a inglés en /us) */}
      <ContactSection />

      <Footer locale="en" />
    </DashboardLayout>
  )
}
