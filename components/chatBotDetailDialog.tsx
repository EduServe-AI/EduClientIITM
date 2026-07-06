'use client'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
} from '@/components/ui/dialog'
import { useChatNavigation } from '@/hooks/use-chatNavigation'
import { useImageUrl } from '@/lib/utils'
import { ProgramLevelId } from '@/types/types'
import { Heart, MessageCircle, Share } from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Badge } from './ui/badge'

interface ChatBotDetailDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  chatBot: {
    id: string
    name: string
    description: string
    level: string | number | ProgramLevelId
    numInteractions?: number
    lastInteractionTime?: Date
    createdAt?: Date
    course?: {
      id: string
      name: string
    }
  }
  // Optional: if this is an existing chat, pass the chatId to navigate directly
  existingChatId?: string
}

// Helper function to capitalize first letter of each word in level
const formatLevel = (level: string | number | ProgramLevelId): string => {
  const levelStr = String(level).toLowerCase()
  // Special cases
  if (levelStr === 'bsc') return 'Bsc'
  if (levelStr === 'bs') return 'Bs'
  // Capitalize first letter
  return levelStr.charAt(0).toUpperCase() + levelStr.slice(1)
}

export default function ChatBotDetailDialog({
  open,
  onOpenChange,
  chatBot,
  existingChatId,
}: ChatBotDetailDialogProps) {
  const savedImageUrl = useImageUrl(chatBot.name, 'bot')
  const createAndNavigateToChat = useChatNavigation()
  const router = useRouter()
  const [isFavorited, setIsFavorited] = useState(false)
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false)

  // Character limit for description truncation
  const DESCRIPTION_LIMIT = 100
  const shouldTruncate = chatBot.description.length > DESCRIPTION_LIMIT
  const displayedDescription =
    shouldTruncate && !isDescriptionExpanded
      ? chatBot.description.slice(0, DESCRIPTION_LIMIT) + '...'
      : chatBot.description

  const handleChat = () => {
    if (existingChatId) {
      // Navigate to existing chat
      router.push(`/dashboard/student/chat/${chatBot.id}/${existingChatId}`)
    } else {
      // Create new chat
      createAndNavigateToChat(chatBot.id)
    }
    onOpenChange(false)
  }

  const handleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsFavorited(!isFavorited)
    // TODO: Implement actual favorite logic with API call
  }

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation()
    // TODO: Implement share logic
    if (navigator.share) {
      navigator
        .share({
          title: chatBot.name,
          text: chatBot.description,
          url: window.location.href,
        })
        .catch(err => console.log('Error sharing:', err))
    } else {
      // Fallback: copy link to clipboard
      navigator.clipboard.writeText(window.location.href)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="">
        {/* Hidden title for accessibility */}
        <DialogTitle className="sr-only">
          {chatBot.name} - Chatbot Details
        </DialogTitle>

        {/* Header Image Section */}
        <div className="relative w-full h-48 sm:h-64 bg-gradient-to-br from-purple-600 via-blue-600 to-cyan-600">
          <Image
            src={savedImageUrl || '/Chat-Bot.jpg'}
            alt={`Profile picture of ${chatBot.name}`}
            fill
            className="object-cover"
            priority
          />
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

          {/* Name and Level - Positioned on top of image */}
          <div className="absolute bottom-4 left-4 right-4 z-10 flex items-end justify-between gap-2">
            <h2 className="text-2xl sm:text-3xl font-bold text-white drop-shadow-lg">
              {chatBot.name}
            </h2>
            {/* Level Badge - Right aligned */}
            <Badge className="px-3 h-6 flex items-center backdrop-blur-sm text-white text-xs sm:text-sm font-medium border border-white/30 whitespace-nowrap flex-shrink-0">
              {formatLevel(chatBot.level)}
            </Badge>
          </div>
        </div>

        {/* Content Section */}
        {/* Name, Level, Stats, and Action Buttons Row */}
        <div className="flex flex-col gap-3">
          {/* Stats and Action Buttons */}
          <div className="flex items-center justify-between gap-2">
            {/* Interactions Count */}
            <div className="flex items-center gap-1 text-muted-foreground">
              <MessageCircle size={18} className="flex-shrink-0" />
              <span className="text-sm sm:text-base">
                {chatBot.numInteractions || 0}
              </span>
            </div>

            {/* Action Buttons - Right aligned */}
            <div className="flex gap-2">
              <Button
                variant={'ghost'}
                size={'icon'}
                onClick={handleFavorite}
                className="p-2 rounded-full hover:bg-accent transition-colors cursor-pointer"
                aria-label="Favorite"
              >
                <Heart
                  size={20}
                  className={`${isFavorited ? 'fill-red-700 text-red-700' : 'text-muted-foreground'}`}
                />
              </Button>
              <Button
                variant={'ghost'}
                size={'icon'}
                onClick={handleShare}
                className="p-2 rounded-full transition-colors cursor-pointer"
                aria-label="Share"
              >
                <Share size={20} className="text-muted-foreground" />
              </Button>
            </div>
          </div>
        </div>

        {/* Course Badge (if available) */}
        {chatBot.course && (
          <div className="flex gap-2 flex-wrap">
            <span className="px-3 py-1 rounded-full bg-secondary/10 text-secondary-foreground text-xs sm:text-sm font-medium border border-secondary/20">
              {chatBot.course.name}
            </span>
          </div>
        )}

        {/* Description Section */}
        <DialogDescription className="space-y-2 pb-2">
          <span className="text-base sm:text-lg text-foreground">
            Description
          </span>

          <div
            className={`text-sm sm:text-base text-muted-foreground leading-relaxed whitespace-pre-wrap ${
              isDescriptionExpanded ? 'max-h-48 overflow-y-auto' : ''
            }`}
          >
            {displayedDescription}
          </div>
          {shouldTruncate && (
            <Button
              variant={'link'}
              onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
              className="cursor-pointer px-0"
            >
              {isDescriptionExpanded ? 'View Less' : 'View More'}
            </Button>
          )}
        </DialogDescription>

        {/* Additional Info */}
        {(chatBot.createdAt || chatBot.lastInteractionTime) && (
          <div className="pt-2 border-t space-y-1 text-xs text-muted-foreground">
            {chatBot.createdAt && (
              <p>Created: {new Date(chatBot.createdAt).toLocaleDateString()}</p>
            )}
            {chatBot.lastInteractionTime && (
              <p>
                Last interaction:{' '}
                {new Date(chatBot.lastInteractionTime).toLocaleString()}
              </p>
            )}
          </div>
        )}

        {/* Chat Button */}
        <DialogFooter>
          <Button onClick={handleChat} className="w-full" size={'lg'}>
            Chat
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
