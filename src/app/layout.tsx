import type { Metadata } from 'next'
import { Inter, JetBrains_Mono } from 'next/font/google'
import { FloatingChatWidget } from '@/components/chat/FloatingChatWidget'
import { Header } from '@/components/site/Header'
import './globals.css'

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
})

const jetbrainsMono = JetBrains_Mono({
  variable: '--font-jetbrains',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  metadataBase: new URL('https://demo.altr.haus'),
  title: 'ALTR — Sponsorship OS',
  description:
    'Sponsorship infrastructure for live events across ASIA. The AI agent for Live IP × brand match — search, match, settle in seconds, prove ROI from real revenue.',
  openGraph: {
    title: 'ALTR — Sponsorship OS',
    description:
      'Live properties get funded. Brands get presence. The AI agent for Live IP × brand match across ASIA.',
    url: 'https://demo.altr.haus',
    siteName: 'ALTR',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'ALTR — Sponsorship OS',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ALTR — Sponsorship OS',
    description:
      'Live properties get funded. Brands get presence. The AI agent for Live IP × brand match across ASIA.',
    images: ['/og-image.png'],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${jetbrainsMono.variable} h-full`}
    >
      <body className="flex min-h-screen flex-col bg-altr-bg font-sans text-altr-white">
        <Header />
        <main className="flex flex-1 flex-col">{children}</main>
        <FloatingChatWidget />
      </body>
    </html>
  )
}
