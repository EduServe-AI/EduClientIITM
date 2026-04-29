'use client'

import { LogoutConfirmation } from '@/components/common/logoutConfirmation'
import { RecentChatsList } from '@/components/recentChatsList'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
  useSidebar,
} from '@/components/ui/sidebar'
import { BRAND_ASSETS } from '@/constants/brandAssets'
import { apiService } from '@/lib/api'
import { removeAccessToken } from '@/lib/auth'
import { useImageUrl } from '@/lib/utils'
import { NavItem } from '@/types/types'
import {
  ChevronsLeft,
  LogOutIcon,
  MessageSquareIcon,
  MoreHorizontal,
  UserCircle2Icon,
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'
import { Button } from './ui/button'
import { Separator } from './ui/separator'

// Generate a consistent gradient based on the first letter of the username
function getAvatarGradient(letter: string): string {
  const gradients: Record<string, string> = {
    A: 'from-rose-500 to-pink-600',
    B: 'from-orange-500 to-amber-600',
    C: 'from-amber-500 to-yellow-600',
    D: 'from-yellow-500 to-lime-600',
    E: 'from-lime-500 to-green-600',
    F: 'from-green-500 to-emerald-600',
    G: 'from-emerald-500 to-teal-600',
    H: 'from-teal-500 to-cyan-600',
    I: 'from-cyan-500 to-sky-600',
    J: 'from-sky-500 to-blue-600',
    K: 'from-blue-500 to-indigo-600',
    L: 'from-indigo-500 to-violet-600',
    M: 'from-violet-500 to-purple-600',
    N: 'from-purple-500 to-fuchsia-600',
    O: 'from-fuchsia-500 to-pink-600',
    P: 'from-pink-500 to-rose-600',
    Q: 'from-rose-400 to-orange-500',
    R: 'from-orange-400 to-amber-500',
    S: 'from-amber-400 to-yellow-500',
    T: 'from-yellow-400 to-lime-500',
    U: 'from-lime-400 to-green-500',
    V: 'from-green-400 to-emerald-500',
    W: 'from-emerald-400 to-teal-500',
    X: 'from-teal-400 to-cyan-500',
    Y: 'from-cyan-400 to-sky-500',
    Z: 'from-sky-400 to-blue-500',
  }
  return gradients[letter.toUpperCase()] || 'from-gray-500 to-gray-600'
}

// Defining the props the sidebar should accept
interface SidebarProps {
  mainNavItems: NavItem[]
  footerNavItems: NavItem[]
  username?: string
  userId?: string
}

export function AppSidebar({ mainNavItems, username, userId }: SidebarProps) {
  const [showLogoutModal, setShowLogoutModal] = useState(false)
  const { toggleSidebar, isMobile } = useSidebar()
  const router = useRouter()
  const pathname = usePathname()

  const userType = pathname.includes('/dashboard/student')
    ? 'student'
    : 'instructor'
  const profileLink = `/dashboard/${userType}/profile`
  const isStudent = userType === 'student'

  const displayName = username || 'User'
  const firstLetter = displayName.charAt(0).toUpperCase()
  const avatarGradient = getAvatarGradient(firstLetter)

  const imageUrl = useImageUrl(userId, 'profile')

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

  return (
    <Sidebar
      collapsible="offcanvas"
      className="border-r border-sidebar-border"
      color=""
    >
      {/* Sidebar Header */}
      <SidebarHeader className="p-4">
        <div className="flex justify-between items-center">
          <Link
            href="/home"
            className="flex items-center gap-2 group-data-[state=closed]:hidden bg-sidebar"
          >
            <h1 className="font-semibold text-xl ml-2">(eduserve.ai)</h1>
          </Link>
          <div className="flex items-center gap-2">
            {/* Chevron Left */}
            <div className="group-data-[state=closed]:hidden">
              <Button
                variant="link"
                size="icon"
                onClick={() => toggleSidebar()}
                className="bg-transparent border-none cursor-pointer"
              >
                <ChevronsLeft size={20} />
              </Button>
            </div>

            {/* Brand Logo */}
            <div
              className="hidden group-data-[state=closed]:block cursor-pointer"
              onClick={() => toggleSidebar()}
            >
              <Image
                src={BRAND_ASSETS.LOGOS.LOGO}
                alt="logo"
                className=""
                width={32}
                height={32}
              />
            </div>
          </div>
        </div>
      </SidebarHeader>

      {/* Sidebar Content */}
      <SidebarContent className="px-2 flex flex-col flex-1 min-h-0">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainNavItems.map(item => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    className="gap-2 group hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                    onClick={() => {
                      // Close sidebar on mobile after navigation
                      if (isMobile) {
                        toggleSidebar()
                      }
                    }}
                  >
                    <Link href={item.href} className="flex items-center gap-5">
                      <div className="flex-shrink-0 min-w-[20px]">
                        <item.icon className="h-5 w-5" strokeWidth={2} />
                      </div>
                      <span className="text-lg font-serif">{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Recent Chats Section - Only for Students */}
        {isStudent && (
          <>
            <Separator className="my-2 border-sidebar-border" />

            <p className="text-lg font-semibold px-4 py-3 group-data-[state=closed]:hidden">
              Chats
            </p>

            <div className="flex-1 min-h-0 overflow-auto">
              <RecentChatsList />
            </div>
          </>
        )}
      </SidebarContent>

      {/* Sidebar Footer — Username Dropdown */}
      <SidebarFooter className="p-4 mb-2">
        <SidebarSeparator className="border-sidebar-border" />
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton className="w-full gap-3 py-6 cursor-pointer hover:bg-sidebar-accent hover:text-sidebar-accent-foreground">
                  {/* Avatar circle with image or first letter */}
                  {imageUrl && imageUrl !== '/placeholder.jpg' ? (
                    <Avatar className="h-8 w-8 shrink-0 rounded-full shadow-md">
                      <AvatarImage
                        src={imageUrl}
                        alt={displayName}
                        className="object-cover"
                      />
                      <AvatarFallback
                        className={`bg-gradient-to-br ${avatarGradient} text-white font-bold text-sm`}
                      >
                        {firstLetter}
                      </AvatarFallback>
                    </Avatar>
                  ) : (
                    <div
                      className={`flex-shrink-0 h-8 w-8 rounded-full bg-gradient-to-br ${avatarGradient} flex items-center justify-center shadow-md`}
                    >
                      <span className="text-sm font-bold text-white">
                        {firstLetter}
                      </span>
                    </div>
                  )}
                  {/* Username + ellipsis */}
                  <span className="flex-1 text-left text-sm font-medium truncate group-data-[state=closed]:hidden">
                    {displayName}
                  </span>
                  <MoreHorizontal className="h-4 w-4 flex-shrink-0 text-muted-foreground group-data-[state=closed]:hidden" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>

              <DropdownMenuContent
                side="top"
                align="start"
                className="w-56 mb-1"
              >
                {/* Profile */}
                <DropdownMenuItem
                  className="cursor-pointer gap-3 py-2.5"
                  onClick={() => {
                    router.push(profileLink)
                    if (isMobile) toggleSidebar()
                  }}
                >
                  <UserCircle2Icon className="h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>

                {/* Feedback */}
                <DropdownMenuItem
                  className="cursor-pointer gap-3 py-2.5"
                  onClick={() => {
                    toast.info('Feedback feature coming soon!')
                  }}
                >
                  <MessageSquareIcon className="h-4 w-4" />
                  <span>Feedback</span>
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                {/* Logout */}
                <DropdownMenuItem
                  className="cursor-pointer gap-3 py-2.5"
                  onClick={() => setShowLogoutModal(true)}
                >
                  <LogOutIcon className="h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      {showLogoutModal && (
        <LogoutConfirmation
          onClose={() => setShowLogoutModal(false)}
          onConfirm={() => {
            setShowLogoutModal(false)
            handleLogout()
          }}
        />
      )}
    </Sidebar>
  )
}
