'use client'

import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/appSidebar'
import { footerNavItems, studentNavItems } from '@/lib/navlinks'
import { StudentProvider } from '@/app/contexts/studentContext'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <StudentProvider>
      <SidebarProvider className="">
        <AppSidebar
          mainNavItems={studentNavItems}
          footerNavItems={footerNavItems}
        />
        <main className="flex-1 p-6 bg-white">
          {/* <SidebarTrigger /> */}
          {children}
        </main>
      </SidebarProvider>
    </StudentProvider>
  )
}
