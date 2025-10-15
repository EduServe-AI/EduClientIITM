'use client'

import { Tooltip } from '@radix-ui/react-tooltip'
import { TooltipContent, TooltipTrigger } from './ui/tooltip'
import { Button } from './ui/button'
import { Info } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { ProgramLevelId } from '@/types/types'
import { useEffect, useState } from 'react'
import { apiService } from '@/lib/api'
import { toast } from 'sonner'
import FeaturedChatBotCard from '@/components/featuredChatBotCard'

// Defining the shape of instructor object
interface ChatBot {
  id: string
  name: string
  description: string
  level: ProgramLevelId
  numInteractions: number
}

// Defining the shape of the api response
interface ResponseType {
  data: {
    featuredChatBots: ChatBot[]
  }
}

export default function FeauturedChatBots() {
  const [chatBots, setChatBots] = useState<ChatBot[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const router = useRouter()

  // useEffect to get the featured instructors
  useEffect(() => {
    setIsLoading(true)
    async function fetchChatBots() {
      try {
        const data = await apiService<ResponseType>('/bot/featured')
        const chatbots = data.data.featuredChatBots
        console.log('ChatBots', chatbots)
        setChatBots(chatbots)
      } catch (error) {
        console.error('Failed to Fetch Featured ChatBots')
        toast.error('Failed to Fetch Featured ChatBOts')
        return
      } finally {
        setIsLoading(false)
      }
    }

    fetchChatBots()
  }, [])
  return (
    <div className="w-full mb-8 mt-8">
      <div className="flex items-center justify-between mb-2">
        {/* ---- Heading ---- */}
        <div className="flex items-center gap-2">
          <h3 className="text-lg md:text-xl font-bold font-serif">
            Featured ChatBots
          </h3>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                className=" bg-fuchsia-50 hover:bg-gray-400 cursor-pointer"
                size="icon"
              >
                <Info size={20} className="" color="black" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Top Rated Chat Bots </p>
            </TooltipContent>
          </Tooltip>
        </div>

        {/* ---- Explore Section ---- */}
        <Button
          className="cursor-pointer"
          onClick={() => router.push('/dashboard/student/bots')}
        >
          EXPLORE
        </Button>
      </div>

      {/* Here comes the featured instructors card */}
      <div className="grid grid-cols-2 sm:grid-cols-1 md:grid-cols-3 gap-4 mt-3">
        {chatBots.map(feature_chatbot => (
          <FeaturedChatBotCard
            key={feature_chatbot.id}
            id={feature_chatbot.id}
            name={feature_chatbot.name}
            level={feature_chatbot.level}
            description={feature_chatbot.description}
            numInteractions={feature_chatbot.numInteractions}
          />
        ))}
      </div>
    </div>
  )
}
