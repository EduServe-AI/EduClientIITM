'use client'

import { chatMessage, useChat } from '@/app/contexts/chatContext' // Import your type
import { cn, useImageUrl } from '@/lib/utils'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useStudent } from '@/app/contexts/studentContext' // To show user avatar
import ReactMarkdown from 'react-markdown'
import { Loader2 } from 'lucide-react'

export default function Message({ message }: { message: chatMessage }) {
  const { student } = useStudent()
  const { chat } = useChat()
  const isUser = message.sender === 'user'

  const profileImage = useImageUrl(student?.id, 'profile')
  const botImage = useImageUrl(chat?.botName, 'bot')

  // Get the first two letters for the fallback
  const fallback =
    (isUser ? student?.username : 'Bot')?.substring(0, 2).toUpperCase() || 'AI'

  return (
    <div
      className={cn(
        'flex items-start gap-2 md:gap-3 w-full',
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
          'rounded-lg p-2.5 md:p-3 break-words',
          isUser
            ? 'bg-black text-white ml-auto max-w-[85%] md:max-w-[75%]'
            : 'text-gray-900 max-w-[85%] md:max-w-[90%]'
        )}
      >
        {message.id === 'loading' ? (
          <div className="flex items-center gap-2.5 text-gray-600 text-sm">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span className="font-medium">AI assistant is thinking...</span>
          </div>
        ) : (
          <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none [&>*:first-child]:mt-0 [&>*:last-child]:mb-0">
            <ReactMarkdown>{message.content}</ReactMarkdown>
          </div>
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
