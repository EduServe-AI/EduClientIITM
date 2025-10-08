'use client'

import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/appSidebar'
import { footerNavItems, studentNavItems } from '@/lib/navlinks'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
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
  )
}
