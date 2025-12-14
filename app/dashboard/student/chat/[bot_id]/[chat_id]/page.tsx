'use client'

import { Button } from '@/components/ui/button'
import { useChat } from '@/contexts/chatContext'
import { useStudent } from '@/contexts/studentContext'
import { useIsMobile } from '@/hooks/use-mobile'
import { useImageUrl } from '@/lib/utils'
import { Heart, Settings } from 'lucide-react'
import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import MessageInput from './components/messageInput'
import MessageList from './components/messageList'

export default function BotChat() {
  const { chat, messages, isLoading } = useChat()
  const [isFavourite, setIsFavourite] = useState<boolean>(false)
  const { student, isLoading: studenLoading } = useStudent()
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const handleFavClick = () => {
    setIsFavourite(!isFavourite)
  }

  const BotImageUrl = useImageUrl(chat?.botName, 'bot')

  const isMobile = useIsMobile()

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

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

  if (studenLoading || !student) {
    return <div>Loading...</div>
  }

  // Check if there are any messages
  const hasMessages = messages && messages.length > 0

  return (
    <div className="h-full  flex flex-col bg-background ">
      {/* Fixed Header */}
      <header className="flex-shrink-0 w-full bg-background px-4 z-10">
        <div className="w-full justify-between py-1 flex items-center h-14">
          {/* Left side - Bot Name , Level */}
          <div className="flex gap-2 md:gap-3 items-center min-w-0">
            <Image
              src={BotImageUrl || '/Chat-Bot.jpg'}
              alt="Bot-Image"
              width={40}
              height={40}
              className="shrink-0 rounded-lg object-cover"
            />

            <div className="min-w-0">
              <h2 className="font-serif text-base md:text-xl truncate font-semibold">
                {chat.botName}
              </h2>
            </div>
          </div>

          {/* Right side - Fav Button , Settings icon */}
          <div className="flex gap-1 md:gap-2 items-center flex-shrink-0">
            {/* Heart icon */}
            <Button
              size="icon"
              variant="ghost"
              className="hover:bg-accent "
              onClick={handleFavClick}
            >
              <Heart
                className={`${
                  isFavourite ? 'text-red-600 fill-red-600' : 'text-black'
                }`}
                size={isMobile ? 18 : 24}
              />
            </Button>

            {/* Settings icon */}
            <Button size="icon" variant="ghost" className="hover:bg-accent">
              <Settings className="text-black" size={isMobile ? 18 : 24} />
            </Button>
          </div>
        </div>
      </header>

      {/* Scrollable Message Area */}
      <main className="flex-1 overflow-y-auto overflow-x-hidden min-h-0">
        <div className="px-4 py-4 md:py-6 max-w-5xl mx-auto w-full h-full">
          {hasMessages ? (
            <div className="flex flex-col min-h-full">
              <MessageList />
              {/* Spacer to ensure last message is visible above input */}
              <div ref={messagesEndRef} className="h-4" />
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center text-black px-4">
                <h2 className="text-2xl md:text-4xl font-semibold">
                  Hello, {student?.username}
                </h2>
                <p className="text-sm md:text-base text-gray-600 mt-2">
                  Start a conversation with {chat.botName}
                </p>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Fixed Input Area */}
      <footer className="flex-shrink-0 w-full bg-background border-t p-3 md:p-4">
        <MessageInput />
      </footer>
    </div>
  )
}
