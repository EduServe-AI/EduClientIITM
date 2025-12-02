'use client'

import { apiService } from '@/lib/api'
import { saveAccessToken } from '@/lib/auth'
import { Loader2 } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

interface InstructorData {
  onboarded: boolean
  verified: boolean
}

interface StudentData {
  onboarded: boolean
}

interface UserDataResponse {
  data: {
    instructor?: InstructorData
    student?: StudentData
  }
}

export default function AuthCallback() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Extract token and role from URL query parameters
        const token = searchParams.get('token')
        const role = searchParams.get('role')

        if (!token || !role) {
          setError('Missing authentication credentials')
          toast.error('Authentication failed: Missing credentials')
          setTimeout(() => router.push('/'), 3000)
          return
        }

        // Save the access token to localStorage
        saveAccessToken(token)

        // Fetch user data to determine routing based on role
        const endpoint =
          role === 'instructor' ? '/instructor/me' : '/student/me'

        const userData = await apiService<UserDataResponse>(endpoint, {
          method: 'GET',
        })

        // Route based on role and onboarding/verification status
        if (role === 'instructor') {
          const instructor = userData.data.instructor
          if (!instructor) {
            throw new Error('Instructor data not found')
          }

          // Check onboarding and verification status
          if (instructor.onboarded) {
            if (instructor.verified) {
              toast.success('Welcome back!')
              router.push('/dashboard/instructor')
            } else {
              toast.info('Under verification ...')
              router.push('/verification')
            }
          } else {
            toast.info('Please complete your profile')
            router.push('/onboarding/instructor')
          }
        } else if (role === 'student') {
          const student = userData.data.student
          if (!student) {
            throw new Error('Student data not found')
          }

          // Check onboarding status
          if (student.onboarded) {
            toast.success('Welcome back!')
            router.push('/dashboard/student')
          } else {
            toast.info('Please complete your profile')
            router.push('/onboarding/student')
          }
        } else {
          throw new Error('Invalid role')
        }
      } catch (error) {
        console.error('Authentication callback error:', error)
        setError(
          error instanceof Error
            ? error.message
            : 'An unexpected error occurred'
        )
        toast.error('Authentication failed. Redirecting to login...')
        setTimeout(() => router.push('/'), 3000)
      }
    }

    handleCallback()
  }, [searchParams, router])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-sky-50 to-blue-100">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
        {error ? (
          <div className="space-y-4">
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <h1 className="text-2xl font-semibold text-gray-800">
              Authentication Failed
            </h1>
            <p className="text-gray-600">{error}</p>
            <p className="text-sm text-gray-500">Redirecting to login...</p>
          </div>
        ) : (
          <div className="space-y-4">
            <Loader2 className="h-16 w-16 animate-spin text-sky-500 mx-auto" />
            <h1 className="text-2xl font-semibold text-gray-800">
              Authenticating...
            </h1>
            <p className="text-gray-600">
              Please wait while we verify your credentials
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
