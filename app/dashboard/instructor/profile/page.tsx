'use client'

import { useInstructor } from '@/app/contexts/instructorContext'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { EditIcon, Github, Linkedin, User } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import EditProfileField from '../../student/profile/components/editField'
import { useImageUrl } from '@/lib/utils'
import { toast } from 'sonner'
import { getAccessToken } from '@/lib/auth'

export default function Profile() {
  const { instructor, isLoading } = useInstructor()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [profileImage, setProfileImage] = useState('')
  const savedImageUrl = useImageUrl(instructor?.id, 'profile')

  useEffect(() => {
    console.log('instructor data from the context', instructor)
  }, [instructor])

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

  const displayImageUrl = profileImage || savedImageUrl

  return (
    <div className="max-w-3xl mx-auto py-10 space-y-10">
      {/* Heading */}
      <div className="text-center space-y-1">
        <h1 className="text-3xl font-semibold tracking-tight">
          Instructor Profile
        </h1>
        <p className="text-neutral-500 text-sm">
          Manage your personal information, skills, and social links.
        </p>
      </div>

      {/* Profile Image Section */}
      <div className="flex flex-col items-center space-y-3">
        <Input
          type="file"
          className="hidden"
          ref={fileInputRef}
          onChange={handleFileChange}
        />
        <div className="relative group">
          <Avatar className="h-28 w-28 border-2 border-neutral-400 shadow-sm">
            <AvatarImage src={displayImageUrl} alt="profile" />
            <AvatarFallback className="text-lg font-medium bg-neutral-100">
              {instructor.username.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <Button
            variant="outline"
            size="icon"
            className="absolute bottom-0 right-0 h-9 w-9 border-neutral-400 bg-white hover:bg-neutral-100 transition"
            onClick={() => fileInputRef.current?.click()}
          >
            <EditIcon className="h-4 w-4" />
          </Button>
        </div>
        <p className="text-sm text-neutral-500">
          Click the edit icon to update your profile picture.
        </p>
      </div>

      {/* Profile Info */}
      <div className="space-y-6">
        {[
          { label: 'Username', value: instructor.username },
          { label: 'Email', value: instructor.email },
          { label: 'Level', value: instructor.instructorProfile.level },
          { label: 'Bio', value: instructor.instructorProfile.bio },
        ].map((item, idx) => (
          <div
            key={idx}
            className="flex items-center justify-between rounded-lg border border-neutral-300 px-5 py-3 hover:shadow-sm transition"
          >
            <div>
              <p className="text-sm text-neutral-500">{item.label}</p>
              <p className="text-md font-medium">{item.value || '—'}</p>
            </div>
            <EditProfileField label={item.label} currentValue={item.value} />
          </div>
        ))}
      </div>

      {/* Social URLs */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold tracking-tight flex items-center gap-2">
          <User className="h-5 w-5" /> Social Links
        </h2>

        <div className="grid md:grid-cols-2 gap-4">
          {[
            {
              label: 'GitHub',
              icon: <Github className="h-5 w-5 text-neutral-600" />,
              value: instructor.instructorProfile.githubUrl,
            },
            {
              label: 'LinkedIn',
              icon: <Linkedin className="h-5 w-5 text-blue-600" />,
              value: instructor.instructorProfile.linkedinUrl,
            },
          ].map((link, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between border border-neutral-300 rounded-lg px-5 py-4 hover:shadow-sm transition"
            >
              <div className="flex items-center gap-3">
                {link.icon}
                <div>
                  <p className="text-sm text-neutral-500">{link.label}</p>
                  <p className="text-md break-all font-medium">
                    {link.value || 'Not provided'}
                  </p>
                </div>
              </div>
              <EditProfileField label={link.label} currentValue={link.value} />
            </div>
          ))}
        </div>
      </div>

      {/* Skills */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold tracking-tight flex items-center gap-2">
          ⚡ Skills
        </h2>

        <div className="flex flex-wrap gap-3">
          {instructor.instructorProfile.skills?.length ? (
            instructor.instructorProfile.skills.map((skill: any) => (
              <span
                key={skill.id}
                className="px-4 py-1.5 bg-neutral-100 rounded-full border border-neutral-300 text-sm font-medium hover:bg-neutral-200 transition"
              >
                {skill.name}
              </span>
            ))
          ) : (
            <p className="text-neutral-500 italic">No skills added yet</p>
          )}
        </div>
      </div>
    </div>
  )
}
