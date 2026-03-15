'use client'

import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import type { OnboardingFormData } from '@/types/types'
import { DayType } from '@/types/types'
import { MinusCircle, PlusCircle } from 'lucide-react'

export const weekdays: DayType[] = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
]

export const generateTimeOptions = () => {
  const options = []
  for (let h = 0; h < 24; h++) {
    for (let m = 0; m < 60; m += 30) {
      const value = `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`
      const ampm = h >= 12 ? 'PM' : 'AM'
      const hour12 = h % 12 === 0 ? 12 : h % 12
      const label = `${hour12.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')} ${ampm}`
      options.push({ value, label })
    }
  }
  return options
}

export const timeOptions = generateTimeOptions()

interface AvailabilityProps {
  formData: OnboardingFormData
  setFormData: React.Dispatch<React.SetStateAction<OnboardingFormData>>
}

export default function Availability({
  formData,
  setFormData,
}: AvailabilityProps) {
  const handleDayToggle = (day: DayType, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      availability: {
        ...prev.availability,
        [day]: { ...prev.availability[day], isEnabled: checked },
      },
    }))
  }

  const handleSlotChange = (
    day: DayType,
    slotIndex: number,
    field: 'from' | 'to',
    value: string
  ) => {
    setFormData(prev => {
      const newSlots = [...prev.availability[day].slots]
      newSlots[slotIndex] = { ...newSlots[slotIndex], [field]: value }
      return {
        ...prev,
        availability: {
          ...prev.availability,
          [day]: { ...prev.availability[day], slots: newSlots },
        },
      }
    })
  }

  const addSlot = (day: DayType) => {
    setFormData(prev => {
      const newSlots = [
        ...prev.availability[day].slots,
        { from: '19:00', to: '20:00' },
      ]
      return {
        ...prev,
        availability: {
          ...prev.availability,
          [day]: { ...prev.availability[day], slots: newSlots },
        },
      }
    })
  }

  const removeSlot = (day: DayType, slotIndex: number) => {
    setFormData(prev => {
      const newSlots = prev.availability[day].slots.filter(
        (_, index: number) => index !== slotIndex
      )
      return {
        ...prev,
        availability: {
          ...prev.availability,
          [day]: { ...prev.availability[day], slots: newSlots },
        },
      }
    })
  }

  const applyMondayToAllDays = () => {
    const mondaySchedule = formData.availability.Monday
    setFormData(prev => {
      const newAvailability = { ...prev.availability }
      weekdays.slice(1).forEach(day => {
        newAvailability[day] = {
          isEnabled: mondaySchedule.isEnabled,
          slots: mondaySchedule.slots.map(slot => ({ ...slot })),
        }
      })
      return {
        ...prev,
        availability: newAvailability,
      }
    })
  }

  // const handleNext = () => {
  //   const hasAnySlot = Object.values(formData.availability).some(
  //     day => day.isEnabled && day.slots.length > 0
  //   )

  //   if (!hasAnySlot) {
  //     toast.error('Please set at least one availability slot')
  //     return
  //   }

  //   onNext()
  // }

  return (
    <div className="w-full h-screen">
      {/* Info Box */}
      <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-sm text-blue-800">
          Set your weekly availability. Students can only book sessions during
          these times.
        </p>
      </div>

      {/* Availability Schedule */}
      <ScrollArea className="h-[400px] rounded-lg border border-gray-200 p-4">
        <div className="space-y-4 pr-4">
          {weekdays.map(day => (
            <div
              key={day}
              className="p-4 border rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
            >
              {/* Day Header */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <Switch
                    checked={formData.availability[day].isEnabled}
                    onCheckedChange={checked => handleDayToggle(day, checked)}
                  />
                  <span className="font-semibold text-gray-800 w-28">
                    {day}
                  </span>
                </div>
                {formData.availability[day]?.isEnabled && (
                  <button
                    onClick={() => addSlot(day)}
                    className="flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors"
                  >
                    <PlusCircle className="w-4 h-4" />
                    Add slot
                  </button>
                )}
              </div>

              {/* Time Slots */}
              {formData.availability[day]?.isEnabled ? (
                <div className="pl-12 space-y-2">
                  {formData.availability[day].slots.length > 0 ? (
                    <>
                      {formData.availability[day].slots.map((slot, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-2 animate-in fade-in duration-300"
                        >
                          <Select
                            value={slot.from}
                            onValueChange={value =>
                              handleSlotChange(day, index, 'from', value)
                            }
                          >
                            <SelectTrigger className="w-32 h-9 text-sm">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="max-h-48">
                              {timeOptions.map(option => (
                                <SelectItem
                                  key={option.value}
                                  value={option.value}
                                  className="text-sm"
                                >
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>

                          <span className="text-gray-400 text-sm">to</span>

                          <Select
                            value={slot.to}
                            onValueChange={value =>
                              handleSlotChange(day, index, 'to', value)
                            }
                          >
                            <SelectTrigger className="w-32 h-9 text-sm">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="max-h-48">
                              {timeOptions.map(option => (
                                <SelectItem
                                  key={option.value}
                                  value={option.value}
                                  className="text-sm"
                                >
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>

                          <button
                            onClick={() => removeSlot(day, index)}
                            className="text-red-400 hover:text-red-600 transition-colors"
                          >
                            <MinusCircle className="w-5 h-5" />
                          </button>
                        </div>
                      ))}

                      {day === 'Monday' && (
                        <button
                          onClick={applyMondayToAllDays}
                          className="text-xs font-medium text-blue-600 hover:text-blue-800 mt-2 flex items-center gap-1"
                        >
                          → Apply to all days
                        </button>
                      )}
                    </>
                  ) : (
                    <p className="text-sm text-gray-400 italic">
                      No slots added yet
                    </p>
                  )}
                </div>
              ) : (
                <div className="pl-12">
                  <span className="text-sm text-gray-400 italic">
                    Unavailable
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      </ScrollArea>

      {/* Info */}
      <p className="text-xs text-gray-500 mt-4">
        📌 You can modify your availability at any time from your dashboard
      </p>
    </div>
  )
}
