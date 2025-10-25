import { BSC_SUBJECTS } from '@/constants/bsc-subjects'
import { DIPLOMA_PROJECTS } from '@/constants/diploma-projects'
import { DIPLOMADS_SUBJECTS } from '@/constants/diplomads-subjects'
import { DIPLOMAPR_SUBJECTS } from '@/constants/diplomapr-subjects'
import { FOUNDATION_SUBJECTS } from '@/constants/foundation-subjects'
import { ProgramLevelId, Subjects } from '@/types/types'
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { useMemo } from 'react'

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

export const getImageUrl = (name: string, type: 'bot' | 'profile') => {
  const baseUrl = process.env.NEXT_PUBLIC_STORGAE_URL

  const paths = {
    profile: `/profileimages/${name}.jpg`,
    bot: `/botimages/${name}.jpg`,
  }

  return `${baseUrl}${paths[type]}`
}

export const useImageUrl = (
  name: string | undefined,
  type: 'bot' | 'profile'
) => {
  return useMemo(() => {
    // If there's no file name , return an empty string or a default placeholder
    if (!name) {
      return '' // Or return '/placeholder-image.jpg'
    }

    // Only call getImageUrl if an id exists
    return getImageUrl(name, type)
  }, [name, type])
}
