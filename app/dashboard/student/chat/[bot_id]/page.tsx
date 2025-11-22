'use client'

import { Spinner } from '@/components/ui/spinner'

export default function NewChatPage() {
  return (
    <div className="flex flex-row items-center justify-center gap-3">
      {/* Spinner with Loading Text */}

      <Spinner speed={20} className="size-6 text-blue-500" />
      <span className="text-lg">Loading your chat ...</span>
    </div>
  )
}
