'use client'

import { apiService } from '@/lib/api'
import { useImageUrl } from '@/lib/utils'
import { MessageCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { ScrollArea } from './ui/scroll-area'
import { Skeleton } from './ui/skeleton'

interface Chat {
  id: string
  botId: string
  botName: string
  title: string | null
  lastInteractionTime: Date
  createdAt: Date
}

interface UserChatsResponse {
  data: {
    chats: Chat[]
  }
}

export function RecentChatsList() {
  const [chats, setChats] = useState<Chat[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    async function fetchRecentChats() {
      try {
        const response = await apiService<UserChatsResponse>('/chat/user-chats')
        setChats(response.data.chats.slice(0, 10)) // Limit to 10 most recent
      } catch (error) {
        console.error('Failed to fetch recent chats:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchRecentChats()
  }, [])

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

  if (chats.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 px-4 text-center">
        <MessageCircle className="h-12 w-12 text-muted-foreground mb-3 opacity-50" />
        <p className="text-sm text-muted-foreground">No recent chats</p>
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
              onClick={() =>
                router.push(`/dashboard/student/chat/${chat.botId}/${chat.id}`)
              }
            />
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}

interface ChatItemProps {
  chat: Chat
  onClick: () => void
}

function ChatItem({ chat, onClick }: ChatItemProps) {
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
    <div
      onClick={onClick}
      className={`
        group relative flex items-center gap-3 p-2 rounded-lg cursor-pointer
        transition-all duration-200
        group-data-[state=closed]:justify-center
        
      `}
    >
      {/* Active indicator - Orange bar on the right */}
      {/* {isActive && (
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-3/4 bg-orange-500 rounded-l-full" />
      )} */}

      {/* Avatar */}
      <Avatar className="h-10 w-10 flex-shrink-0">
        <AvatarImage src={imageUrl || '/Chat-Bot.jpg'} alt={chat.botName} />
        <AvatarFallback className="text-sm">
          {chat.botName.substring(0, 2).toUpperCase()}
        </AvatarFallback>
      </Avatar>

      {/* Chat info - Hidden when sidebar is collapsed */}
      <div className="flex-1 min-w-0 group-data-[state=closed]:hidden">
        <div className="flex items-center justify-between gap-2">
          <p className="text-sm font-medium text-sidebar-foreground truncate">
            {chat.botName}
          </p>
          <span className="text-xs text-muted-foreground whitespace-nowrap">
            {formatTime(chat.lastInteractionTime)}
          </span>
        </div>
        <p className="text-xs text-muted-foreground truncate mt-0.5">
          {chat.title || 'Conversation with ' + chat.botName}
        </p>
      </div>
    </div>
  )
}
