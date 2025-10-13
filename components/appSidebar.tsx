'use client'

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarSeparator,
  useSidebar,
} from '@/components/ui/sidebar'
import { NavItem } from '@/types/types'
import { ChevronsLeft, LogOutIcon, UserCircle2Icon } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { BRAND_ASSETS } from '@/constants/brandAssets'
import { Button } from './ui/button'
import { apiService } from '@/lib/api'
import { removeAccessToken } from '@/lib/auth'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

// Defining the props the sidebar should accept
interface SidebarProps {
  mainNavItems: NavItem[]
  footerNavItems: NavItem[]
}

export function AppSidebar({ mainNavItems }: SidebarProps) {
  const [showLogoutModal, setShowLogoutModal] = useState(false)
  const { toggleSidebar, state, isMobile, setOpenMobile } = useSidebar()
  const router = useRouter()

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
      collapsible={isMobile ? 'offcanvas' : 'icon'}
      className="border-r border-neutral-900 bg-sky-900"
      color=""
    >
      {/* Sidebar Header */}
      <SidebarHeader className="p-4">
        <div className="flex justify-between items-center">
          <Link
            href="/home"
            className="flex items-center gap-2 group-data-[state=closed]:hidden"
          >
            <Image
              src={BRAND_ASSETS.LOGOS.NEW_WORD_MARK}
              width={150}
              height={70}
              alt="EduserveAI"
              className="hover:opacity-80 transition-all duration-300"
              unoptimized
            />
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
                    className="gap-5 group hover:bg-sidebar-primary hover:text-sidebar-primary-foreground"
                  >
                    <Link href={item.href}>
                      <item.icon className="w-20 h-10 min-w-7" />
                      <span className="text-lg font-serif">{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Sidebar Footer */}
      <SidebarFooter className="p-4 mb-9">
        <SidebarSeparator className="border-neutral-900" color="cyan-900" />
        <SidebarMenu>
          {/* For profile */}
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="gap-5 group hover:bg-sidebar-primary hover:text-sidebar-primary-foreground"
            >
              <Link href="#">
                <UserCircle2Icon size={30} />
                <span>Profile</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>

          {/* For Logout */}
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={() => setShowLogoutModal(true)}
              className="gap-5 group hover:bg-sidebar-primary hover:text-sidebar-primary-foreground cursor-pointer"
            >
              <LogOutIcon size={20} />
              <span>Logout</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      {showLogoutModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-transparent bg-opacity-2 backdrop-blur-sm z-10">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-80 text-center">
            <h2 className="text-xl font-semibold mb-4 text-gray-900">
              Confirm Logout
            </h2>
            <p className="text-gray-600 mb-6">
              Are you sure you want to log out?
            </p>

            <div className="flex justify-center gap-4">
              <Button
                onClick={() => setShowLogoutModal(false)}
                className="bg-gray-300 hover:bg-gray-400 text-black"
              >
                Cancel
              </Button>
              <Button
                onClick={() => {
                  setShowLogoutModal(false)
                  handleLogout()
                }}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                Logout
              </Button>
            </div>
          </div>
        </div>
      )}
    </Sidebar>
  )
}
