import { MeetStatus, ProgramLevelId } from './types'

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

export interface CreateSessionRequest {
  instructorId: string
  startTime: string
  title: string
  description: string
  durationMinutes: number
}

export interface CreateSessionResponse {
  message: string
  httpCode: number
  data: {
    savedSession: {
      id: string
      title: string
      description: string
      studentId: string
      instructorId: string
      start_time: string
      duration_minutes: number
      end_time: string
      stream_call_id: string
      status: MeetStatus
    }
  }
}

export interface member {
  username: string
  email: string
  profileImageUrl?: string
}

export interface UserSessionsResponse {
  message: string
  httpCode: number
  data: {
    userSessions: {
      id: string
      studentId: string
      instructorId: string
      title: string
      description: string
      start_time: Date
      duration_minutes: number
      end_time: Date
      stream_call_id: string
      status: MeetStatus
      student: member
      instructor: member
    }[]
  }
}
