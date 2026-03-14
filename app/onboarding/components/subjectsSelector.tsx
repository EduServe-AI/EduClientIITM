import { Button } from '@/components/ui/button'
import { BSC_SUBJECTS } from '@/constants/bsc-subjects'
import { DIPLOMA_PROJECTS } from '@/constants/diploma-projects'
import { DIPLOMADS_SUBJECTS } from '@/constants/diplomads-subjects'
import { DIPLOMAPR_SUBJECTS } from '@/constants/diplomapr-subjects'
import { FOUNDATION_SUBJECTS } from '@/constants/foundation-subjects'
import { apiService } from '@/lib/api'
import { ProgramLevelId } from '@/types/types'
import {
  Loader2,
  BookOpen,
  FlaskConical,
  Code,
  BrainCircuit,
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'
import { getLevelProperties } from './levelSelector'
import { motion } from 'framer-motion'

interface Subject {
  name: string
  credits: number
  prerequisites?: string[]
}

interface SubjectSelectorProps {
  selectedLevel: ProgramLevelId | null
  onBack: () => void
}

// Accent colors per level for the gradient cards
const levelAccents: Record<
  string,
  { gradient: string; ring: string; badge: string; icon: string }
> = {
  foundation: {
    gradient: 'from-violet-500/10 via-purple-500/5 to-transparent',
    ring: 'ring-violet-500/40',
    badge: 'bg-violet-100 text-violet-700',
    icon: 'text-violet-500',
  },
  diploma: {
    gradient: 'from-sky-500/10 via-blue-500/5 to-transparent',
    ring: 'ring-sky-500/40',
    badge: 'bg-sky-100 text-sky-700',
    icon: 'text-sky-500',
  },
  bsc: {
    gradient: 'from-emerald-500/10 via-green-500/5 to-transparent',
    ring: 'ring-emerald-500/40',
    badge: 'bg-emerald-100 text-emerald-700',
    icon: 'text-emerald-500',
  },
  bs: {
    gradient: 'from-amber-500/10 via-orange-500/5 to-transparent',
    ring: 'ring-amber-500/40',
    badge: 'bg-amber-100 text-amber-700',
    icon: 'text-amber-500',
  },
}

// Pick an icon based on subject name keywords
function getSubjectIcon(
  name: string,
  iconColor: string,
  sizeClass: string = 'w-5 h-5'
) {
  const lower = name.toLowerCase()
  if (
    lower.includes('math') ||
    lower.includes('stats') ||
    lower.includes('statistics')
  )
    return <BrainCircuit className={`${sizeClass} ${iconColor}`} />
  if (
    lower.includes('program') ||
    lower.includes('python') ||
    lower.includes('java') ||
    lower.includes('system') ||
    lower.includes('dbms') ||
    lower.includes('software')
  )
    return <Code className={`${sizeClass} ${iconColor}`} />
  if (
    lower.includes('ml') ||
    lower.includes('ai') ||
    lower.includes('deep') ||
    lower.includes('business')
  )
    return <FlaskConical className={`${sizeClass} ${iconColor}`} />
  return <BookOpen className={`${sizeClass} ${iconColor}`} />
}

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
  const accent = levelAccents[selectedLevel] || levelAccents.foundation
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([])
  const [selectedProjects, setSelectedProjects] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)

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
    if (!accessToken) {
      toast.error('No access token found. Please log in again')
    }

    if (selectedSubjects.length === 0 && selectedProjects.length === 0) {
      toast.error('Please select at least one course.')
      return
    }

    if (selectedSubjects.length > 4) {
      toast.error('You can only select up to 4 regular subjects')
      return
    }

    if (selectedProjects.length > 2) {
      toast.error('You can only select up to 2 project courses')
      return
    }

    const selected_courses = Array.from(
      new Set([...selectedSubjects, ...selectedProjects])
    )

    setIsSubmitting(true)
    try {
      await apiService('/enrollment/add-courses', {
        method: 'POST',
        body: { selected_courses },
      })

      toast.success('Courses enrolled successfully')
      router.push('/dashboard/student')
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message || 'An unknown network error occurred.')
      } else {
        toast.error('An unknown error occurred.')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const renderSubjects = (subjects: Subject[]) => (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 mb-6">
      {subjects.map((subject, index) => {
        const isProject = isProjectCourse(subject.name)
        const isSelected = isProject
          ? selectedProjects.includes(subject.name)
          : selectedSubjects.includes(subject.name)

        return (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.04 }}
            onClick={() => toggleSubject(subject.name)}
            className={`
              relative group cursor-pointer rounded-xl p-4 transition-all duration-200
              bg-white
              hover:shadow-md hover:-translate-y-0.5
              ${
                isSelected
                  ? `border-2 ${color.selectedColor} shadow-md ring-1 ${accent.ring}`
                  : 'border-2 border-gray-200 hover:border-gray-300'
              }
            `}
          >
            {/* Gradient background accent */}
            <div
              className={`absolute inset-0 rounded-xl bg-gradient-to-br ${accent.gradient} pointer-events-none ${isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-60'} transition-opacity duration-300`}
            />

            <div className="relative z-10 flex flex-row items-center gap-4">
              {/* Icon */}
              <div
                className={`w-12 h-12 flex-shrink-0 rounded-xl flex items-center justify-center ${isSelected ? accent.badge : 'bg-gray-100'} transition-colors duration-200`}
              >
                {getSubjectIcon(
                  subject.name,
                  isSelected ? accent.icon : 'text-gray-500',
                  'w-6 h-6'
                )}
              </div>

              {/* Text content */}
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start gap-2 mb-1">
                  <h4 className="text-base font-bold text-gray-900 leading-tight truncate">
                    {subject.name}
                  </h4>
                  <span
                    className={`text-xs font-semibold px-2 py-0.5 flex-shrink-0 rounded-full ${accent.badge}`}
                  >
                    {subject.credits} cr
                  </span>
                </div>
                {/* Prerequisites */}
                {subject.prerequisites && subject.prerequisites.length > 0 && (
                  <p className="text-xs text-gray-500 leading-snug truncate">
                    Prereq: {subject.prerequisites.join(', ')}
                  </p>
                )}
              </div>
            </div>

            {/* Selection check indicator */}
            {isSelected && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute top-2 right-2 w-5 h-5 rounded-full bg-green-500 flex items-center justify-center shadow"
              >
                <svg
                  className="w-3 h-3 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={3}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </motion.div>
            )}
          </motion.div>
        )
      })}
    </div>
  )

  return (
    <div className="w-full">
      <p className="text-gray-500 text-sm mb-6">
        Select courses for your {selectedLevel.toUpperCase()} level programme.
      </p>

      {selectedLevel === 'diploma' ? (
        <>
          <h3 className="text-lg font-semibold mb-3 text-gray-800">
            Diploma in Data Science
          </h3>
          {renderSubjects(DIPLOMADS_SUBJECTS)}

          <h3 className="text-lg font-semibold mb-3 text-gray-800 mt-6">
            Diploma in Programming
          </h3>
          {renderSubjects(DIPLOMAPR_SUBJECTS)}

          <h3 className="text-lg font-semibold mb-3 text-gray-800 mt-6">
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

      {/* Selected subjects display + actions */}
      <div className="flex items-start justify-between mt-6 flex-wrap gap-4">
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

        <div className="flex gap-3 sm:mt-0">
          <Button
            onClick={handleNext}
            disabled={
              (selectedSubjects.length === 0 &&
                selectedProjects.length === 0) ||
              isSubmitting
            }
            className="px-6 py-2.5 text-md rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white hover:cursor-pointer shadow-md shadow-emerald-500/20 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              '🎉 Submit Enrollment'
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}
