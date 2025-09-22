export type ProgramLevelId = 'foundation' | 'diploma' | 'bsc' | 'bs' | undefined

export type foundationSubjects =
  | 'Maths-I'
  | 'Maths-II'
  | 'Stats-I'
  | 'Stats-II'
  | 'English-I'
  | 'English-II'
  | 'Computational Thinking'
  | 'Python'

export type diplomadsSubjects = 'MLF' | 'MLT' | 'MLP' | 'BDM' | 'BA' | 'TDS'

export type diplomaprSubjects =
  | 'PDSA'
  | 'DBMS'
  | 'MAD-I'
  | 'MAD-II'
  | 'JAVA'
  | 'SC'

export type diplomaProjects =
  | 'MLP Project'
  | 'BDM Project'
  | 'MAD-I Project'
  | 'MAD-II Project'

export type bscSubjects = 'AI' | 'DL' | 'SE' | 'ST' | 'SFPG' | 'MR' | 'LLM'

export type Subjects =
  | foundationSubjects
  | diplomadsSubjects
  | diplomaprSubjects
  | diplomaProjects
  | bscSubjects

export type Languages =
  | 'English'
  | 'Tamil'
  | 'Hindi'
  | 'Telugu'
  | 'Kannada'
  | 'Malayalam'

export type FoundationSubjects = {
  name: foundationSubjects
  description: string
  credits: number
  level: ProgramLevelId
  prerequisites?: foundationSubjects[]
}

export type DiplomaDsSubjects = {
  name: diplomadsSubjects
  description: string
  credits: number
  level: ProgramLevelId
  prerequisites?: diplomadsSubjects[]
}

export type DiplomaPrSubjects = {
  name: diplomaprSubjects
  description: string
  credits: number
  level: ProgramLevelId
  prerequisites?: diplomaprSubjects[]
}

export type DiplomaProjects = {
  name: diplomaProjects
  description: string
  credits: number
  level: ProgramLevelId
  prerequisites?: diplomaProjects[]
}

export type BscSubjects = {
  name: bscSubjects
  description: string
  credits: number
  level: ProgramLevelId
  prerequisites?: bscSubjects[]
}

export type PricingTier = {
  level: ProgramLevelId
  title: string
  price: number
  color: string
  highlightColor: string
}

// Types for instructor availability
export type TimeSlot = { from: string; to: string }

export type DayType =
  | 'Monday'
  | 'Tuesday'
  | 'Wednesday'
  | 'Thursday'
  | 'Friday'
  | 'Saturday'
  | 'Sunday'

export type DayAvailability = { isEnabled: boolean; slots: TimeSlot[] }

export type AvailabilityType = { [day in DayType]: DayAvailability }

export type OnboardingFormData = {
  iitmProfileUrl: string
  cgpa: number
  level: ProgramLevelId
  subjects: Subjects[]
  languages: Languages[]
  profilePicture: string | null
  bio: string
  githubUrl: string
  linkedinUrl: string
  availability: AvailabilityType
}
