'use client'

import { InstructorProvider } from '@/app/contexts/instructorContext'
import { AppSidebar } from '@/components/appSidebar'
import { SidebarProvider } from '@/components/ui/sidebar'
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
          {/* <SidebarTrigger /> */}
          {children}
        </main>
      </SidebarProvider>
    </InstructorProvider>
  )
}
