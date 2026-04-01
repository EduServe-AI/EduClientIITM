'use client'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { Spinner } from '@/components/ui/spinner'
import { getBotsQueryFn } from '@/lib/api'
import { useQuery } from '@tanstack/react-query'
import {
  BotMessageSquare,
  MessageCircle,
  Search,
  SlidersHorizontal,
} from 'lucide-react'
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
      <div className="pb-5">
        <h3 className="text-lg leading-6 font-medium text-foreground">
          Explore
        </h3>
        <p className="mt-2 max-w-4xl text-sm text-muted-foreground">
          Workcation is a property rental website. Etiam ullamcorper massa
          viverra consequat, consectetur id nulla tempus. Fringilla egestas
          justo massa purus sagittis malesuada.
        </p>
      </div>

      {/* Level Filter Buttons (Visual Only) */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-4 mb-6 border-b pb-4 border-border">
        {/* Filter label with icon */}
        <div className="flex items-center gap-2 text-muted-foreground">
          <SlidersHorizontal className="h-4 w-4" />
          <p className="text-base font-medium">Filter</p>
        </div>
        <Separator orientation="vertical" />
        {/* Filter buttons */}
        <div className="flex flex-wrap gap-2">
          <Button
            size={'sm'}
            onClick={() => setLevel('all')}
            variant={level === 'all' ? 'default' : 'outline'}
          >
            All Levels
          </Button>
          {levelFilters.map(filterLevel => (
            <Button
              size={'sm'}
              key={filterLevel}
              onClick={() => setLevel(filterLevel)}
              className="border-dashed"
              variant={level === filterLevel ? 'default' : 'outline'}
            >
              {filterLevel.charAt(0).toUpperCase() + filterLevel.slice(1)}
            </Button>
          ))}
        </div>
        <div className="relative flex-1 max-w-md md:ml-auto">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
          <Input
            placeholder="Search for bots..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-10 rounded-md focus:outline-none h-9"
          />
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
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {bots.map(bot => (
              <>
                <Card key={bot.id} className="w-full max-w-xs">
                  <CardContent className="flex flex-col gap-3">
                    <div className="bg-primary rounded-md [&_svg]:text-primary-foreground flex size-11 items-center justify-center [&_svg]:size-5">
                      <BotMessageSquare />
                    </div>
                    <a
                      href="#"
                      className="text-foreground hover:text-primary block text-sm leading-tight font-medium"
                    >
                      {bot.name}
                    </a>
                    <p className="text-muted-foreground line-clamp-2 text-xs leading-relaxed">
                      {bot.description}
                    </p>
                    <div className="flex items-center justify-between gap-2">
                      <Badge variant={'outline'}>{bot.level}</Badge>
                      <div className="flex items-center gap-2 text-primary">
                        <MessageCircle className="size-4" />
                        <span>{bot.numInteractions}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                {/* <FeaturedChatBotCard
                  key={bot.id}
                  id={bot.id}
                  name={bot.name}
                  description={bot.description}
                  numInteractions={bot.numInteractions}
                  level={bot.level}
                /> */}
              </>
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
