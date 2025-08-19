'use client'

import { useState } from 'react'
import LevelSelector from '../components/levelSelector'
import SubjectSelector from '../components/subjectsSelector'
import { ProgramLevelId } from '@/types/types'
import { toast } from 'sonner'

const BaseUrl = process.env.NEXT_PUBLIC_API_URL

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

    const response = await fetch(`${BaseUrl}/user/update`, {
      method: 'PATCH',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        level: selectedLevel,
      }),
    })

    if (!response.ok) {
      toast.error('Network Error')
    }

    // making the level component to hide
    setLevelOpen(false)

    // set the subject selection component to open
    setSubjectOpen(true)
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
