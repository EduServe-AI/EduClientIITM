'use client'

import { Check, Copy, ThumbsDown, ThumbsUp } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

interface MessageActionsProps {
  content: string
}

export default function MessageActions({ content }: MessageActionsProps) {
  const [copied, setCopied] = useState(false)
  const [liked, setLiked] = useState(false)
  const [disliked, setDisliked] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content)
      setCopied(true)
      toast.success('Copied to clipboard')
      setTimeout(() => setCopied(false), 2000)
    } catch {
      toast.error('Failed to copy')
    }
  }

  const handleLike = () => {
    setLiked(prev => !prev)
    if (disliked) setDisliked(false)
  }

  const handleDislike = () => {
    setDisliked(prev => !prev)
    if (liked) setLiked(false)
  }

  return (
    <div className="flex items-center gap-1 mt-2">
      {/* Copy */}
      <button
        onClick={handleCopy}
        className="p-1.5 rounded-md text-neutral-500 hover:text-black hover:bg-neutral-100 transition-colors duration-150 cursor-pointer"
        title="Copy"
      >
        {copied ? (
          <Check className="h-4 w-4 text-green-600" />
        ) : (
          <Copy className="h-4 w-4" />
        )}
      </button>

      {/* Like */}
      <button
        onClick={handleLike}
        className="p-1.5 rounded-md text-neutral-500 hover:text-black hover:bg-neutral-100 transition-colors duration-150 cursor-pointer"
        title="Like"
      >
        <ThumbsUp
          className={`h-4 w-4 transition-all ${liked ? 'fill-neutral-700 text-neutral-700' : ''}`}
        />
      </button>

      {/* Dislike */}
      <button
        onClick={handleDislike}
        className="p-1.5 rounded-md text-neutral-500 hover:text-black hover:bg-neutral-100 transition-colors duration-150 cursor-pointer"
        title="Dislike"
      >
        <ThumbsDown
          className={`h-4 w-4 transition-all ${disliked ? 'fill-neutral-700 text-neutral-700' : ''}`}
        />
      </button>
    </div>
  )
}
