'use client'

import { useStudent } from '@/contexts/studentContext'
import { useImageUrl } from '@/lib/utils'
import { BellIcon, Loader2, Menu } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Button } from '../ui/button'
import { useSidebar } from '../ui/sidebar'

import { Skeleton } from '../ui/skeleton'

export default function Header() {
  const { student, isLoading } = useStudent()
  const { state, toggleSidebar, isMobile } = useSidebar()
  const imageUrl = useImageUrl(student?.id, 'profile')
  const router = useRouter()

  return (
    <header className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4">
      {/* Left side: Welcome Text */}
      <div className="flex flex-row gap-1 sm:gap-2">
        <div className="flex items-center gap-2">
          {state === 'collapsed' && !isMobile && (
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleSidebar}
              className="h-8 w-8 hover:bg-accent text-foreground"
            >
              <Menu size={20} />
            </Button>
          )}
          <div className="flex items-center h-7">
            <h1 className="text-md sm:text-base md:text-lg font-serif tracking-wide m-0 text-foreground flex items-center gap-1.5">
              <span>Hi</span>
              {isLoading ? (
                <Skeleton className="h-5 w-24 rounded bg-muted-foreground/20" />
              ) : (
                <span>@{student?.username},</span>
              )}
            </h1>
          </div>
        </div>
        {/* Profile Button - Redirects to profile page */}
        {/* <Button
          variant="ghost"
          onClick={() => router.push('/dashboard/student/profile')}
          className="justify-start gap-2 sm:gap-3 px-0 hover:bg-transparent group"
        >
          <Avatar className="w-5 h-5 sm:w-5 sm:h-5 ring-1 ring-border transition-all">
            <AvatarImage
              src={imageUrl || '/student_fallback.jpg'}
              alt="profile"
            />
            <AvatarFallback className="text-lg sm:text-sm text-center m-2">
              {student?.username?.charAt(0)?.toUpperCase() || 'U'}
            </AvatarFallback>
          </Avatar>
          <span className="text-base sm:text-lg md:text-xl font-serif text-foreground group-hover:text-primary transition-colors">
            {student?.username}
          </span>
        </Button> */}
      </div>

      {/* Right side: Notification Icon */}
      <div className="flex items-center">
        <Button
          variant="ghost"
          size="icon"
          className="hover:bg-muted transition-colors rounded-full relative h-10 w-10 sm:h-11 sm:w-11 bg-secondary"
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
