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

export interface SourceLink {
  filename: string
  url: string | null
}

export interface chatMessage {
  id: string
  chatId: string
  content: string
  sender: 'user' | 'bot'
  sourceLinks?: SourceLink[]
}

interface ChatContextType {
  chat: chat | null
  setChat: (chat: chat) => void
  messages: chatMessage[]
  setMessages: (messages: []) => void
  isLoading: boolean
  isGenerating: boolean
  stopGeneration: () => void
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

const SOURCES_DELIMITER = '___SOURCES_JSON___'

export function ChatProvider({ children, botId, chatId }: ChatProviderProps) {
  const [chat, setChat] = useState<chat | null>(null)
  const [messages, setMessages] = useState<chatMessage[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isGenerating, setIsGenerating] = useState(false)
  const [abortController, setAbortController] =
    useState<AbortController | null>(null)

  // Calling the backend for populating the chatcontext state
  useEffect(() => {
    async function loadChatData() {
      if (!botId || !chatId) return

      setIsLoading(true)

      try {
        // Calling the backend api
        const response = await apiService<ChatResponse>(`/chat/${chatId}`)

        const { chat, messages: backendMessages } = response.data

        // Pre-process historical messages to parse source links if they contain the JSON delimiter
        const parsedMessages = backendMessages.map((msg: chatMessage) => {
          if (msg.sender === 'bot' && msg.content.includes(SOURCES_DELIMITER)) {
            const [textPart, jsonPart] = msg.content.split(SOURCES_DELIMITER)
            try {
              const parsed = JSON.parse(jsonPart.trim())
              return {
                ...msg,
                content: textPart.trim(),
                sourceLinks: parsed.sources || [],
              }
            } catch (e) {
              console.error('Failed to parse sources JSON from history:', e)
              return { ...msg, content: textPart.trim() } // Fallback to just text
            }
          }
          return msg
        })

        setChat(chat)
        setMessages(parsedMessages)
      } catch (error) {
        console.error('Failed to load chat data', error)
        toast.error('Failed to load chat session ')
      } finally {
        setIsLoading(false)
      }
    }

    loadChatData()
  }, [botId, chatId])

  const stopGeneration = () => {
    if (abortController) {
      abortController.abort()
      setAbortController(null)
      setIsGenerating(false)
    }
  }

  // Handling message generation
  const handleSendMessage = async (content: string) => {
    if (!chatId || !botId) {
      throw Error('ChatId or BotId is Missing')
    }

    if (!chat) {
      toast.error('Chat session not initialized. Please wait or refresh.')
      return
    }

    // Adding the user's message to the state immediately
    const userMessage: chatMessage = {
      id: crypto.randomUUID(),
      chatId: chat?.id,
      content: content,
      sender: 'user',
    }

    setMessages(prev => [...prev, userMessage])

    // Creating an empty bot message in the UI to stream into
    const botMessageId = crypto.randomUUID()

    const botMessage: chatMessage = {
      id: botMessageId,
      chatId: chat.id,
      content: '',
      sender: 'bot',
    }
    setMessages(prev => [...prev, botMessage])

    try {
      setIsGenerating(true)
      const token = getAccessToken()

      const newAbortController = new AbortController()
      setAbortController(newAbortController)

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
        signal: newAbortController.signal,
      })

      if (!response.ok || !response.body) {
        throw new Error('Failed to get stream response')
      }

      // 4. Read the stream from the response body
      const reader = response.body.getReader()
      const decoder = new TextDecoder()

      let fullBuffer = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value)
        fullBuffer += chunk

        // During streaming, display content but strip delimiter if it starts appearing
        const displayContent = fullBuffer.includes(SOURCES_DELIMITER)
          ? fullBuffer.split(SOURCES_DELIMITER)[0].trim()
          : fullBuffer

        setMessages(prev => {
          const lastMessage = prev[prev.length - 1]
          if (lastMessage && lastMessage.id === botMessage.id) {
            const updatedLastMessage = {
              ...lastMessage,
              content: displayContent,
            }
            return [...prev.slice(0, -1), updatedLastMessage]
          }
          return prev
        })
      }

      // After stream ends: parse sources from the delimiter
      let finalContent = fullBuffer
      let sourcesData: SourceLink[] = []

      if (fullBuffer.includes(SOURCES_DELIMITER)) {
        const [textPart, jsonPart] = fullBuffer.split(SOURCES_DELIMITER)
        finalContent = textPart.trim()

        try {
          const parsed = JSON.parse(jsonPart.trim())
          sourcesData = parsed.sources || []
        } catch (e) {
          console.error('Failed to parse sources JSON:', e)
        }
      }

      // Final update with cleaned content and source links
      setMessages(prev =>
        prev.map(msg =>
          msg.id === botMessage.id
            ? {
                ...msg,
                content: finalContent,
                sourceLinks: sourcesData.length > 0 ? sourcesData : undefined,
              }
            : msg
        )
      )
    } catch (error: any) {
      if (error.name === 'AbortError') {
        console.log('Generation stopped by user')
        // Stream aborted, keep the accumulated content
        return
      }

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
    } finally {
      setIsGenerating(false)
      setAbortController(null)
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
        isGenerating,
        stopGeneration,
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
