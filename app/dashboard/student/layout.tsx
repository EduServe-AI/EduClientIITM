'use client'

import { AppSidebar } from '@/components/appSidebar'
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { StudentProvider } from '@/contexts/studentContext'
import { footerNavItems, studentNavItems } from '@/lib/navlinks'
import { usePathname } from 'next/navigation'

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
                <SidebarTrigger />
              </div>
            )}
            {children}
          </main>
        </div>
      </SidebarProvider>
    </StudentProvider>
  )
}
