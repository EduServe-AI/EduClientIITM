'use client'

import { useStudent } from '@/contexts/studentContext'
import { useImageUrl } from '@/lib/utils'
import { AvatarFallback } from '@radix-ui/react-avatar'
import { BellIcon, Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Avatar, AvatarImage } from './ui/avatar'
import { Button } from './ui/button'

export default function Header() {
  const { student, isLoading } = useStudent()
  const imageUrl = useImageUrl(student?.id, 'profile')
  const router = useRouter()
  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-6">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    )
  }

  return (
    <header className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4">
      {/* Left side: Welcome Text */}
      <div className="flex flex-col gap-1 sm:gap-2">
        <h1 className="text-md sm:text-base md:text-lg font-serif text-neutral-800 tracking-wide">
          Welcome back,
        </h1>
        {/* Profile Button - Redirects to profile page */}
        <Button
          variant="ghost"
          onClick={() => router.push('/dashboard/student/profile')}
          className="justify-start gap-2 sm:gap-3 px-0 hover:bg-transparent group"
        >
          <Avatar className="w-7 h-7 sm:w-8 sm:h-8 ring-2 ring-black transition-all">
            <AvatarImage
              src={imageUrl || '/default-avatar.png'}
              alt="profile"
            />
            <AvatarFallback className="text-xs sm:text-sm text-center p-2">
              {student?.username?.substring(0, 2).toUpperCase() || 'U'}
            </AvatarFallback>
          </Avatar>
          <span className="text-base sm:text-lg md:text-xl font-serif text-foreground group-hover:text-primary transition-colors">
            {student?.username}
          </span>
        </Button>
      </div>

      {/* Right side: Notification Icon */}
      <div className="flex items-center">
        <Button
          variant="ghost"
          size="icon"
          className="hover:bg-muted transition-colors rounded-full relative h-10 w-10 sm:h-11 sm:w-11 bg-neutral-200"
          aria-label="Notifications"
        >
          <BellIcon className="h-5 w-5 sm:h-6 sm:w-6 text-foreground" />
          {/* Optional: Notification badge */}
          <span className="absolute top-1 right-1 h-3 w-3 bg-red-500 rounded-full border-2 border-background" />
        </Button>
      </div>
    </header>
  )
}
