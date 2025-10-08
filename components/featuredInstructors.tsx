'use client'

import { Tooltip } from '@radix-ui/react-tooltip'
import { TooltipContent, TooltipTrigger } from './ui/tooltip'
import { Button } from './ui/button'
import { Info } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { ProgramLevelId } from '@/types/types'
import { useEffect, useState } from 'react'
import { apiService } from '@/lib/api'
import { toast } from 'sonner'
import { FeaturedInstructorCard } from './featuredInstructorCard'

// Defining the shape of instructor object
interface Instructor {
  id: string
  level: ProgramLevelId
  bio: string
  basePrice: string
  user: {
    username: string
    profileUrl: string | null
  }
  skills: { name: string }[]
}

// Defining the shape of the api response
interface ResponseType {
  data: {
    featuredInstructors: Instructor[]
  }
}

export default function FeauturedInstructors() {
  const [instructors, setInstructors] = useState<Instructor[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const router = useRouter()

  // useEffect to get the featured instructors
  useEffect(() => {
    setIsLoading(true)
    async function fetchInstructors() {
      try {
        const data = await apiService<ResponseType>('/instructor/featured')
        const instructors = data.data.featuredInstructors
        console.log('instructors', instructors)
        setInstructors(instructors)
      } catch (error) {
        console.error('Failed to Fetch Featured Instructors')
        toast.error('Login Failed')
        return
      } finally {
        setIsLoading(false)
      }
    }

    fetchInstructors()
  }, [])
  return (
    <div className="w-full mb-8 mt-8">
      <div className="flex items-center justify-between mb-2">
        {/* ---- Heading ---- */}
        <div className="flex items-center gap-2">
          <h3 className="text-lg md:text-xl font-bold font-serif">
            Featured Instructors
          </h3>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                className=" bg-fuchsia-50 hover:bg-gray-400 cursor-pointer"
                size="icon"
              >
                <Info size={20} className="" color="black" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Top Rated Instructors </p>
            </TooltipContent>
          </Tooltip>
        </div>

        {/* ---- Explore Section ---- */}
        <Button
          className="cursor-pointer"
          onClick={() => router.push('/dashboard/student/instructors')}
        >
          EXPLORE
        </Button>
      </div>

      {/* Here comes the featured instructors card */}
      <div className="grid grid-cols-2 sm:grid-cols-1 md:grid-cols-3 gap-4 mt-3">
        {instructors.map(feature_instructor => (
          <FeaturedInstructorCard
            key={feature_instructor.id}
            name={feature_instructor.user.username}
            bio={feature_instructor.bio}
            level={feature_instructor.level}
            profileUrl={feature_instructor.user.profileUrl}
            basePrice={feature_instructor.basePrice}
            skills={feature_instructor.skills}
          />
        ))}
      </div>
    </div>
  )
}
