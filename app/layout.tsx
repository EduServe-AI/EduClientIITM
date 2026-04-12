import { ThemeProvider } from '@/components/themeProvider'
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
  themeColor: '#1a1a1d',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: 'cover',
}

import RouteGuard from '@/components/common/routeGuard'

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${outfit.variable} font-sans antialiased bg-background text-foreground`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange={false}
        >
          <QueryProvider>
            <RouteGuard>
              <TopLoader />
              {children}
              <Toaster richColors position="top-center" />
            </RouteGuard>
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
