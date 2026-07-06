'use client'

import { Card, CardContent } from '@/components/ui/card'
import { useImageUrl } from '@/lib/utils'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Badge } from './ui/badge'

// Defining the shape of the featured instructor object
export interface ChatBotProps {
  id: string
  botId: string
  botName: string
  title: string | null
  lastInteractionTime: Date
  createdAt: Date
}

export default function ChatBotCard(chatBot: ChatBotProps) {
  const savedImageUrl = useImageUrl(chatBot.botName, 'bot')
  const router = useRouter()

  return (
    <>
      <Card key={chatBot.id} className="w-full max-w-xs relative h-full">
        <div
          className="group cursor-pointer overflow-hidden"
          role="button"
          tabIndex={0}
          onClick={() => {
            // Navigate directly to the existing chat
            router.push(
              `/dashboard/student/chat/${chatBot.botId}/${chatBot.id}`
            )
          }}
          onKeyDown={e => {
            if (e.key === 'Enter' || e.key === ' ') {
              router.push(
                `/dashboard/student/chat/${chatBot.botId}/${chatBot.id}`
              )
            }
          }}
        >
          <div
            className="absolute inset-0 z-0"
            style={{
              background:
                'radial-gradient(38% 39% at 75% 0%, #ee783e38 44%, transparent 139%), #ffffff1c',
            }}
          />
          <CardContent className="flex flex-col gap-3">
            <div className="bg-primary overflow-hidden rounded-md [&_svg]:text-primary-foreground flex size-11 items-center justify-center [&_svg]:size-5">
              {/* <BotMessageSquare /> */}
              <Image
                src={savedImageUrl || '/Chat-Bot.jpg'}
                alt={`Profile picture of ${chatBot.botName}`}
                loading="lazy"
                className="object-cover size-11"
                height={400}
                width={400}
              />
            </div>
            <p className="text-foreground hover:text-primary block text-sm leading-tight font-medium">
              {chatBot.botName}
            </p>
            <p className="text-muted-foreground line-clamp-2 text-xs leading-relaxed">
              Profile picture of BA BA That basic course focused on the
              preliminaries of the area. This course highlights a business
              application and
            </p>
            <div className="flex items-center justify-between gap-2">
              <Badge variant={'outline'}>
                {new Date(chatBot.createdAt).toLocaleDateString()}
              </Badge>
              <div className="flex items-center gap-2 text-primary">
                <time>
                  {new Date(chatBot.lastInteractionTime).toLocaleTimeString()}
                </time>
              </div>
            </div>
          </CardContent>
        </div>
      </Card>

      {/* <div
        className="group cursor-pointer w-full"
        role="button"
        tabIndex={0}
        onClick={() => {
          // Navigate directly to the existing chat
          router.push(`/dashboard/student/chat/${chatBot.botId}/${chatBot.id}`)
        }}
        onKeyDown={e => {
          if (e.key === 'Enter' || e.key === ' ') {
            router.push(
              `/dashboard/student/chat/${chatBot.botId}/${chatBot.id}`
            )
          }
        }}
      >
        {/* Card with Image , Name , Level and NumInteractions */}
      {/*
        <Card className="overflow-hidden rounded-xl relative transition-transform duration-300 ease-in-out group-hover:scale-105">
          {/* Image should cover the whole card - overlay */}
      {/*
          <div className="aspect-[4/3] w-full">
            <Image
              src={savedImageUrl || '/Chat-Bot.jpg'}
              alt={`Profile picture of ${chatBot.botName}`}
              className="object-cover"
              fill
              loading="lazy"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />

            {/* Name and level at Footer */}
      {/*
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-4 transition-all duration-300 ease-in-out group-hover:bottom-4">
              <h3 className="text-white text-xl font-bold">
                {chatBot.botName}
              </h3>
              <h6 className="text-white/80 text-sm font-medium uppercase tracking-wider">
                {new Date(chatBot.createdAt).toLocaleDateString()}
              </h6>
            </div>

            {/* Timestamp at right */}
      {/*
            <div className="absolute bottom-4 right-4 p-4 transition-all duration-300 ease-in-out group-hover:bottom-4">
              <h3 className="text-white/80  font-medium uppercase tracking-wider">
                {new Date(chatBot.lastInteractionTime).toLocaleTimeString()}
              </h3>
            </div>
          </div>
        </Card>
      </div> */}
    </>
  )
}
