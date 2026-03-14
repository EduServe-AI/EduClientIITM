'use client'

import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import type { OnboardingFormData } from '@/types/types'
import { AnimatePresence, motion } from 'framer-motion'
import { Camera, Github, Linkedin, Sparkles, User2 } from 'lucide-react'
import Image from 'next/image'
import React, { useRef, useState } from 'react'
import { toast } from 'sonner'
import { FileText } from 'lucide-react'

interface PersonalizationProps {
  formData: OnboardingFormData
  setFormData: React.Dispatch<React.SetStateAction<OnboardingFormData>>
}

interface PersonalizationErrors {
  profilePicture?: boolean
  about?: boolean
  bio?: boolean
  githubUrl?: boolean
  linkedinUrl?: boolean
}

export default function Personalization({
  formData,
  setFormData,
}: PersonalizationProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    formData.profilePicture || null
  )
  const [errors, setErrors] = useState<PersonalizationErrors>({})
  const [isDragging, setIsDragging] = useState(false)
  const aboutLength = formData.about.trim().length
  const aboutPercent = Math.min((aboutLength / 500) * 100, 100)
  const aboutGood = aboutLength >= 50 && aboutLength <= 500
  const bioLength = formData.bio.trim().length
  const bioPercent = Math.min((bioLength / 500) * 100, 100)
  const bioGood = bioLength >= 50 && bioLength <= 500

  const processFile = (file: File) => {
    if (file.size > 2 * 1024 * 1024) {
      toast.error('File size exceeds 2MB. Please upload a smaller image.')
      return
    }
    const reader = new FileReader()
    reader.onloadend = () => {
      const result = reader.result as string
      setPreviewUrl(result)
      setFormData(prev => ({ ...prev, profilePicture: result }))
      setErrors(prev => ({ ...prev, profilePicture: false }))
    }
    reader.readAsDataURL(file)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) processFile(file)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files?.[0]
    if (file && file.type.startsWith('image/')) processFile(file)
  }

  return (
    <div className="w-full space-y-8">
      {/* ── PROFILE PICTURE ─────────────────────────────────────────── */}
      <div className="space-y-3">
        <Label className="text-sm font-semibold text-gray-700 tracking-wide uppercase">
          Profile Picture
        </Label>

        <div className="flex items-start gap-6">
          {/* Avatar preview circle */}
          <div className="relative shrink-0 group">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/png, image/jpeg, image/webp"
              className="hidden"
            />

            {/* Outer ring pulse when no image */}
            {!previewUrl && (
              <motion.div
                animate={{ scale: [1, 1.06, 1], opacity: [0.4, 0.7, 0.4] }}
                transition={{
                  duration: 2.4,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                className="absolute -inset-1.5 rounded-full border-2 border-dashed border-blue-300 pointer-events-none"
              />
            )}

            {/* Avatar circle */}
            <motion.div
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => fileInputRef.current?.click()}
              onDragOver={e => {
                e.preventDefault()
                setIsDragging(true)
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              className={`relative w-28 h-28 rounded-full cursor-pointer overflow-hidden transition-all duration-200 ${
                errors.profilePicture
                  ? 'ring-2 ring-red-400 ring-offset-2'
                  : previewUrl
                    ? 'ring-2 ring-blue-400 ring-offset-2 shadow-lg shadow-blue-100'
                    : isDragging
                      ? 'ring-2 ring-blue-400 ring-offset-2 bg-blue-50'
                      : 'bg-gradient-to-br from-gray-100 to-gray-200'
              }`}
            >
              <AnimatePresence mode="wait">
                {previewUrl ? (
                  <motion.div
                    key="preview"
                    initial={{ opacity: 0, scale: 1.1 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0"
                  >
                    <Image
                      src={previewUrl}
                      alt="Profile Preview"
                      fill
                      className="object-cover"
                    />
                  </motion.div>
                ) : (
                  <motion.div
                    key="placeholder"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 flex flex-col items-center justify-center gap-1"
                  >
                    <User2 className="w-9 h-9 text-gray-400" />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Hover overlay */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-200 flex items-center justify-center">
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileHover={{ opacity: 1, scale: 1 }}
                  className="opacity-0 group-hover:opacity-100 flex flex-col items-center gap-1 transition-opacity duration-200"
                >
                  <Camera className="w-6 h-6 text-white" />
                  <span className="text-white text-[10px] font-semibold">
                    {previewUrl ? 'Change' : 'Upload'}
                  </span>
                </motion.div>
              </div>
            </motion.div>

            {/* Green check badge when uploaded */}
            <AnimatePresence>
              {previewUrl && (
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  className="absolute -bottom-1 -right-1 w-7 h-7 bg-green-500 rounded-full flex items-center justify-center border-2 border-white shadow-md"
                >
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path
                      d="M2 6l3 3 5-5"
                      stroke="white"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Upload instructions */}
          <div className="flex-1 pt-1 space-y-3">
            <div>
              <p className="text-sm font-medium text-gray-800">
                {previewUrl ? 'Looking great! 👋' : 'Upload your photo'}
              </p>
              <p className="text-xs text-gray-400 mt-0.5">
                PNG, JPG or WebP · Max 2MB
              </p>
            </div>

            {/* Drop zone card */}
            <motion.div
              whileHover={{ scale: 1.01 }}
              onClick={() => fileInputRef.current?.click()}
              onDragOver={e => {
                e.preventDefault()
                setIsDragging(true)
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl border-2 border-dashed cursor-pointer transition-all duration-200 ${
                isDragging
                  ? 'border-blue-400 bg-blue-50'
                  : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50/40'
              }`}
            >
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                  isDragging ? 'bg-blue-100' : 'bg-gray-100'
                }`}
              >
                <Camera
                  size={15}
                  className={isDragging ? 'text-blue-500' : 'text-gray-500'}
                />
              </div>
              <div>
                <p className="text-xs font-medium text-gray-700">
                  {isDragging ? 'Drop it here!' : 'Click or drag & drop'}
                </p>
                <p className="text-[11px] text-gray-400">
                  to upload your picture
                </p>
              </div>
            </motion.div>

            {errors.profilePicture && (
              <p className="text-red-500 text-xs">
                Profile picture is required
              </p>
            )}
          </div>
        </div>
      </div>

      {/* ── DIVIDER ──────────────────────────────────────────────────── */}
      <div className="border-t border-gray-100" />

      {/* ── ABOUT ────────────────────────────────────────────────────── */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-indigo-100 flex items-center justify-center">
              <FileText size={13} className="text-indigo-500" />
            </div>
            <Label
              htmlFor="about"
              className="text-sm font-semibold text-gray-700 tracking-wide uppercase"
            >
              About
            </Label>
          </div>
          <span
            className={`text-xs font-medium tabular-nums transition-colors ${
              aboutLength === 0
                ? 'text-gray-400'
                : aboutLength < 50
                  ? 'text-amber-500'
                  : aboutLength <= 500
                    ? 'text-green-500'
                    : 'text-red-500'
            }`}
          >
            {formData.about.length} / 500
          </span>
        </div>

        <div className="relative">
          <Textarea
            id="about"
            placeholder="Tell us a bit about your background, education, and professional experience..."
            value={formData.about}
            onChange={e => {
              const value = e.target.value
              setFormData(prev => ({ ...prev, about: value }))
              const len = value.trim().length
              setErrors(prev => ({ ...prev, about: len < 50 || len > 500 }))
            }}
            onBlur={e => {
              const len = e.target.value.trim().length
              if (len < 50 || len > 500)
                setErrors(prev => ({ ...prev, about: true }))
            }}
            className={`min-h-32 resize-none text-sm leading-relaxed transition-all duration-200 rounded-xl border-gray-200 focus:ring-2 focus:ring-indigo-400 focus:border-transparent pr-4 ${
              errors.about ? 'border-red-300 focus:ring-red-400' : ''
            }`}
            rows={4}
            maxLength={500}
          />

          {/* Character progress bar */}
          <div className="mt-2 h-1 w-full bg-gray-100 rounded-full overflow-hidden">
            <motion.div
              animate={{ width: `${aboutPercent}%` }}
              transition={{ duration: 0.3 }}
              className={`h-full rounded-full transition-colors ${
                aboutLength < 50
                  ? 'bg-amber-400'
                  : aboutGood
                    ? 'bg-green-400'
                    : 'bg-red-400'
              }`}
            />
          </div>
        </div>

        <AnimatePresence>
          {errors.about && (
            <motion.p
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="text-red-500 text-xs"
            >
              {aboutLength < 50
                ? `${50 - aboutLength} more characters needed`
                : 'About cannot exceed 500 characters'}
            </motion.p>
          )}
          {aboutGood && (
            <motion.p
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="text-green-600 text-xs font-medium"
            >
              ✓ Looks great!
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      {/* ── DIVIDER ──────────────────────────────────────────────────── */}
      <div className="border-t border-gray-100" />

      {/* ── BIO ──────────────────────────────────────────────────────── */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-purple-100 flex items-center justify-center">
              <Sparkles size={13} className="text-purple-500" />
            </div>
            <Label
              htmlFor="bio"
              className="text-sm font-semibold text-gray-700 tracking-wide uppercase"
            >
              Bio
            </Label>
          </div>
          <span
            className={`text-xs font-medium tabular-nums transition-colors ${
              bioLength === 0
                ? 'text-gray-400'
                : bioLength < 50
                  ? 'text-amber-500'
                  : bioLength <= 500
                    ? 'text-green-500'
                    : 'text-red-500'
            }`}
          >
            {formData.bio.length} / 500
          </span>
        </div>

        <div className="relative">
          <Textarea
            id="bio"
            placeholder="Tell us about yourself — your teaching style, areas of expertise, what students can expect from your sessions…"
            value={formData.bio}
            onChange={e => {
              const value = e.target.value
              setFormData(prev => ({ ...prev, bio: value }))
              const len = value.trim().length
              setErrors(prev => ({ ...prev, bio: len < 50 || len > 500 }))
            }}
            onBlur={e => {
              const len = e.target.value.trim().length
              if (len < 50 || len > 500)
                setErrors(prev => ({ ...prev, bio: true }))
            }}
            className={`min-h-32 resize-none text-sm leading-relaxed transition-all duration-200 rounded-xl border-gray-200 focus:ring-2 focus:ring-blue-400 focus:border-transparent pr-4 ${
              errors.bio ? 'border-red-300 focus:ring-red-400' : ''
            }`}
            rows={4}
            maxLength={500}
          />

          {/* Character progress bar */}
          <div className="mt-2 h-1 w-full bg-gray-100 rounded-full overflow-hidden">
            <motion.div
              animate={{ width: `${bioPercent}%` }}
              transition={{ duration: 0.3 }}
              className={`h-full rounded-full transition-colors ${
                bioLength < 50
                  ? 'bg-amber-400'
                  : bioGood
                    ? 'bg-green-400'
                    : 'bg-red-400'
              }`}
            />
          </div>
        </div>

        <AnimatePresence>
          {errors.bio && (
            <motion.p
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="text-red-500 text-xs"
            >
              {bioLength < 50
                ? `${50 - bioLength} more characters needed`
                : 'Bio cannot exceed 500 characters'}
            </motion.p>
          )}
          {bioGood && (
            <motion.p
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="text-green-600 text-xs font-medium"
            >
              ✓ Looks great!
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      {/* ── DIVIDER ──────────────────────────────────────────────────── */}
      <div className="border-t border-gray-100" />

      {/* ── SOCIAL LINKS ─────────────────────────────────────────────── */}
      <div className="space-y-4">
        <p className="text-sm font-semibold text-gray-700 tracking-wide uppercase">
          Social Links{' '}
          <span className="text-gray-400 font-normal normal-case tracking-normal">
            (optional)
          </span>
        </p>

        <div className="grid grid-cols-1 gap-4">
          {/* GitHub */}
          <div className="group">
            <div
              className={`flex items-center gap-3 px-4 py-3 rounded-xl border bg-white transition-all duration-200 focus-within:ring-2 focus-within:ring-gray-800 focus-within:border-gray-800 ${
                errors.githubUrl
                  ? 'border-red-300'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="w-8 h-8 rounded-lg bg-gray-900 flex items-center justify-center shrink-0">
                <Github size={15} className="text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-0.5">
                  GitHub
                </p>
                <input
                  id="githubUrl"
                  type="url"
                  placeholder="github.com/yourusername"
                  value={formData.githubUrl}
                  onChange={e =>
                    setFormData({ ...formData, githubUrl: e.target.value })
                  }
                  className="w-full text-sm text-gray-800 placeholder-gray-300 bg-transparent outline-none"
                />
              </div>
            </div>
          </div>

          {/* LinkedIn */}
          <div className="group">
            <div
              className={`flex items-center gap-3 px-4 py-3 rounded-xl border bg-white transition-all duration-200 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 ${
                errors.linkedinUrl
                  ? 'border-red-300'
                  : 'border-gray-200 hover:border-blue-200'
              }`}
            >
              <div className="w-8 h-8 rounded-lg bg-[#0A66C2] flex items-center justify-center shrink-0">
                <Linkedin size={15} className="text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-0.5">
                  LinkedIn
                </p>
                <input
                  id="linkedinUrl"
                  type="url"
                  placeholder="linkedin.com/in/yourusername"
                  value={formData.linkedinUrl}
                  onChange={e =>
                    setFormData({ ...formData, linkedinUrl: e.target.value })
                  }
                  className="w-full text-sm text-gray-800 placeholder-gray-300 bg-transparent outline-none"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
