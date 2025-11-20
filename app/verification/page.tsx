'use client'

import { Clock } from 'lucide-react'

export default function Verification() {
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
      </div>
    </div>
  )
}
