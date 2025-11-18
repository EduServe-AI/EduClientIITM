'use client'

import { useStudent } from '@/app/contexts/studentContext'
import { useEffect, useRef, useState } from 'react'
import EditProfileField from './components/editField'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Camera, EditIcon } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import { useImageUrl } from '@/lib/utils'
import { getAccessToken } from '@/lib/auth'

export default function Profile() {
  const { student, isLoading } = useStudent()

  // for image
  const fileInputRef = useRef<HTMLInputElement>(null)

  // This state is only for new profile image when updated or changed
  const [profileImage, setProfileImage] = useState('')

  // This hook gets the saved image from the Azure
  const savedImageUrl = useImageUrl(student?.id, 'profile')

  useEffect(() => {
    console.log('student data from the context', student)
  }, [student])

  // You can show a loading state while the context is initializing
  if (isLoading) {
    return <div>Loading Profile Data...</div>
  }

  // Once loading is false, you know if the student exists or not
  if (!student) {
    // This could happen if someone tries to access the URL directly without logging in
    return <div>No student data found. Please log in.</div>
  }

  const handleUpdateUsername = async () => {
    alert('clicked')
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
      formData.append('userId', student.id)
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
    <div className="w-full min-h-screen px-4 py-6 md:px-6 lg:px-8 overflow-y-auto">
      <div className="max-w-2xl mx-auto space-y-8">
        <h1 className="text-2xl md:text-3xl font-serif font-semibold text-start">
          Student Profile
        </h1>

        {/* Main Profile Card */}
        <div className="rounded-3xl border border-gray-200 bg-white p-6 md:p-8 space-y-8 shadow-sm">
          {/* Profile Image Section */}
          <div className="flex flex-col items-center py-4">
            {/* Image uploading */}
            <Input
              type="file"
              className="hidden"
              ref={fileInputRef}
              onChange={handleFileChange}
            />

            {/* Avatar with edit button */}
            <div className="relative">
              <Avatar className="h-24 w-24 md:h-32 md:w-32 border-4 border-black">
                <AvatarImage src={displayImageUrl} alt="profile" />
                <AvatarFallback className="text-lg md:text-2xl">
                  {student.username.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <Button
                variant="outline"
                size="icon"
                className="absolute bottom-0 right-0 h-9 w-9 md:h-10 md:w-10 rounded-full cursor-pointer shadow-md hover:bg-gray-100"
                onClick={() => fileInputRef.current?.click()}
              >
                <EditIcon size={20} />
              </Button>
            </div>
          </div>

          {/* Divider */}
          <Separator className="my-4" />

          {/* Profile Fields Container */}
          <div className="space-y-4">
            {/* Username Card */}
            <div className="flex items-center justify-between gap-4 rounded-lg border border-gray-200 p-4 md:p-6 hover:bg-gray-50 transition-colors">
              <div className="flex-1 min-w-0">
                <p className="text-xs md:text-sm font-medium text-gray-500 uppercase tracking-wide">
                  Username
                </p>
                <p className="text-base md:text-lg font-semibold text-gray-900 truncate">
                  {student.username}
                </p>
              </div>
              <div className="flex-shrink-0">
                <EditProfileField
                  label="Username"
                  currentValue={student.username}
                />
              </div>
            </div>

            {/* Email Card */}
            <div className="flex items-center justify-between gap-4 rounded-lg border border-gray-200 p-4 md:p-6 hover:bg-gray-50 transition-colors">
              <div className="flex-1 min-w-0">
                <p className="text-xs md:text-sm font-medium text-gray-500 uppercase tracking-wide">
                  Email
                </p>
                <p className="text-base md:text-lg font-semibold text-gray-900 truncate">
                  {student.email}
                </p>
              </div>
              <div className="flex-shrink-0">
                <EditProfileField label="Email" currentValue={student.email} />
              </div>
            </div>

            {/* Level Card */}
            <div className="flex items-center justify-between gap-4 rounded-lg border border-gray-200 p-4 md:p-6 hover:bg-gray-50 transition-colors">
              <div className="flex-1 min-w-0">
                <p className="text-xs md:text-sm font-medium text-gray-500 uppercase tracking-wide">
                  Level
                </p>
                <p className="text-base md:text-lg font-semibold text-gray-900 truncate">
                  {student.level}
                </p>
              </div>
              <div className="flex-shrink-0">
                <EditProfileField label="Level" currentValue={student.level} />
              </div>
            </div>
          </div>

          {/* Enrolled Courses Section */}
          <div className="pt-4">
            {/* Placeholder for enrolled courses - can be expanded later */}
          </div>
        </div>
      </div>
    </div>
  )
}
