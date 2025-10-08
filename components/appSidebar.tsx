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
import { ChevronsLeft } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { BRAND_ASSETS } from '@/constants/brandAssets'
import { Button } from './ui/button'

// Defining the props the sidebar should accept
interface SidebarProps {
  mainNavItems: NavItem[]
  footerNavItems: NavItem[]
}

export function AppSidebar({ mainNavItems, footerNavItems }: SidebarProps) {
  const { toggleSidebar, state, isMobile, setOpenMobile } = useSidebar()

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
          {footerNavItems.map(item => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton asChild>
                <Link href={item.href}>
                  <item.icon size={20} className="" />
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
