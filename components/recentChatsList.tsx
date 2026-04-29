'use client'

import { getRecentChats } from '@/lib/api'
import { useImageUrl } from '@/lib/utils'
import { useQuery } from '@tanstack/react-query'
import {
  AlertCircle,
  MessageCircle,
  MoreHorizontal,
  Trash2,
} from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import { toast } from 'sonner'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu'
import { ScrollArea } from './ui/scroll-area'
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
    <div className="flex flex-col">
      <ScrollArea className="max-h-[400px] px-2">
        <div className="space-y-1">
          {chats.map(chat => (
            <ChatItem
              key={chat.id}
              chat={chat}
              href={`/dashboard/student/chat/${chat.botId}/${chat.id}`}
            />
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}

interface ChatItemProps {
  chat: Chat
  href: string
}

function ChatItem({ chat, href }: ChatItemProps) {
  const imageUrl = useImageUrl(chat.botName, 'bot')
  const [menuOpen, setMenuOpen] = useState(false)

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
    <div
      className={`
        group/chat relative flex items-center gap-2 p-2 rounded-lg cursor-pointer
        transition-all duration-200
        group-data-[state=closed]:justify-center hover:bg-sidebar-accent
      `}
    >
      {/* Clickable area — navigates to chat */}
      <Link href={href} className="absolute inset-0 z-0" />

      {/* Avatar */}
      <Avatar className="h-9 w-9 flex-shrink-0 relative z-[1] pointer-events-none">
        <AvatarImage src={imageUrl || '/Chat-Bot.jpg'} alt={chat.botName} />
        <AvatarFallback className="text-sm">
          {chat.botName.substring(0, 2).toUpperCase()}
        </AvatarFallback>
      </Avatar>

      {/* Chat info - Hidden when sidebar is collapsed */}
      <div className="flex-1 min-w-0 overflow-hidden group-data-[state=closed]:hidden relative z-[1] pointer-events-none">
        <div className="flex items-baseline justify-between gap-1">
          <span className="text-sm font-medium text-sidebar-foreground truncate">
            {chat.botName}
          </span>
          {/* Timestamp — hidden on hover / when menu is open */}
          <span
            className={`text-[11px] text-muted-foreground whitespace-nowrap flex-shrink-0 ml-auto group-hover/chat:opacity-0 ${menuOpen ? 'opacity-0' : ''}`}
          >
            {formatTime(chat.lastInteractionTime)}
          </span>
        </div>
        <p className="text-xs text-muted-foreground truncate mt-0.5">
          {chat.title || 'Conversation with ' + chat.botName}
        </p>
      </div>

      {/* Three-dot menu — visible on hover or when dropdown is open */}
      <div
        className={`
          absolute right-2 top-1/2 -translate-y-1/2 z-[2] flex-shrink-0
          group-data-[state=closed]:!hidden
          transition-opacity duration-150
          ${menuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none group-hover/chat:opacity-100 group-hover/chat:pointer-events-auto'}
        `}
      >
        <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
          <DropdownMenuTrigger asChild>
            <button
              className="h-6 w-6 flex items-center justify-center rounded-md hover:bg-sidebar-border transition-colors cursor-pointer"
              onClick={e => e.stopPropagation()}
            >
              <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent side="bottom" align="end" className="w-40">
            <DropdownMenuItem
              className="cursor-pointer gap-2 text-red-500 focus:text-red-500"
              onClick={e => {
                e.stopPropagation()
                toast.info('This feature is coming soon!')
              }}
            >
              <Trash2 className="h-4 w-4" color="red" />
              <span>Delete Chat</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}
