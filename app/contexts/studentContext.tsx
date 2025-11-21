import { apiService } from '@/lib/api'
import { ProgramLevelId } from '@/types/types'
import React, { createContext, useContext, useEffect, useState } from 'react'
import { toast } from 'sonner'

export interface Course {
  id: string
  name: string
  description: string
}

export interface student {
  id: string
  username: string
  email: string
  role: string
  level: ProgramLevelId
  courses: Course[]
}

interface StudentContextType {
  student: student | null
  //   setStudent: (student: student) => void
  isLoading: boolean
}

interface studentResponseDataType {
  data: {
    student: student
  }
}

const StudentContext = createContext<StudentContextType | undefined>(undefined)

export function StudentProvider({ children }: { children: React.ReactNode }) {
  const [student, setStudent] = useState<student | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadStudentData() {
      try {
        const response =
          await apiService<studentResponseDataType>('/student/me')
        const studentData = response.data.student

        console.log('StudentData', studentData)

        // Here we populate the student Data in the context
        setStudent(studentData)
      } catch (error) {
        console.error('Failed to load student data', error)
        toast.error('Failed to load student data for context')
      } finally {
        setIsLoading(false)
      }
    }

    loadStudentData()
  }, [])

  return (
    <StudentContext.Provider
      value={{
        student,
        isLoading,
      }}
    >
      {children}
    </StudentContext.Provider>
  )
}

export function useStudent() {
  const context = useContext(StudentContext)
  if (context === undefined) {
    throw new Error('UseStudent must be used within a Student Provider context')
  }
  return context
}
