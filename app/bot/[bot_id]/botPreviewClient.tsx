'use client'

import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupTextarea,
} from '@/components/ui/input-group'
import { getAccessToken, getCurrentUserId } from '@/lib/auth'
import { getImageUrl } from '@/lib/utils'
import { ArrowUpIcon, Bot, CirclePlus } from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

interface BotData {
  id: string
  name: string
  description: string
  level: string
  numInteractions: number
  course?: {
    id: string
    name: string
  }
}

interface BotPreviewClientProps {
  bot: BotData | null
  botId: string
}

export default function BotPreviewClient({
  bot,
  botId,
}: BotPreviewClientProps) {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    // Check if user is already authenticated
    const token = getAccessToken()
    const user = getCurrentUserId()
    if (token && user) {
      setIsAuthenticated(true)
      // Already logged in — redirect directly to the chat
      router.push(`/dashboard/student/chat/${botId}`)
    }
    setIsChecking(false)
  }, [botId, router])

  const handleSignup = () => {
    // Store the intended redirect so we can come back after auth
    localStorage.setItem(
      'redirectAfterAuth',
      `/dashboard/student/chat/${botId}`
    )
    router.push('/student')
  }

  const handleLogin = () => {
    localStorage.setItem(
      'redirectAfterAuth',
      `/dashboard/student/chat/${botId}`
    )
    router.push('/student')
  }

  // Show nothing while checking auth (prevents flash)
  if (isChecking || isAuthenticated) {
    return (
      <div className="h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground text-sm">
          Loading...
        </div>
      </div>
    )
  }

  // Bot not found
  if (!bot) {
    return (
      <div className="h-screen bg-background flex flex-col items-center justify-center text-foreground gap-4 p-6">
        <Bot className="h-16 w-16 text-muted-foreground" />
        <h1 className="text-2xl font-bold">Bot Not Found</h1>
        <p className="text-muted-foreground text-center max-w-md">
          This chatbot may have been removed or the link is invalid.
        </p>
        <button
          onClick={() => router.push('/')}
          className="mt-4 px-6 py-3 bg-foreground text-background rounded-full font-semibold hover:bg-foreground/90 transition-all cursor-pointer"
        >
          Go to Home
        </button>
      </div>
    )
  }

  const botImageUrl = getImageUrl(bot.name, 'bot')

  return (
    <div className="h-screen bg-background text-foreground flex flex-col overflow-hidden">
      {/* ─── Top Navigation Bar ─── */}
      <header className="flex-shrink-0 w-full border-b border-border bg-background px-4 sm:px-6 z-10">
        <div className="max-w-5xl mx-auto flex items-center justify-between h-14">
          {/* Logo — same as appSidebar */}
          <button
            onClick={() => router.push('/')}
            className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
          >
            <h1 className="font-semibold text-xl">(eduserve.ai)</h1>
          </button>

          {/* Auth Buttons — no icons, cursor pointer */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={handleSignup}
              className="px-4 sm:px-5 py-2 rounded-full bg-foreground text-background font-semibold text-sm hover:bg-foreground/90 transition-all cursor-pointer"
            >
              Sign Up to Chat
            </button>
            <button
              onClick={handleLogin}
              className="px-4 sm:px-5 py-2 rounded-full border border-border text-foreground font-medium text-sm hover:bg-accent transition-all cursor-pointer"
            >
              Login
            </button>
          </div>
        </div>
      </header>

      {/* ─── Main Content — centered, non-scrollable ─── */}
      <main className="flex-1 flex flex-col items-center justify-center min-h-0 px-4 sm:px-6">
        {/* Bot Avatar — circular */}
        <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden ring-2 ring-border shadow-lg flex-shrink-0">
          <Image
            src={botImageUrl || '/Chat-Bot.jpg'}
            alt={bot.name}
            fill
            className="object-cover"
            sizes="96px"
          />
        </div>

        {/* Greeting — same font/style as the chat page */}
        <div className="text-center text-foreground mt-6 sm:mt-8 px-4">
          <h2 className="text-2xl md:text-4xl font-semibold">
            Hello User, Sign up to chat
          </h2>
          <p className="text-sm md:text-base text-muted-foreground mt-2">
            Start a conversation with {bot.name}
          </p>
        </div>
      </main>

      {/* ─── Bottom Input — same as messageInput.tsx, disabled ─── */}
      <footer className="flex-shrink-0 w-full bg-background px-2 py-3 md:py-4 safe-area-bottom">
        <div className="px-2 max-w-3xl lg:max-w-4xl mx-auto">
          <div className="w-full max-w-5xl mx-auto px-0 md:px-0 flex flex-col items-center justify-center gap-2">
            <InputGroup className="border-2 rounded-2xl border-black dark:border-neutral-800 dark:bg-neutral-900 bg-background transition-colors opacity-50 pointer-events-none">
              <InputGroupTextarea
                placeholder="Ask anything ...."
                disabled
                rows={1}
              />
              <InputGroupAddon align="block-end">
                {/* plus button */}
                <InputGroupButton
                  variant="outline"
                  className="cursor-not-allowed hover:bg-gray-200 dark:hover:bg-neutral-800 dark:border-neutral-700"
                  size="icon-xs"
                  disabled
                >
                  <CirclePlus />
                </InputGroupButton>

                {/* Auto label */}
                <InputGroupButton variant="secondary" disabled>
                  Auto
                </InputGroupButton>

                {/* Send button */}
                <InputGroupButton
                  variant="default"
                  className="rounded-full ml-auto"
                  size="icon-xs"
                  disabled
                >
                  <ArrowUpIcon />
                  <span className="sr-only">Send</span>
                </InputGroupButton>
              </InputGroupAddon>
            </InputGroup>

            {/* Disclaimer text */}
            <span className="text-xs text-center text-neutral-600">
              AI-generated, for reference only
            </span>
          </div>
        </div>
      </footer>
    </div>
  )
}
