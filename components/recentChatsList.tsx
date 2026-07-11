'use client'

import { getRecentChats } from '@/lib/api'
import { useImageUrl } from '@/lib/utils'
import { useQuery } from '@tanstack/react-query'
import { AlertCircle, MessageCircle } from 'lucide-react'
import Link from 'next/link'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
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

function categorizeChats(chats: Chat[]) {
  const today: Chat[] = []
  const lastWeek: Chat[] = []
  const aWhileAgo: Chat[] = []

  const now = new Date()
  const startOfToday = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate()
  )
  const oneDay = 24 * 60 * 60 * 1000
  const sevenDaysAgo = new Date(startOfToday.getTime() - 7 * oneDay)

  chats.forEach(chat => {
    const chatDate = new Date(chat.lastInteractionTime)
    if (chatDate >= startOfToday) {
      today.push(chat)
    } else if (chatDate >= sevenDaysAgo) {
      lastWeek.push(chat)
    } else {
      aWhileAgo.push(chat)
    }
  })

  return { today, lastWeek, aWhileAgo }
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

    if (/no chats|not found|empty|no conversations/i.test(errorMessage)) {
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

  const categorized = categorizeChats(chats)

  return (
    <div className="flex flex-col">
      <ScrollArea className="max-h-[400px] px-2">
        <div className="space-y-4">
          {categorized.today.length > 0 && (
            <div className="space-y-1">
              <h4 className="text-xs font-semibold text-muted-foreground px-2 py-1">
                Today
              </h4>
              <div className="space-y-1">
                {categorized.today.map(chat => (
                  <ChatItem
                    key={chat.id}
                    chat={chat}
                    href={`/dashboard/student/chat/${chat.botId}/${chat.id}`}
                  />
                ))}
              </div>
            </div>
          )}

          {categorized.lastWeek.length > 0 && (
            <div className="space-y-1">
              <h4 className="text-xs font-semibold text-muted-foreground px-2 py-1">
                Last Week
              </h4>
              <div className="space-y-1">
                {categorized.lastWeek.map(chat => (
                  <ChatItem
                    key={chat.id}
                    chat={chat}
                    href={`/dashboard/student/chat/${chat.botId}/${chat.id}`}
                  />
                ))}
              </div>
            </div>
          )}

          {categorized.aWhileAgo.length > 0 && (
            <div className="space-y-1">
              <h4 className="text-xs font-semibold text-muted-foreground px-2 py-1">
                A While Ago
              </h4>
              <div className="space-y-1">
                {categorized.aWhileAgo.map(chat => (
                  <ChatItem
                    key={chat.id}
                    chat={chat}
                    href={`/dashboard/student/chat/${chat.botId}/${chat.id}`}
                  />
                ))}
              </div>
            </div>
          )}
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
  const showTitle =
    chat.title &&
    !chat.title.trim().toLowerCase().startsWith('conversation with')

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
        </div>
        {showTitle && (
          <p className="text-xs text-muted-foreground truncate mt-0.5">
            {chat.title}
          </p>
        )}
      </div>
    </div>
  )
}
