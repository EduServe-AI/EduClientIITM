'use client'

import { useStudent } from '@/contexts/studentContext'
import { apiService } from '@/lib/api'
import { removeAccessToken } from '@/lib/auth'
import { getInitials, useImageUrl } from '@/lib/utils'
import { AvatarFallback } from '@radix-ui/react-avatar'
import {
  Bell,
  CalendarCheck2Icon,
  CalendarIcon,
  InboxIcon,
  LogOut,
  Moon,
  Settings,
  Sparkles,
  Sun,
  User,
} from 'lucide-react'
import { useTheme } from 'next-themes'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'
import { LogoutConfirmation } from './logoutConfirmation'
import { Avatar, AvatarImage } from './ui/avatar'
import { Button } from './ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu'
import { Separator } from './ui/separator'
import { SidebarTrigger } from './ui/sidebar'

export default function Header() {
  const { student, isLoading } = useStudent()
  const [showLogoutModal, setShowLogoutModal] = useState(false)
  const imageUrl = useImageUrl(student?.id, 'profile')
  const router = useRouter()
  const pathname = usePathname()
  const { setTheme, resolvedTheme } = useTheme()

  const userType = pathname.includes('/dashboard/student')
    ? 'student'
    : 'instructor'
  const profileLink = `/dashboard/${userType}/profile`

  const handleLogout = async () => {
    try {
      // calling the backend route for clearing cookies
      await apiService('/auth/logout', {
        method: 'POST',
      })

      // removing the accessToken
      removeAccessToken()

      toast.success('You have been logged out.')

      // redirecting to the login page
      router.push('/')

      router.refresh()
    } catch (error) {
      console.error('Logout failed: ', error)
      toast.error('Logout failed. Please try again.')
    }
  }

  if (isLoading) {
    return
  }

  return (
    <header className="bg-background/20 backdrop-blur-md sticky top-0 px-4 flex h-12 shrink-0 items-center justify-between gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 border-b border-border">
      {/* Left side: Welcome Text */}

      <div className="flex items-center justify-between gap-2">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4 mt-1.5" />
        <span>Welcome back</span>
      </div>

      {/* Right side: Notification Icon */}
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          className="size-7"
          onClick={() => setTheme(resolvedTheme === 'light' ? 'dark' : 'light')}
        >
          <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
          <span className="sr-only">Toggle theme</span>
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon" className="size-7 relative">
              <Bell />
              <span className="border-2 border-background rounded-full size-3 bg-red-600 absolute -top-1 -end-1 animate-bounce" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-60">
            <DropdownMenuLabel className="my-1 font-medium">
              Notifications
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="my-1" />
            <>
              <div className="flex items-center gap-3 hover:bg-muted rounded-sm p-2">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-white">
                  <CalendarIcon className="h-4 w-4" />
                </div>
                <div className="flex-1 truncate">
                  <p className="text-sm font-medium truncate">
                    Your call has been confirmed
                  </p>
                  <p className="text-[12px] text-gray-500 dark:text-gray-400">
                    5 minutes ago
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 hover:bg-muted rounded-sm p-2">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-white">
                  <InboxIcon className="h-4 w-4" />
                </div>
                <div className="flex-1 truncate">
                  <p className="text-sm font-medium truncate">
                    You have a new message
                  </p>
                  <p className="text-[12px] text-gray-500 dark:text-gray-400">
                    1 minute ago
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 hover:bg-muted rounded-sm p-2">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-white">
                  <CalendarCheck2Icon className="h-4 w-4" />
                </div>
                <div className="flex-1 truncate">
                  <p className="text-sm font-medium truncate">
                    Your subscription is expiring soon
                  </p>
                  <p className="text-[12px] text-gray-500 dark:text-gray-400">
                    2 hours ago
                  </p>
                </div>
              </div>
            </>
          </DropdownMenuContent>
        </DropdownMenu>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Avatar className="h-[30px] w-[30px] rounded-full flex items-center justify-center bg-primary/20 p-1">
              <AvatarImage
                src={imageUrl || '/student_fallback.jpg'}
                alt={student?.username}
              />
              <AvatarFallback className="rounded-full text-sm font-semibold text-primary">
                {getInitials(student?.username || '', true)}
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            // side={isMobile ? 'bottom' : 'bottom'}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-full flex items-center justify-center">
                  <AvatarImage
                    src={student?.username}
                    alt={student?.username}
                  />
                  <AvatarFallback className="rounded-full">
                    {getInitials(student?.username || '', true)}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">
                    {student?.username}
                  </span>
                  <span className="truncate text-xs">{student?.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <Sparkles />
                Upgrade to Pro
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem asChild>
                <Link href={profileLink}>
                  <User />
                  Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings />
                Settings
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              variant="destructive"
              onClick={() => setShowLogoutModal(true)}
            >
              <LogOut />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        {showLogoutModal && (
          <LogoutConfirmation
            onClose={() => setShowLogoutModal(false)}
            onConfirm={() => {
              setShowLogoutModal(false)
              handleLogout()
            }}
          />
        )}
      </div>
    </header>
  )
}
