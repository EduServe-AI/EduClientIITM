import { FOUNDATION_SUBJECTS } from '@/constants/foundation-subjects'
import { DIPLOMADS_SUBJECTS } from '@/constants/diplomads-subjects'
import { DIPLOMAPR_SUBJECTS } from '@/constants/diplomapr-subjects'
import { DIPLOMA_PROJECTS } from '@/constants/diploma-projects'
import { BSC_SUBJECTS } from '@/constants/bsc-subjects'
import { getLevelProperties } from './levelSelector'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import { toast } from 'sonner'
import { ProgramLevelId } from '@/types/types'
import { useRouter } from 'next/navigation'

interface SubjectSelectorProps {
  selectedLevel: ProgramLevelId | null
  onBack: () => void
}

const BaseUrl = process.env.NEXT_PUBLIC_API_URL

export default function SubjectSelector({
  selectedLevel,
  onBack,
}: SubjectSelectorProps) {
  if (!selectedLevel) {
    toast.error('No selected Programme Level')
    throw new Error('No selected Programme Level')
  }

  const router = useRouter()

  const color = getLevelProperties(selectedLevel)
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([])
  const [selectedProjects, setSelectedProjects] = useState<string[]>([])

  const isProjectCourse = (name: string) => {
    return DIPLOMA_PROJECTS.some(project => project.name === name)
  }

  const toggleSubject = (name: string) => {
    const isProject = isProjectCourse(name)

    if (isProject) {
      setSelectedProjects(prev => {
        if (prev.includes(name)) {
          return prev.filter(s => s !== name)
        } else {
          if (prev.length >= 2) {
            toast.error('You can only select up to 2 project courses')
            return prev
          }
          return [...prev, name]
        }
      })
    } else {
      setSelectedSubjects(prev => {
        if (prev.includes(name)) {
          return prev.filter(s => s !== name)
        } else {
          if (prev.length >= 4) {
            toast.error('You can only select up to 4 regular subjects')
            return prev
          }
          return [...prev, name]
        }
      })
    }
  }

  const handleNext = async () => {
    const accessToken = localStorage.getItem('accessToken')

    const response = await fetch(`${BaseUrl}/enrollment/add-courses`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        selected_courses: [...selectedSubjects, ...selectedProjects],
      }),
    })

    const data = await response.json()

    router.push('/dashboard/student')
  }

  const renderSubjects = (subjects: any[]) => (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 mb-6">
      {subjects.map((subject, index) => {
        const isSelected = isProjectCourse(subject.name)
          ? selectedProjects.includes(subject.name)
          : selectedSubjects.includes(subject.name)

        return (
          <Card
            key={index}
            onClick={() => toggleSubject(subject.name)}
            className={`flex flex-col justify-between p-5 h-full transition-all duration-200 rounded-xl cursor-pointer
            ${color.color}
            ${isSelected ? 'border-2 ' + color.selectedColor : 'border ' + color.color}
            hover:shadow-xl`}
          >
            <CardHeader>
              <CardTitle className="text-lg text-center font-bold text-gray-900">
                {subject.name}
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-md font-medium text-gray-700">
                Credits: {subject.credits}
              </p>
              {subject.prerequisites?.length > 0 && (
                <p className="text-sm mt-2 text-gray-500">
                  Prerequisites: {subject.prerequisites.join(', ')}
                </p>
              )}
            </CardContent>
          </Card>
        )
      })}
    </div>
  )

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-6">
      <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">
        {selectedLevel.toUpperCase()} LEVEL
      </h2>

      {selectedLevel === 'diploma' ? (
        <>
          <h3 className="text-lg font-semibold mb-2 text-gray-800 text-center">
            Diploma in Data Science
          </h3>
          {renderSubjects(DIPLOMADS_SUBJECTS)}

          <h3 className="text-lg font-semibold mb-2 text-gray-800 mt-6 text-center">
            Diploma in Programming
          </h3>
          {renderSubjects(DIPLOMAPR_SUBJECTS)}

          <h3 className="text-lg font-semibold mb-2 text-gray-800 mt-6 text-center">
            Project Courses
          </h3>
          {renderSubjects(DIPLOMA_PROJECTS)}
        </>
      ) : (
        renderSubjects(
          selectedLevel === 'foundation'
            ? FOUNDATION_SUBJECTS
            : selectedLevel === 'bsc'
              ? BSC_SUBJECTS
              : []
        )
      )}

      {/* Selected subjects display */}
      <div className="flex items-start justify-between mt-6 flex-wrap">
        <div className="flex-grow space-y-3">
          {selectedSubjects.length > 0 && (
            <div className="flex items-center gap-3 flex-wrap">
              <span className="text-gray-700 font-medium whitespace-nowrap">
                Selected Subjects:
              </span>
              <div className="flex flex-wrap gap-2">
                {selectedSubjects.map((subject, index) => (
                  <span
                    key={index}
                    className={`text-sm px-3 py-1 rounded-full ${color.color} border ${color.selectedColor}`}
                  >
                    {subject}
                  </span>
                ))}
                <span className="text-xs text-gray-500">
                  ({selectedSubjects.length}/4)
                </span>
              </div>
            </div>
          )}

          {selectedLevel === 'diploma' && selectedProjects.length > 0 && (
            <div className="flex items-center gap-3 flex-wrap">
              <span className="text-gray-700 font-medium whitespace-nowrap">
                Selected Projects:
              </span>
              <div className="flex flex-wrap gap-2">
                {selectedProjects.map((project, index) => (
                  <span
                    key={index}
                    className={`text-sm px-3 py-1 rounded-full bg-amber-50 border-2 border-amber-500`}
                  >
                    {project}
                  </span>
                ))}
                <span className="text-xs text-gray-500">
                  ({selectedProjects.length}/2)
                </span>
              </div>
            </div>
          )}
        </div>

        <div className="flex gap-3  sm:mt-0">
          <Button
            onClick={onBack}
            className="px-6 py-2 text-md rounded-md border-neutral-800 bg-neutral-600 hover:bg-neutral-900 hover:cursor-pointer text-white"
          >
            Back
          </Button>
          <Button
            onClick={handleNext}
            disabled={
              selectedSubjects.length === 0 && selectedProjects.length === 0
            }
            className="px-6 py-2 text-md rounded-md bg-sky-600 hover:bg-sky-800 text-white hover:cursor-pointer"
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}
