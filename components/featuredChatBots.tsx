'use client'

import FeaturedChatBotCard from '@/components/bot/featuredChatBotCard'
import { getFeatureChatBotsQueryFn } from '@/lib/api'
import { useQuery } from '@tanstack/react-query'
import WheelGesturesPlugin from 'embla-carousel-wheel-gestures'
import { useRouter } from 'next/navigation'
import { Button } from './ui/button'
import { Carousel, CarouselContent, CarouselItem } from './ui/carousel'
import { ChatBotSkeletonGrid } from '@/components/bot/chatBotSkeleton'

export default function FeauturedChatBots() {
  const router = useRouter()

  const { data: chatBots = [], isLoading } = useQuery({
    queryKey: ['getFeatureChatBots'],
    queryFn: getFeatureChatBotsQueryFn,
  })

  return (
    <div className="w-full mb-8 mt-8">
      <div className="flex items-center justify-between mb-2">
        {/* ---- Heading ---- */}
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-bold font-serif tracking-wider text-foreground uppercase ml-1 mb-1">
            Featured ChatBots
          </h3>
          {/* <Tooltip>
            <TooltipTrigger asChild>
              <Button
                className="hidden md:flex bg-secondary hover:bg-accent cursor-pointer"
                size="sm"
              >
                <Info size={20} className="text-foreground" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Top Rated Chat Bots </p>
            </TooltipContent>
          </Tooltip> */}
        </div>

        {/* ---- Explore Section ---- */}
        <Button
          className="cursor-pointer"
          onClick={() => router.push('/dashboard/student/bots')}
        >
          EXPLORE
        </Button>
      </div>

      {isLoading ? (
        <ChatBotSkeletonGrid count={3} />
      ) : (
        /* Here comes the featured chatbots carousel */
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
              {chatBots.length > 0 ? (
                chatBots.map(feature_chatbot => (
                  <CarouselItem
                    key={feature_chatbot.id}
                    className="pl-2 md:pl-4 basis-full sm:basis-1/2 lg:basis-1/3"
                  >
                    <FeaturedChatBotCard
                      id={feature_chatbot.id}
                      name={feature_chatbot.name}
                      level={feature_chatbot.level}
                      description={feature_chatbot.description}
                      numInteractions={feature_chatbot.numInteractions}
                    />
                  </CarouselItem>
                ))
              ) : (
                <div className="col-span-full text-center text-muted-foreground py-10">
                  No featured chatbots found.
                </div>
              )}
            </CarouselContent>
          </Carousel>
        </div>
      )}
    </div>
  )
}
