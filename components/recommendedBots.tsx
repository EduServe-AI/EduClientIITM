'use client'

import { apiService } from '@/lib/api'
import WheelGesturesPlugin from 'embla-carousel-wheel-gestures'
import { useEffect, useState } from 'react'
import FeaturedChatBotCard from './featuredChatBotCard'
import { Carousel, CarouselContent, CarouselItem } from './ui/carousel'

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

export function RecommendedBots() {
  const [bots, setBots] = useState<ChatBot[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchRecentBots() {
      try {
        const response = await apiService<{
          data: { recommendedBots: ChatBot[] }
        }>('/bot/recommended')
        setBots(response.data.recommendedBots)
      } catch (error) {
        console.error('Failed to fetch recent chats:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchRecentBots()
  }, [])

  if (isLoading) {
  }

  return (
    <div className="">
      {bots.length > 0 && (
        <>
          <h1 className="text-2xl font-serif font-semibold mb-4">For you</h1>

          <div className="relative">
            <Carousel
              opts={{
                align: 'start',
                loop: true,
                dragFree: true,
                containScroll: 'trimSnaps',
              }}
              plugins={[WheelGesturesPlugin()]}
              className="w-full"
            >
              <CarouselContent className="-ml-2 md:-ml-4">
                {bots.map(bot => (
                  <CarouselItem
                    key={bot.id}
                    className="pl-2 md:pl-4 basis-full sm:basis-1/2 lg:basis-1/3"
                  >
                    <FeaturedChatBotCard
                      id={bot.id}
                      name={bot.name}
                      description={bot.description}
                      level={bot.level}
                      numInteractions={bot.numInteractions}
                    />
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
          </div>
        </>
      )}
    </div>
  )
}
