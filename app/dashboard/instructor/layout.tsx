'use client'

import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/appSidebar'
import { footerNavItems, instructorNavItems } from '@/lib/navlinks'
import { InstructorProvider } from '@/app/contexts/instructorContext'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <InstructorProvider>
      <SidebarProvider className="">
        <AppSidebar
          mainNavItems={instructorNavItems}
          footerNavItems={footerNavItems}
        />
        <main className="flex-1 p-6 bg-white">
          {/* <SidebarTrigger /> */}
          {children}
        </main>
      </SidebarProvider>
    </InstructorProvider>
  )
}
