'use client'

import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/appSidebar'
import { footerNavItems, studentNavItems } from '@/lib/navlinks'
import { StudentProvider } from '@/app/contexts/studentContext'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <StudentProvider>
      <SidebarProvider className="">
        <div className="flex h-screen w-full overflow-hidden bg-white">
          <AppSidebar
            mainNavItems={studentNavItems}
            footerNavItems={footerNavItems}
          />
          <main className="flex-1 flex flex-col overflow-hidden">
            {/* <SidebarTrigger /> */}
            {children}
          </main>
        </div>
      </SidebarProvider>
    </StudentProvider>
  )
}
