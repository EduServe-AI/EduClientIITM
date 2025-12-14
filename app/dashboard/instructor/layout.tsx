'use client'

import { AppSidebar } from '@/components/appSidebar'
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { InstructorProvider } from '@/contexts/instructorContext'
import { footerNavItems, instructorNavItems } from '@/lib/navlinks'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <InstructorProvider>
      <SidebarProvider className="">
        <AppSidebar
          mainNavItems={instructorNavItems}
          footerNavItems={footerNavItems}
        />
        <main className="flex-1 p-6 bg-white">
          <div className="mb-4 md:hidden">
            <SidebarTrigger />
          </div>
          {children}
        </main>
      </SidebarProvider>
    </InstructorProvider>
  )
}
