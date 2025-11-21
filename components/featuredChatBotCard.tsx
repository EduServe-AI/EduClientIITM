import { Card } from '@/components/ui/card'
import { useChatNavigation } from '@/hooks/use-chatNavigation'
import { useImageUrl } from '@/lib/utils'
import { ProgramLevelId } from '@/types/types'
import { MessageCircle } from 'lucide-react'
import Image from 'next/image'

// Defining the shape of the featured instructor object
interface FeaturedChatBotProps {
  id: string
  name: string
  description: string
  level: string | number | ProgramLevelId
  numInteractions: number
}

export default function FeaturedChatBotCard(chatBot: FeaturedChatBotProps) {
  const savedImageUrl = useImageUrl(chatBot.name, 'bot')
  const createAndNavigateToChat = useChatNavigation()

  return (
    <div
      className="group cursor-pointer"
      role="button"
      tabIndex={0}
      onKeyDown={e => {
        if (e.key === 'Enter' || e.key === ' ') {
          createAndNavigateToChat(chatBot.id)
        }
      }}
      onClick={() => {
        createAndNavigateToChat(chatBot.id)
      }}
    >
      {/* Card with Image , Name , Level and NumInteractions */}
      <Card className="overflow-hidden rounded-xl relative transition-transform duration-300 ease-in-out group-hover:scale-105">
        {/* Image should cover the whole card - overlay */}
        <div className="aspect-[4/3] w-full">
          <Image
            src={savedImageUrl || '/Chat-Bot.jpg'}
            alt={`Profile picture of ${chatBot.name}`}
            className="object-cover"
            fill
            loading="lazy"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />

          {/* Name and level at Footer */}
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
      </Card>
    </div>
  )
}
