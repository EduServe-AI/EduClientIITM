import { RecentChatsList } from '../recentChatsList'
import { Separator } from '../ui/separator'
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
} from '../ui/sidebar'

export default function NavChatBots() {
  return (
    <SidebarGroup>
      <Separator className="!bg-sidebar-border" />
      <SidebarGroupLabel>Chats</SidebarGroupLabel>
      <SidebarGroupContent>
        <RecentChatsList />
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
