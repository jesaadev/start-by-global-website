import React from "react"
import type { Metadata, Viewport } from 'next'
import { Inter, Space_Grotesk } from 'next/font/google'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { ChatWidget } from '@/components/chat-widget'
import { SitePixels } from '@/components/site-pixels'
import { AttributionTracker } from '@/components/attribution-tracker'
import { CookieConsent } from '@/components/cookie-consent'
import { ThemeProvider } from '@/components/theme-provider'
import { JsonLd } from '@/components/json-ld'
import { getSiteSettings } from '@/lib/site-settings'

import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const spaceGrotesk = Space_Grotesk({ subsets: ['latin'], variable: '--font-space-grotesk' })

export async function generateMetadata(): Promise<Metadata> {
  const { seo, pixels } = await getSiteSettings()
  let base: URL
  try {
    base = new URL(seo.canonicalBase)
  } catch {
    base = new URL('https://startbyglobal.com')
  }

  return {
    metadataBase: base,
    title: { default: seo.titleDefault, template: seo.titleTemplate },
    description: seo.description,
    keywords: seo.keywords,
    applicationName: seo.siteName,
    alternates: { canonical: '/' },
    openGraph: {
      type: 'website',
      locale: seo.locale,
      siteName: seo.siteName,
      title: seo.titleDefault,
      description: seo.description,
      url: base.toString(),
      images: seo.defaultOgImage
        ? [{ url: seo.defaultOgImage, width: 1200, height: 630, alt: seo.siteName }]
        : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: seo.titleDefault,
      description: seo.description,
      ...(seo.twitterHandle ? { site: seo.twitterHandle, creator: seo.twitterHandle } : {}),
      images: seo.defaultOgImage ? [seo.defaultOgImage] : [],
    },
    robots: seo.indexable
      ? { index: true, follow: true }
      : { index: false, follow: false },
    icons: { icon: '/logo-black.svg', shortcut: '/logo-black.svg', apple: '/logo-black.svg' },
    ...(pixels.googleSiteVerification
      ? { verification: { google: pixels.googleSiteVerification } }
      : {}),
  }
}

export const viewport: Viewport = {
  themeColor: '#0d1117',
}

// ISR: el sitio se regenera periódicamente para reflejar los cambios de SEO y
// pixels guardados en el admin sin necesidad de un nuevo despliegue.
export const revalidate = 60

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const settings = await getSiteSettings()

  return (
    <html lang="es" suppressHydrationWarning>
      <body className={`${inter.variable} ${spaceGrotesk.variable} font-sans antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          {children}
          <ChatWidget />
          <JsonLd settings={settings} />
          <SitePixels pixels={settings.pixels} />
          <AttributionTracker />
          <CookieConsent />
          <SpeedInsights />
        </ThemeProvider>
      </body>
    </html>
  )
}
