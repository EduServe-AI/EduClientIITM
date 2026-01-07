'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { saveAccessToken } from '@/lib/auth'
import { Eye, EyeOff } from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'

export default function StudentAuthLogin() {
  const router = useRouter()

  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [showPassword, setShowPassword] = useState<boolean>(false)

  // Handling the student login
  const handleLogin = async () => {
    if (!email || !password) {
      toast.error('Please enter both email and password')
      return
    }

    setIsLoading(true)
    try {
      // Here we need to call the student login mutation using tanstack query

      const response = {
        data: { accessToken: 'token', student: { onboarded: true } },
      }

      const { accessToken, student: studentData } = response.data

      // Save the access token
      saveAccessToken(accessToken)

      toast.success('Student Signed In Successfully!')

      // If user onboarded , need to redirect to student dashboard else redirect to student onboarding
      if (studentData.onboarded) {
        router.push('/dashboard/student')
      } else {
        router.push('/onboarding/student')
      }
    } catch (error) {
      if (error instanceof Error) {
        console.error('Login failed:', error)
        toast.error(error.message || 'Login failed. Please try again.')
      } else {
        toast.error('An unknown error occurred during login.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleSignIn = () => {
    // TODO: Implement Google sign-in
    toast.info('Google sign-in coming soon!')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
      <div className="w-full max-w-md">
        {/* Brand Logo */}
        <div className="flex justify-center mb-8">
          <div className="w-16 h-16 bg-neutral-400 rounded-2xl flex items-center justify-center">
            <Image
              src="/Brand_Logo.png"
              alt="Brand Logo"
              width={48}
              height={48}
              className="object-contain"
            />
          </div>
        </div>

        {/* Welcome Text */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">Welcome</h1>
          <p className="text-sm text-gray-600">
            Log in to start using Eduserve AI
          </p>
        </div>

        {/* Login Form */}
        <div className="space-y-5">
          {/* Email Field */}
          <div className="space-y-2">
            <Label
              htmlFor="email"
              className="text-sm font-normal text-gray-700"
            >
              Email address*
            </Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder=""
              className="h-11 border-gray-300 rounded-lg focus:border-gray-900 focus:ring-gray-900"
            />
          </div>

          {/* Password Field */}
          <div className="space-y-2">
            <Label
              htmlFor="password"
              className="text-sm font-normal text-gray-700"
            >
              Password*
            </Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder=""
                className="h-11 border-gray-300 rounded-lg focus:border-gray-900 focus:ring-gray-900 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? (
                  <Eye className="h-5 w-5" />
                ) : (
                  <EyeOff className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>

          {/* Forgot Password */}
          <div className="text-left">
            <button
              type="button"
              className="text-sm text-gray-500 hover:text-gray-700"
              onClick={() => toast.info('Forgot password feature coming soon!')}
            >
              Forgot password?
            </button>
          </div>

          {/* Continue Button */}
          <Button
            onClick={handleLogin}
            disabled={isLoading}
            className="w-full h-12 bg-black hover:bg-gray-800 text-white rounded-lg font-medium"
          >
            {isLoading ? 'Loading...' : '← Continue'}
          </Button>

          {/* Sign Up Link */}
          <div className="text-center">
            <span className="text-sm text-gray-600">
              Don&apos;t have an account?{' '}
            </span>
            <button
              type="button"
              className="text-sm text-gray-900 font-medium hover:underline"
              onClick={() => router.push('/auth/student/signup')}
            >
              Sign up
            </button>
          </div>

          {/* Divider */}
          <div className="relative py-3">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-gray-50 text-gray-500">OR</span>
            </div>
          </div>

          {/* Google Sign In */}
          <Button
            variant="outline"
            onClick={handleGoogleSignIn}
            className="w-full h-12 border-gray-300 rounded-lg font-medium hover:bg-gray-50 flex items-center justify-center gap-3"
          >
            <Image
              src="/Google.jpeg"
              alt="Google"
              width={20}
              height={20}
              className="object-contain"
            />
            <span className="text-gray-900">Continue with Google</span>
          </Button>
        </div>
      </div>
    </div>
  )
}
