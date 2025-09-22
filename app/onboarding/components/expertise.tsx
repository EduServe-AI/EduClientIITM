import { useMemo, useState } from 'react'
import { Languages, ProgramLevelId, Subjects } from '@/types/types'
import { subjectNames } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Languages as Medium } from '@/constants/languages'
import { GraduationCap, Languages as LangIcon, InfoIcon } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { toast } from 'sonner'

interface ExpertiseProps {
  formData: {
    level: ProgramLevelId
    subjects: Subjects[]
    languages: Languages[]
  }
  setFormData: React.Dispatch<React.SetStateAction<any>>
}

const foundation_subjects = subjectNames('foundation')
const diploma_subjects = subjectNames('diploma')
const bsc_subjects = subjectNames('bsc')

export default function Expertise({ formData, setFormData }: ExpertiseProps) {
  // Memorizing the list of subjects to display so it only recalculates when level changes
  const subjectToDisplay = useMemo(() => {
    switch (formData.level) {
      case 'foundation':
        return foundation_subjects.map(s => ({ name: s, level: 'foundation' }))
      case 'diploma':
        return [
          ...foundation_subjects.map(s => ({ name: s, level: 'foundation' })),
          ...diploma_subjects.map(s => ({ name: s, level: 'diploma' })),
        ]
      case 'bsc':
      case 'bs':
        return [
          ...foundation_subjects.map(s => ({ name: s, level: 'foundation' })),
          ...diploma_subjects.map(s => ({ name: s, level: 'diploma' })),
          ...bsc_subjects.map(s => ({ name: s, level: 'bsc' })),
        ]
      default:
        return []
    }
  }, [formData.level])

  // handling the subject selection
  const handleSubjectSelect = (subject: Subjects) => {
    // Check if subject is already selected
    if (formData.subjects.includes(subject)) {
      // Remove subject if already selected
      setFormData({
        ...formData,
        subjects: formData.subjects.filter(s => s !== subject),
      })
    } else {
      // Check if maximum limit reached (5 subjects)
      if (formData.subjects.length >= 5) {
        toast.error("You can't select more than 5 subjects")
        return
      }
      // Add subject if not at limit
      setFormData({
        ...formData,
        subjects: [...formData.subjects, subject],
      })
    }
  }

  // handling the language selection
  const handleLanguageSelect = (language: Languages) => {
    if (!formData.languages.includes(language)) {
      setFormData({ ...formData, languages: [...formData.languages, language] })
    } else {
      setFormData({
        ...formData,
        languages: formData.languages.filter(l => l !== language),
      })
    }
  }

  return (
    <section className="max-w-4xl mx-auto w-full space-y-4">
      {/* Subjects display */}
      <div className="flex flex-col ml-10 space-y-2">
        <h3 className="text-xl ml-4 flex items-center justify-center text-center gap-2">
          <GraduationCap size={22} className="" />
          Subjects
          {/* Tooltip for subjects */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <InfoIcon size={18} className="text-black cursor-pointer" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-sm">
                  Select the subjects you are expertised with
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </h3>
        {/* Here we need to display the selected subjects */}
        {formData.subjects.length > 0 ? (
          <div className="flex flex-wrap gap-2 ml-4 mb-2">
            {formData.subjects.map(subject => (
              <span
                key={subject}
                className="px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-sm font-medium"
              >
                {subject}
              </span>
            ))}
          </div>
        ) : (
          <>
            <span className="text-sm italic">No selected subjects yet</span>
          </>
        )}
        <ScrollArea className="h-60 w-full">
          <div className="flex flex-wrap gap-3 mt-5 ml-2">
            {subjectToDisplay.map(subject => {
              let bgColor =
                subject.level === 'foundation'
                  ? 'bg-blue-50 border-blue-200'
                  : subject.level === 'diploma'
                    ? 'bg-green-50 border-green-200'
                    : 'bg-purple-50 border-purple-200'

              return (
                <Card
                  key={subject.name}
                  onClick={() => handleSubjectSelect(subject.name)}
                  className={`hover:cursor-pointer border ${bgColor} rounded-xl shadow-sm hover:shadow-md transition w-fit ${formData.subjects.includes(subject.name) ? 'ring-2 ring-blue-400' : ''}`}
                >
                  <CardContent className="flex items-center justify-center px-4 text-sm text-center font-medium text-gray-800">
                    {subject.name}
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </ScrollArea>
      </div>

      {/* Languages display */}
      <div className="flex flex-col ml-10 mt-6 ">
        <h3 className="text-xl ml-4 text-center flex items-center justify-center gap-2">
          <LangIcon size={22} className="" />
          Languages
          {/* Tooltip for languages */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <InfoIcon size={18} className="text-black cursor-pointer" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-sm">
                  Select the languages you are proficient with
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </h3>
        {/* Here we need to display the selected languages */}
        {formData.languages.length > 0 ? (
          <div className="flex flex-wrap gap-2 ml-4 mt-2 justify-start items-center">
            {formData.languages.map(language => (
              <span
                key={language}
                className="px-3 py-1 rounded-full bg-green-100 text-green-800 text-sm font-medium"
              >
                {language}
              </span>
            ))}
          </div>
        ) : (
          <>
            <span className="text-sm italic ml-3">
              No selected languages yet
            </span>
          </>
        )}
        <div className="flex flex-wrap gap-3 p-4">
          {Medium.map(language => (
            <Button
              key={language}
              onClick={() => handleLanguageSelect(language as Languages)}
              className={`px-4 py-2 rounded-md border text-sm font-medium shadow-sm transition ${
                formData.languages.includes(language as Languages)
                  ? 'bg-blue-700 border-blue-300 text-white hover:bg-blue-300 hover:cursor-pointer'
                  : 'bg-white border-gray-300 text-gray-800 hover:bg-blue-400 hover:border-blue-300 hover:text-blue-700 hover:cursor-pointer'
              }`}
            >
              {language}
            </Button>
          ))}
        </div>
      </div>
    </section>
  )
}
