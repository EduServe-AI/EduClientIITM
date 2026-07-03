'use client'

import { getFeatureChatBotsQueryFn } from '@/lib/api'
import { useQuery } from '@tanstack/react-query'
import WheelGesturesPlugin from 'embla-carousel-wheel-gestures'
import FeaturedChatBotCard from './bot/featuredChatBotCard'
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
          <h3 className="text-lg font-bold font-serif tracking-wider text-foreground uppercase ml-1 mb-1">
            For you
          </h3>

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
