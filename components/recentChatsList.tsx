'use client'

import { getRecentChats } from '@/lib/api'
import { useImageUrl } from '@/lib/utils'
import { useQuery } from '@tanstack/react-query'
import { AlertCircle, MessageCircle } from 'lucide-react'
import Link from 'next/link'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { ScrollArea } from './ui/scroll-area'
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from './ui/sidebar'
import { Skeleton } from './ui/skeleton'

export interface Chat {
  id: string
  botId: string
  botName: string
  title: string | null
  lastInteractionTime: Date
  createdAt: Date
}

export interface UserChatsResponse {
  data: {
    chats: Chat[]
  }
}

export function RecentChatsList() {
  const {
    data: chats = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['recentChats'],
    queryFn: getRecentChats,
  })

  if (isLoading) {
    return (
      <div className="flex flex-col gap-2 px-2 overflow-y-auto">
        {[1, 2, 3].map(i => (
          <div key={i} className="flex items-center gap-3 p-2">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-3 w-32" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (isError) {
    const errorMessage =
      error instanceof Error ? error.message : 'Failed to load recent chats'

    return (
      <div className="flex flex-col items-center justify-center py-8 px-4 text-center">
        <div className="inline-flex items-center justify-center h-10 w-10 rounded-full bg-red-100 mb-3">
          <AlertCircle className="h-5 w-5 text-red-600" />
        </div>
        <p className="text-xs text-red-600 font-medium">{errorMessage}</p>
        <p className="text-xs text-muted-foreground mt-1">
          Please try again later
        </p>
      </div>
    )
  }

  if (chats.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 px-4 text-center">
        <MessageCircle className="h-12 w-12 text-muted-foreground mb-3 opacity-50" />
        <p className="text-xs text-muted-foreground mt-1">
          Start a conversation with a bot
        </p>
      </div>
    )
  }

  return (
    <SidebarMenu>
      <ScrollArea className="max-h-[400px]">
        {chats.map(chat => (
          <ChatItem
            key={chat.id}
            chat={chat}
            href={`/dashboard/student/chat/${chat.botId}/${chat.id}`}
          />
        ))}
      </ScrollArea>
    </SidebarMenu>
  )
}

interface ChatItemProps {
  chat: Chat
  href: string
}

function ChatItem({ chat, href }: ChatItemProps) {
  const imageUrl = useImageUrl(chat.botName, 'bot')

  const formatTime = (date: Date) => {
    const now = new Date()
    const chatDate = new Date(date)
    const diff = now.getTime() - chatDate.getTime()
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))

    if (days === 0) {
      return chatDate.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      })
    } else if (days < 7) {
      return chatDate.toLocaleDateString('en-US', { weekday: 'short' })
    } else {
      return chatDate.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      })
    }
  }

  return (
    <SidebarMenuItem>
      <SidebarMenuButton className="h-12" asChild>
        <Link href={href}>
          {/* Active indicator - Orange bar on the right */}
          {/* {isActive && (
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-3/4 bg-orange-500 rounded-l-full" />
      )} */}

          {/* Avatar */}
          <Avatar className="h-8 w-8 flex-shrink-0">
            <AvatarImage src={imageUrl || '/Chat-Bot.jpg'} alt={chat.botName} />
            <AvatarFallback className="text-sm">
              {chat.botName.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>

          {/* Chat info - Hidden when sidebar is collapsed */}
          <div className="flex w-full flex-col group-data-[state=closed]:hidden">
            <div className="flex flex-1 items-center justify-between gap-1">
              <p className="text-sm font-semibold line-clamp-1">
                {chat.botName}sdfsdfsdfsdf sdf sdf sdf
              </p>
              <span className="text-[10px] text-muted-foreground whitespace-nowrap flex-shrink-0 block">
                {formatTime(chat.lastInteractionTime)}
              </span>
            </div>
            <p className="text-xs text-muted-foreground line-clamp-1">
              {chat.title || 'Conversation with ' + chat.botName} dfg dfg
            </p>
          </div>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  )
}
