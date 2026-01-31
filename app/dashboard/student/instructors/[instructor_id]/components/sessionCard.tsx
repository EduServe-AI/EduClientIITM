import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { createSession } from '@/lib/api'
import { cn } from '@/lib/utils'
import { useMutation } from '@tanstack/react-query'
import { format } from 'date-fns'
import { Calendar as CalendarIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'

interface SessionCardProps {
  isOpen: boolean
  onOpen: (open: boolean) => void
  instructorName: string
  instructorId: string
  subjects?: string[]
}

export default function SessionCard({
  isOpen,
  onOpen,
  instructorName,
  instructorId,
  subjects = [],
}: SessionCardProps) {
  const router = useRouter()
  const [selectedSubject, setSelectedSubject] = useState<string>('')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [selectedDate, setSelectedDate] = useState<Date>()
  const [selectedTime, setSelectedTime] = useState<string>('')

  // Generate time slots (e.g., 9:00 AM to 9:00 PM in 30-minute intervals)
  const timeSlots = Array.from({ length: 25 }, (_, i) => {
    const hour = Math.floor(i / 2) + 9
    const minute = i % 2 === 0 ? '00' : '30'
    const period = hour >= 12 ? 'PM' : 'AM'
    const displayHour = hour > 12 ? hour - 12 : hour
    return `${displayHour}:${minute} ${period}`
  })

  // TanStack Query mutation for creating session
  const createSessionMutation = useMutation({
    mutationFn: createSession,
    onSuccess: data => {
      toast.success('Session booked successfully!')
      console.log('Session created:', data)
      resetForm()
      onOpen(false)
      // Redirect to sessions page
      router.push('/dashboard/student/sessions')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to book session')
      console.error('Session creation error:', error)
    },
  })

  const handleBookSession = () => {
    // Validate required fields
    if (
      !selectedSubject ||
      !title ||
      !description ||
      !selectedDate ||
      !selectedTime
    ) {
      toast.error('Please fill in all fields')
      return
    }

    // Convert date and time to ISO string
    const [time, period] = selectedTime.split(' ')
    const [hours, minutes] = time.split(':')
    let hour24 = parseInt(hours)

    if (period === 'PM' && hour24 !== 12) {
      hour24 += 12
    } else if (period === 'AM' && hour24 === 12) {
      hour24 = 0
    }

    const startDateTime = new Date(selectedDate)
    startDateTime.setHours(hour24, parseInt(minutes), 0, 0)

    // Create session data
    const sessionData = {
      instructorId,
      startTime: startDateTime.toISOString(),
      title,
      description,
      durationMinutes: 60, // Default to 60 minutes
    }

    // Call the mutation
    createSessionMutation.mutate(sessionData)
  }

  const resetForm = () => {
    setSelectedSubject('')
    setTitle('')
    setDescription('')
    setSelectedDate(undefined)
    setSelectedTime('')
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpen}>
      <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col p-0">
        {/* Fixed Header */}
        <DialogHeader className="px-6 pt-6 pb-4 border-b">
          <DialogTitle className="text-2xl font-bold">
            Book a Session
          </DialogTitle>
          <DialogDescription>
            Fill in the details to schedule a session with {instructorName}
          </DialogDescription>
        </DialogHeader>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          <div className="space-y-6">
            {/* Instructor Name (Read-only display) */}
            <div className="space-y-2">
              <Label htmlFor="instructor" className="text-sm font-medium">
                Instructor
              </Label>
              <Input
                id="instructor"
                value={instructorName}
                disabled
                className="bg-gray-50"
              />
            </div>

            {/* Subject Selection */}
            <div className="space-y-2">
              <Label htmlFor="subject" className="text-sm font-medium">
                Subject <span className="text-red-500">*</span>
              </Label>
              <Select
                value={selectedSubject}
                onValueChange={setSelectedSubject}
              >
                <SelectTrigger id="subject">
                  <SelectValue placeholder="Select a subject" />
                </SelectTrigger>
                <SelectContent>
                  {subjects.length > 0 ? (
                    subjects.map(subject => (
                      <SelectItem key={subject} value={subject}>
                        {subject}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="general" disabled>
                      No subjects available
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>

            {/* Session Title */}
            <div className="space-y-2">
              <Label htmlFor="title" className="text-sm font-medium">
                Session Title <span className="text-red-500">*</span>
              </Label>
              <Input
                id="title"
                placeholder="e.g., Data Structures - Binary Trees"
                value={title}
                onChange={e => setTitle(e.target.value)}
              />
            </div>

            {/* Problem Description */}
            <div className="space-y-2">
              <Label htmlFor="description" className="text-sm font-medium">
                Problem Description <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="description"
                placeholder="Describe the problem or topic you need help with..."
                value={description}
                onChange={e => setDescription(e.target.value)}
                rows={4}
                // className="resize-none"
              />
            </div>

            {/* Date and Time in a Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Date Picker */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">
                  Preferred Date <span className="text-red-500">*</span>
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        'w-full justify-start text-left font-normal',
                        !selectedDate && 'text-muted-foreground'
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {selectedDate ? (
                        format(selectedDate, 'PPP')
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      disabled={date =>
                        date < new Date(new Date().setHours(0, 0, 0, 0))
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* Time Picker */}
              <div className="space-y-2">
                <Label htmlFor="time" className="text-sm font-medium">
                  Preferred Time <span className="text-red-500">*</span>
                </Label>
                <Select value={selectedTime} onValueChange={setSelectedTime}>
                  <SelectTrigger id="time">
                    <SelectValue placeholder="Select time" />
                  </SelectTrigger>
                  <SelectContent className="max-h-[200px]">
                    {timeSlots.map(time => (
                      <SelectItem key={time} value={time}>
                        {time}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>

        {/* Fixed Footer */}
        <DialogFooter className="px-6 py-4 border-t flex flex-col sm:flex-row gap-2">
          <Button
            variant="outline"
            onClick={() => {
              resetForm()
              onOpen(false)
            }}
            className="w-full sm:w-auto"
            disabled={createSessionMutation.isPending}
          >
            Cancel
          </Button>
          <Button
            onClick={handleBookSession}
            className="w-full sm:w-auto bg-black text-white hover:bg-gray-800"
            disabled={createSessionMutation.isPending}
          >
            {createSessionMutation.isPending ? 'Booking...' : 'Book Session'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
