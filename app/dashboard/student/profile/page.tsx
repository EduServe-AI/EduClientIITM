'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useStudent } from '@/contexts/studentContext'
import { getAccessToken } from '@/lib/auth'
import { getInitials, useImageUrl } from '@/lib/utils'
import { EditIcon } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'
import EditProfileField from './components/editField'

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
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/20">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  // Once loading is false, you know if the student exists or not
  if (!student) {
    // This could happen if someone tries to access the URL directly without logging in
    return <div>No student data found. Please log in.</div>
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
      formData.append('imageType', 'profile')
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
    <div className="w-full h-full py-4 overflow-y-auto overflow-x-hidden">
      <div className="pb-6">
        <div>
          <img
            className="h-32 w-full object-cover lg:h-48"
            src="https://images.unsplash.com/photo-1444628838545-ac4016a5418a?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80"
            alt=""
          />
        </div>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="-mt-12 sm:-mt-16 sm:flex sm:items-end sm:space-x-5">
            <div className="flex">
              <Input
                type="file"
                className="hidden"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/jpeg,image/png,image/webp"
              />
              <div className="relative">
                <Avatar className="h-24 w-24 rounded-full ring-4 ring-white sm:h-32 sm:w-32">
                  <AvatarImage src={displayImageUrl} alt="profile" />
                  <AvatarFallback className="text-lg md:text-2xl">
                    {getInitials(student.username)}
                  </AvatarFallback>
                </Avatar>
                <Button
                  variant="outline"
                  size="icon"
                  className="absolute bottom-0 right-0 h-9 w-9 md:h-10 md:w-10 rounded-full cursor-pointer shadow-md"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <EditIcon size={20} />
                </Button>
              </div>
            </div>
            <div className="mt-6 sm:flex-1 sm:min-w-0 sm:flex sm:items-center sm:justify-end sm:space-x-6 sm:pb-1">
              <div className="sm:hidden md:block mt-6 min-w-0 flex-1">
                <h1 className="text-2xl font-bold text-foreground truncate">
                  {student.username}
                </h1>
              </div>
            </div>
          </div>
          <div className="hidden sm:block md:hidden mt-6 min-w-0 flex-1">
            <h1 className="text-2xl font-bold text-foreground truncate">
              {student.username}
            </h1>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto py-12 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="border border-border shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-foreground">
                Profile Information
              </h3>
              <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
                Personal details and application.
              </p>
            </div>
            <div className="border-t border-border">
              <dl>
                <div className="px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-muted-foreground">
                    Username
                  </dt>
                  <dd className="mt-1 flex text-sm text-foreground sm:mt-0 sm:col-span-2">
                    <span className="flex-grow">{student.username}</span>
                    <span className="ml-4 flex-shrink-0">
                      <EditProfileField
                        label="Username"
                        currentValue={student.username}
                      />
                    </span>
                  </dd>
                </div>
                <div className="bg-muted/20 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-muted-foreground">
                    Email address
                  </dt>
                  <dd className="mt-1 flex text-sm text-foreground sm:mt-0 sm:col-span-2">
                    <span className="flex-grow">{student.email}</span>
                    <span className="ml-4 flex-shrink-0">
                      <EditProfileField
                        label="Email"
                        currentValue={student.email}
                      />
                    </span>
                  </dd>
                </div>
                <div className="px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-muted-foreground">
                    Level
                  </dt>
                  <dd className="mt-1 flex text-sm text-foreground sm:mt-0 sm:col-span-2">
                    <span className="flex-grow">{student.level}</span>
                    <span className="ml-4 flex-shrink-0">
                      <EditProfileField
                        label="Level"
                        currentValue={student.level}
                      />
                    </span>
                  </dd>
                </div>
                <div className="bg-muted/20 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-muted-foreground">
                    Enrolled Courses
                  </dt>
                  <dd className="mt-1 flex text-sm text-foreground sm:mt-0 sm:col-span-2">
                    <span className="flex-grow flex gap-1">
                      {student.courses.map((course, i) => (
                        <Badge key={i}>{course.name}</Badge>
                      ))}
                    </span>
                    <span className="ml-4 flex-shrink-0">
                      <EditProfileField
                        label="Courses"
                        currentValue={student.courses
                          .map(c => c.name)
                          .join(', ')}
                      />
                    </span>
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
