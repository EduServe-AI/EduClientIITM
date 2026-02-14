'use client'
import FeaturedChatBotCard from '@/components/featuredChatBotCard'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Spinner } from '@/components/ui/spinner'
import { getBotsQueryFn } from '@/lib/api'
import { useQuery } from '@tanstack/react-query'
import { Search, SlidersHorizontal } from 'lucide-react'
import { useState } from 'react'

export default function StudentBotsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [level, setLevel] = useState('all')

  // Define level filter options
  const levelFilters = ['foundation', 'diploma', 'bsc']

  const {
    data: bots = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['bots', searchQuery, level],
    queryFn: () => getBotsQueryFn(searchQuery, level),
  })

  return (
    <div className="h-full p-4 sm:p-6 flex flex-col overflow-y-auto overflow-x-hidden">
      {/* EXPLORE Heading with Search Bar */}
      <div className="flex items-center justify-between gap-4 mb-4">
        <h1 className="text-2xl sm:text-3xl font-semibold font-serif whitespace-nowrap">
          EXPLORE
        </h1>
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-5 w-5" />
          <Input
            placeholder="Search for bots..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-10 rounded-md border-2 border-black focus:border-primary focus:outline-none h-10"
          />
        </div>
      </div>

      {/* Level Filter Buttons (Visual Only) */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 mb-6">
        {/* Filter label with icon */}
        <div className="flex items-center gap-2 mr-6">
          <SlidersHorizontal className="h-5 w-5 text-foreground" />
          <p className="text-base sm:text-lg font-medium text-foreground">
            Filter &nbsp;:
          </p>
        </div>
        {/* Filter buttons */}
        <div className="flex flex-wrap gap-2">
          <Button
            onClick={() => setLevel('all')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              level === 'all'
                ? 'bg-primary text-primary-foreground'
                : 'bg-secondary hover:bg-neutral-200 text-secondary-foreground'
            }`}
          >
            All Levels
          </Button>
          {levelFilters.map(filterLevel => (
            <Button
              key={filterLevel}
              onClick={() => setLevel(filterLevel)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                level === filterLevel
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary hover:bg-neutral-200 text-secondary-foreground'
              }`}
            >
              {filterLevel.charAt(0).toUpperCase() + filterLevel.slice(1)}
            </Button>
          ))}
        </div>
      </div>

      {/* List of chatbots */}
      <div className="">
        {isLoading ? (
          <div className="max-h-svh flex justify-center items-center">
            <Spinner className="w-16 h-16" />
          </div>
        ) : isError ? (
          <div className="flex justify-center items-center max-h-svh">
            <div className="text-center">
              <p className="text-red-500 font-semibold mb-2">
                Failed to load bots
              </p>
              <p className="text-gray-600 text-sm">
                {error instanceof Error ? error.message : 'An error occurred'}
              </p>
            </div>
          </div>
        ) : bots && bots.length > 0 ? (
          <div className="grid md:grid-cols-3 sm:grid-cols-1 gap-4">
            {bots.map(bot => (
              <div key={bot.id}>
                <FeaturedChatBotCard
                  id={bot.id}
                  name={bot.name}
                  description={bot.description}
                  numInteractions={bot.numInteractions}
                  level={bot.level}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="flex justify-center items-center max-h-svh">
            <p className="text-gray-600">
              No bots found. Try adjusting your filters or search.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
