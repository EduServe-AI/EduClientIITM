import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { apiService } from '@/lib/api'
import { Plus } from 'lucide-react'
import { useState } from 'react'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select'
import { Textarea } from '../ui/textarea'

type NewCallPayload = {
  guestId: string
  startTime: string // RFC3339
  title: string
  description?: string
  durationMinutes: number
}

export default function NewSessionDialog() {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const [form, setForm] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    durationMinutes: '',
    guestId: '7c7e32c7-a27e-4ad5-a91c-81149854cdb1', // set from user picker or context
  })

  // 🔹 Generic change handler
  const updateField = (key: keyof typeof form, value: string) => {
    setForm(prev => ({ ...prev, [key]: value }))
  }

  // 🔹 Build RFC3339 start time
  const buildStartTime = (date: string, time: string) =>
    new Date(`${date}T${time}:00`).toISOString()

  // 🔹 Validate form
  const isFormValid = () =>
    form.title && form.date && form.time && form.durationMinutes && form.guestId

  // 🔹 API call
  const handleScheduleCall = async () => {
    if (!isFormValid()) return

    setLoading(true)

    const payload: NewCallPayload = {
      guestId: form.guestId,
      title: form.title,
      description: form.description,
      durationMinutes: Number(form.durationMinutes),
      startTime: buildStartTime(form.date, form.time),
    }

    try {
      const data = await apiService('/session/create-session', {
        method: 'POST',
        body: {
          guestId: form.guestId,
          title: form.title,
          description: form.description,
          durationMinutes: Number(form.durationMinutes),
          startTime: buildStartTime(form.date, form.time),
        },
      })
      console.log(data)
      setOpen(false)
      setForm({
        title: '',
        description: '',
        date: '',
        time: '',
        durationMinutes: '',
        guestId: '',
      })
    } catch (error) {
      console.error('Failed to schedule call', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="lg" className="gap-2 w-full sm:w-auto shadow-md">
          <Plus className="h-5 w-5" />
          Schedule Call
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">Schedule New Call</DialogTitle>
          <DialogDescription>
            Add a new video call to your schedule.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label>Title *</Label>
            <Input
              value={form.title}
              onChange={e => updateField('title', e.target.value)}
            />
          </div>

          <div className="grid gap-2">
            <Label>Description</Label>
            <Textarea
              value={form.description}
              onChange={e => updateField('description', e.target.value)}
            />
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label>Date *</Label>
              <Input
                type="date"
                value={form.date}
                min={new Date().toISOString().split('T')[0]}
                onChange={e => updateField('date', e.target.value)}
              />
            </div>

            <div className="grid gap-2">
              <Label>Time *</Label>
              <Input
                type="time"
                value={form.time}
                onChange={e => updateField('time', e.target.value)}
              />
            </div>
          </div>

          <div className="grid gap-2">
            <Label>Duration *</Label>
            <Select
              value={form.durationMinutes}
              onValueChange={value => updateField('durationMinutes', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select duration" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="15">15 minutes</SelectItem>
                <SelectItem value="30">30 minutes</SelectItem>
                <SelectItem value="45">45 minutes</SelectItem>
                <SelectItem value="60">1 hour</SelectItem>
                <SelectItem value="90">1.5 hours</SelectItem>
                <SelectItem value="120">2 hours</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleScheduleCall}
            disabled={!isFormValid() || loading}
          >
            {loading ? 'Scheduling...' : 'Schedule Call'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
