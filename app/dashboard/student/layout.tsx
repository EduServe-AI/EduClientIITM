'use client'

import { AppSidebar } from '@/components/appSidebar'
import { SidebarProvider, useSidebar } from '@/components/ui/sidebar'
import { StudentProvider } from '@/contexts/studentContext'
import { footerNavItems, studentNavItems } from '@/lib/navlinks'
import { Menu } from 'lucide-react'
import Image from 'next/image'
import { usePathname } from 'next/navigation'

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
  const pathname = usePathname()

  // Hide sidebar trigger on chat interface and session video
  const isChatRoute = pathname.includes('/chat/')
  const isSessionRoute =
    pathname.includes('/sessions/') && pathname.split('/').length > 4

  return (
    <StudentProvider>
      <SidebarProvider className="!min-h-0 h-full">
        <div className="flex h-screen w-full overflow-hidden bg-white">
          <AppSidebar
            mainNavItems={studentNavItems}
            footerNavItems={footerNavItems}
          />
          <main className="flex-1 flex flex-col overflow-hidden">
            {!isChatRoute && !isSessionRoute && (
              <div className="p-4 md:hidden">
                <MobileTrigger />
              </div>
            )}
            {children}
          </main>
        </div>
      </SidebarProvider>
    </StudentProvider>
  )
}
