import { Card } from '@/components/ui/card'
import { useImageUrl } from '@/lib/utils'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

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

  // Retreiving the date

  return (
    <div
      className="group cursor-pointer"
      role="button"
      tabIndex={0}
      onClick={() => {
        router.push(`/dashboard/student/chat/${chatBot.botId}/${chatBot.id}`)
      }}
    >
      {/* Card with Image , Name , Level and NumInteractions */}
      <Card className="overflow-hidden rounded-xl relative transition-transform duration-300 ease-in-out group-hover:scale-105">
        {/* Image should cover the whole card - overlay */}
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
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-4 transition-all duration-300 ease-in-out group-hover:bottom-4">
            <h3 className="text-white text-xl font-bold">{chatBot.botName}</h3>
            <h6 className="text-white/80 text-sm font-medium uppercase tracking-wider">
              {new Date(chatBot.createdAt).toLocaleDateString()}
            </h6>
          </div>

          {/* Timestamp at right */}
          <div className="absolute bottom-4 right-4 p-4 transition-all duration-300 ease-in-out group-hover:bottom-4">
            <h3 className="text-white/80  font-medium uppercase tracking-wider">
              {new Date(chatBot.lastInteractionTime).toLocaleTimeString()}
            </h3>
          </div>
        </div>
      </Card>
    </div>
  )
}
