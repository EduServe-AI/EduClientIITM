'use client'

import { useInstructor } from '@/app/contexts/instructorContext'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { EditIcon } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import EditProfileField from '../../student/profile/components/editField'
import { useImageUrl } from '@/lib/utils'
import { toast } from 'sonner'

const LEVEL_DATA = {
  foundation: { totalCourses: 12, credits: 36 },
  diploma: { totalCourses: 18, credits: 54 },
  bsc: { totalCourses: 24, credits: 72 },
  bs: { totalCourses: 36, credits: 108 },
} as const

export default function Profile() {
  const { instructor, isLoading } = useInstructor()

  const fileInputRef = useRef<HTMLInputElement>(null)
  const [profileImage, setProfileImage] = useState('')
  const savedImageUrl = useImageUrl(instructor?.id, 'profile')

  useEffect(() => {
    console.log('instructor data from the context', instructor)
  }, [instructor])

  if (isLoading) return <div>Loading Profile Data...</div>

  if (!instructor) return <div>No Instructor data found. Please log in.</div>

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
      if (previousImageExtension)
        formData.append('previousImageExtension', previousImageExtension)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
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

  const displayImageUrl = profileImage || savedImageUrl
  const levelInfo =
    LEVEL_DATA[instructor?.instructorProfile?.level || 'foundation']

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <h1 className="text-start text-2xl font-serif font-semibold">
        Instructor Profile
      </h1>

      <div className="rounded-2xl border border-black min-h-screen p-5 space-y-7">
        {/* Profile Image */}
        <div className="flex items-center justify-center p-5">
          <Input
            type="file"
            className="hidden"
            ref={fileInputRef}
            onChange={handleFileChange}
          />
          <div className="relative">
            <Avatar className="h-30 w-30 border-2 border-black">
              <AvatarImage src={displayImageUrl} alt="profile" />
              <AvatarFallback>
                {instructor.username.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <Button
              variant="outline"
              size="icon"
              className="absolute bottom-2 right-2 h-9 w-9 cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
            >
              <EditIcon />
            </Button>
          </div>
        </div>

        {/* Username */}
        <div className="flex items-center justify-between rounded-md border">
          <div className="px-6 py-3">
            <p className="text-sm text-neutral-500">Username</p>
            <p className="text-md font-normal">{instructor.username}</p>
          </div>
          <EditProfileField
            label="Username"
            currentValue={instructor.username}
          />
        </div>

        {/* Email */}
        <div className="flex items-center justify-between rounded-md border">
          <div className="px-6 py-3">
            <p className="text-sm text-neutral-500">Email</p>
            <p className="text-md font-normal">{instructor.email}</p>
          </div>
          <EditProfileField label="Email" currentValue={instructor.email} />
        </div>

        {/* Level */}
        <div className="flex items-center justify-between rounded-md border">
          <div className="px-6 py-3">
            <p className="text-sm text-neutral-500">Level</p>
            <p className="text-md font-normal capitalize">
              {instructor.instructorProfile.level}
            </p>
          </div>
          <EditProfileField
            label="Level"
            currentValue={instructor.instructorProfile.level}
          />
        </div>

        {/* Bio */}
        <div className="flex items-center justify-between rounded-md border">
          <div className="px-6 py-3">
            <p className="text-sm text-neutral-500">Bio</p>
            <p className="text-md font-normal">
              {instructor.instructorProfile.bio}
            </p>
          </div>
          <EditProfileField
            label="Bio"
            currentValue={instructor.instructorProfile.bio}
          />
        </div>

        {/* Social URLs */}
        <div className="space-y-3">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <EditIcon className="h-5 w-5" /> Social Links
          </h2>

          <div className="grid md:grid-cols-2 gap-4">
            {/* GitHub */}
            <div className="flex items-center justify-between rounded-md border p-4">
              <div>
                <p className="text-sm text-neutral-500">GitHub</p>
                <p className="text-md break-all">
                  {instructor.instructorProfile.githubUrl || 'Not provided'}
                </p>
              </div>
              <EditProfileField
                label="GitHub URL"
                currentValue={instructor.instructorProfile.githubUrl}
              />
            </div>

            {/* LinkedIn */}
            <div className="flex items-center justify-between rounded-md border p-4">
              <div>
                <p className="text-sm text-neutral-500">LinkedIn</p>
                <p className="text-md break-all">
                  {instructor.instructorProfile.linkedinUrl || 'Not provided'}
                </p>
              </div>
              <EditProfileField
                label="LinkedIn URL"
                currentValue={instructor.instructorProfile.linkedinUrl}
              />
            </div>
          </div>
        </div>

        {/* Skills */}
        <div className="space-y-3 mt-8">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            ⚡ Skills
          </h2>

          <div className="flex flex-wrap gap-3">
            {instructor.instructorProfile.skills?.length ? (
              instructor.instructorProfile.skills.map((skill: any) => (
                <span
                  key={skill.id}
                  className="px-4 py-1.5 bg-neutral-100 rounded-full border text-sm font-medium hover:bg-neutral-200 transition"
                >
                  {skill.name}
                </span>
              ))
            ) : (
              <p className="text-neutral-500 italic">No skills added yet</p>
            )}
          </div>
        </div>

        {/* Level Details */}
        <div className="space-y-3 mt-8">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            🎓 Level Information
          </h2>

          <div className="grid sm:grid-cols-3 gap-4">
            <div className="rounded-md border p-4">
              <p className="text-sm text-neutral-500">Level</p>
              <p className="text-md font-semibold capitalize">
                {instructor.instructorProfile.level}
              </p>
            </div>

            <div className="rounded-md border p-4">
              <p className="text-sm text-neutral-500">Total Courses</p>
              <p className="text-md font-semibold">{levelInfo.totalCourses}</p>
            </div>

            <div className="rounded-md border p-4">
              <p className="text-sm text-neutral-500">Credits</p>
              <p className="text-md font-semibold">{levelInfo.credits}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
