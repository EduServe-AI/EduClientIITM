import { BRAND_ASSETS } from '@/constants/brandAssets'
import Image from 'next/image'
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '../ui/sidebar'

export default function NavHeaderLogo() {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          size="lg"
          className="hover:bg-sidebar focus-within:bg-sidebar hover:text-inherit"
        >
          <div className="flex aspect-square size-8 items-center justify-center rounded-lg text-sidebar-primary-foreground">
            <Image
              src={BRAND_ASSETS?.LOGOS.LOGO}
              className="size-8"
              alt="logo"
              height="32"
              width="32"
            />
          </div>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-medium">Eduserve AI</span>
            <span className="truncate text-xs">Just Plane</span>
          </div>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
