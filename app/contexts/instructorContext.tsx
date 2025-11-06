'use client'

import { apiService } from '@/lib/api'
import { ProgramLevelId } from '@/types/types'
import React, { createContext, useContext, useEffect, useState } from 'react'
import { toast } from 'sonner'

export interface Skill {
  id: string
  name: string
  courseId: string
  instructorProfileId: string
  userId: string
}

export interface instructorProfile {
  bio: string
  cgpa: string
  githubUrl?: string
  linkedinUrl?: string
  level: ProgramLevelId
  basePrice: number
  skills?: Skill[]
}

export interface instructor {
  id: string
  email: string
  username: string
  instructorProfile: instructorProfile
}

interface instructorResponseDataType {
  data: {
    instructor: instructor
  }
}

interface InstructorContextType {
  instructor: instructor | null
  setInstructor: (Instructor: any) => void
  isLoading: boolean
}

const InstructorContext = createContext<InstructorContextType | undefined>(
  undefined
)

export function InstructorProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [instructor, setInstructor] = useState<instructor | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadinstructorData() {
      try {
        const response =
          await apiService<instructorResponseDataType>('/instructor/me')

        console.log('response', response)
        const instructorData = response.data.instructor

        console.log('instructorData', instructorData)

        // Here we populate the instructor Data in the context
        setInstructor(instructorData)
      } catch (error) {
        console.error('Failed to load instructor data')
        toast.error('Failed to load instructor data for context')
      } finally {
        setIsLoading(false)
      }
    }

    loadinstructorData()
  }, [])

  return (
    <InstructorContext.Provider
      value={{
        instructor,
        setInstructor,
        isLoading,
      }}
    >
      {children}
    </InstructorContext.Provider>
  )
}

export function useInstructor() {
  const context = useContext(InstructorContext)
  if (context === undefined) {
    throw new Error(
      'UseInstructor must be used within a Instructor Provider context'
    )
  }
  return context
}
