import { UploadCloud, User2, UserCog } from 'lucide-react'
import { toast } from 'sonner'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Image from 'next/image'
import React, { useState, useRef } from 'react'

interface PersonalizationProps {
  formData: {
    profilePicture: string | null
    bio: string
    githubUrl: string
    linkedinUrl: string
  }
  setFormData: React.Dispatch<React.SetStateAction<any>>
}

export default function Personalization({
  formData,
  setFormData,
}: PersonalizationProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    formData.profilePicture || null
  )

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) {
      toast.error('No file selected')
      return
    }

    // validating the file size ( max 2MB )
    if (file.size > 2 * 1024 * 1024) {
      toast.error('File size exceeds 2MB. Please upload a smaller image.')
      return
    }

    // creating and setting a preview url
    const reader = new FileReader()
    reader.onloadend = () => {
      const result = reader.result as string
      setPreviewUrl(result)

      // updating the parent state with the file object
      setFormData((prev: any) => ({
        ...prev,
        profilePicture: result,
      }))
    }
    reader.readAsDataURL(file)
  }
  return (
    <section className="max-w-4xl mx-auto w-full">
      <header className="mb-8 text-center flex flex-row gap-3 items-center justify-center">
        <UserCog size={30} />
        <h3 className="text-3xl font-semibold text-gray-800">
          Personalization
        </h3>
      </header>

      {/* main container - grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 items-start">
        {/* Left column - Profile picture */}
        <div className="md:col-span-1 flex flex-col items-center text-center">
          <Label className="font-semibold text-gray-500 mb-6">
            Profile Picture
          </Label>
          <Input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/png, image/jpeg, image/webp"
            className="hidden"
          />
          <div
            onClick={() => fileInputRef.current?.click()}
            className="relative w-40 h-40 rounded-full border-2 border-dashed flex items-center justify-center cursor-pointer hover:bg-gray-100 transition-colors group"
          >
            {previewUrl ? (
              <Image
                src={previewUrl}
                alt="Profile Preview"
                fill
                className="rounded-full object-cover"
              />
            ) : (
              <User2 className="w-16 h-16 text-gray-400" />
            )}
            <div className="absolute inset-0 rounded-full bg-opacity-0 group-hover:bg-opacity-40 bg-opacity-0 group-hover:bg-opacity-40 flex items-center justify-center transition-opacity">
              <UploadCloud className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-3">
            Upload a professional photo. (Max 2MB)
          </p>
        </div>
        {/* Right column - Bio and Links */}
        <div className="md:col-span-2 space-y-6">
          {/* Bio Textarea */}
          <div className="space-y-2">
            <Label htmlFor="bio" className="text-md font-medium">
              Bio
            </Label>
            <Textarea
              id="bio"
              placeholder="Tell us a little about yourself, your teaching style, and your expertise."
              value={formData.bio}
              onChange={e => {
                setFormData((prev: any) => ({ ...prev, bio: e.target.value }))
              }}
              className="min-h-[120px]"
              rows={3}
              maxLength={400}
            />
          </div>

          {/* Github URL */}
          <div className="space-y-2">
            <Label
              htmlFor="githubUrl"
              className="text-sm font-medium text-gray-700 flex items-center gap-2"
            >
              <Image
                src="/github.svg"
                alt="GitHub"
                width={20}
                height={20}
                className="text-gray-700"
              />
              GitHub URL (Optional)
            </Label>
            <div className="relative">
              <Input
                id="githubUrl"
                type="url"
                placeholder="https://github.com/yourusername"
                value={formData.githubUrl}
                onChange={e =>
                  setFormData({ ...formData, githubUrl: e.target.value })
                }
                className=""
              />
            </div>
          </div>

          {/* Linkedin URL */}
          <div className="space-y-2">
            <Label
              htmlFor="linkedinUrl"
              className="text-sm font-medium text-gray-700 flex items-center gap-2"
            >
              <Image
                src="/icons8-linkedin.svg"
                alt="LinkedIn"
                width={20}
                height={20}
                className="text-[#0077B5]"
              />
              Linkedin URL (Optional)
            </Label>
            <div className="relative">
              <Input
                id="githubUrl"
                type="url"
                placeholder="https://linkedin.com/in/yourusername"
                value={formData.linkedinUrl}
                onChange={e =>
                  setFormData({ ...formData, linkedinUrl: e.target.value })
                }
                className=""
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
