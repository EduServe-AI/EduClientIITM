import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ProgramLevelId } from '@/types/types'
import { ShieldCheckIcon } from 'lucide-react'
import { getLevelProperties } from './levelSelector'

interface VerificationProps {
  formData: {
    iitmProfileUrl: string
    cgpa: number
    level: ProgramLevelId
  }
  setFormData: React.Dispatch<React.SetStateAction<any>>
}

export default function Verification({
  formData,
  setFormData,
}: VerificationProps) {
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
            onChange={e =>
              setFormData({ ...formData, iitmProfileUrl: e.target.value })
            }
            required
            className="py-6 transition-all duration-200 focus:ring-2 focus:ring-blue-500"
          />
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
            onChange={e => setFormData({ ...formData, cgpa: e.target.value })}
            required
            className="py-6 transition-all duration-200 focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Program Level Selection */}
        <div className="w-full max-w-2xl space-y-2">
          <Label htmlFor="programLevel" className="text-md font-medium">
            Current Program Level
          </Label>
          <Select
            value={formData.level}
            onValueChange={value => setFormData({ ...formData, level: value })}
          >
            <SelectTrigger
              id="programLevel"
              className="py-6 w-full transition-all duration-200 focus:ring-2 focus:ring-blue-500"
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
        </div>
      </form>
    </section>
  )
}
