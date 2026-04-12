'use client'

import { AppSidebar } from '@/components/appSidebar'
import { SidebarProvider, useSidebar } from '@/components/ui/sidebar'
import { InstructorProvider, useInstructor } from '@/contexts/instructorContext'
import { footerNavItems, instructorNavItems } from '@/lib/navlinks'
import { Menu } from 'lucide-react'
import Image from 'next/image'
import { usePathname } from 'next/navigation'

function MobileTrigger() {
  const { toggleSidebar } = useSidebar()
  return (
    <button
      onClick={toggleSidebar}
      className="flex items-center gap-2 p-1 rounded-lg hover:bg-accent transition-colors"
      aria-label="Toggle Sidebar"
    >
      <Image
        src="/Brand_Logo.png"
        alt="EduServe"
        width={28}
        height={28}
        className="object-contain"
      />
      <Menu className="h-5 w-5 text-foreground" />
    </button>
  )
}

function SidebarWithUser() {
  const { instructor } = useInstructor()
  return (
    <AppSidebar
      mainNavItems={instructorNavItems}
      footerNavItems={footerNavItems}
      username={instructor?.username}
    />
  )
}

export default function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  // Hide sidebar trigger on session video interface
  const isSessionRoute =
    pathname.includes('/sessions/') && pathname.split('/').length > 4

  return (
    <InstructorProvider>
      <SidebarProvider className="">
        <div className="flex h-screen w-full overflow-hidden bg-background">
          <SidebarWithUser />
          <main className="flex-1 flex flex-col overflow-hidden">
            {!isSessionRoute && (
              <div className="p-4 md:hidden">
                <MobileTrigger />
              </div>
            )}
            {children}
          </main>
        </div>
      </SidebarProvider>
    </InstructorProvider>
  )
}
