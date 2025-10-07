'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function Verification() {
  const router = useRouter()
  const [verified, setVerified] = useState<boolean | null>(null)
  const totalTime = 5 * 60 * 60 // 5 hours in seconds
  const [timeLeft, setTimeLeft] = useState(totalTime)

  // Check verification status
  const checkStatus = async () => {
    try {
      const token = localStorage.getItem('accessToken')
      const res = await fetch(
        'http://localhost:5000/api/v1/instructor/status',
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      const data = await res.json()
      setVerified(data.verified)

      if (data.verified) {
        localStorage.removeItem('verificationStart') // cleanup
        router.push('/dashboard/instructor') // redirect if verified
      }
    } catch (err) {
      console.error('Error fetching verification status', err)
    }
  }

  // On mount: check status and set timer start
  useEffect(() => {
    checkStatus()

    // Get or set the start time
    const storedStart = localStorage.getItem('verificationStart')
    if (!storedStart) {
      const now = Date.now()
      localStorage.setItem('verificationStart', now.toString())
    }

    const startTime = parseInt(localStorage.getItem('verificationStart')!)
    const elapsedSeconds = Math.floor((Date.now() - startTime) / 1000)
    const remaining = totalTime - elapsedSeconds
    setTimeLeft(remaining > 0 ? remaining : 0)

    // Poll every 30s for verification updates
    const pollInterval = setInterval(checkStatus, 30 * 1000)
    return () => clearInterval(pollInterval)
  }, [])

  // Countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        const newVal = prev > 0 ? prev - 1 : 0
        return newVal
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  // Format hh:mm:ss
  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600)
      .toString()
      .padStart(2, '0')
    const m = Math.floor((seconds % 3600) / 60)
      .toString()
      .padStart(2, '0')
    const s = Math.floor(seconds % 60)
      .toString()
      .padStart(2, '0')
    return `${h}:${m}:${s}`
  }

  if (verified === null) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white text-gray-700">
        <p>Loading verification status...</p>
      </div>
    )
  }

  if (verified === false) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-white text-gray-800">
        <h1 className="text-4xl font-semibold mb-4 animate-pulse">
          🔒 You are under verification
        </h1>
        <p className="text-lg text-gray-500 mb-6">
          Please wait while we verify your details.
        </p>
        <div className="text-5xl font-bold tracking-widest text-gray-700 bg-gray-100 px-8 py-4 rounded-2xl shadow-sm">
          {formatTime(timeLeft)}
        </div>
        <p className="text-sm text-gray-400 mt-3">Estimated time: 5 hours</p>
      </div>
    )
  }

  return null
}
