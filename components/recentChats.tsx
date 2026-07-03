'use client'

import { getRecentChats } from '@/lib/api'
import { useQuery } from '@tanstack/react-query'
import WheelGesturesPlugin from 'embla-carousel-wheel-gestures'
import ChatBotCard from './bot/chatBotCard'
import { Carousel, CarouselContent, CarouselItem } from './ui/carousel'
import { Skeleton } from './ui/skeleton'

export function RecentChats() {
  const { data: chats = [], isLoading } = useQuery({
    queryKey: ['recent-chats'],
    queryFn: getRecentChats,
  })

  if (isLoading) {
    return (
      <div className="pt-2">
        <h3 className="text-lg font-bold font-serif tracking-wider text-foreground uppercase ml-1 mb-1">
          Continue ...
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="space-y-3">
              {/* Image Skeleton - aspect-[4/3] for chatbots */}
              <Skeleton className="aspect-[4/3] w-full rounded-xl" />

              {/* Contents below the card */}
              <div className="mt-3 space-y-2">
                {/* Bot name and date skeleton */}
                <div className="space-y-1">
                  <Skeleton className="h-5 w-32" />
                  <Skeleton className="h-4 w-24" />
                </div>

                {/* Title skeleton - 2 lines */}
                <div className="space-y-1.5">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-4/5" />
                </div>

                {/* Time skeleton */}
                <Skeleton className="h-4 w-28 mt-2" />
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }
  return (
    <div className=" pt-2">
      {chats.length > 0 && (
        <>
          <h3 className="text-lg font-bold font-serif tracking-wider text-foreground uppercase ml-1 mb-1">
            Continue ...
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
                {chats.map(chat => (
                  <CarouselItem
                    key={chat.id}
                    className="pl-2 md:pl-4 basis-full sm:basis-1/2 lg:basis-1/3"
                  >
                    <ChatBotCard
                      id={chat.id}
                      botId={chat.botId}
                      botName={chat.botName}
                      title={chat.title}
                      lastInteractionTime={chat.lastInteractionTime}
                      createdAt={chat.createdAt}
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
