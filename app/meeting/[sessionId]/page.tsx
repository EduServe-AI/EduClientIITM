'use client'

import SessionRoom from '@/components/session/sessionRoom'
import { useStudent } from '@/contexts/studentContext'
import { apiService } from '@/lib/api'
import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'

interface PageProps {
  params: {
    sessionId: string
  }
}

interface JoinCallResponse {
  streamCallId: string
}

interface TokenResponse {
  token: string
}

export default function JoinMeeting() {
  const [callId, setCallId] = useState<string | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const params = useParams()
  const sessionId = params?.sessionId ?? ''
  const { student, isLoading: isStudentLoading } = useStudent()

  useEffect(() => {
    const join = async () => {
      if (!student) return

      try {
        // 1. Validate join
        const joinRes = await apiService<JoinCallResponse>(
          `/session/${sessionId}/join`
        )
        console.log('Join response:', joinRes)

        // 2. Get token
        const tokenRes = await apiService<TokenResponse>('/session/token')
        console.log('Token response:', tokenRes)

        setCallId(joinRes.streamCallId)
        setToken(tokenRes.token)
      } catch (error) {
        console.error('Failed to join session:', error)
      }
    }

    join()
  }, [sessionId, student])

  if (isStudentLoading || !student) {
    return <p>Loading user data...</p>
  }

  if (!callId || !token) {
    return <p>Loading session...</p>
  }

  return (
    <SessionRoom
      callId={callId}
      token={token}
      userId={student.id}
      name={student.username}
    />
  )
}
