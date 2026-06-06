'use client'

import NextTopLoader from 'nextjs-toploader'
import { usePathname } from 'next/navigation'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

export default function TopLoader() {
  const pathname = usePathname()
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Default color based on theme: black for light theme, white for dark theme
  let color = '#000000'
  if (mounted && resolvedTheme === 'dark') {
    color = '#ffffff'
  }

  // Override color based on route
  if (
    pathname?.includes('/instructor') ||
    (pathname?.includes('/verification') && pathname?.includes('instructor'))
  ) {
    color = '#9b2d5e' // maroon/pink for instructor
  } else if (pathname?.includes('/student')) {
    color = '#0a66c2' // blue for student
  }

  return (
    <NextTopLoader
      color={color}
      initialPosition={0.08}
      crawlSpeed={200}
      height={4}
      crawl={true}
      showSpinner={false}
      easing="ease"
      speed={200}
    />
  )
}
