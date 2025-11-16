'use client'

import { apiService } from '@/lib/api'
import { getAccessToken } from '@/lib/auth'
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
  handleSendMessage: (content: string) => void
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

  console.log('messages from context', messages)

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

  // Handling message generation
  const handleSendMessage = async (content: string) => {
    if (!chatId || !botId) {
      throw Error('ChatId or BotId is Missing')
    }

    // Adding the user's message to the state immediately
    const userMessage: chatMessage = {
      id: crypto.randomUUID(),
      chatId: chat?.id!,
      content: content,
      sender: 'user',
    }

    setMessages(prev => [...prev, userMessage])

    // Creating an empty bot message in the UI to stream into
    const botMessageId = crypto.randomUUID()

    const botMessage: chatMessage = {
      id: crypto.randomUUID(),
      chatId: chat?.id!,
      content: '',
      sender: 'bot',
    }
    setMessages(prev => [...prev, botMessage])

    try {
      const token = getAccessToken()

      const url = `${process.env.NEXT_PUBLIC_API_URL}/chat/${chat?.id}/generate`

      // Actual LLM Response Generation step
      // const response: any = await apiService('/chat/:chatId/generate', {
      //   method: 'POST',
      //   body: {
      //     userMessage,
      //     botMessage,
      //   },
      // })

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          userMessage,
          botMessage,
        }),
      })

      if (!response.ok || !response.body) {
        throw new Error('Failed to get stream response')
      }

      // 4. Read the stream from the response body
      const reader = response.body.getReader()
      const decoder = new TextDecoder()

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value)

        // 5. Update the *last* message (the empty bot one) with the new chunk
        setMessages(prev =>
          prev.map(msg =>
            msg.id === botMessage.id
              ? { ...msg, content: msg.content + chunk }
              : msg
          )
        )
      }
    } catch (error) {
      console.error('Error in generating ai response', error)
      toast.error('Error in getting response ')
      // Update the bot message with an error
      setMessages(prev =>
        prev.map(msg =>
          msg.id === botMessage.id
            ? {
                ...msg,
                content: 'Sorry, I ran into an error. Please try again.',
              }
            : msg
        )
      )
    }
  }

  return (
    <ChatContext.Provider
      value={{
        chat,
        setChat,
        messages,
        setMessages,
        isLoading,
        handleSendMessage,
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
