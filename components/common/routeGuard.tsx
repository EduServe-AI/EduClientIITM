'use client'

import { getAccessToken, getCurrentUserId, saveAccessToken } from '@/lib/auth'
import api from '@/lib/axios'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

// Pages that require Authentication
const PROTECTED_ROUTES = [
  '/dashboard',
  '/onboarding',
  '/verification',
  '/profile',
]

// Public auth pages (where logged-in users shouldn't navigate)
const AUTH_ROUTES = ['/student', '/instructor']

export default function RouteGuard({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const router = useRouter()
  const [authorized, setAuthorized] = useState(false)
  const [checkedPath, setCheckedPath] = useState('')

  useEffect(() => {
    const authCheck = async () => {
      // Check if it's a protected route
      const isProtectedRoute = PROTECTED_ROUTES.some(route =>
        pathname.startsWith(route)
      )

      const isAuthRoute = AUTH_ROUTES.some(
        route =>
          pathname === route ||
          pathname === `${route}/login` ||
          pathname === `${route}/signup`
      )

      // Check local storage for initial token state
      let user = getCurrentUserId()
      let token = getAccessToken()

      // If missing token but on a protected route, attempt a background refresh
      // (User might have a valid HTTP-only refreshToken cookie but lost localStorage)
      if (isProtectedRoute && !token) {
        try {
          const { data } = await api.post('/auth/refresh-token')
          const newAccessToken = data?.data?.accessToken || data?.accessToken
          if (newAccessToken) {
            token = newAccessToken
            saveAccessToken(newAccessToken)
            api.defaults.headers.common['Authorization'] =
              `Bearer ${newAccessToken}`
            user = getCurrentUserId()
          }
        } catch (err) {
          // Token refresh failed, user is definitely unauthenticated
        }
      }

      if (isProtectedRoute && !token) {
        setAuthorized(false)
        // Navigate to the appropriate auth page based on URL to get the role
        if (pathname.includes('/instructor')) {
          router.push('/instructor')
        } else {
          router.push('/student')
        }
      } else if (isAuthRoute && token) {
        // Redirect safely logged-in users away from the login/signup page
        const role =
          user?.role ||
          (pathname.includes('/instructor') ? 'instructor' : 'student')
        router.push(`/dashboard/${role}`)
      } else {
        setAuthorized(true)
      }

      // Mark this path as fully verified
      setCheckedPath(pathname)
    }

    authCheck()
  }, [pathname, router])

  const isProtectedRoute = PROTECTED_ROUTES.some(route =>
    pathname.startsWith(route)
  )

  // Deep protection: Prevent flashing protected content OR
  // nested React Queries from running early for the new route
  // by blocking render completely until the current exact pathname is verified
  if (isProtectedRoute && checkedPath !== pathname) {
    return (
      <div className="h-screen w-full flex items-center justify-center font-outfit text-gray-500">
        Loading...
      </div>
    )
  }

  if (isProtectedRoute && !authorized) {
    return (
      <div className="h-screen w-full flex items-center justify-center font-outfit text-gray-500">
        Loading...
      </div>
    )
  }

  return <>{children}</>
}
