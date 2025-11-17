'use client'

import { ChatProvider } from '@/app/contexts/chatContext'
import { useParams } from 'next/navigation'
import React from 'react'

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const params = useParams()

  //Retreiving the botId and the chatId
  const botId = params.bot_id as string
  const chatId = params.chat_id as string

  // Render a loading state or null if params are not yet available
  if (!botId || !chatId) {
    return <div>Loading chat...</div>
  }

  return (
    <ChatProvider botId={botId} chatId={chatId}>
      {children}
    </ChatProvider>
  )
}
