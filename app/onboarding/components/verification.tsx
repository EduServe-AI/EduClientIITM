import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { OnboardingFormData, ProgramLevelId } from '@/types/types'
import { ShieldCheckIcon } from 'lucide-react'
import { useState } from 'react'

interface VerificationProps {
  formData: {
    iitmProfileUrl: string
    cgpa: number
    level: ProgramLevelId
  }
  setFormData: React.Dispatch<React.SetStateAction<OnboardingFormData>>
}

export default function Verification({
  formData,
  setFormData,
}: VerificationProps) {
  const [errors, setErrors] = useState<{ [key: string]: boolean }>({
    iitmProfileUrl: false,
    cgpa: false,
    level: false,
  })

  return (
    <section className="max-w-4xl mx-auto w-full">
      <header className="mb-8 text-center flex flex-row gap-3 items-center justify-center">
        <ShieldCheckIcon size={30} />
        <h3 className="text-3xl font-semibold text-gray-800">
          Programme Verification
        </h3>
      </header>

      <form className="flex flex-col items-start w-full gap-8 ">
        {/* IITM Public profile Url */}
        <div className="w-full max-w-2xl space-y-2">
          <Label className="text-md font-medium" htmlFor="iitmProfileUrl">
            IITM Public Profile URL
          </Label>
          <Input
            id="iitmProfileUrl"
            type="url"
            placeholder="https://ds.study.iitm.ac.in/student/2xFxxxxxxx"
            value={formData.iitmProfileUrl}
            onChange={e => {
              const value = e.target.value
              setFormData(prev => ({ ...prev, iitmProfileUrl: value }))
              if (value.trim() === '') {
                setErrors({ ...errors, iitmProfileUrl: true })
              } else {
                setErrors({ ...errors, iitmProfileUrl: false })
              }
            }}
            required
            className={`py-6 transition-all duration-200 focus:ring-2 focus:ring-blue-500 ${
              errors.iitmProfileUrl
                ? 'border-red-500 focus-visible:ring-red-500'
                : ''
            }`}
          />
          {errors.iitmProfileUrl && (
            <p className="text-red-500 text-sm">
              Public Profile Url Cannot be empty
            </p>
          )}
        </div>

        {/* Overall CGPA Input */}
        <div className="w-full max-w-2xl space-y-2">
          <Label className="text-md font-medium" htmlFor="cgpa">
            CGPA
          </Label>
          <Input
            placeholder="Current CGPA in the programme"
            id="cgpa"
            type="number"
            step="0.01"
            min={0}
            max={10}
            value={formData.cgpa}
            onChange={e => {
              const value = e.target.value
              const numValue = value === '' ? NaN : parseFloat(value)
              setFormData(prev => ({
                ...prev,
                cgpa: numValue,
              }))
              if (isNaN(numValue) || numValue <= 0 || numValue > 10) {
                setErrors(prev => ({ ...prev, cgpa: true }))
              } else {
                setErrors(prev => ({ ...prev, cgpa: false }))
              }
            }}
            required
            className={`py-6 transition-all duration-200 focus:ring-2 focus:ring-blue-500 ${
              errors.cgpa ? 'border-red-500 focus-visible:ring-red-500' : ''
            }`}
          />
          {errors.cgpa && (
            <p className="text-red-500 text-sm">
              CGPA must be a valid number greater than 0 and at most 10.
            </p>
          )}
        </div>

        {/* Program Level Selection */}
        <div className="w-full max-w-2xl space-y-2">
          <Label htmlFor="programLevel" className="text-md font-medium">
            Current Program Level
          </Label>
          <Select
            value={formData.level || ''}
            onValueChange={value => {
              setFormData(prev => ({ ...prev, level: value as ProgramLevelId }))
              setErrors(prev => ({ ...prev, level: false }))
            }}
          >
            <SelectTrigger
              id="programLevel"
              className={`py-6 w-full transition-all duration-200 focus:ring-2 focus:ring-blue-500 ${
                errors.level ? 'border-red-500 focus-visible:ring-red-500' : ''
              }`}
              onBlur={() => {
                if (!formData.level) {
                  setErrors(prev => ({ ...prev, level: true }))
                }
              }}
            >
              <SelectValue placeholder="Select your current level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="foundation">Foundation Level</SelectItem>
              <SelectItem value="diploma">Diploma Level</SelectItem>
              <SelectItem value="bsc">BSc Degree Level</SelectItem>
              <SelectItem value="bs">BS Degree Level</SelectItem>
            </SelectContent>
          </Select>
          {errors.level && (
            <p className="text-red-500 text-sm">
              Please select your program level.
            </p>
          )}
        </div>
      </form>
    </section>
  )
}
