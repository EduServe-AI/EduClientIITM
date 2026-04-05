'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { MarkdownRenderer } from '@/components/ui/markdown-renderer'
import { chatMessage, useChat } from '@/contexts/chatContext' // Import your type
import { useStudent } from '@/contexts/studentContext' // To show user avatar
import { cn, useImageUrl } from '@/lib/utils'
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
          'break-words overflow-hidden min-w-0',
          isUser
            ? 'bg-secondary text-foreground ml-auto max-w-[85%] md:max-w-[75%] rounded-2xl rounded-tr-sm p-3 md:p-3.5'
            : 'text-foreground max-w-[85%] md:max-w-[90%] rounded-lg p-2.5 md:p-3'
        )}
      >
        {message.id === 'loading' ? (
          <div className="flex items-center gap-2.5 text-muted-foreground text-sm">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span className="font-medium">AI assistant is thinking...</span>
          </div>
        ) : (
          <div className="prose prose-sm md:prose-base dark:prose-invert w-full max-w-none [&>*:first-child]:mt-0 [&>*:last-child]:mb-0">
            <MarkdownRenderer content={message.content} />
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
