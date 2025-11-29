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

    const fetchRecommendedBots = async () => {
      try {
        const response = await apiService<{
          data: { recommendedBots: ChatBot[] }
        }>('/bot/recommended')
        if (isMounted) {
          setBots(response?.data?.recommendedBots ?? [])
        }
      } catch (err) {
        if (err instanceof Error && isMounted) {
          console.error(err.message)
          // toast.error(err.message)
        } else if (typeof err === 'string') {
          console.error(err)
        } else {
          console.error(
            'An unexpected error occurred while fetching chatbots.',
            err
          )
          // toast.error('An unexpected error occurred while fetching chatbots.')
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    const fetchRecentChats = async () => {
      try {
        const response = await apiService<{
          data: { chats: Chat[] }
        }>('/chat/user-chats')
        if (isMounted) {
          setUserChats(response?.data?.chats ?? [])
        }
      } catch (err) {
        if (err instanceof Error && isMounted) {
          console.error(err.message)
          // toast.error(err.message)
        } else if (typeof err === 'string') {
          console.error(err)
          // toast.error(err)
        } else {
          console.error(
            'An unexpected error occurred while fetching chatbots.',
            err
          )
          // toast.error('An unexpected error occurred while fetching chatbots.')
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    fetchRecommendedBots()
    fetchRecentChats()

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
