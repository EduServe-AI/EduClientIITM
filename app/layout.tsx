import { Toaster } from '@/components/ui/sonner'

import TopLoader from '@/components/topLoader'
import { BRAND_ASSETS } from '@/constants/brandAssets'
import 'katex/dist/katex.min.css'
import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'Eduserve AI',
  description: 'On Demand Human and AI Teaching Assistance',
  manifest: '/manifest.json',
  icons: {
    icon: BRAND_ASSETS.FAVICON,
  },
}

export const viewport: Viewport = {
  themeColor: '#ffffff',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: 'cover',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="h-screen">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased h-screen w-screen overflow-hidden`}
      >
        <TopLoader />
        {children}
        <Toaster richColors position="top-center" />
      </body>
    </html>
  )
}
