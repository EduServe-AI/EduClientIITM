'use client'

import { timeOptions } from '@/app/onboarding/components/availability'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Availability } from '@/contexts/instructorContext'
import { MinusCircle, PlusCircle } from 'lucide-react'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

export function EditAvailabilities({
  Availabilities,
  setAvailabilities,
}: {
  Availabilities: Availability[]
  setAvailabilities: (availabilities: Availability[]) => void
}) {
  const [isOpen, setIsOpen] = useState(false)

  // Local state - clone the availabilities for editing
  const [localAvailability, setLocalAvailability] =
    useState<Availability[]>(Availabilities)

  // Sync local state when Availabilities prop changes AND dialog is closed
  useEffect(() => {
    if (!isOpen) {
      setLocalAvailability(JSON.parse(JSON.stringify(Availabilities)))
    }
  }, [Availabilities, isOpen])

  // Update local state when dialog opens
  const handleOpen = (open: boolean) => {
    if (open) {
      setLocalAvailability(JSON.parse(JSON.stringify(Availabilities))) // Deep clone
    }
    setIsOpen(open)
  }

  // Handle day toggle
  const handleDayToggle = (dayId: string, checked: boolean) => {
    setLocalAvailability(prev =>
      prev.map(day =>
        day.id === dayId ? { ...day, isAvailable: checked } : day
      )
    )
  }

  // Handle time slot change
  const handleSlotChange = (
    dayId: string,
    slotIndex: number,
    field: 'startTime' | 'endTime',
    value: string
  ) => {
    setLocalAvailability(prev =>
      prev.map(day => {
        if (day.id === dayId) {
          const newSlots = [...day.timeSlots]
          newSlots[slotIndex] = { ...newSlots[slotIndex], [field]: value }
          return { ...day, timeSlots: newSlots }
        }
        return day
      })
    )
  }

  // Add time slot
  const addSlot = (dayId: string) => {
    setLocalAvailability(prev =>
      prev.map(day => {
        if (day.id === dayId) {
          return {
            ...day,
            timeSlots: [
              ...day.timeSlots,
              {
                id: `temp-slot-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                startTime: '19:00',
                endTime: '20:00',
              },
            ],
          }
        }
        return day
      })
    )
  }

  // Remove time slot
  const removeSlot = (dayId: string, slotIndex: number) => {
    setLocalAvailability(prev =>
      prev.map(day => {
        if (day.id === dayId) {
          return {
            ...day,
            timeSlots: day.timeSlots.filter((_, index) => index !== slotIndex),
          }
        }
        return day
      })
    )
  }

  // Apply Monday's schedule to all other days
  const applyMondayToAllDays = () => {
    const mondaySchedule = localAvailability.find(
      d => d.dayOfWeek.name === 'Monday'
    )
    if (!mondaySchedule) return

    setLocalAvailability(prev =>
      prev.map(day => {
        if (day.dayOfWeek.name === 'Monday') return day // Keep Monday as is
        return {
          ...day,
          isAvailable: mondaySchedule.isAvailable,
          timeSlots: mondaySchedule.timeSlots.map((slot, slotIndex) => ({
            id: `temp-slot-${Date.now()}-${day.id}-${slotIndex}-${Math.random().toString(36).substr(2, 9)}`,
            startTime: slot.startTime,
            endTime: slot.endTime,
          })),
        }
      })
    )
  }

  // Apply changes to parent component
  const handleApply = () => {
    setAvailabilities(localAvailability)
    toast.success('Availability updated')
    setIsOpen(false)
  }

  // Reset to current availability when dialog closes without saving
  const handleCancel = () => {
    setIsOpen(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" color="black">
          Edit Availability
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-3xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Edit Availability</DialogTitle>
          <DialogDescription>
            You will receive bookings in your local timezone
            <span className="font-bold"> Asia/Kolkata</span>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <Card className="bg-white shadow-sm border-gray-200/80">
            <ScrollArea className="h-[300px]">
              <CardContent className="space-y-4 pt-6">
                {localAvailability.map(day => (
                  <div
                    key={day.id}
                    className="p-4 border rounded-lg bg-gray-50/50 transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <Switch
                          checked={day.isAvailable}
                          onCheckedChange={checked =>
                            handleDayToggle(day.id, checked)
                          }
                        />
                        <span className="font-medium text-gray-700 w-28 text-base">
                          {day.dayOfWeek.name}
                        </span>
                      </div>
                      {day.isAvailable && (
                        <button
                          onClick={() => addSlot(day.id)}
                          className="flex items-center text-sm font-medium text-violet-600 hover:text-violet-800 transition-colors"
                        >
                          <PlusCircle className="w-4 h-4 mr-2" />
                          Add slot
                        </button>
                      )}
                    </div>

                    {day.isAvailable ? (
                      <div className="pl-12 pt-3 space-y-3">
                        <div className="flex flex-col">
                          {day.timeSlots.length > 0 ? (
                            day.timeSlots.map((slot, index) => (
                              <div
                                key={slot.id}
                                className="flex items-center space-x-3 space-y-3 animate-in fade-in duration-300"
                              >
                                <Select
                                  value={slot.startTime}
                                  onValueChange={value =>
                                    handleSlotChange(
                                      day.id,
                                      index,
                                      'startTime',
                                      value
                                    )
                                  }
                                >
                                  <SelectTrigger className="w-40 h-10">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {timeOptions.map(option => (
                                      <SelectItem
                                        key={option.value}
                                        value={option.value}
                                      >
                                        {option.label}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                <span className="text-gray-500 font-medium">
                                  to
                                </span>
                                <Select
                                  value={slot.endTime}
                                  onValueChange={value =>
                                    handleSlotChange(
                                      day.id,
                                      index,
                                      'endTime',
                                      value
                                    )
                                  }
                                >
                                  <SelectTrigger className="w-40 h-10">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {timeOptions.map(option => (
                                      <SelectItem
                                        key={option.value}
                                        value={option.value}
                                      >
                                        {option.label}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                <button
                                  onClick={() => removeSlot(day.id, index)}
                                >
                                  <MinusCircle className="w-5 h-5 text-red-400 hover:text-red-600 transition-colors" />
                                </button>
                              </div>
                            ))
                          ) : (
                            <p className="text-sm text-gray-400 italic">
                              Click &apos;Add slot&apos; to set your available
                              times.
                            </p>
                          )}
                          {day.dayOfWeek.name === 'Monday' && (
                            <p className="mt-2 flex justify-start items-start">
                              To apply this slot to all days
                              <button
                                className="italic text-blue-900 ml-3 cursor-pointer hover:underline"
                                onClick={applyMondayToAllDays}
                              >
                                Click here
                              </button>
                            </p>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="pl-12 pt-3">
                        <span className="text-sm text-gray-400 italic">
                          Unavailable
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </CardContent>
            </ScrollArea>
          </Card>
        </div>

        <DialogFooter className="gap-2">
          <DialogClose asChild>
            <Button type="button" variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
          </DialogClose>
          <Button type="button" onClick={handleApply}>
            Apply Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
