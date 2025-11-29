'use client'
import ChatBotCard from '@/components/chatBotCard'
import FeaturedChatBotCard from '@/components/featuredChatBotCard'
import { apiService } from '@/lib/api'
import { useEffect, useState } from 'react'

interface ChatBot {
  id: string
  name: string
  description: string
  level: string
  numInteractions: number
  course?: {
    id: string
    name: string
  }
}

interface Chat {
  id: string
  botId: string
  botName: string
  title: string | null
  lastInteractionTime: Date
  createdAt: Date
}

export default function StudentBotsPage() {
  const [bots, setBots] = useState<ChatBot[]>([])
  const [loading, setLoading] = useState(true)

  const [userChats, setUserChats] = useState<Chat[]>([])

  useEffect(() => {
    let isMounted = true

    const fetchAllData = async () => {
      try {
        const [botsResult, chatsResult] = await Promise.allSettled([
          apiService<{ data: { recommendedBots: ChatBot[] } }>(
            '/bot/recommended'
          ),
          apiService<{ data: { chats: Chat[] } }>('/chat/user-chats'),
        ])

        if (isMounted) {
          if (botsResult.status === 'fulfilled') {
            setBots(botsResult.value?.data?.recommendedBots ?? [])
          } else {
            console.error(
              'Failed to fetch recommended bots:',
              botsResult.reason
            )
            setBots([]) // Ensure bots is an array on failure
          }

          if (chatsResult.status === 'fulfilled') {
            setUserChats(chatsResult.value?.data?.chats ?? [])
          } else {
            console.error('Failed to fetch user chats:', chatsResult.reason)
            // If fetching chats fails (e.g., 404), we'll treat it as no chats.
            setUserChats([])
          }
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    fetchAllData()

    return () => {
      isMounted = false
    }
  }, [])

  if (loading) return <p>Loading recommended chatbots...</p>
  // if (error) return <p className="text-red-600">Error: {error}</p>

  return (
    <div className="p-6 flex flex-col overflow-y-auto">
      {/* Recommended chat bots */}
      <div className="">
        <h1 className="text-2xl font-semibold mb-4">Recommended ChatBots</h1>

        {bots.length === 0 ? (
          <p>No chatbots available for your enrolled courses.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {bots.map(bot => (
              <FeaturedChatBotCard
                key={bot.id}
                id={bot.id}
                name={bot.name}
                description={bot.description}
                level={bot.level}
                numInteractions={bot.numInteractions}
              />
            ))}
          </div>
        )}
      </div>

      {/* Recent Chats */}
      {userChats.length > 0 && (
        <div>
          <h1 className="text-2xl font-semibold mb-4 mt-4 ">Recent Chats</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {userChats.map(chat => (
              <ChatBotCard
                key={chat.id}
                id={chat.id}
                botId={chat.botId}
                botName={chat.botName}
                lastInteractionTime={chat.lastInteractionTime}
                title={chat.title}
                createdAt={chat.createdAt}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
