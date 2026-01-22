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

export type InstructorType = {
  id: string
  instructorId: string
  bio: string
  basePrice: number
  level: ProgramLevelId
  user: { id: string; username: string; level: ProgramLevelId }
  skills: { name: string; course: { title: string } }[]
}

export type searchInstructorResponseType = {
  message: string
  success: boolean
  data: {
    instructors: InstructorType[]
  }
}

export interface Chat {
  id: string
  botId: string
  botName: string
  title: string | null
  lastInteractionTime: Date
  createdAt: Date
}

export interface UserChatsResponse {
  data: {
    chats: Chat[]
  }
}

export interface InstructorProfileType {
  data: {
    name: string
    bio: string
    about: string
    iitmProfileUrl: string
    instructorId: string
    cgpa: number
    githubUrl: string
    linkedinUrl: string
    level: string
    basePrice: number
    cgpa?: number
    skills: string[]
    languages: string[]
    availabilities: Record<string, string[]>
  }
}
