'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { joinSessionFn } from '@/lib/api'
import { getCurrentUserId } from '@/lib/auth'
import { useImageUrl } from '@/lib/utils'
import { MeetStatus } from '@/types/types'
import { useMutation } from '@tanstack/react-query'
import { format } from 'date-fns'
import { Calendar, Clock } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

// Defining the shape of the session object
export interface MeetProps {
  id: string
  instructorId: string
  instructorName: string
  title: string
  startTime: Date
  endTime: Date
  status: MeetStatus
  studentId?: string
  studentName?: string
  studentImageUrl?: string
  showStudentInfo?: boolean
}

export default function MeetCard(meet: MeetProps) {
  // Use student image if showing student info, otherwise use instructor image
  const imageKey = meet.showStudentInfo ? meet.studentId : meet.instructorId
  const savedImageUrl = meet.showStudentInfo
    ? meet.studentImageUrl || useImageUrl(meet.studentId, 'profile')
    : useImageUrl(meet.instructorId, 'profile')
  const displayName = meet.showStudentInfo
    ? meet.studentName
    : meet.instructorName
  const router = useRouter()

  // Mutation to join session and get stream_call_id from backend
  const joinSessionMutation = useMutation({
    mutationFn: () => joinSessionFn(meet.id),
    onSuccess: stream_call_id => {
      // Get current user info from JWT token
      const userInfo = getCurrentUserId()

      if (!userInfo) {
        toast.error('No user info found')
        return
      }

      // Store session_id in sessionStorage for later use (when ending the session)
      sessionStorage.setItem('current_session_id', meet.id)

      // If current user is the instructor for this session, route to instructor dashboard
      // Otherwise, route to student dashboard
      const isInstructor = meet.instructorId === userInfo.userId

      const basePath = isInstructor
        ? '/dashboard/instructor/sessions'
        : '/dashboard/student/sessions'

      // Navigate to the session with the stream_call_id from backend
      router.push(`${basePath}/${stream_call_id}`)
    },
    onError: error => {
      console.error('Failed to join session:', error)
      toast.error('Failed to join session. Please try again.')
    },
  })

  // Get initials from instructor name
  const getInitials = (name: string) => {
    const parts = name.split(' ')
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase()
    }
    return name.substring(0, 2).toUpperCase()
  }

  // Format date and time
  const formatDate = (date: Date) => {
    const today = new Date()
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    if (format(date, 'yyyy-MM-dd') === format(today, 'yyyy-MM-dd')) {
      return 'Today'
    } else if (format(date, 'yyyy-MM-dd') === format(tomorrow, 'yyyy-MM-dd')) {
      return 'Tomorrow'
    } else {
      return format(date, 'EEE, MMM dd')
    }
  }

  const formatTimeRange = (start: Date, end: Date) => {
    return `${format(start, 'h:mm aa')} - ${format(end, 'h:mm aa')}`
  }

  // Determine button text and style based on status
  const getButtonConfig = () => {
    // If mutation is loading, show loading state
    if (joinSessionMutation.isPending) {
      return {
        text: 'Joining...',
        variant: 'default' as const,
        disabled: true,
      }
    }

    switch (meet.status) {
      case 'scheduled':
        // Check if session is in the near future (within 15 minutes)
        const now = new Date()
        const timeDiff = new Date(meet.startTime).getTime() - now.getTime()
        const minutesDiff = Math.floor(timeDiff / (1000 * 60))

        if (minutesDiff <= 40 && minutesDiff >= -60) {
          return {
            text: 'Join',
            variant: 'default' as const,
            disabled: false,
          }
        } else {
          return {
            text: 'Join Later',
            variant: 'outline' as const,
            disabled: true,
          }
        }
      case 'completed':
        return {
          text: 'Completed',
          variant: 'outline' as const,
          disabled: true,
        }
      case 'cancelled':
        return {
          text: 'Cancelled',
          variant: 'outline' as const,
          disabled: true,
        }
      default:
        return {
          text: 'Join',
          variant: 'default' as const,
          disabled: false,
        }
    }
  }

  const buttonConfig = getButtonConfig()

  const handleJoin = () => {
    if (!buttonConfig.disabled && meet.status === 'scheduled') {
      // Trigger the mutation to join the session
      // The mutation will handle getting stream_call_id and routing
      joinSessionMutation.mutate()
    }
  }

  return (
    <div className="w-full max-w-4xl">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 rounded-xl border bg-card p-5 sm:p-6 hover:shadow-lg transition-all duration-300 hover:border-neutral-300">
        {/* Left section: Avatar and session details */}
        <div className="flex items-start sm:items-center gap-4 flex-1 min-w-0 w-full sm:w-auto">
          <Avatar className="h-14 w-14 sm:h-16 sm:w-16 flex-shrink-0 ring-2 ring-neutral-100">
            <AvatarImage src={savedImageUrl || undefined} alt={displayName} />
            <AvatarFallback className="bg-gradient-to-br from-neutral-100 to-neutral-200 text-neutral-700 font-semibold text-lg">
              {getInitials(displayName || '')}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-base sm:text-lg text-foreground mb-1 line-clamp-2 sm:line-clamp-1">
              {meet.title}
            </h3>
            <p className="text-sm text-muted-foreground truncate">
              {displayName}
            </p>
          </div>
        </div>

        {/* Middle section: Date and time for desktop */}
        <div className="hidden sm:flex flex-col gap-2.5 flex-shrink-0 min-w-[180px]">
          <div className="flex items-center gap-2.5 text-sm text-foreground">
            <Calendar className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            <span className="font-medium whitespace-nowrap">
              {formatDate(new Date(meet.startTime))}
            </span>
          </div>
          <div className="flex items-center gap-2.5 text-sm text-foreground">
            <Clock className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            <span className="font-medium whitespace-nowrap">
              {formatTimeRange(
                new Date(meet.startTime),
                new Date(meet.endTime)
              )}
            </span>
          </div>
        </div>

        {/* Mobile date/time - show below avatar section on small screens */}
        <div className="sm:hidden flex flex-col gap-2 w-full pl-[72px]">
          <div className="flex items-center gap-2 text-sm text-foreground">
            <Calendar className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            <span className="font-medium">
              {formatDate(new Date(meet.startTime))},{' '}
              {format(new Date(meet.startTime), 'MMM dd')}
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm text-foreground">
            <Clock className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            <span className="font-medium">
              {formatTimeRange(
                new Date(meet.startTime),
                new Date(meet.endTime)
              )}
            </span>
          </div>
        </div>

        {/* Right section: Join button */}
        <div className="w-full sm:w-auto pl-[72px] sm:pl-0">
          <Button
            variant={buttonConfig.variant}
            size="default"
            onClick={handleJoin}
            disabled={buttonConfig.disabled}
            className="w-full sm:w-auto sm:min-w-[120px] h-10 font-medium"
          >
            {buttonConfig.text}
          </Button>
        </div>
      </div>
    </div>
  )
}
