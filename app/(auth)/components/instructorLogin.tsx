import { Button } from '@/components/ui/button'
import { useState } from 'react'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Image from 'next/image'
import Link from 'next/link'
import { toast } from 'sonner'
import { saveAccessToken } from '@/lib/auth'
import { useRouter } from 'next/navigation'

interface InstructorLoginProps {
  isSignin: boolean
  setIsSignin: (value: boolean) => void
}

const BaseUrl = process.env.NEXT_PUBLIC_API_URL

export default function InstructorLogin({
  isSignin,
  setIsSignin,
}: InstructorLoginProps) {
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [showPassword, setShowPassword] = useState<boolean>(false)

  const router = useRouter()

  const [isLoading, setIsLoading] = useState<boolean>(false)

  // Handling the student login
  const handleLogin = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`${BaseUrl}/auth/instructor-login`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        toast.error('Login failed')
        console.error(`Login failed ${data.message}`)
        return
      }

      // Save the access token
      saveAccessToken(data.data.accessToken)

      toast.success('Instructor Signed In')

      // If user onboarded , need to redirect to instructor dashboard else redirect to student onboarding
      const instructor = data.data.instructor
      instructor.onboarded
        ? router.push('/dashboard/instructor')
        : router.push('/onboarding/instructor')
    } catch (error) {
      console.error(`Login error : ${error}`)
      toast.error('Login Failed')
      return
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex ml-15 mt-10 items-center gap-10">
      {/* Left side : Heading and Image */}
      <div className="p-10 space-y-4 bg-neutral-50 rounded-lg">
        {/* Heading */}
        <h1 className="text-5xl font-serif tracking-wide italic text-start">
          Eduserve AI
        </h1>

        {/* Image */}
        <Image
          src="/instructor-online.webp"
          alt="Instructor Illustration"
          width={550}
          height={800}
          className="object-cover ml-1"
        />

        {/* Copyright */}
        <span>
          <p className="text-sm text-neutral-500 font-medium">
            © 2025 Eduserve &nbsp;AI
          </p>
        </span>
      </div>

      {/* Right side : Signin Card */}
      <Card className="w-120 rounded-md justify-center mb-30">
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
              <Link href="/" className="text-md font-[365] hover:text-sky-600">
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
                    <Eye className="h-5 w-5" />
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
                onClick={() => {}}
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
                  Don't have an account ?
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
  )
}
