'use client'

import { apiService } from '@/lib/api'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

// Define the shape of the API response
interface CreateChatResponse {
  data: {
    chatId: string
    botId: string
    userId: string
    botName: string
  }
}

export const useChatNavigation = () => {
  const router = useRouter()

  // Our respective component will call this function
  const createAndNavigateToChat = async (botId: string) => {
    try {
      // Calling the backend to create the chat
      const response = await apiService<CreateChatResponse>('/chat/create', {
        method: 'POST',
        body: { botId },
      })

      const newChatId = response.data.chatId
      const botName = response.data.botName

      router.push(`/dashboard/student/chat/${botId}/${newChatId}`)

      toast.success(`Chat with ${botName}...`)
    } catch (error) {
      console.error('Failed to create chat :', error)
      toast.error('Failed to create chat!')
    }
  }

  return createAndNavigateToChat
}
