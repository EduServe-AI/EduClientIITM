'use client'

import {
  CallControls,
  CallingState,
  ParticipantView,
  StreamCall,
  StreamTheme,
  StreamVideo,
  StreamVideoClient,
  StreamVideoParticipant,
  useCallStateHooks,
} from '@stream-io/video-react-sdk'
import '@stream-io/video-react-sdk/dist/css/styles.css'
import { useEffect, useState } from 'react'

type Props = {
  callId: string
  token: string
  userId: string
  name?: string
}

// set up the user object

export default function SessionRoom({ callId, token, userId, name }: Props) {
  const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY!

  if (!apiKey) {
    console.error('Missing NEXT_PUBLIC_STREAM_API_KEY environment variable')
  }

  const [client, setClient] = useState<StreamVideoClient | null>(null)
  const [call, setCall] = useState<any>(null)

  const user = {
    id: userId,
    name: name || 'User',
    image: `https://getstream.io/random_svg/?id=${userId}&name=${name || 'User'}`,
  }

  useEffect(() => {
    const init = async () => {
      const videoClient = new StreamVideoClient({ apiKey, user, token })
      const videoCall = videoClient.call('default', callId)
      await videoCall.join({ create: true })

      setClient(videoClient)
      setCall(videoCall)
    }

    init()

    return () => {
      call?.leave()
      client?.disconnectUser()
    }
  }, [callId, token, userId])

  if (!client || !call) {
    return <div>Loading video call...</div>
  }

  return (
    <StreamVideo client={client}>
      <StreamCall call={call}>
        <MyUILayout />
      </StreamCall>
    </StreamVideo>
  )
}

export const MyUILayout = () => {
  const { useCallCallingState, useLocalParticipant, useRemoteParticipants } =
    useCallStateHooks()

  const callingState = useCallCallingState()
  const localParticipant = useLocalParticipant()
  const remoteParticipants = useRemoteParticipants()

  if (callingState !== CallingState.JOINED) {
    return <div>Loading...</div>
  }

  return (
    <StreamTheme>
      <MyParticipantList participants={remoteParticipants} />
      {/* <MyFloatingLocalParticipant participant={localParticipant} /> */}
      <CallControls />
    </StreamTheme>
  )
}

export const MyParticipantList = (props: {
  participants: StreamVideoParticipant[]
}) => {
  const { participants } = props

  console.log(participants)
  return (
    <div style={{ display: 'flex', flexDirection: 'row', gap: '8px' }}>
      {participants.map(participant => (
        <ParticipantView
          participant={participant}
          key={participant.sessionId}
        />
      ))}
    </div>
  )
}

export const MyFloatingLocalParticipant = (props: {
  participant?: StreamVideoParticipant
}) => {
  const { participant } = props
  if (!participant) {
    return <p>Error: No local participant</p>
  }

  return (
    <div
      style={{
        position: 'absolute',
        top: '15px',
        left: '15px',
        width: '240px',
        height: '135px',
        boxShadow: 'rgba(0, 0, 0, 0.1) 0px 0px 10px 3px',
        borderRadius: '12px',
      }}
    >
      <ParticipantView participant={participant} />
    </div>
  )
}
