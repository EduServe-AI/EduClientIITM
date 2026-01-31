'use client'

import MyUILayout from '@/components/streamLayout'
import { useInstructor } from '@/contexts/instructorContext'
import { endSessionFn, getCallTokenFn } from '@/lib/api'
import { useImageUrl } from '@/lib/utils'
import {
  StreamCall,
  StreamVideo,
  StreamVideoClient,
} from '@stream-io/video-react-sdk'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useParams, useRouter } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'
import { toast } from 'sonner'

export default function InstructorSessionCall() {
  const { instructor, isLoading: instructorLoading } = useInstructor()
  const params = useParams()
  const router = useRouter()

  // Retrieving the stream call id from the route params
  const stream_call_id = params.stream_id as string

  // Get session_id from sessionStorage (stored when joining)
  const [sessionId, setSessionId] = useState<string | null>(null)

  useEffect(() => {
    const storedSessionId = sessionStorage.getItem('current_session_id')
    setSessionId(storedSessionId)
  }, [])

  const imageUrl = useImageUrl(instructor?.id, 'profile')

  // Mutation to end the session
  const endSessionMutation = useMutation({
    mutationFn: () => {
      if (!sessionId) {
        throw new Error('No session ID found')
      }
      return endSessionFn(sessionId)
    },
    onSuccess: () => {
      toast.success('Session ended successfully')
      // Clean up sessionStorage
      sessionStorage.removeItem('current_session_id')
      // Redirect to sessions page
      router.push('/dashboard/instructor/sessions')
    },
    onError: error => {
      console.error('Failed to end session:', error)
      toast.error("Failed to end session properly, but you've left the call")
      // Still redirect even if API fails
      sessionStorage.removeItem('current_session_id')
      router.push('/dashboard/instructor/sessions')
    },
  })

  // Token fetching using tanstack query - MUST be called unconditionally
  const {
    data: token,
    isLoading: isTokenLoading,
    isError: isTokenError,
  } = useQuery({
    queryKey: ['stream-token'],
    queryFn: getCallTokenFn,
    staleTime: 60 * 60 * 1000, // Caching the token for the one hour ,
    retry: 1,
    enabled: !!stream_call_id, // Only fetch if we have stream_call_id
  })

  // ALL HOOKS MUST BE CALLED BEFORE ANY CONDITIONAL RETURNS
  // Use useMemo to create client only once when dependencies change
  const client = useMemo(() => {
    if (!instructor || !token) return null

    const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY

    console.log('Getting or creating client with:', {
      apiKey: apiKey,
      apiKeyPresent: !!apiKey,
      userId: instructor.id,
      userName: instructor.username,
      hasToken: !!token,
      tokenLength: token?.length,
    })

    if (!apiKey) {
      console.error(
        'NEXT_PUBLIC_STREAM_API_KEY is not defined in environment variables!'
      )
      toast.error(
        'Stream API key is missing. Please check environment configuration.'
      )
      return null
    }

    try {
      // Use getOrCreateInstance instead of constructor to prevent duplicates
      const videoClient = StreamVideoClient.getOrCreateInstance({
        apiKey: apiKey,
        user: {
          id: instructor.id,
          image: imageUrl,
          name: instructor.username,
        },
        token: token,
      })
      console.log('StreamVideoClient ready (created or retrieved existing)')
      return videoClient
    } catch (error) {
      console.error('Error getting StreamVideoClient:', error)
      toast.error('Failed to initialize video client')
      return null
    }
  }, [instructor?.id, token, imageUrl, instructor?.username])

  // Use useMemo to create call only once
  const call = useMemo(() => {
    if (!client || !stream_call_id) return null
    return client.call('default', stream_call_id)
  }, [client, stream_call_id])

  // Cleanup client on unmount
  useEffect(() => {
    return () => {
      if (client) {
        console.log('Disconnecting client...')
        client.disconnectUser()
      }
    }
  }, [client])

  // Join the call when it's ready
  useEffect(() => {
    if (call) {
      console.log('Joining call...')
      call
        .join()
        .then(() => {
          console.log('Successfully joined the call!')
        })
        .catch(error => {
          console.error('Error joining call:', error)
          toast.error('Failed to join the session')
        })
    }

    // Leave the call on unmount
    return () => {
      if (call) {
        console.log('Leaving call...')
        call
          .leave()
          .then(() => console.log('Left the call'))
          .catch(error => console.error('Error leaving call:', error))
      }
    }
  }, [call])

  // Show error toast only once when token fails to load
  useEffect(() => {
    if (isTokenError) {
      toast.error('Failed to fetch stream token. Please try again.')
    }
  }, [isTokenError])

  // NOW WE CAN DO CONDITIONAL RENDERING AFTER ALL HOOKS ARE CALLED
  console.log('Instructor Loading:', instructorLoading)
  console.log('Token Loading:', isTokenLoading)
  console.log('Token:', token)
  console.log('Instructor:', instructor)

  // Check for stream_call_id first
  if (!stream_call_id) {
    toast.error('Stream call id is missing')
    throw new Error('stream call id required')
  }

  // Wait for both instructor and token to be loaded
  if (instructorLoading || isTokenLoading) {
    console.log(
      'Still loading... Instructor:',
      instructorLoading,
      'Token:',
      isTokenLoading
    )
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading session...</p>
          <p className="mt-2 text-sm text-gray-500">
            Instructor: {instructorLoading ? 'Loading...' : 'Ready'} | Token:{' '}
            {isTokenLoading ? 'Loading...' : 'Ready'}
          </p>
        </div>
      </div>
    )
  }

  // Check if instructor is available after loading
  if (!instructor) {
    toast.error('Instructor context must be present')
    throw new Error('Instructor context must be present')
  }

  // Check if token is available after loading
  if (!token || isTokenError) {
    console.log('Token error or missing token')
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <p className="text-red-600">Failed to load session token</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  // Check if client and call are ready
  if (!client || !call) {
    console.log('Client or call not ready')
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Preparing session...</p>
        </div>
      </div>
    )
  }

  console.log('Rendering StreamVideo component')

  // Handle leave button click
  const handleLeave = async () => {
    try {
      // First leave the Stream call
      if (call) {
        await call.leave()
        console.log('Left the Stream call')
      }
      // Then trigger the backend API call and redirect
      endSessionMutation.mutate()
    } catch (error) {
      console.error('Error leaving call:', error)
      // Still trigger end session even if leave fails
      endSessionMutation.mutate()
    }
  }

  return (
    <StreamVideo client={client}>
      <StreamCall call={call}>
        <MyUILayout onLeave={handleLeave} />
      </StreamCall>
    </StreamVideo>
  )
}
