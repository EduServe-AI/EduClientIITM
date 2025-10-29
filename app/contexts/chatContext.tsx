'use client'

import { apiService } from '@/lib/api'
import React, { createContext, useContext, useEffect, useState } from 'react'
import { toast } from 'sonner'

export interface chat {
  id: string
  botId: string
  botName: string
  title: string
  userId: string
}

export interface chatMessage {
  id: string
  chatId: string
  content: string
  sender: 'user' | 'bot'
}

interface ChatContextType {
  chat: chat | null
  setChat: (chat: chat) => void
  messages: chatMessage[]
  setMessages: (messages: any[]) => void
  isLoading: boolean
}

const ChatContext = createContext<ChatContextType | undefined>(undefined)

interface ChatProviderProps {
  children: React.ReactNode
  botId: string
  chatId: string
}

interface ChatResponse {
  data: {
    chat: chat
    messages: chatMessage[] | []
  }
}

export function ChatProvider({ children, botId, chatId }: ChatProviderProps) {
  const [chat, setChat] = useState<chat | null>(null)
  const [messages, setMessages] = useState<chatMessage[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Calling the backend for populating the chatcontext state
  useEffect(() => {
    async function loadChatData() {
      if (!botId || !chatId) return

      setIsLoading(true)

      try {
        // Calling the backend api
        const response = await apiService<ChatResponse>(`/chat/${chatId}`)

        const { chat, messages } = response.data

        setChat(chat)
        setMessages(messages)
      } catch (error) {
        console.error('Failed to load chat data', error)
        toast.error('Failed to load chat session ')
      } finally {
        setIsLoading(false)
      }
    }

    loadChatData()
  }, [botId, chatId])

  return (
    <ChatContext.Provider
      value={{
        chat,
        setChat,
        messages,
        setMessages,
        isLoading,
      }}
    >
      {children}
    </ChatContext.Provider>
  )
}

export function useChat() {
  const context = useContext(ChatContext)
  if (context === undefined) {
    throw new Error('UseChat must be used within a  Chat Provider context')
  }
  return context
}
