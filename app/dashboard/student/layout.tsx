'use client'

import { AppSidebar } from '@/components/asidebar/appSidebar'
import Header from '@/components/header'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  SidebarInset,
  SidebarProvider,
  useSidebar,
} from '@/components/ui/sidebar'
import { StudentProvider } from '@/contexts/studentContext'
import { footerNavItems, studentNavItems } from '@/lib/navlinks'
import { Menu } from 'lucide-react'
import Image from 'next/image'

function MobileTrigger() {
  const { toggleSidebar } = useSidebar()
  return (
    <button
      onClick={toggleSidebar}
      className="flex items-center gap-2 p-1 rounded-lg hover:bg-neutral-100 transition-colors"
      aria-label="Toggle Sidebar"
    >
      <Image
        src="/Brand_Logo.png"
        alt="EduServe"
        width={28}
        height={28}
        className="object-contain"
      />
      <Menu className="h-5 w-5 text-neutral-700" />
    </button>
  )
}

export default function Layout({ children }: { children: React.ReactNode }) {
  // const pathname = usePathname()

  // Hide sidebar trigger on chat interface and session video
  // const isChatRoute = pathname.includes('/chat/')
  // const isSessionRoute =
  //   pathname.includes('/sessions/') && pathname.split('/').length > 4

  return (
    <StudentProvider>
      <SidebarProvider>
        <AppSidebar
          mainNavItems={studentNavItems}
          footerNavItems={footerNavItems}
        />
        <SidebarInset className="h-[calc(100vh_-_0px)]">
          <Header />
          <ScrollArea className="overflow-x-hidden flex flex-1 flex-col gap-4 px-4">
            {children}
          </ScrollArea>
        </SidebarInset>
      </SidebarProvider>
    </StudentProvider>
  )
}
