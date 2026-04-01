'use client'

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  useSidebar,
} from '@/components/ui/sidebar'
import { apiService } from '@/lib/api'
import { removeAccessToken } from '@/lib/auth'
import { NavItem } from '@/types/types'
import { usePathname, useRouter } from 'next/navigation'
import { toast } from 'sonner'
import NavChatBots from './nav-chatbots'
import NavHeaderLogo from './nav-header-logo'
import NavMain from './nav-main'
import { NavSecondary } from './nav-secondary'

// Defining the props the sidebar should accept
interface SidebarProps {
  mainNavItems: NavItem[]
  footerNavItems: NavItem[]
}

export function AppSidebar({ mainNavItems, footerNavItems }: SidebarProps) {
  const { toggleSidebar, isMobile } = useSidebar()
  const router = useRouter()
  const pathname = usePathname()

  const userType = pathname.includes('/dashboard/student')
    ? 'student'
    : 'instructor'
  const profileLink = `/dashboard/${userType}/profile`
  const isStudent = userType === 'student'

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
    <Sidebar collapsible={isMobile ? 'offcanvas' : 'icon'}>
      {/* Sidebar Header */}
      <SidebarHeader>
        <NavHeaderLogo />
      </SidebarHeader>

      {/* Sidebar Content */}
      <SidebarContent>
        <NavMain mainNavItems={mainNavItems} />

        {/* Recent Chats Section - Only for Students */}
        {isStudent && <NavChatBots />}
        <NavSecondary items={footerNavItems} className="mt-auto" />
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border">
        <div className="px-3">
          <p className="text-xs text-muted-foreground">
            <span>Version </span>
            {process.env.NEXT_PUBLIC_APP_VERSION}
          </p>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
