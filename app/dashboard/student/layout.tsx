'use client'

import { StudentProvider } from '@/app/contexts/studentContext'
import { AppSidebar } from '@/components/appSidebar'
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { footerNavItems, studentNavItems } from '@/lib/navlinks'

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
            <div className="p-4 md:hidden">
              <SidebarTrigger />
            </div>
            {children}
          </main>
        </div>
      </SidebarProvider>
    </StudentProvider>
  )
}
