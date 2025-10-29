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
import { getAccessToken } from '@/lib/auth'

export default function Profile() {
  const { instructor, isLoading } = useInstructor()

  // for image
  const fileInputRef = useRef<HTMLInputElement>(null)

  // This state is only for new profile image when updated or changed
  const [profileImage, setProfileImage] = useState('')

  // This hook gets the saved image from the Azure
  const savedImageUrl = useImageUrl(instructor?.id, 'profile')

  useEffect(() => {
    console.log('instructor data from the context', instructor)
  }, [instructor])

  // You can show a loading state while the context is initializing
  if (isLoading) {
    return <div>Loading Profile Data...</div>
  }

  // Once loading is false, you know if the student exists or not
  if (!instructor) {
    // This could happen if someone tries to access the URL directly without logging in
    return <div>No Instructor data found. Please log in.</div>
  }

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0]

    if (!file) {
      toast.error('No file selected')
      return
    }

    // Validate file size
    if (file.size > 2 * 1024 * 1024) {
      toast.error('File size exceeds 2MB. Please upload a smaller image.')
      return
    }

    try {
      // Get the extension of the previous image if it exists
      const previousImageUrl = savedImageUrl
      const previousImageExtension = previousImageUrl
        ? '.' + previousImageUrl.split('.').pop()
        : null

      // Create form data
      const formData = new FormData()
      formData.append('file', file)
      formData.append('userId', instructor.id)
      if (previousImageExtension) {
        formData.append('previousImageExtension', previousImageExtension)
      }

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

      if (!response.ok) {
        throw new Error(data.error || 'Failed to upload image')
      }

      // Update profile image with the returned URL
      setProfileImage(data.url)
      toast.success('Profile image updated successfully')
    } catch (error) {
      toast.error('Failed to upload image. Please try again.')
      console.error('Upload error:', error)
    }
  }

  // If `profileImage` (the preview state) has something, use it.
  // Otherwise, use `savedImageUrl` (the one from Azure).
  const displayImageUrl = profileImage || savedImageUrl

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <h1 className="text-start text-2xl font-serif font-semibold">
        Instructors Profile
      </h1>

      {/* Card with border showing the profile attributes of student */}

      <div className="rounded-2xl border-1 border-black min-h-screen p-5 space-y-7">
        {/* Rounded image with edit button */}
        <div className="flex items-center justify-center p-5">
          {/* Image uploading */}
          <Input
            type="file"
            className="hidden"
            ref={fileInputRef}
            onChange={handleFileChange}
          ></Input>
          {/* Relative container wrapping the avatar and the edit buttont  */}
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

        {/* Attributes to edit - username , email , level etc., */}

        {/* Username card */}
        <div className="flex items-center justify-between rounded-md border-1">
          <div className="px-6 py-3">
            <p className="text-sm font-medium text-neutral-500">Username</p>
            <p className="text-md font-normal">{instructor.username}</p>
          </div>
          <EditProfileField
            label="Username"
            currentValue={instructor.username}
            // onSave={handleUpdateUsername}
          />
        </div>

        {/* email  card */}
        <div className="flex items-center justify-between rounded-md border-1">
          <div className="px-6 py-3">
            <p className="text-sm font-medium text-neutral-500">Email</p>
            <p className="text-md font-normal">{instructor.email}</p>
          </div>
          <EditProfileField label="Email" currentValue={instructor.email} />
        </div>

        {/* Level  card */}
        <div className="flex items-center justify-between rounded-md border-1">
          <div className="px-6 py-3">
            <p className="text-sm font-medium text-neutral-500">Level</p>
            <p className="text-md font-normal">
              {instructor.instructorProfile.level}
            </p>
          </div>
          <EditProfileField
            label="Level"
            currentValue={instructor.instructorProfile.level}
            // onSave={handleUpdateUsername}
          />
        </div>

        {/* Bio */}
        <div className="flex items-center justify-between rounded-md border-1">
          <div className="px-6 py-3">
            <p className="text-sm font-medium text-neutral-500">Bio</p>
            <p className="text-md font-normal">
              {instructor.instructorProfile.bio}
            </p>
          </div>
          <EditProfileField
            label="Level"
            currentValue={instructor.instructorProfile.bio}
            // onSave={handleUpdateUsername}
          />
        </div>

        {/* Displaying list of enrolled courses */}
        <div></div>
      </div>
    </div>
  )
}
