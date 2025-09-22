import { BSC_SUBJECTS } from '@/constants/bsc-subjects'
import { DIPLOMA_PROJECTS } from '@/constants/diploma-projects'
import { DIPLOMADS_SUBJECTS } from '@/constants/diplomads-subjects'
import { DIPLOMAPR_SUBJECTS } from '@/constants/diplomapr-subjects'
import { FOUNDATION_SUBJECTS } from '@/constants/foundation-subjects'
import { ProgramLevelId, Subjects } from '@/types/types'
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const subjectNames = (level: ProgramLevelId): Subjects[] => {
  let subjects: Subjects[] = []

  if (level === 'foundation') {
    subjects = [...FOUNDATION_SUBJECTS.map(subject => subject.name as Subjects)]
    return subjects
  }

  if (level === 'diploma') {
    const diplomaSubjects = [
      ...DIPLOMADS_SUBJECTS.map(subject => subject.name as Subjects),
      ...DIPLOMAPR_SUBJECTS.map(subject => subject.name as Subjects),
      ...DIPLOMA_PROJECTS.map(subject => subject.name as Subjects),
    ]
    subjects = [...diplomaSubjects]
    return subjects
  }

  if (level === 'bsc' || level === 'bs') {
    subjects = [...BSC_SUBJECTS.map(subject => subject.name as Subjects)]
    return subjects
  }

  return subjects
}
