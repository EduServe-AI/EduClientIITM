'use client'
import { useEffect, useState } from 'react'
import { apiService } from '@/lib/api'
import FeaturedChatBotCard from '@/components/featuredChatBotCard'

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

export default function StudentBotsPage() {
  const [bots, setBots] = useState<ChatBot[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

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

  if (loading) return <p>Loading recommended chatbots...</p>
  if (error) return <p className="text-red-600">Error: {error}</p>

  return (
    <div className="p-6">
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
  )
}
