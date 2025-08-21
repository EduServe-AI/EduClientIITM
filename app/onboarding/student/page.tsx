'use client'

import { useState } from 'react'
import LevelSelector from '../components/levelSelector'
import SubjectSelector from '../components/subjectsSelector'
import { ProgramLevelId } from '@/types/types'
import { toast } from 'sonner'
import { apiService } from '@/lib/api'

export default function StudentOnboarding() {
  // state controlling level selection
  const [levelOpen, setLevelOpen] = useState<boolean>(true)

  // state controlling subject selection
  const [subjectOpen, setSubjectOpen] = useState<boolean>(false)

  const [selectedLevel, setSelectedLevel] = useState<ProgramLevelId | null>(
    null
  )

  const handleLevelClick = async () => {
    // here we need to make a call to the backend
    if (!selectedLevel) {
      toast.error('Please select a level')
      return
    }

    const accessToken = localStorage.getItem('accessToken')

    if (!accessToken) {
      toast.error('No access token found. Please log in again.')
      return
    }

    try {
      await apiService('/user/update', {
        method: 'PATCH',
        body: { level: selectedLevel },
      })

      // making the level component to hide
      setLevelOpen(false)

      // set the subject selection component to open
      setSubjectOpen(true)
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message || 'Failed to update level')
      } else {
        toast.error('An unknown error occurred.')
      }
    }
  }

  return (
    <>
      {levelOpen && (
        <LevelSelector
          selectedLevel={selectedLevel}
          setSelectedLevel={setSelectedLevel}
          handleLevelClick={handleLevelClick}
        />
      )}

      {subjectOpen && (
        <SubjectSelector
          selectedLevel={selectedLevel}
          onBack={() => {
            setLevelOpen(true)
            setSubjectOpen(false)
          }}
        />
      )}
    </>
  )
}
