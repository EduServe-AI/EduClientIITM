'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Skill } from '@/contexts/instructorContext'
import { subjectNames } from '@/lib/utils'
import { XIcon } from 'lucide-react'
import { useMemo, useState } from 'react'
import { toast } from 'sonner'

const foundation_subjects = subjectNames('foundation')
const diploma_subjects = subjectNames('diploma')
const bsc_subjects = subjectNames('bsc')

export function EditSkills({
  skills,
  setSkills,
  level,
}: {
  skills: Skill[]
  setSkills: (skills: Skill[]) => void
  level: string | undefined
}) {
  const [isOpen, setIsOpen] = useState(false)

  // Local state to manage selected skills
  const [selectedSkills, setSelectedSkills] = useState<string[]>(
    skills?.map(skill => skill.name) || []
  )

  // Update local state when dialog opens
  const handleOpen = (open: boolean) => {
    if (open) {
      setSelectedSkills(skills?.map(skill => skill.name) || [])
    }
    setIsOpen(open)
  }

  // Get all available subjects based on instructor's level
  const availableSubjects = useMemo(() => {
    switch (level) {
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
  }, [level])

  // Handle skill selection
  const handleSkillToggle = (skillName: string) => {
    if (selectedSkills.includes(skillName)) {
      // Remove skill
      setSelectedSkills(selectedSkills.filter(s => s !== skillName))
    } else {
      // Check if maximum limit reached (5 skills)
      if (selectedSkills.length >= 5) {
        toast.error("You can't select more than 5 skills")
        return
      }
      // Add skill
      setSelectedSkills([...selectedSkills, skillName])
    }
  }

  // Apply changes to parent component
  const handleApply = () => {
    // Create new skills array based on selected skills
    const updatedSkills: Skill[] = selectedSkills.map(skillName => {
      // Find existing skill or create new one
      const existingSkill = skills?.find(s => s.name === skillName)

      return (
        existingSkill || {
          id: `temp-${Date.now()}-${skillName}`,
          name: skillName,
          courseId: '',
          instructorProfileId: '',
          userId: '',
        }
      )
    })

    setSkills(updatedSkills)
    toast.success('Skills updated')
    setIsOpen(false)
  }

  // Reset to current skills when dialog closes without saving
  const handleCancel = () => {
    setSelectedSkills(skills?.map(skill => skill.name) || [])
    setIsOpen(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" color="black">
          Edit Skills
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Edit Skills</DialogTitle>
          <DialogDescription>
            Select the subjects you are skilled in. You can select up to 5
            skills.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Current Selected Skills */}
          <div className="space-y-2">
            <h4 className="font-medium text-sm">
              Current Skills ({selectedSkills.length}/5)
            </h4>
            <div className="min-h-[60px] p-3 rounded-md border bg-muted/30">
              {selectedSkills.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {selectedSkills.map(skillName => (
                    <div
                      key={skillName}
                      className="px-3 py-1.5 rounded-full bg-blue-100 text-blue-800 text-sm font-medium flex items-center gap-1.5"
                    >
                      {skillName}
                      <button
                        onClick={() => handleSkillToggle(skillName)}
                        className="hover:bg-blue-200 rounded-full p-0.5"
                      >
                        <XIcon className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground italic">
                  No skills selected yet
                </p>
              )}
            </div>
          </div>

          {/* Available Skills */}
          <div className="space-y-2">
            <h4 className="font-medium text-sm">Available Subjects</h4>
            <ScrollArea className="h-[300px] w-full rounded-md border p-4 mt-5">
              <div className="flex flex-wrap gap-3">
                {availableSubjects.map(subject => {
                  const isSelected = selectedSkills.includes(subject.name)
                  const bgColor =
                    subject.level === 'foundation'
                      ? 'bg-blue-50 border-blue-200'
                      : subject.level === 'diploma'
                        ? 'bg-green-50 border-green-200'
                        : 'bg-purple-50 border-purple-200'

                  return (
                    <Card
                      key={subject.name}
                      onClick={() => handleSkillToggle(subject.name)}
                      className={`cursor-pointer border ${bgColor} rounded-xl shadow-sm hover:shadow-md transition w-fit ${
                        isSelected ? 'ring-2 ring-blue-400' : ''
                      }`}
                    >
                      <CardContent className="flex items-center justify-center px-4 py-2 text-sm text-center font-medium text-gray-800">
                        {subject.name}
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </ScrollArea>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <DialogClose asChild>
            <Button type="button" variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
          </DialogClose>
          <Button type="button" onClick={handleApply}>
            Apply Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
