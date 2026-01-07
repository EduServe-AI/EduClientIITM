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
