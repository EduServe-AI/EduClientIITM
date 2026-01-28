'use client'

import { FeaturedInstructorCard } from '@/components/featuredInstructorCard'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { useDebounce } from '@/hooks/useDebounce'
import { getInstructorsQueryFn } from '@/lib/api'
import { useQuery } from '@tanstack/react-query'
import { ChevronDown, Search } from 'lucide-react'
import { useEffect, useState } from 'react'

const PLACEHOLDERS = ['"Maths-I"', '"DBMS" ', '"MLP"', '"MAD-I Project"']

// Skeleton Card Component for loading state
function InstructorCardSkeleton() {
  return (
    <div className="space-y-3">
      <Skeleton className="w-full aspect-[16/9] rounded-2xl" />
      <div className="space-y-2">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <div className="flex gap-2 flex-wrap pt-2">
          <Skeleton className="h-6 w-16 rounded-full" />
          <Skeleton className="h-6 w-16 rounded-full" />
          <Skeleton className="h-6 w-16 rounded-full" />
        </div>
        <Skeleton className="h-4 w-full pt-2" />
        <Skeleton className="h-4 w-5/6" />
      </div>
    </div>
  )
}

export default function Instructors() {
  const [searchQuery, setSearchQuery] = useState('')
  const [placeholderIndex, setPlaceholderIndex] = useState(0)
  const [level, setLevel] = useState('all')
  const [tempLevel, setTempLevel] = useState('all')
  const [isLevelPopoverOpen, setIsLevelPopoverOpen] = useState(false)

  // Define level filter options
  const levelFilters = [
    { value: 'foundation', label: 'Foundation' },
    { value: 'diploma', label: 'Diploma' },
    { value: 'bsc', label: 'BSc' },
  ]

  const debouncedSearch = useDebounce(searchQuery, 500)

  const {
    data: instructors = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['instructors', debouncedSearch, level],
    queryFn: () => getInstructorsQueryFn(debouncedSearch, level),
  })

  // Rotate placeholder every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIndex(prev => (prev + 1) % PLACEHOLDERS.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  // Initialize temp level when popover opens
  useEffect(() => {
    if (isLevelPopoverOpen) {
      setTempLevel(level)
    }
  }, [isLevelPopoverOpen, level])

  const handleClearAll = () => {
    setTempLevel('all')
  }

  const handleApplyFilters = () => {
    setLevel(tempLevel)
    setIsLevelPopoverOpen(false)
  }

  const getLevelButtonText = () => {
    if (level === 'all') {
      return 'Level'
    }
    const selectedLevel = levelFilters.find(l => l.value === level)
    return selectedLevel ? selectedLevel.label : 'Level'
  }

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Header - search box , filters */}
      <div className="flex-shrink-0 px-4 pt-4">
        {/* Search Box */}
        <div className="relative w-full max-w-md mx-auto mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-5 w-5" />
          <Input
            placeholder={`Search ${PLACEHOLDERS[placeholderIndex]}`}
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-10 rounded-full border-2 border-black h-12 placeholder:text-neutral-600"
          />
        </div>

        {/* Filters - level , price etc., */}
        <div className="flex flex-wrap gap-2 max-w-md mx-auto justify-center">
          {/* Level Filter Dropdown */}
          <Popover
            open={isLevelPopoverOpen}
            onOpenChange={setIsLevelPopoverOpen}
          >
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="rounded-full border-2 border-gray-300 px-4 py-2 text-sm font-medium hover:bg-gray-50"
              >
                {getLevelButtonText()}
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-64 p-4" align="start">
              <div className="space-y-4">
                {/* Level options */}
                <RadioGroup value={tempLevel} onValueChange={setTempLevel}>
                  <div className="space-y-3">
                    {/* All Levels option */}
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="all" id="all" />
                      <label
                        htmlFor="all"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                      >
                        All Levels
                      </label>
                    </div>

                    {/* Individual level options */}
                    {levelFilters.map(levelOption => (
                      <div
                        key={levelOption.value}
                        className="flex items-center space-x-2"
                      >
                        <RadioGroupItem
                          value={levelOption.value}
                          id={levelOption.value}
                        />
                        <label
                          htmlFor={levelOption.value}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                        >
                          {levelOption.label}
                        </label>
                      </div>
                    ))}
                  </div>
                </RadioGroup>

                {/* Action buttons */}
                <div className="flex items-center justify-between pt-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleClearAll}
                    className="text-sm text-gray-600 hover:text-gray-900"
                  >
                    Clear All
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleApplyFilters}
                    className="bg-black text-white hover:bg-gray-800 rounded-md px-4"
                  >
                    Apply Filters
                  </Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>

          {/* Price Filter Button (non-functional for now) */}
          <Button
            variant="outline"
            className="rounded-full border-2 border-gray-300 px-4 py-2 text-sm font-medium hover:bg-gray-50"
          >
            Price
          </Button>
        </div>

        {/* Separator line */}
        <Separator className="my-6" />
      </div>

      {/* Instructor List Grid View */}
      <div className="flex-1 overflow-y-auto px-4 pb-4">
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <InstructorCardSkeleton key={i} />
            ))}
          </div>
        ) : isError ? (
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="text-center">
              <p className="text-red-500 font-semibold mb-2">
                Failed to load instructors
              </p>
              <p className="text-gray-600 text-sm">
                {error instanceof Error ? error.message : 'An error occurred'}
              </p>
            </div>
          </div>
        ) : instructors && instructors.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {instructors.map(instructor => (
              <FeaturedInstructorCard
                key={instructor.id}
                id={instructor.id}
                instructorId={instructor.instructorId}
                name={instructor.user.username}
                bio={instructor.bio}
                level={instructor.level}
                profileUrl={null}
                basePrice={instructor.basePrice.toString()}
                skills={instructor.skills}
              />
            ))}
          </div>
        ) : (
          <div className="flex justify-center items-center min-h-[400px]">
            <p className="text-gray-600">
              No instructors found. Try adjusting your filters or search.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
