'use client'

import NewSessionDialog from '@/components/session/newSessionDialog'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from '@/components/ui/item'
import { ScrollArea } from '@/components/ui/scroll-area'
import { apiService } from '@/lib/api'
import { Calendar, Clock, ShieldAlertIcon, Video } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

interface Session {
  id: string
  title: string
  host_id: string
  guest_id: string
  description: string
  start_time: string
  end_time: string
  stream_call_id: string
  status: 'scheduled' | 'active' | 'ended'
  duration_minutes: number
  host: { username: string; email: string }
  guest: { username: string; email: string }
}

export default function Sessions() {
  const [loading, setLoading] = useState(true)
  const [session, setSession] = useState<Session[]>([])
  const router = useRouter()

  const formatTime = (isoTime: string) => {
    const date = new Date(isoTime)

    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    })
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  const canJoinWithEnd = (
    startTime: string,
    endTime: string,
    earlyMinutes = 5
  ) => {
    const now = Date.now()
    const start = new Date(startTime).getTime()
    const end = new Date(endTime).getTime()

    return now >= start - earlyMinutes * 60 * 1000 && now <= end
  }
  useEffect(() => {
    const getSeesion = async () => {
      try {
        const session = await apiService('/session/get-session')
        console.log(session)
        setSession(session as Session[])
      } catch (error) {
        console.log(error)
      } finally {
        setLoading(false)
      }
    }

    getSeesion()
  }, [])

  if (loading) return <div>Loading...</div>

  return (
    <ScrollArea className="h-screen p-5 space-y-3">
      <div className=" flex items-center justify-between">
        <h1 className="text-center font-italic">Sessions</h1>
        <NewSessionDialog />
      </div>

      <div className="flex w-full flex-col gap-6">
        {session.map((s, i) => (
          <Item key={i} variant="outline">
            <ItemMedia variant="icon">
              <ShieldAlertIcon />
            </ItemMedia>
            <ItemContent>
              <ItemTitle>{s.title}</ItemTitle>
              <ItemDescription>{s.description}</ItemDescription>
              <div className="flex flex-wrap gap-x-4 text-sm mt-1">
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <Calendar className="h-4 w-4 shrink-0" />
                  <span className="font-medium">
                    {formatDate(s.start_time)}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <Clock className="h-4 w-4 shrink-0" />
                  <span className="font-medium">
                    {formatTime(s.start_time)}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <Video className="h-4 w-4 shrink-0" />
                  <span className="font-medium">{s.duration_minutes} mins</span>
                </div>
              </div>
              <Badge>{s.status}</Badge>
            </ItemContent>
            {/* {s.status === 'scheduled' &&
              canJoinWithEnd(s.start_time, s.end_time) && ( */}
            <ItemActions>
              <Button
                size="sm"
                variant="outline"
                onClick={() => router.push(`/meeting/${s.id}`)}
              >
                Join Call
              </Button>
            </ItemActions>
            {/* )} */}
          </Item>
        ))}
      </div>
    </ScrollArea>
  )
}
