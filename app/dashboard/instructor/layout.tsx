'use client'

import { AppSidebar } from '@/components/appSidebar'
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { InstructorProvider } from '@/contexts/instructorContext'
import { footerNavItems, instructorNavItems } from '@/lib/navlinks'
import { usePathname } from 'next/navigation'

export default function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  // Hide sidebar trigger on session video interface
  const isSessionRoute =
    pathname.includes('/sessions/') && pathname.split('/').length > 4

  return (
    <InstructorProvider>
      <SidebarProvider className="">
        <div className="flex h-screen w-full overflow-hidden bg-white">
          <AppSidebar
            mainNavItems={instructorNavItems}
            footerNavItems={footerNavItems}
          />
          <main className="flex-1 flex flex-col overflow-hidden">
            {!isSessionRoute && (
              <div className="p-4 md:hidden">
                <SidebarTrigger />
              </div>
            )}
            {children}
          </main>
        </div>
      </SidebarProvider>
    </InstructorProvider>
  )
}
