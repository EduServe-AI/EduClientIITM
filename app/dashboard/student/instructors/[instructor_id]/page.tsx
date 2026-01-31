'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Spinner } from '@/components/ui/spinner'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { getInstructorQueryFn } from '@/lib/api'
import { useImageUrl } from '@/lib/utils'
import { useQuery } from '@tanstack/react-query'
import {
  ArrowLeft,
  Award,
  GraduationCap,
  Info,
  Languages,
  Trophy,
} from 'lucide-react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import SideCard from './components/sideCard'

export default function InstructorProfile() {
  const params = useParams()
  const instructorId = params.instructor_id as string

  const {
    data: instructor,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['instructorProfile', instructorId],
    queryFn: () => getInstructorQueryFn(instructorId),
    enabled: !!instructorId,
  })

  // Use instructorId from params for profile image
  const profileUrl = useImageUrl(instructor?.instructorId, 'profile')

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <Spinner width="20" />
      </div>
    )
  }

  if (isError || !instructor) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div className="text-center">
          <p className="text-lg font-medium text-black">
            Failed to load instructor details
          </p>
          <Link href="/dashboard/student/instructors">
            <Button variant="outline" className="mt-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Instructors
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white overflow-y-auto">
      {/* Main content */}
      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 sm:py-8">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 lg:gap-8">
          {/* Left side - Scrollable content */}
          <div className="lg:col-span-2 space-y-6 sm:space-y-8">
            {/* Profile header */}
            <div className="flex flex-col gap-6">
              {/* Profile image and basic info */}
              <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
                <div className="flex-1 space-y-3">
                  <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-black">
                      {instructor.bio}
                    </h1>
                    {/* Level with icon and label */}
                    <div className="mt-3 sm:mt-4 flex items-center gap-2 sm:gap-3 flex-wrap">
                      <span className="text-sm sm:text-base font-semibold text-black">
                        Current Level &nbsp;:
                      </span>
                      <div className="inline-flex items-center gap-2 rounded-md bg-gray-100 px-3 py-1.5 border border-gray-300">
                        <Award className="h-4 w-4 text-gray-700" />
                        <span className="text-xs sm:text-sm font-semibold uppercase tracking-wide text-gray-700">
                          {instructor.level}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* About */}
              <Card className="shadow-sm">
                <CardContent className="p-4 sm:p-6">
                  <div className="mb-3 text-xl sm:text-2xl flex items-center gap-2 font-bold text-black">
                    {instructor.name} - Know your tutor
                  </div>
                  <p className="leading-relaxed text-sm sm:text-base text-gray-700">
                    {instructor.about ||
                      "Experienced educator passionate about helping students achieve their academic goals. Specializes in creating personalized learning experiences tailored to each student's unique needs."}
                  </p>

                  {/* Languages - Inline Display */}
                  {instructor.languages && instructor.languages.length > 0 && (
                    <div className="mt-6 border-t border-gray-200 pt-4">
                      <div className="flex items-center gap-2 flex-wrap">
                        <div className="flex items-center gap-2">
                          <Languages className="h-5 w-5 text-gray-700" />
                          <h3 className="text-sm font-semibold text-gray-900">
                            Languages :
                          </h3>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger>
                                <Info className="h-4 w-4 " />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Languages in which the class is available</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                        <span className="text-sm font-medium text-neutral-800 ml-3">
                          {instructor.languages.join(', ')}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Academic Performance (CGPA) - Inline Display */}
                  <div className="mt-6 border-t border-gray-200 pt-4">
                    <div className="flex items-center gap-2 flex-wrap">
                      <div className="flex items-center gap-2">
                        <Trophy className="h-5 w-5 text-gray-700" />
                        <h3 className="text-sm font-semibold text-gray-900">
                          Academic Performance :
                        </h3>
                      </div>
                      <span className="text-sm font-medium text-gray-700">
                        <span className="font-bold text-black">
                          {instructor.cgpa?.toString() || 'N/A'}
                        </span>
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Subjects/Skills */}
            {instructor.skills && instructor.skills.length > 0 && (
              <Card className="border-2 border-gray-200 shadow-sm">
                <CardContent className="p-6">
                  <h2 className="mb-4 flex items-center gap-2 text-xl font-bold text-black">
                    <GraduationCap className="h-5 w-5" />
                    Subjects Taught
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {instructor.skills.map((skill: string) => (
                      <Badge
                        key={skill}
                        variant="outline"
                        className="border-2 border-black bg-white px-4 py-2 text-sm font-medium text-black transition-colors hover:bg-black hover:text-white"
                      >
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right side - Sticky booking card */}
          <SideCard instructor={instructor} profileUrl={profileUrl} />
        </div>
      </div>
    </div>
  )
}
