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
    instructor: {
      onboarded: boolean
      verified: boolean
    }
  }
}

interface InstructorLoginProps {
  isSignin: boolean
  setIsSignin: (value: boolean) => void
}

export default function InstructorLogin({ setIsSignin }: InstructorLoginProps) {
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [showPassword, setShowPassword] = useState<boolean>(false)

  const router = useRouter()

  const [isLoading, setIsLoading] = useState<boolean>(false)

  // Handling the student login
  const handleLogin = async () => {
    if (!email || !password) {
      toast.error('Please enter both email and password')
      return
    }
    setIsLoading(true)
    try {
      const data = await apiService<LoginResponse>('/auth/instructor-login', {
        method: 'POST',
        body: { email, password },
      })

      // Save the access token
      saveAccessToken(data.data.accessToken)

      toast.success('Instructor Signed In')

      // If user onboarded , need to redirect to instructor dashboard else redirect to student onboarding
      const instructor = data.data.instructor
      if (instructor.onboarded) {
        if (instructor.verified) {
          router.push('/dashboard/instructor')
        } else {
          router.push('/verification')
        }
      } else {
        router.push('/onboarding/instructor')
      }
    } catch (error) {
      // console.error(`Login error : ${error}`)
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
    // UPDATED CONTAINER: w-full and split logic
    <div className="flex flex-col lg:flex-row items-center justify-center min-h-screen bg-white p-4 gap-6 lg:gap-10 lg:p-10">
      {/* SECTION 1: BRANDING / IMAGE (Left on Desktop) */}
      <div className="hidden lg:flex flex-col justify-center items-center bg-neutral-50 rounded-lg w-full lg:w-1/2 h-full min-h-[500px] lg:h-auto p-10 space-y-4">
        {/* Heading */}
        <h1 className="text-4xl lg:text-6xl font-serif tracking-wide italic text-center">
          Eduserve AI
        </h1>

        {/* Image - Responsive Width */}
        <div className="relative w-full max-w-[550px] lg:max-w-none lg:w-[80%] h-auto">
          <Image
            src="/instructor-online.webp"
            alt="Instructor Illustration"
            width={0}
            height={0}
            sizes="100vw"
            className="w-full h-auto object-contain"
          />
        </div>

        {/* Copyright */}
        <span>
          <p className="text-sm text-neutral-500 font-medium ml-3">
            © 2025 Eduserve &nbsp;AI
          </p>
        </span>
      </div>

      {/* Mobile Branding */}
      <h1 className="text-4xl font-serif tracking-wide italic lg:hidden mb-2">
        Eduserve AI
      </h1>

      {/* SECTION 2: SIGNIN FORM (Right on Desktop) */}
      <div className="w-full lg:w-1/2 flex justify-center">
        <Card className="w-full max-w-md lg:max-w-xl rounded-md justify-center shadow-none border-0 lg:border lg:shadow-sm">
          <CardHeader>
            <CardTitle className="text-2xl font-[360] mb-9 ml-1">
              Sign in
            </CardTitle>

            {/* Tab Content */}
            <div className="flex justify-between w-full border-b-2">
              <div className="relative w-1/2 text-center pb-2">
                <span className="text-md font-light text-gray-900">
                  Instructors
                </span>
                <div className="absolute bottom-0 left-0 w-full h-[2px] bg-black" />
              </div>
              <div className="w-1/2 text-center pb-2">
                <Link
                  href="/"
                  className="text-md font-[365] hover:text-sky-600"
                >
                  Students
                </Link>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            <div className="flex flex-col gap-5 justify-center">
              <div className="flex flex-col ">
                <Label htmlFor="email" className="text-md font-[360] ml-1 mb-1">
                  Email
                </Label>
                <Input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                />
              </div>

              <div className="flex flex-col">
                <Label
                  htmlFor="password"
                  className="text-md font-[360] ml-1 mb-1"
                >
                  Password
                </Label>

                <div className="relative">
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
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

              <Link className="text-md text-neutral-500 ml-1" href="#">
                Forgot Password ?
              </Link>

              <div className="flex flex-col gap-8">
                <Button
                  variant="outline"
                  size="lg"
                  className="bg-sky-400 hover:cursor-pointer hover:bg-sky-500 hover:text-white text-white "
                  onClick={handleLogin}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Loading..
                    </>
                  ) : (
                    'Sign in'
                  )}
                </Button>

                <Button
                  variant="outline"
                  size="lg"
                  className="hover:bg-white hover:cursor-pointer gap-2 items-center justify-center"
                  onClick={() => {
                    const apiUrl = process.env.NEXT_PUBLIC_API_URL
                    if (!apiUrl) {
                      console.error('Error: Backend Url is not defined')
                      toast.error('Authentication Failed')
                      return
                    }
                    window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/google/instructor`
                  }}
                >
                  <Image
                    src="/download.png"
                    alt="google"
                    width="30"
                    height="30"
                    className=""
                  />
                  <span>Sign in with Google</span>
                </Button>

                <div className="flex gap-2 justify-center">
                  <span className="text-base font-light">
                    Don&apos;t have an account ?
                  </span>
                  <button
                    onClick={() => setIsSignin(false)}
                    className="text-sky-800 hover:cursor-pointer"
                  >
                    Hire one
                  </button>
                </div>
              </div>
            </div>
          </CardContent>

          <CardFooter></CardFooter>
        </Card>
      </div>
    </div>
  )
}
