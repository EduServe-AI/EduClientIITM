import {
  CallControls,
  CallingState,
  SpeakerLayout,
  StreamTheme,
  useCallStateHooks,
} from '@stream-io/video-react-sdk'
import '@stream-io/video-react-sdk/dist/css/styles.css'
import { useEffect, useRef } from 'react'

interface MyUILayoutProps {
  onLeave?: () => void
}

export default function MyUILayout({ onLeave }: MyUILayoutProps) {
  const { useCallCallingState, useParticipantCount } = useCallStateHooks()
  const callingState = useCallCallingState()
  const participantCount = useParticipantCount()
  const wasJoinedRef = useRef(false)

  // Monitor call state changes
  useEffect(() => {
    // Track if we were ever joined
    if (callingState === CallingState.JOINED) {
      wasJoinedRef.current = true
    }

    // If we were joined before but are no longer joined, the call ended unexpectedly
    // This happens when the other user ends the session
    if (wasJoinedRef.current && callingState !== CallingState.JOINED) {
      console.log('Call state changed from JOINED to:', callingState)
      console.log('Participant count:', participantCount)

      // Wait a bit to ensure it's not just a temporary state change
      const timeoutId = setTimeout(() => {
        if (
          callingState === CallingState.LEFT ||
          callingState === CallingState.IDLE
        ) {
          console.log('Call ended, triggering auto-leave')
          onLeave?.()
        }
      }, 2000) // 2 second delay to avoid false positives

      return () => clearTimeout(timeoutId)
    }
  }, [callingState, participantCount, onLeave])

  if (callingState !== CallingState.JOINED) {
    return (
      <div className="flex items-center justify-center h-screen bg-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-900">Joining session...</p>
          {wasJoinedRef.current && (
            <p className="mt-2 text-sm text-gray-600">
              Session may have ended. Redirecting...
            </p>
          )}
        </div>
      </div>
    )
  }

  return (
    <StreamTheme
      className="h-screen w-full"
      style={
        {
          // Override default dark theme with light theme
          '--str-video__background-color': '#ffffff',
          '--str-video__text-color': '#000000',
          '--str-video__primary-color': '#000000',
          '--str-video__secondary-color': '#6b7280',
          '--str-video__surface-color': '#f3f4f6',
        } as React.CSSProperties
      }
    >
      <div className="flex flex-col h-full w-full relative bg-white">
        <SpeakerLayout participantsBarPosition="bottom" />
        <CallControls onLeave={onLeave} />
      </div>
    </StreamTheme>
  )
}
