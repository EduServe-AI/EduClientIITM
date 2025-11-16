'use client'

import { useChat } from '@/app/contexts/chatContext'
import Message from './message' // We'll create this next

export default function MessageList() {
  const { messages, isLoading, chat } = useChat()

  console.log('messages', messages)

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
            chatId: chat?.id!,
          }}
        />
      )}
    </div>
  )
}
