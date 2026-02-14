import TopLoader from '@/components/topLoader'
import { Toaster } from '@/components/ui/sonner'
import { BRAND_ASSETS } from '@/constants/brandAssets'
import QueryProvider from '@/contexts/queryProvider'
import 'katex/dist/katex.min.css'
import type { Metadata, Viewport } from 'next'
import { Outfit } from 'next/font/google'
import './globals.css'

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
  display: 'swap',
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
    <html lang="en">
      <body
        className={`${outfit.variable} font-sans antialiased bg-white text-black`}
      >
        <QueryProvider>
          <TopLoader />
          {children}
          <Toaster richColors position="top-center" />
        </QueryProvider>
      </body>
    </html>
  )
}
