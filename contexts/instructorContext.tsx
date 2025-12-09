// 'use client'

// import { apiService } from '@/lib/api'
// import { ProgramLevelId } from '@/types/types'
// import React, { createContext, useContext, useEffect, useState } from 'react'
// import { toast } from 'sonner'

// export interface Skill {
//   id: string
//   name: string
//   courseId: string
//   instructorProfileId: string
//   userId: string
// }

// export interface instructorProfile {
//   bio: string
//   cgpa: string
//   githubUrl?: string
//   linkedinUrl?: string
//   level: ProgramLevelId
//   basePrice: number
//   skills?: Skill[]
// }

// export interface instructor {
//   id: string
//   email: string
//   username: string
//   instructorProfile: instructorProfile
// }

// interface instructorResponseDataType {
//   data: {
//     instructor: instructor
//   }
// }

// interface InstructorContextType {
//   instructor: instructor | null
//   setInstructor: (Instructor: any) => void
//   isLoading: boolean
// }

// const InstructorContext = createContext<InstructorContextType | undefined>(
//   undefined
// )

// export function InstructorProvider({
//   children,
// }: {
//   children: React.ReactNode
// }) {
//   const [instructor, setInstructor] = useState<instructor | null>(null)
//   const [isLoading, setIsLoading] = useState(true)

//   useEffect(() => {
//     async function loadinstructorData() {
//       try {
//         const response =
//           await apiService<instructorResponseDataType>('/instructor/me')

//         console.log('response', response)
//         const instructorData = response.data.instructor

//         console.log('instructorData', instructorData)

//         // Here we populate the instructor Data in the context
//         setInstructor(instructorData)
//       } catch (error) {
//         console.error('Failed to load instructor data')
//         toast.error('Failed to load instructor data for context')
//       } finally {
//         setIsLoading(false)
//       }
//     }

//     loadinstructorData()
//   }, [])

//   return (
//     <InstructorContext.Provider
//       value={{
//         instructor,
//         setInstructor,
//         isLoading,
//       }}
//     >
//       {children}
//     </InstructorContext.Provider>
//   )
// }

// export function useInstructor() {
//   const context = useContext(InstructorContext)
//   if (context === undefined) {
//     throw new Error(
//       'UseInstructor must be used within a Instructor Provider context'
//     )
//   }
//   return context
// }
'use client'

import { apiService } from '@/lib/api'
import { ProgramLevelId } from '@/types/types'
import React, { createContext, useContext, useEffect, useState } from 'react'
import { toast } from 'sonner'

// ✅ Skill type — optional but useful for displaying skills in Profile
export interface Skill {
  id: string
  name: string
  courseId: string
  instructorProfileId: string
  userId: string
}

// ✅ Language type
export interface Language {
  id: string
  languageId: string
  language: {
    name: string
  }
}

// ✅ Availability type
export interface Availability {
  id: string
  isAvailable: boolean
  dayOfWeek: { id: number; name: string }
  timeSlots: { id: string; startTime: string; endTime: string }[]
}

// ✅ Instructor profile structure (matches your backend)
export interface InstructorProfile {
  bio: string
  cgpa: string
  iitmProfileUrl?: string
  githubUrl?: string
  linkedinUrl?: string
  level: ProgramLevelId
  basePrice: number
  skills?: Skill[]
  availabilities: Availability[]
}

// ✅ Instructor main type
export interface Instructor {
  id: string
  email: string
  username: string
  instructorProfile: InstructorProfile
  userLanguages?: Language[]
}

// ✅ API response type
interface InstructorResponseData {
  data: {
    instructor: Instructor
  }
}

// ✅ Context shape
interface InstructorContextType {
  instructor: Instructor | null
  setInstructor: React.Dispatch<React.SetStateAction<Instructor | null>>
  isLoading: boolean
}

// ✅ Create Context
const InstructorContext = createContext<InstructorContextType | undefined>(
  undefined
)

// ✅ Provider
export function InstructorProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [instructor, setInstructor] = useState<Instructor | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadInstructorData() {
      try {
        const response =
          await apiService<InstructorResponseData>('/instructor/me')
        const instructorData = response.data.instructor
        console.log('Loaded instructor:', instructorData)
        setInstructor(instructorData)
      } catch (error) {
        console.error('Failed to load instructor data:', error)
        toast.error('Failed to load instructor data')
      } finally {
        setIsLoading(false)
      }
    }

    loadInstructorData()
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

// ✅ Hook
export function useInstructor() {
  const context = useContext(InstructorContext)
  if (!context) {
    throw new Error('useInstructor must be used within an InstructorProvider')
  }
  return context
}
