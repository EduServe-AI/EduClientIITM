import { BSC_SUBJECTS } from '@/constants/bsc-subjects'
import { DIPLOMA_PROJECTS } from '@/constants/diploma-projects'
import { DIPLOMADS_SUBJECTS } from '@/constants/diplomads-subjects'
import { DIPLOMAPR_SUBJECTS } from '@/constants/diplomapr-subjects'
import { FOUNDATION_SUBJECTS } from '@/constants/foundation-subjects'
import { ProgramLevelId, Subjects } from '@/types/types'
import { clsx, type ClassValue } from 'clsx'
import { useMemo } from 'react'
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

export const getImageUrl = (
  name: string,
  type: 'bot' | 'profile' | 'banner'
) => {
  const baseUrl = process.env.NEXT_PUBLIC_STORGAE_URL

  const paths = {
    profile: `/userassets/${name}/profile.jpg`,
    banner: `/userassets/${name}/banner.jpg`,
    bot: `/botimages/${name}.jpg`,
  }

  return `${baseUrl}${paths[type]}`
}

export const useImageUrl = (
  name: string | undefined,
  type: 'bot' | 'profile' | 'banner'
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

export function getInitials(
  name: string,
  limitToFirstAndLast: boolean = false
): string {
  if (!name || typeof name !== 'string') return ''

  // Normalize: trim whitespace, split by space, filter out empty parts
  const parts = name
    .trim()
    .split(/\s+/)
    .filter(part => part.length > 0)

  if (parts.length === 0) return ''

  // If limited to first and last name
  const selectedParts =
    limitToFirstAndLast && parts.length >= 2
      ? [parts[0], parts[parts.length - 1]]
      : parts

  // Extract and uppercase initials
  const initials = selectedParts
    .map(part => part.charAt(0).toUpperCase())
    .join('')

  return initials
}
