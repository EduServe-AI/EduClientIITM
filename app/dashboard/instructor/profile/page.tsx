'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import {
  Availability,
  Language,
  Skill,
  useInstructor,
} from '@/contexts/instructorContext'
import { apiService } from '@/lib/api'
import { getAccessToken } from '@/lib/auth'
import { useImageUrl } from '@/lib/utils'
import { ProgramLevelId } from '@/types/types'
import { Clock, EditIcon, MoonIcon } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'
import { EditAvailabilities } from './components/editAvailabilities'
import { EditLanguages } from './components/editLanguages'
import { EditSkills } from './components/editSkills'

interface ProfileData {
  username: string
  email: string
  level: ProgramLevelId | undefined
  bio: string
  iitmProfileUrl?: string
  githubUrl?: string
  linkedinUrl?: string
  basePrice: number
  skills?: Skill[]
  languages?: Language[]
  availabilities: Availability[]
}

export default function Profile() {
  const { instructor, setInstructor, isLoading } = useInstructor()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const bannerInputRef = useRef<HTMLInputElement>(null)
  const [profileImage, setProfileImage] = useState('')
  const [bannerImage, setBannerImage] = useState('')
  const savedImageUrl = useImageUrl(instructor?.id, 'profile')
  const savedBannerUrl = useImageUrl(instructor?.id, 'banner')

  const [formData, setFormData] = useState<ProfileData>({
    username: '',
    email: '',
    level: undefined,
    bio: '',
    basePrice: 0,
    skills: [],
    languages: [],
    iitmProfileUrl: '',
    githubUrl: '',
    linkedinUrl: '',
    availabilities: [],
  })

  useEffect(() => {
    if (instructor) {
      setFormData({
        username: instructor?.username,
        email: instructor.email,
        level: instructor.instructorProfile?.level || undefined,
        bio: instructor.instructorProfile?.bio || '',
        basePrice: instructor.instructorProfile.basePrice,
        iitmProfileUrl: instructor.instructorProfile.iitmProfileUrl || '',
        githubUrl: instructor.instructorProfile.githubUrl || '',
        linkedinUrl: instructor.instructorProfile.linkedinUrl || '',
        skills: instructor.instructorProfile.skills || [],
        languages: instructor.userLanguages || [],
        availabilities: instructor.instructorProfile.availabilities || [],
      })
      console.log('instructor data from the context', instructor)
    }
  }, [instructor])

  const hasChanges = () => {
    if (!instructor) return false

    // Helper function to sort and stringify arrays of objects for reliable comparison
    const sortAndStringifySkills = (arr: Skill[] | undefined) =>
      JSON.stringify(
        (arr || [])
          .slice()
          .sort((a, b) => (a.name || '').localeCompare(b.name || ''))
      )

    const sortAndStringifyLanguages = (arr: Language[] | undefined) =>
      JSON.stringify(
        arr
          ?.slice()
          .sort((a, b) => (a.language.name > b.language.name ? 1 : -1)) || []
      )

    const sortAndStringifyAvailabilities = (arr: Availability[]) =>
      JSON.stringify(
        arr
          ?.slice()
          .sort((a, b) => (a.dayOfWeek.name > b.dayOfWeek.name ? 1 : -1)) || []
      )

    return (
      formData.username !== instructor.username ||
      formData.email !== instructor.email ||
      formData.bio !== (instructor.instructorProfile?.bio || '') ||
      formData.level !== instructor.instructorProfile?.level ||
      formData.iitmProfileUrl !==
        (instructor.instructorProfile?.iitmProfileUrl || '') ||
      formData.githubUrl !== (instructor.instructorProfile?.githubUrl || '') ||
      formData.linkedinUrl !==
        (instructor.instructorProfile?.linkedinUrl || '') ||
      sortAndStringifySkills(formData.skills) !==
        sortAndStringifySkills(instructor.instructorProfile?.skills) ||
      sortAndStringifyLanguages(formData.languages) !==
        sortAndStringifyLanguages(instructor.userLanguages) ||
      sortAndStringifyAvailabilities(formData.availabilities) !==
        sortAndStringifyAvailabilities(
          instructor.instructorProfile?.availabilities
        )
    )
  }

  if (isLoading)
    return (
      <div className="text-center py-10 text-lg font-medium">
        Loading profile...
      </div>
    )
  if (!instructor)
    return (
      <div className="text-center py-10 text-lg font-medium">
        No Instructor data found. Please log in.
      </div>
    )

  const handleInputChange =
    (field: keyof ProfileData) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData(prev => ({
        ...prev,
        [field]: e.target.value,
      }))
    }

  const handleAvailabilityChange = (availability: Availability[]) => {
    setFormData(prev => ({
      ...prev,
      availabilities: availability,
    }))
  }

  const handleSkillsChange = (skills: Skill[]) => {
    setFormData(prev => ({
      ...prev,
      skills: skills,
    }))
  }

  const handleLanguagesChange = (languages: Language[]) => {
    setFormData(prev => ({
      ...prev,
      languages: languages,
    }))
  }

  // For profile image upload
  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0]
    if (!file) return toast.error('No file selected')

    if (file.size > 2 * 1024 * 1024)
      return toast.error(
        'File size exceeds 2MB. Please upload a smaller image.'
      )

    try {
      const previousImageUrl = savedImageUrl
      const previousImageExtension = previousImageUrl
        ? '.' + previousImageUrl.split('.').pop()
        : null

      const formData = new FormData()
      formData.append('file', file)
      formData.append('userId', instructor.id)
      formData.append('imageType', 'profile')
      if (previousImageExtension)
        formData.append('previousImageExtension', previousImageExtension)

      // Retreiving the accessToken
      const accessToken = getAccessToken()
      // Upload file
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })

      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Failed to upload image')

      setProfileImage(data.url)
      toast.success('Profile image updated successfully')
    } catch (error) {
      toast.error('Failed to upload image. Please try again.')
      console.error('Upload error:', error)
    }
  }

  // For banner image upload
  const handleBannerFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0]
    if (!file) return toast.error('No file selected')

    if (file.size > 5 * 1024 * 1024)
      return toast.error(
        'File size exceeds 5MB. Please upload a smaller image.'
      )

    try {
      const previousBannerUrl = savedBannerUrl
      const previousImageExtension = previousBannerUrl
        ? '.' + previousBannerUrl.split('.').pop()
        : null

      const formData = new FormData()
      formData.append('file', file)
      formData.append('userId', instructor.id)
      formData.append('imageType', 'banner')
      if (previousImageExtension)
        formData.append('previousImageExtension', previousImageExtension)

      // Retreiving the accessToken
      const accessToken = getAccessToken()
      // Upload file
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })

      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Failed to upload banner')

      setBannerImage(data.url)
      toast.success('Banner image updated successfully')
    } catch (error) {
      toast.error('Failed to upload banner. Please try again.')
      console.error('Upload error:', error)
    }
  }

  // Handle Save - Update instructor profile
  const handleSave = async () => {
    try {
      // TODO: Add API call to save profile data
      // For now, just update the context
      if (!instructor) return

      setInstructor({
        ...instructor,
        username: formData.username,
        email: formData.email,
        instructorProfile: {
          ...instructor.instructorProfile,
          bio: formData.bio,
          level: formData.level,
          githubUrl: formData.githubUrl,
          linkedinUrl: formData.linkedinUrl,
          skills: formData.skills,
          availabilities: formData.availabilities,
        },
        userLanguages: formData.languages,
      })

      // We need to call the backend update api here
      await apiService(`/instructor/me`, {
        method: 'PUT',
        body: formData,
      })

      toast.success('Profile updated successfully!')
    } catch (error) {
      toast.error('Failed to update profile')
      console.error('Save error:', error)
    }
  }

  // Handle Reset - Revert to original data
  const handleReset = () => {
    if (instructor) {
      setFormData({
        username: instructor.username,
        email: instructor.email,
        level: instructor.instructorProfile?.level || undefined,
        bio: instructor.instructorProfile?.bio || '',
        basePrice: instructor.instructorProfile.basePrice,
        githubUrl: instructor.instructorProfile.githubUrl || '',
        linkedinUrl: instructor.instructorProfile.linkedinUrl || '',
        skills: instructor.instructorProfile.skills || [],
        languages: instructor.userLanguages || [],
        availabilities: instructor.instructorProfile.availabilities || [],
      })
      toast.info('Changes discarded')
    }
  }

  const displayImageUrl = profileImage || savedImageUrl
  const displayBannerUrl = bannerImage || savedBannerUrl || '/Teaching_Prov.png'

  return (
    <div className="flex-1 overflow-y-auto w-full h-full">
      <div
        className={`max-w-4xl mx-auto py-4 sm:py-6 md:py-8 lg:py-10 px-3 sm:px-4 md:px-6 lg:px-8 space-y-6 sm:space-y-8 md:space-y-10 ${hasChanges() ? 'pb-32' : 'pb-8'}`}
      >
        {/* Black bordered container with premium aesthetics */}
        <div className="border-2 border-black rounded-xl shadow-lg p-4 sm:p-6 md:p-8 bg-white space-y-8 md:space-y-10">
          {/* Profile and Banner Image Section */}

          <div className="relative w-full max-w-full">
            {/* Banner image section */}
            <div className="relative w-full h-32 sm:h-40 md:h-48 lg:h-56 overflow-hidden rounded-lg border-2 border-black">
              <img
                src={displayBannerUrl}
                alt="banner"
                className="w-full h-full object-cover"
                onError={e => {
                  // Fallback to default banner if Azure blob doesn't exist
                  const target = e.target as HTMLImageElement
                  if (target.src !== '/Teaching_Prov.png') {
                    target.src = '/Teaching_Prov.png'
                  }
                }}
              />

              {/* Hidden file input for banner */}
              <Input
                type="file"
                className="hidden"
                ref={bannerInputRef}
                onChange={handleBannerFileChange}
                accept="image/jpeg,image/png,image/webp"
              />

              {/* Banner edit button */}
              <Button
                variant="outline"
                size="sm"
                className="absolute top-2 right-2 sm:top-4 sm:right-4 bg-white/90 backdrop-blur-sm hover:bg-white shadow-md h-8 w-8 sm:h-auto sm:w-auto p-2"
                onClick={() => bannerInputRef.current?.click()}
              >
                <EditIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              </Button>
            </div>

            {/* Profile Image */}
            <div className="relative flex flex-col items-center -mt-12 sm:-mt-14 md:-mt-16 lg:-mt-20">
              <Input
                type="file"
                className="hidden"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/jpeg,image/png,image/webp"
              />
              <div className="relative group">
                <Avatar className="h-20 w-20 sm:h-24 sm:w-24 md:h-28 md:w-28 lg:h-32 lg:w-32 border-4 border-white shadow-lg ring-2 ring-black">
                  <AvatarImage src={displayImageUrl} alt="profile" />
                  <AvatarFallback className="text-base sm:text-lg font-medium bg-neutral-100">
                    {instructor.username.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <Button
                  variant="outline"
                  size="icon"
                  className="absolute bottom-0 right-0 h-7 w-7 sm:h-8 sm:w-8 border-2 border-black bg-white hover:bg-neutral-100 transition shadow-md"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <EditIcon className="h-3 w-3 sm:h-4 sm:w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Profile Info */}
          <div className="space-y-4 sm:space-y-5 md:space-y-6">
            {/* Username */}
            <div className="space-y-2 sm:space-y-3">
              <Label className="font-serif text-base sm:text-lg ml-1">
                Full Name
              </Label>
              <Input
                value={formData.username}
                onChange={handleInputChange('username')}
                className="text-sm sm:text-base"
              />
            </div>

            {/* Email */}
            <div className="space-y-2 sm:space-y-3">
              <Label className="font-serif text-base sm:text-lg ml-1">
                Email
              </Label>
              <Input
                type="email"
                value={formData.email}
                onChange={handleInputChange('email')}
                className="text-sm sm:text-base"
              />
            </div>

            {/* Bio */}
            <div className="space-y-2 sm:space-y-3">
              <Label className="font-serif text-base sm:text-lg ml-1">
                Bio
              </Label>
              <Textarea
                value={formData.bio}
                onChange={e =>
                  setFormData(prev => ({ ...prev, bio: e.target.value }))
                }
                className="text-sm sm:text-base min-h-[80px] sm:min-h-[100px]"
              />
            </div>

            {/* Level */}
            <div className="space-y-2 sm:space-y-3">
              <Label className="font-serif text-base sm:text-lg ml-1">
                Current Level
              </Label>
              <Select
                value={formData.level || ''}
                onValueChange={value => {
                  setFormData(prev => ({
                    ...prev,
                    level: value as ProgramLevelId,
                  }))
                }}
              >
                <SelectTrigger
                  id="programLevel"
                  className={`py-5 sm:py-6 w-full transition-all duration-200 focus:ring-2 focus:ring-blue-50 text-sm sm:text-base`}
                >
                  <SelectValue placeholder="Select your current level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="foundation">Foundation</SelectItem>
                  <SelectItem value="diploma">Diploma</SelectItem>
                  <SelectItem value="bsc">BSc </SelectItem>
                  <SelectItem value="bs">BS </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* IITM Public Profile Url */}
            <div className="space-y-2 sm:space-y-3">
              <Label className="font-serif text-base sm:text-lg ml-1">
                IITM Public Profile Url
              </Label>
              <Input
                placeholder="https://iitm.ac.in/profile/username"
                value={formData.iitmProfileUrl}
                onChange={handleInputChange('iitmProfileUrl')}
                className="text-sm sm:text-base"
              />
            </div>

            {/* Github Url */}
            <div className="space-y-2 sm:space-y-3">
              <Label className="font-serif text-base sm:text-lg ml-1">
                Github Url
              </Label>
              <Input
                placeholder="https://github.com/username"
                value={formData.githubUrl}
                onChange={handleInputChange('githubUrl')}
                className="text-sm sm:text-base"
              />
            </div>

            {/* Linkedin Url */}
            <div className="space-y-2 sm:space-y-3">
              <Label className="font-serif text-base sm:text-lg ml-1">
                Linkedin Url
              </Label>
              <Input
                placeholder="https://linkedin.com/in/username"
                value={formData.linkedinUrl}
                onChange={handleInputChange('linkedinUrl')}
                className="text-sm sm:text-base"
              />
            </div>
          </div>

          {/* Skills */}
          <div className="space-y-2 sm:space-y-3">
            <div className="flex justify-between items-center">
              <Label className="font-serif text-base sm:text-lg ml-1">
                Skills
              </Label>
              <EditSkills
                skills={formData.skills || []}
                setSkills={handleSkillsChange}
                level={formData.level}
              />
            </div>
            <div className="rounded-lg border-2 border-black p-3 sm:p-4 min-h-[80px] sm:min-h-24 bg-gray-50/50">
              <div className="flex flex-wrap gap-2 sm:gap-3 md:gap-4 overflow-x-auto">
                {formData.skills?.map(skill => (
                  <div key={skill.id}>
                    <Button
                      variant="outline"
                      className="border-black text-xs sm:text-sm"
                    >
                      {skill.name}
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Languages */}
          <div className="space-y-2 sm:space-y-3">
            <div className="flex justify-between items-center">
              <Label className="font-serif text-base sm:text-lg ml-1">
                Languages
              </Label>
              <EditLanguages
                languages={formData.languages || []}
                setLanguages={handleLanguagesChange}
              />
            </div>
            <div className="rounded-lg border-2 border-black p-3 sm:p-4 min-h-[80px] sm:min-h-24 bg-gray-50/50">
              <div className="flex flex-wrap gap-2 sm:gap-3 md:gap-4 overflow-x-auto">
                {formData.languages?.map(language => (
                  <div key={language.languageId}>
                    <Button
                      variant="outline"
                      className="border-black text-xs sm:text-sm"
                    >
                      {language.language.name}
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Instructor Availabilities */}
          <div className="space-y-2 sm:space-y-3">
            <div className="flex justify-between items-center">
              <Label className="font-serif text-base sm:text-lg ml-1">
                Availability
              </Label>
              <EditAvailabilities
                Availabilities={formData.availabilities}
                setAvailabilities={handleAvailabilityChange}
              />
            </div>
            <div className="rounded-lg border-2 border-black p-3 sm:p-4 min-h-[80px] sm:min-h-24 overflow-x-auto bg-gray-50/50">
              <div className="flex flex-col gap-3 sm:gap-4">
                {formData.availabilities?.map(availability => (
                  <div key={availability.id}>
                    {/* format - Monday 10:00 AM - 11:00 AM , 5:00 PM - 6:00 PM */}
                    {/* format - Sunday - Unavailable moon logo */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:justify-between">
                      <p className="font-medium text-sm sm:text-base min-w-[80px]">
                        {availability.dayOfWeek.name}
                      </p>
                      {availability.isAvailable ? (
                        <div className="flex flex-wrap gap-2">
                          {availability.timeSlots.map(slot => (
                            <div
                              key={slot.id}
                              className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1 border-2 border-black rounded-md text-xs sm:text-sm bg-white"
                            >
                              <Clock className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                              <span className="font-medium whitespace-nowrap">
                                {slot.startTime} - {slot.endTime}
                              </span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5 sm:gap-2">
                          <MoonIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-gray-500" />
                          <p className="text-xs sm:text-sm text-gray-500">
                            Unavailable
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sticky footer with Save and Reset buttons - Only show when changes are made */}
          {hasChanges() && (
            <div className="fixed bottom-0 left-0 md:left-64 right-0 bg-white border-t-2 border-black shadow-[0_-6px_12px_-2px_rgba(0,0,0,0.15)] py-3 sm:py-4 z-50">
              <div className="max-w-4xl mx-auto flex flex-col sm:flex-row justify-end gap-2 sm:gap-4 px-3 sm:px-4 md:px-6 lg:px-8">
                <Button
                  variant="outline"
                  onClick={handleReset}
                  className="min-w-full sm:min-w-[120px] border-2 border-black text-sm sm:text-base"
                >
                  Reset Changes
                </Button>
                <Button
                  onClick={handleSave}
                  className="min-w-full sm:min-w-[120px] bg-black hover:bg-gray-800 text-sm sm:text-base"
                >
                  Save Profile
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
