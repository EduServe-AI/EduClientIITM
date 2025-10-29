'use client'

import { useChat } from '@/app/contexts/chatContext'
import { useEffect } from 'react'

export default function BotChat() {
  const { chat, messages, isLoading } = useChat()

  useEffect(() => {
    // Only update the title if the chat details are loaded and have a botName
    if (chat?.botName) {
      document.title = `${chat.botName}`
    } else {
      // Set a default title while loading or if data fails
      document.title = 'Chat | Eduserve AI'
    }
    // Run this effect whenever chatDetails changes
  }, [chat])

  if (isLoading || !chat) {
    return <div>Loading .....</div>
  }
  return (
    <div className="text-center text-3xl font-serif">
      <h1>Welcome to {chat?.botName} chat</h1>
    </div>
  )
}
