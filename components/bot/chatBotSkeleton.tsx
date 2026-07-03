'use client'

import { Skeleton } from '../ui/skeleton'

export function ChatBotSkeleton() {
  return (
    <div className="space-y-3">
      {/* Image Skeleton - aspect-[4/3] for chatbots */}
      <Skeleton className="aspect-[4/3] w-full rounded-xl" />

      {/* Contents below the card */}
      <div className="mt-3 space-y-2">
        {/* Name and level skeleton */}
        <div className="space-y-1">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-4 w-24" />
        </div>

        {/* Description skeleton - 2 lines */}
        <div className="space-y-1.5">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-4/5" />
        </div>

        {/* Interactions skeleton */}
        <Skeleton className="h-4 w-28 mt-2" />
      </div>
    </div>
  )
}

interface ChatBotSkeletonGridProps {
  count?: number
}

export function ChatBotSkeletonGrid({ count = 3 }: ChatBotSkeletonGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <ChatBotSkeleton key={i} />
      ))}
    </div>
  )
}
