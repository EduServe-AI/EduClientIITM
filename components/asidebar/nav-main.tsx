import { NavItem } from '@/types/types'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '../ui/sidebar'

export default function NavMain({ mainNavItems }: { mainNavItems: NavItem[] }) {
  const { toggleSidebar, isMobile } = useSidebar()
  const pathname = usePathname()
  const isActive = (path: string) => pathname === path

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Platform</SidebarGroupLabel>
      <SidebarGroupContent className="overflow-y-hidden">
        <SidebarMenu className="space-y-1">
          {mainNavItems.map(item => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                asChild
                className={
                  isActive(item.href)
                    ? 'bg-primary text-white hover:bg-primary hover:text-white'
                    : ''
                }
                onClick={() => {
                  // Close sidebar on mobile after navigation
                  if (isMobile) {
                    toggleSidebar()
                  }
                }}
              >
                <Link href={item.href}>
                  {item.icon && <item.icon />}
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
