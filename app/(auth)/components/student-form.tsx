'use client'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
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

interface StudentFormProps {
  isSignin: boolean
  setIsSignin: (value: boolean) => void
}

export function StudentLoginForm({
  setIsSignin,
}: Omit<StudentFormProps, 'isSignin'>) {
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
    <Card className="w-full rounded-lg border shadow-sm bg-white">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold mb-6">Sign in</CardTitle>
      </CardHeader>

      <CardContent>
        <div className="flex flex-col gap-5">
          <div className="flex flex-col">
            <Label htmlFor="email" className="text-sm font-medium mb-2">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="your@email.com"
            />
          </div>

          <div className="flex flex-col">
            <Label htmlFor="password" className="text-sm font-medium mb-2">
              Password
            </Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <EyeClosed className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2">
              <input type="checkbox" className="w-4 h-4" />
              <span className="text-gray-600">Remember me</span>
            </label>
            <Link href="#" className="text-gray-500 hover:text-gray-700">
              Forgot password?
            </Link>
          </div>

          <div className="flex flex-col gap-3 pt-2">
            <Button
              onClick={handleLogin}
              disabled={isLoading}
              className="w-full bg-sky-400 hover:bg-sky-500 text-white h-11"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Loading...
                </>
              ) : (
                'Sign in'
              )}
            </Button>

            <Button
              variant="outline"
              className="w-full gap-2"
              onClick={() => {
                window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/google/student`
              }}
            >
              <Image src="/download.png" alt="google" width="20" height="20" />
              <span>Sign in with Google</span>
            </Button>
          </div>
        </div>
      </CardContent>

      <CardFooter>
        <div className="w-full text-center text-sm">
          <span className="text-gray-600">
            Don&apos;t have an account?{' '}
            <button
              onClick={() => setIsSignin(false)}
              className="text-sky-600 font-medium hover:underline"
            >
              Sign up
            </button>
          </span>
        </div>
      </CardFooter>
    </Card>
  )
}

interface SignupResponse {
  data: {
    accessToken: string
    student: {
      onboarded: boolean
    }
  }
}

export function StudentSignupForm({
  setIsSignin,
}: Omit<StudentFormProps, 'isSignin'>) {
  const [username, setUsername] = useState<string>('')
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [showPassword, setShowPassword] = useState<boolean>(false)
  const router = useRouter()
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const handleSignup = async () => {
    if (!username || !email || !password) {
      toast.error('Please enter all fields')
      return
    }

    setIsLoading(true)
    try {
      const data = await apiService<SignupResponse>('/auth/student-signup', {
        method: 'POST',
        body: { username, email, password },
      })

      saveAccessToken(data.data.accessToken)
      toast.success('User Signed Up Successfully!')
      router.push('/onboarding/student')
    } catch (error) {
      if (error instanceof Error) {
        console.error('Signup failed:', error)
        toast.error(error.message || 'Signup failed. Please try again.')
      } else {
        toast.error('An unknown error occurred during signup.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full rounded-lg border shadow-sm bg-white">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold mb-6">Sign up</CardTitle>
      </CardHeader>

      <CardContent>
        <div className="flex flex-col gap-5">
          <div className="flex flex-col">
            <Label htmlFor="username" className="text-sm font-medium mb-2">
              Username
            </Label>
            <Input
              id="username"
              type="text"
              value={username}
              onChange={e => setUsername(e.target.value)}
              placeholder="your_username"
            />
          </div>

          <div className="flex flex-col">
            <Label htmlFor="email" className="text-sm font-medium mb-2">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="your@email.com"
            />
          </div>

          <div className="flex flex-col">
            <Label htmlFor="password" className="text-sm font-medium mb-2">
              Password
            </Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <EyeClosed className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-3 pt-2">
            <Button
              onClick={handleSignup}
              disabled={isLoading}
              className="w-full bg-sky-400 hover:bg-sky-500 text-white h-11"
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
              className="w-full gap-2"
              onClick={() => {
                window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/google/student`
              }}
            >
              <Image src="/download.png" alt="google" width="20" height="20" />
              <span>Continue with Google</span>
            </Button>
          </div>
        </div>
      </CardContent>

      <CardFooter>
        <div className="w-full text-center text-sm">
          <span className="text-gray-600">
            Already have an account?{' '}
            <button
              onClick={() => setIsSignin(true)}
              className="text-sky-600 font-medium hover:underline"
            >
              Sign in here
            </button>
          </span>
        </div>
      </CardFooter>
    </Card>
  )
}
