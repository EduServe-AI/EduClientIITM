'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { MarkdownRenderer } from '@/components/ui/markdown-renderer'
import { ChatSpinner } from '@/components/ui/spinner'
import { chatMessage, useChat } from '@/contexts/chatContext' // Import your type
import { useStudent } from '@/contexts/studentContext' // To show user avatar
import { cn, useImageUrl } from '@/lib/utils'
import MessageActions from './messageActions'
import SourceLinks from './sourceLinks'

export default function Message({ message }: { message: chatMessage }) {
  const { student } = useStudent()
  const { chat, isGenerating, messages, stopGeneration } = useChat()
  const isUser = message.sender === 'user'

  const isLastMessage = messages[messages.length - 1]?.id === message.id

  const profileImage = useImageUrl(student?.id, 'profile')
  const botImage = useImageUrl(chat?.botName, 'bot')

  // Get the first two letters for the fallback
  const fallback =
    (isUser ? student?.username : 'Bot')?.substring(0, 2).toUpperCase() || 'AI'

  return (
    <div
      className={cn(
        'flex items-start gap-2 md:gap-3 w-full overflow-hidden',
        isUser ? 'justify-end' : 'justify-start'
      )}
    >
      {/* Bot Avatar */}
      {!isUser && (
        <Avatar className="h-7 w-7 md:h-8 md:w-8 flex-shrink-0">
          <AvatarImage src={botImage} />
          <AvatarFallback>{fallback}</AvatarFallback>
        </Avatar>
      )}

      {/* Message Content */}
      <div
        className={cn(
          'rounded-lg p-2.5 md:p-3 break-words overflow-hidden min-w-0',
          isUser
            ? 'bg-black text-white ml-auto max-w-[85%] md:max-w-[75%]'
            : 'text-gray-900 max-w-[85%] md:max-w-[90%]'
        )}
      >
        {message.id === 'loading' ||
        (isGenerating && isLastMessage && !message.content) ? (
          <div className="flex items-center gap-2.5 text-blue-500 text-xl h-12 w-12">
            <ChatSpinner className="text-black" />
          </div>
        ) : (
          <>
            <div className="prose prose-sm md:prose-base dark:prose-invert w-full max-w-none [&>*:first-child]:mt-0 [&>*:last-child]:mb-0">
              <MarkdownRenderer content={message.content} />
            </div>
            {!isUser &&
              message.sourceLinks &&
              message.sourceLinks.length > 0 && (
                <SourceLinks sources={message.sourceLinks} />
              )}
            {!isUser &&
              message.id !== 'loading' &&
              (!isGenerating || !isLastMessage) && (
                <MessageActions content={message.content} />
              )}
          </>
        )}
      </div>

      {/* User Avatar */}
      {isUser && (
        <Avatar className="h-7 w-7 md:h-8 md:w-8 flex-shrink-0">
          {/* You can add student.profileUrl here later */}
          <AvatarImage src={profileImage} />
          <AvatarFallback>{fallback}</AvatarFallback>
        </Avatar>
      )}
    </div>
  )
}
