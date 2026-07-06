'use client'

import { Card, CardContent } from '@/components/ui/card'
import { useImageUrl } from '@/lib/utils'
import { ProgramLevelId } from '@/types/types'
import { MessageCircle } from 'lucide-react'
import Image from 'next/image'
import { useState } from 'react'
import ChatBotDetailDialog from './chatBotDetailDialog'
import { Badge } from './ui/badge'

// Defining the shape of the featured instructor object
interface FeaturedChatBotProps {
  id: string
  name: string
  description: string
  level: string | number | ProgramLevelId
  numInteractions: number
  lastInteractionTime?: Date | undefined
}

export default function FeaturedChatBotCard(chatBot: FeaturedChatBotProps) {
  const savedImageUrl = useImageUrl(chatBot.name, 'bot')
  const [dialogOpen, setDialogOpen] = useState(false)

  return (
    <>
      <ChatBotDetailDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        chatBot={chatBot}
      />

      {/* Card with Image , Name , Level and NumInteractions */}
      {/* <Card className="overflow-hidden rounded-xl relative transition-transform duration-300 ease-in-out group-hover:scale-105">
          // Image should cover the whole card - overlay
          <div className="aspect-[4/3] w-full">
            <Image
              src={savedImageUrl || '/Chat-Bot.jpg'}
              alt={`Profile picture of ${chatBot.name}`}
              className="object-cover"
              fill
              loading="lazy"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            // Name and level at Footer
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-4 transition-all duration-300 ease-in-out group-hover:bottom-4">
              <h3 className="text-white text-xl font-bold">{chatBot.name}</h3>
              <h6 className="text-white/80 text-sm font-medium uppercase tracking-wider">
                {chatBot.level}
              </h6>
            </div>
            <div className="absolute bottom-4 right-4 flex items-center gap-1 text-white ">
              <MessageCircle size={20} />
              <span>{chatBot.numInteractions}</span>
            </div>
          </div>
        </Card> */}

      <Card key={chatBot.id} className="w-full max-w-xs relative h-full">
        <div
          className="group cursor-pointer overflow-hidden"
          role="button"
          tabIndex={0}
          onKeyDown={e => {
            if (e.key === 'Enter' || e.key === ' ') {
              setDialogOpen(true)
            }
          }}
          onClick={() => {
            setDialogOpen(true)
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
                alt={`Profile picture of ${chatBot.name}`}
                loading="lazy"
                className="object-cover size-11"
                height={400}
                width={400}
              />
            </div>
            <p className="text-foreground hover:text-primary block text-sm leading-tight font-medium">
              {chatBot.name}
            </p>
            <p className="text-muted-foreground line-clamp-2 text-xs leading-relaxed">
              {chatBot.description}
            </p>
            <div className="flex items-center justify-between gap-2">
              <Badge variant={'outline'}>{chatBot.level}</Badge>
              <div className="flex items-center gap-2 text-primary">
                <MessageCircle className="size-4" />
                <span>{chatBot.numInteractions}</span>
              </div>
            </div>
          </CardContent>
        </div>
      </Card>
    </>
  )
}
