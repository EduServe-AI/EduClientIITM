'use client'

import { useChat } from '@/contexts/chatContext'
import Message from './message' // We'll create this next

export default function MessageList() {
  const { messages, isLoading, chat } = useChat()

  if (!chat) {
    throw new Error('Chat not found')
  }

  return (
    <div className="space-y-6">
      {messages.map(msg => (
        <Message key={msg.id} message={msg} />
      ))}

      {/* Show a "typing" indicator if the bot is loading a response */}
      {isLoading && messages[messages.length - 1]?.sender === 'user' && (
        <Message
          key="loading"
          message={{
            id: 'loading',
            sender: 'bot',
            content: '',
            chatId: chat.id,
          }}
        />
      )}
    </div>
  )
}
