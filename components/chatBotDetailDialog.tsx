'use client'

import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { useChatNavigation } from '@/hooks/use-chatNavigation'
import { useImageUrl } from '@/lib/utils'
import { ProgramLevelId } from '@/types/types'
import { Heart, MessageCircle, Share, X } from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

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
  const DESCRIPTION_LIMIT = 200
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
      <DialogContent
        className="max-w-2xl p-0 gap-0 overflow-hidden bg-background"
        showCloseButton={false}
      >
        {/* Hidden title for accessibility */}
        <DialogTitle className="sr-only">
          {chatBot.name} - Chatbot Details
        </DialogTitle>

        {/* Close button */}
        <button
          onClick={() => onOpenChange(false)}
          className="absolute right-4 top-4 z-50 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none"
          aria-label="Close dialog"
        >
          <X className="h-5 w-5 text-white drop-shadow-lg" />
          <span className="sr-only">Close</span>
        </button>

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
            <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-white text-xs sm:text-sm font-medium border border-white/30 whitespace-nowrap flex-shrink-0">
              {formatLevel(chatBot.level)}
            </span>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-4 sm:p-6 space-y-4">
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
                <button
                  onClick={handleFavorite}
                  className="p-2 rounded-full hover:bg-red-300 dark:hover:bg-red-300 transition-colors cursor-pointer"
                  aria-label="Favorite"
                >
                  <Heart
                    size={20}
                    className={`${isFavorited ? 'fill-red-700 text-red-700' : 'text-muted-foreground'}`}
                  />
                </button>
                <button
                  onClick={handleShare}
                  className="p-2 rounded-full hover:bg-sky-200 dark:hover:bg-blue-200 transition-colors cursor-pointer"
                  aria-label="Share"
                >
                  <Share size={20} className="text-muted-foreground" />
                </button>
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
          <div className="space-y-2">
            <h3 className="text-base sm:text-lg font-bold font-serif text-foreground">
              Description
            </h3>
            <div
              className={`${isDescriptionExpanded ? 'max-h-48 overflow-y-auto' : ''}`}
            >
              <p className="text-sm sm:text-base text-foreground leading-relaxed whitespace-pre-wrap">
                {displayedDescription}
              </p>
            </div>
            {shouldTruncate && (
              <button
                onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
                className="text-primary text-sm font-medium hover:underline cursor-pointer focus:outline-none"
              >
                {isDescriptionExpanded ? 'View Less' : 'View More'}
              </button>
            )}
          </div>

          {/* Additional Info */}
          {(chatBot.createdAt || chatBot.lastInteractionTime) && (
            <div className="pt-2 border-t space-y-1 text-xs text-muted-foreground">
              {chatBot.createdAt && (
                <p>
                  Created: {new Date(chatBot.createdAt).toLocaleDateString()}
                </p>
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
          <div className="pt-2">
            <Button
              onClick={handleChat}
              className="w-full bg-black hover:bg-black/90 text-white font-semibold py-5 sm:py-6 text-sm sm:text-base rounded-lg shadow-lg hover:shadow-xl transition-all"
            >
              Chat
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
