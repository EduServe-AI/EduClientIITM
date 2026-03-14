'use client'

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { apiService } from '@/lib/api'
import { saveAccessToken } from '@/lib/auth'
import { EyeClosed, EyeOff, Loader2 } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'

interface SignupResponse {
  data: {
    accessToken: string
    instructor: {
      onboarded: boolean
      verified: boolean
    }
  }
}

interface InstructorSignupProps {
  setIsSignin: (value: boolean) => void
}

export default function InstructorSignup({
  setIsSignin,
}: InstructorSignupProps) {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSignup = async () => {
    if (!username || !email || !password) {
      toast.error('Please enter all fields')
      return
    }

    setIsLoading(true)
    try {
      const data = await apiService<SignupResponse>('/auth/instructor-signup', {
        method: 'POST',
        body: { username, email, password },
      })

      saveAccessToken(data.data.accessToken)
      toast.success('Instructor Registered successfully!')
      router.push('/onboarding/instructor')
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : 'Signup failed. Please try again.'
      )
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      {/* Heading */}
      <h1 className="text-3xl sm:text-4xl font-bold text-[#9b2d5e] italic mb-8">
        Create Account
      </h1>

      <div className="flex flex-col gap-4">
        {/* Username */}
        <Input
          id="instructor-signup-username"
          type="text"
          value={username}
          onChange={e => setUsername(e.target.value)}
          placeholder="Username"
          className="h-12 rounded-md border-gray-300 bg-[#faf3f6] text-[15px] px-4 focus-visible:ring-2 focus-visible:ring-[#9b2d5e] focus-visible:border-[#9b2d5e] transition-all placeholder:text-[#9b2d5e]/60"
        />

        {/* Email */}
        <Input
          id="instructor-signup-email"
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="Email"
          className="h-12 rounded-md border-gray-300 bg-[#faf3f6] text-[15px] px-4 focus-visible:ring-2 focus-visible:ring-[#9b2d5e] focus-visible:border-[#9b2d5e] transition-all placeholder:text-[#9b2d5e]/60"
        />

        {/* Password */}
        <div className="relative">
          <Input
            id="instructor-signup-password"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Password"
            className="h-12 rounded-md border-gray-300 bg-[#faf3f6] text-[15px] px-4 pr-12 focus-visible:ring-2 focus-visible:ring-[#9b2d5e] focus-visible:border-[#9b2d5e] transition-all placeholder:text-[#9b2d5e]/60"
          />
          <button
            type="button"
            onClick={() => setShowPassword(v => !v)}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <EyeClosed className="h-4 w-4" />
            )}
          </button>
        </div>

        {/* Sign Up + Login buttons */}
        <div className="flex flex-row gap-4 pt-2">
          <Button
            type="button"
            onClick={handleSignup}
            disabled={isLoading}
            className="flex-1 h-12 rounded-full bg-[#9b2d5e] hover:bg-[#7a2249] text-white font-semibold text-[15px] shadow-sm transition-all duration-200 cursor-pointer"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Loading...
              </>
            ) : (
              'Sign up'
            )}
          </Button>

          <Button
            variant="outline"
            onClick={() => setIsSignin(true)}
            className="flex-1 h-12 rounded-full border-2 border-[#9b2d5e] text-[#9b2d5e] font-semibold text-[15px] bg-transparent hover:bg-[#9b2d5e]/5 transition-all duration-200 cursor-pointer"
          >
            Login
          </Button>
        </div>

        {/* Divider */}
        <div className="relative flex items-center my-2">
          <div className="flex-1 border-t border-gray-200" />
          <span className="px-4 text-xs text-gray-400 uppercase tracking-wider">
            or
          </span>
          <div className="flex-1 border-t border-gray-200" />
        </div>

        {/* Google */}
        <Button
          type="button"
          variant="outline"
          className="w-full h-12 rounded-full gap-3 border border-gray-300 text-gray-600 font-medium hover:bg-gray-50 hover:border-gray-400 transition-all cursor-pointer"
          onClick={() => {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL
            if (!apiUrl) {
              toast.error('Authentication Failed')
              return
            }
            window.location.href = `${apiUrl}/auth/google/instructor`
          }}
        >
          <Image src="/download.png" alt="Google" width={20} height={20} />
          Continue with Google
        </Button>
      </div>

      {/* Footer links */}
      <div className="flex flex-wrap justify-center gap-x-3 gap-y-1 text-[11px] text-[#9b2d5e]/70 pt-8 mt-auto">
        {/* <Link href="#" className="hover:text-[#9b2d5e] transition-colors">Copyright Policy</Link>
        <Link href="#" className="hover:text-[#9b2d5e] transition-colors">Privacy Policy</Link>
        <Link href="#" className="hover:text-[#9b2d5e] transition-colors">User Agreement</Link> */}
        <span className="text-gray-400">EduServe © 2026</span>
      </div>
    </>
  )
}
