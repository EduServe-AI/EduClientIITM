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

interface Instructor {
  username: string
  email: string
  password: string
  role: string
  onboarded: boolean
  verified: boolean
}

interface SignupResponse {
  data: {
    accessToken: string
    instructor: Instructor
  }
}

interface InstructorSignupProps {
  isSignin: boolean
  setIsSignin: (value: boolean) => void
}

export default function InstructorSignup({
  setIsSignin,
}: InstructorSignupProps) {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [username, setUsername] = useState<string>('')
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [showPassword, setShowPassword] = useState<boolean>(false)

  const router = useRouter()

  // Handling the instructor signup
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

      // Save the access token
      saveAccessToken(data.data.accessToken)

      toast.success('Instructor Registered successfully!')

      // Redirecting to onboarding
      router.push('/onboarding/instructor')
    } catch (error) {
      if (error instanceof Error) {
        console.error('Signup failed:', error)
        toast.error(error.message || 'Signup failed. Please try again.')
      } else {
        toast.error('An unknown error occurred during login.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col-reverse lg:flex-row items-center justify-center min-h-screen gap-10 p-4 bg-white">
      {/* Right side signup form */}

      <Card className="w-full max-w-md rounded-md justify-center">
        <CardHeader>
          <CardTitle className="text-2xl font-[360] mb-9 ml-1">
            Sign up
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
              <Label
                htmlFor="username"
                className="text-md font-[360] ml-1 mb-1"
              >
                Username
              </Label>
              <Input
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
              />
            </div>

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
                className="bg-sky-400 hover:cursor-pointer hover:bg-sky-500 hover:text-white text-white"
                onClick={handleSignup}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Loading..
                  </>
                ) : (
                  'Sign up'
                )}
              </Button>

              <Button
                variant="outline"
                size="lg"
                className="hover:bg-white hover:cursor-pointer gap-2 items-center justify-center"
                onClick={() => {
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
                <span>Continue with Google</span>
              </Button>
            </div>

            <div className="flex gap-2 justify-center">
              <span className="text-base font-light">
                Already have an account?
              </span>
              <button
                onClick={() => setIsSignin(true)}
                className="text-sky-800 hover:cursor-pointer"
              >
                Sign in here
              </button>
            </div>
          </div>
        </CardContent>

        <CardFooter></CardFooter>
      </Card>

      {/* Mobile Branding */}
      <h1 className="text-4xl font-serif tracking-wide italic lg:hidden mb-2">
        Eduserve AI
      </h1>

      {/* Right side : Heading and Image */}
      <div className="hidden lg:flex p-6 lg:p-10 space-y-4 bg-neutral-100 rounded-lg w-full lg:w-auto flex-col items-center lg:items-start">
        {/* Heading */}
        <h1 className="text-4xl lg:text-5xl font-serif tracking-wide italic text-center">
          Eduserve AI
        </h1>

        {/* Image */}
        <Image
          src="/instructor-online.webp"
          alt="Instructor Illustration"
          width={550}
          height={800}
          className="object-cover w-full h-auto max-w-[300px] lg:max-w-[550px]"
        />

        {/* Copyright */}
        <span>
          <p className="text-sm text-neutral-500 font-medium ml-3">
            © 2025 Eduserve &nbsp;AI
          </p>
        </span>
      </div>
    </div>
  )
}
