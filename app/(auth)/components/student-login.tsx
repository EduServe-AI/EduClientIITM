'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { apiService } from '@/lib/api'
import { saveAccessToken } from '@/lib/auth'
import { EyeClosed, EyeOff, Loader2 } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'

interface LoginResponse {
  data: {
    accessToken: string
    student: {
      onboarded: boolean
    }
  }
}

interface StudentLoginProps {
  setIsSignin: (value: boolean) => void
}

export default function StudentLogin({ setIsSignin }: StudentLoginProps) {
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [showPassword, setShowPassword] = useState<boolean>(false)
  const router = useRouter()
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const handleLogin = async () => {
    if (!email || !password) {
      toast.error('Please enter both email and password')
      return
    }

    setIsLoading(true)
    try {
      const response = await apiService<LoginResponse>('/auth/student-login', {
        method: 'POST',
        body: { email, password },
      })

      const { accessToken, student: studentData } = response.data

      saveAccessToken(accessToken)
      toast.success('Student Signed In Successfully!')

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

  return (
    <>
      {/* Welcome heading */}
      <h1 className="text-3xl sm:text-4xl font-bold text-[#0a66c2] italic mb-8">
        Welcome, Back
      </h1>

      <div className="flex flex-col gap-5">
        {/* Email */}
        <div className="flex flex-col gap-1">
          <Input
            id="student-login-email"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="Email or Phone"
            className="h-12 rounded-md border-gray-300 bg-[#f3f6f8] text-[15px] px-4 focus-visible:ring-2 focus-visible:ring-[#0a66c2] focus-visible:border-[#0a66c2] transition-all placeholder:text-[#0a66c2]/60"
          />
        </div>

        {/* Password */}
        <div className="flex flex-col gap-1">
          <div className="relative">
            <Input
              id="student-login-password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Password"
              className="h-12 rounded-md border-gray-300 bg-[#f3f6f8] text-[15px] px-4 pr-12 focus-visible:ring-2 focus-visible:ring-[#0a66c2] focus-visible:border-[#0a66c2] transition-all placeholder:text-[#0a66c2]/60"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <EyeClosed className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        {/* Forgot password */}
        <Link
          href="#"
          className="text-sm text-[#0a66c2] hover:text-[#004182] font-semibold transition-colors w-fit"
        >
          Forgot password?
        </Link>

        {/* Login + Sign up buttons side by side */}
        <div className="flex flex-row gap-4 pt-2">
          <Button
            onClick={handleLogin}
            disabled={isLoading}
            className="flex-1 h-12 rounded-full bg-[#0a66c2] hover:bg-[#004182] text-white font-semibold text-[15px] shadow-sm transition-all duration-200 cursor-pointer"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Loading...
              </>
            ) : (
              'Login'
            )}
          </Button>

          <Button
            variant="outline"
            onClick={() => setIsSignin(false)}
            className="flex-1 h-12 rounded-full border-2 border-[#0a66c2] text-[#0a66c2] font-semibold text-[15px] bg-transparent hover:bg-[#0a66c2]/5 transition-all duration-200 cursor-pointer"
          >
            Sign up
          </Button>
        </div>

        {/* Google */}
        <div className="relative flex items-center my-2">
          <div className="flex-1 border-t border-gray-200" />
          <span className="px-4 text-xs text-gray-400 uppercase tracking-wider">
            or
          </span>
          <div className="flex-1 border-t border-gray-200" />
        </div>

        <Button
          variant="outline"
          className="w-full h-12 rounded-full gap-3 border border-gray-300 text-gray-600 font-medium hover:bg-gray-50 hover:border-gray-400 transition-all cursor-pointer"
          onClick={() => {
            window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/google/student`
          }}
        >
          <Image src="/download.png" alt="Google" width={20} height={20} />
          Sign in with Google
        </Button>
      </div>

      {/* Footer links */}
      <div className="flex flex-wrap justify-center gap-x-3 gap-y-1 text-[11px] text-[#0a66c2]/70 pt-8 mt-auto">
        {/* <Link href="#" className="hover:text-[#0a66c2] transition-colors">Copyright Policy</Link>
        <Link href="#" className="hover:text-[#0a66c2] tr ansition-colors">Privacy Policy</Link>
        <Link href="#" className="hover:text-[#0a66c2] transition-colors">Send Feedback</Link>
        <Link href="#" className="hover:text-[#0a66c2] transition-colors">User Agreement</Link>
        <Link href="#" className="hover:text-[#0a66c2] transition-colors">Cookie Policy</Link> */}
        <span className="text-gray-400">EduServe © 2026</span>
      </div>
    </>
  )
}
