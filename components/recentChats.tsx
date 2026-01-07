'use client'

import { apiService } from '@/lib/api'
import WheelGesturesPlugin from 'embla-carousel-wheel-gestures'
import { useEffect, useState } from 'react'
import ChatBotCard from './chatBotCard'
import { Chat, UserChatsResponse } from './recentChatsList'
import { Carousel, CarouselContent, CarouselItem } from './ui/carousel'
import { Skeleton } from './ui/skeleton'

export function RecentChats() {
  const [chats, setChats] = useState<Chat[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let isMounted = true
    async function fetchRecentChats() {
      try {
        const response = await apiService<UserChatsResponse>('/chat/user-chats')
        if (isMounted) {
          setChats(response.data.chats.slice(0, 10)) // Limit to 10 most recent
        }
      } catch (error) {
        console.error('Failed to fetch recent chats:', error)
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    fetchRecentChats()

    return () => {
      isMounted = false
    }
  }, [])

  if (isLoading) {
    return (
      <div className="pt-2">
        <h1 className="text-2xl font-serif font-semibold mb-4 ml-2">
          Continue ...
        </h1>
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
          <h1 className="text-2xl font-serif font-semibold mb-4 ml-2">
            Continue ...
          </h1>

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
