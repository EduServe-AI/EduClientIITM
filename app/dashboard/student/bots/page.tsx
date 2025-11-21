'use client'
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

// interface Chat {
//   id: string
//   botId: string
//   botName: string
//   title?: string | undefined
//   lastInteractionTime?: Date | undefined
// }

export default function StudentBotsPage() {
  const [bots, setBots] = useState<ChatBot[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // const [userChats, setUserChats] = useState<Chat[]>([])

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
          setError(err.message)
        } else if (typeof err === 'string') {
          setError(err)
        } else {
          setError('An unexpected error occurred while fetching chatbots.')
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    fetchRecommendedBots()

    return () => {
      isMounted = false
    }
  }, [])

  // useEffect(() => {
  //   let isMounted = true

  //   const fetchSavedChats = async () => {
  //     try {
  //       const response = await apiService<{
  //         data: { chats: Chat[] }
  //       }>('/chat/user-chats')
  //       if (isMounted) {
  //         const userChats = response.data.chats
  //         if (userChats && userChats.length > 0) {
  //           setUserChats(userChats)
  //         } else {
  //           setUserChats([])
  //         }
  //       }
  //     } catch (err) {
  //       if (err instanceof Error && isMounted) {
  //         setError(err.message)
  //       } else if (typeof err === 'string') {
  //         setError(err)
  //       } else {
  //         setError('An unexpected error occurred while fetching chatbots.')
  //       }
  //     } finally {
  //       if (isMounted) {
  //         setLoading(false)
  //       }
  //     }
  //   }

  //   fetchSavedChats()

  //   return () => {
  //     isMounted = false
  //   }
  // }, [])

  if (loading) return <p>Loading recommended chatbots...</p>
  if (error) return <p className="text-red-600">Error: {error}</p>

  return (
    <div className="p-6 flex flex-col">
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

      {/* Recent Chats
      <div className="">
        <h1 className="text-2xl font-semibold mb-4">Recent Chats</h1>

        {userChats.length === 0 ? (
          <p>No User Chats AVailable</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {userChats.map(chat => (
              <FeaturedChatBotCard
                key={chat.id}
                id={chat.botId}
                name={chat.botName}
                description={chat.title || 'Subject specifi chatbot'}
                level="foundation"
                numInteractions={20}
              />
            ))}
          </div>
        )}
      </div> */}
    </div>
  )
}
