import { ProgramLevelId } from './types'

export type BotType = {
  id: string
  name: string
  description: string
  courseId: string
  level: ProgramLevelId
  numInteractions: number
}

export type searchResponseType = {
  message: string
  success: boolean
  data: {
    bots: BotType[]
  }
}

export type FeaturedInstructorType = {
  id: string
  level: ProgramLevelId
  bio: string
  basePrice: string
  instructorId: string
  user: {
    username: string
    profileUrl: string | null
  }
  skills: { name: string }[]
}

export type FeaturedInstructorsResponseType = {
  data: {
    featuredInstructors: FeaturedInstructorType[]
  }
}
