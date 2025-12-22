'use client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { apiService } from '@/lib/api'
import { Search, SlidersHorizontal } from 'lucide-react'
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
  const [searchQuery, setSearchQuery] = useState('')

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

  // Define level filter options
  const levelFilters = [
    'Foundation',
    'Diploma in Data Science',
    'Diploma in Programming',
    'Bsc',
    'Bs',
  ]

  return (
    <div className="p-4 sm:p-6 flex flex-col overflow-y-auto">
      {/* EXPLORE Heading with Search Bar */}
      <div className="flex items-center justify-between gap-4 mb-4">
        <h1 className="text-2xl sm:text-3xl font-semibold font-serif whitespace-nowrap">
          EXPLORE
        </h1>
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-5 w-5" />
          <Input
            placeholder="Search for bots..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-10 rounded-md border-2 border-black focus:border-primary focus:outline-none h-10"
          />
        </div>
      </div>

      {/* Level Filter Buttons (Visual Only) */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 mb-6">
        {/* Filter label with icon */}
        <div className="flex items-center gap-2 mr-6">
          <SlidersHorizontal className="h-5 w-5 text-foreground" />
          <p className="text-base sm:text-lg font-medium text-foreground">
            Filter &nbsp;:
          </p>
        </div>

        {/* Filter buttons */}
        <div className="flex flex-wrap gap-2">
          <Button className="px-4 py-2 rounded-full text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
            All Levels
          </Button>
          {levelFilters.map(level => (
            <Button
              key={level}
              className="px-4 py-2 rounded-full text-sm font-medium bg-secondary hover:bg-secondary/80 text-secondary-foreground transition-colors"
            >
              {level}
            </Button>
          ))}
        </div>
      </div>
    </div>
  )
}
