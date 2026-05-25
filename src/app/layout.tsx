import type { Metadata } from 'next'
import { DM_Sans, Space_Mono } from 'next/font/google'
import { BottomNav } from '@/components/demo/BottomNav'
import { TopBar } from '@/components/demo/TopBar'
import './globals.css'

const dmSans = DM_Sans({
  variable: '--font-dm-sans',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
})

const spaceMono = Space_Mono({
  variable: '--font-space-mono',
  subsets: ['latin'],
  weight: ['400', '700'],
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
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ALTR — Sponsorship OS',
    description:
      'Live properties get funded. Brands get presence. The AI agent for Live IP × brand match across ASIA.',
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
      className={`${dmSans.variable} ${spaceMono.variable} h-full`}
    >
      <body className="flex min-h-screen flex-col bg-demo-bg font-sans text-demo-text">
        <TopBar />
        <main className="flex flex-1 flex-col">{children}</main>
        <BottomNav />
      </body>
    </html>
  )
}
