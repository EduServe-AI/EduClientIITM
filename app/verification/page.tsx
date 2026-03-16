'use client'

import { Clock, Home } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function Verification() {
  const router = useRouter()

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="text-center p-8 rounded-lg">
        <Clock className="w-16 h-16 text-blue-500 mx-auto animate-pulse" />
        <h1 className="mt-6 text-2xl font-semibold text-gray-900">
          Verification in Progress
        </h1>
        <p className="mt-2 text-gray-600">
          Please wait while we verify your account
        </p>
        <button
          onClick={() => router.push('/')}
          className="mt-6 inline-flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200 shadow-sm cursor-pointer"
        >
          <Home className="w-4 h-4" />
          Go to Home
        </button>
      </div>
    </div>
  )
}
