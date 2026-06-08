'use client'

import { MarkdownRenderer } from '@/components/ui/markdown-renderer'
import { ChatSpinner } from '@/components/ui/spinner'
import { chatMessage, useChat } from '@/contexts/chatContext'
import { cn } from '@/lib/utils'
import { Copy, Pencil } from 'lucide-react'
import { toast } from 'sonner'
import MessageActions from './messageActions'
import SourceLinks from './sourceLinks'

export default function Message({ message }: { message: chatMessage }) {
  const { isGenerating, messages } = useChat()
  const isUser = message.sender === 'user'
  const isLastMessage = messages[messages.length - 1]?.id === message.id

  const handleCopyUserPrompt = async () => {
    try {
      await navigator.clipboard.writeText(message.content)
      toast.success('Copied to clipboard')
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  // Placeholder for edit functionality
  const handleEditUserPrompt = () => {
    toast.info('Edit feature coming soon')
  }

  return (
    <div
      className={cn(
        'group flex flex-col w-full overflow-hidden',
        isUser ? 'items-end' : 'items-start'
      )}
    >
      {/* Message Content */}
      <div
        className={cn(
          'break-words overflow-hidden min-w-0 text-foreground flex flex-col',
          isUser
            ? 'max-w-[85%] md:max-w-[75%] p-3 md:p-3.5 bg-secondary rounded-2xl'
            : 'max-w-full md:max-w-[100%] py-1 w-full'
        )}
      >
        {message.id === 'loading' ||
        (isGenerating && isLastMessage && !message.content) ? (
          <div className="flex items-center gap-2.5 text-blue-500 text-xl h-12 w-12 px-2">
            <ChatSpinner className="text-black dark:text-white" />
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            <div
              className={`w-full max-w-none ${!isUser ? 'prose prose-sm md:prose-base dark:prose-invert [&>*:first-child]:mt-0 [&>*:last-child]:mb-0 px-2 md:px-4' : ''}`}
            >
              {isUser ? (
                <p className="text-sm md:text-base whitespace-pre-wrap">
                  {message.content}
                </p>
              ) : (
                <MarkdownRenderer content={message.content} />
              )}
            </div>

            {/* Bot message actions and sources */}
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
          </div>
        )}
      </div>

      {/* User message actions - Rendered OUTSIDE the colored bubble */}
      {isUser && (
        <div className="flex items-center justify-end gap-3 mt-1.5 md:mr-2 text-muted-foreground opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
          <button
            onClick={handleCopyUserPrompt}
            className="hover:text-foreground transition-colors cursor-pointer"
            aria-label="Copy prompt"
          >
            <Copy size={15} />
          </button>
          <button
            onClick={handleEditUserPrompt}
            className="hover:text-foreground transition-colors cursor-pointer"
            aria-label="Edit prompt"
          >
            <Pencil size={15} />
          </button>
        </div>
      )}
    </div>
  )
}
