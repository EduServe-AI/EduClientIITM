'use client'

import { apiService } from '@/lib/api'
import React, { createContext, useContext, useEffect, useState } from 'react'
import { toast } from 'sonner'

export interface chatProfile {}

export interface chat {
  id: string
  email: string
  username: string
  chatProfile: chatProfile
}

interface chatResponseDataType {
  data: {
    chat: chat
  }
}

interface chatContextType {
  chat: chat | null
  setchat: (chat: any) => void
  isLoading: boolean
}

const chatContext = createContext<chatContextType | undefined>(undefined)

export function chatProvider({ children }: { children: React.ReactNode }) {
  const [chat, setchat] = useState<chat | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadchatData() {
      try {
        const response = await apiService<chatResponseDataType>('/chat/me')

        console.log('response', response)
        const chatData = response.data.chat

        console.log('chatData', chatData)

        // Here we populate the chat Data in the context
        setchat(chatData)
      } catch (error) {
        console.error('Failed to load chat data')
        toast.error('Failed to load chat data for context')
      } finally {
        setIsLoading(false)
      }
    }

    loadchatData()
  }, [])

  return (
    <chatContext.Provider
      value={{
        chat,
        setchat,
        isLoading,
      }}
    >
      {children}
    </chatContext.Provider>
  )
}

export function usechat() {
  const context = useContext(chatContext)
  if (context === undefined) {
    throw new Error('Usechat must be used within a chat Provider context')
  }
  return context
}
