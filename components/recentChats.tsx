'use client'

import { apiService } from '@/lib/api'
import WheelGesturesPlugin from 'embla-carousel-wheel-gestures'
import { useEffect, useState } from 'react'
import ChatBotCard from './chatBotCard'
import { Chat, UserChatsResponse } from './recentChatsList'
import { Carousel, CarouselContent, CarouselItem } from './ui/carousel'

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
