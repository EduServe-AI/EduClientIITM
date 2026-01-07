'use client'

import FeaturedChatBotCard from '@/components/featuredChatBotCard'
import { apiService } from '@/lib/api'
import { ProgramLevelId } from '@/types/types'
import { Tooltip } from '@radix-ui/react-tooltip'
import WheelGesturesPlugin from 'embla-carousel-wheel-gestures'
import { Info } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { Button } from './ui/button'
import { Carousel, CarouselContent, CarouselItem } from './ui/carousel'
import { Skeleton } from './ui/skeleton'
import { TooltipContent, TooltipTrigger } from './ui/tooltip'
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
      } catch {
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

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="space-y-3">
              {/* Image Skeleton - aspect-[4/3] for chatbots */}
              <Skeleton className="aspect-[4/3] w-full rounded-xl" />

              {/* Contents below the card */}
              <div className="mt-3 space-y-2">
                {/* Name and level skeleton */}
                <div className="space-y-1">
                  <Skeleton className="h-5 w-32" />
                  <Skeleton className="h-4 w-24" />
                </div>

                {/* Description skeleton - 2 lines */}
                <div className="space-y-1.5">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-4/5" />
                </div>

                {/* Interactions skeleton */}
                <Skeleton className="h-4 w-28 mt-2" />
              </div>
            </div>
          ))}
        </div>
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
                <div className="col-span-full text-center text-gray-500 py-10">
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
