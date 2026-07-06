'use client'

import { getFeatureChatBotsQueryFn } from '@/lib/api'
import { useQuery } from '@tanstack/react-query'
import WheelGesturesPlugin from 'embla-carousel-wheel-gestures'
import FeaturedChatBotCard from './featuredChatBotCard'
import { Carousel, CarouselContent, CarouselItem } from './ui/carousel'

// interface ChatBot {
//   id: string
//   name: string
//   description: string
//   level: string
//   numInteractions: number
//   course?: {
//     id: string
//     name: string
//   }
// }

export function RecommendedBots() {
  const { data: bots = [], isLoading } = useQuery({
    queryKey: ['recommendedBots'],
    queryFn: getFeatureChatBotsQueryFn,
  })

  if (isLoading) {
  }

  return (
    <div className="">
      {bots.length > 0 && (
        <>
          <div className="pb-4 border-border border-b">
            <h3 className="text-lg md:text-xl font-bold">For you</h3>
          </div>

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
              <CarouselContent className="pl-2 py-4 grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {bots.map(bot => (
                  <CarouselItem
                    key={bot.id}
                    className="p-1 pl-2 md:pl-4 basis-full sm:basis-1/2 lg:basis-1/3"
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
