import { CalendarDays, PlusCircle, MinusCircle } from 'lucide-react'
import { DayType, TimeSlot } from '@/types/types'
import { Switch } from '@/components/ui/switch'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

const weekdays: DayType[] = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
]

// --- Helper to generate time options ---
const generateTimeOptions = () => {
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
const timeOptions = generateTimeOptions()

interface AvailabilityProps {
  formData: {
    availability: {
      [key in DayType]: { isEnabled: boolean; slots: TimeSlot[] }
    }
  }
  setFormData: React.Dispatch<React.SetStateAction<any>>
}

export default function Availability({
  formData,
  setFormData,
}: AvailabilityProps) {
  // --- Handlers for Availability Changes ---
  const handleDayToggle = (day: string, checked: boolean) => {
    setFormData((prev: any) => ({
      ...prev,
      availability: {
        ...prev.availability,
        [day]: { ...prev.availability[day], isEnabled: checked },
      },
    }))
  }

  const handleSlotChange = (
    day: string,
    slotIndex: number,
    field: 'from' | 'to',
    value: string
  ) => {
    setFormData((prev: any) => {
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

  const addSlot = (day: string) => {
    setFormData((prev: any) => {
      const newSlots = [
        ...prev.availability[day].slots,
        { from: '19:00', to: '20:00' },
      ] // Default evening slot
      return {
        ...prev,
        availability: {
          ...prev.availability,
          [day]: { ...prev.availability[day], slots: newSlots },
        },
      }
    })
  }

  const removeSlot = (day: string, slotIndex: number) => {
    setFormData((prev: any) => {
      const newSlots = prev.availability[day].slots.filter(
        (_: any, index: number) => index !== slotIndex
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

  // Apply Monday's schedule to all other days
  const applyMondayToAllDays = () => {
    const mondaySchedule = formData.availability.Monday
    setFormData((prev: any) => {
      const newAvailability = { ...prev.availability }
      weekdays.slice(1).forEach(day => {
        // Skip Monday itself
        newAvailability[day] = {
          isEnabled: mondaySchedule.isEnabled,
          slots: mondaySchedule.slots.map(slot => ({ ...slot })), // Deep copy slots
        } // changed
      })
      return {
        ...prev,
        availability: newAvailability,
      }
    })
  }

  return (
    <section className="max-w-xl mx-auto w-full animate-in fade-in duration-500">
      <header className="mb-8 text-center flex flex-row gap-3 items-center justify-center">
        <CalendarDays size={30} />
        <h3 className="text-3xl font-semibold text-gray-800">Availability</h3>
      </header>

      {/* Card displaying timings */}
      <Card className="bg-white shadow-sm border-gray-200/80 h-95">
        <ScrollArea className="h-80">
          {/* <CardHeader>
            <div className="flex items-center space-x-3 ">
              <CalendarDays className="w-6 h-6 text-violet-600" />
              <CardTitle className="text-xl font-semibold text-gray-800">
                Weekly Schedule
              </CardTitle>
            </div>
            <CardDescription>
              You can adjust this schedule at any time from your account
              settings.
            </CardDescription>
          </CardHeader> */}
          <CardContent className="space-y-4">
            {weekdays.map(day => (
              <div
                key={day}
                className="p-4 border rounded-lg bg-gray-50/50 transition-all"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <Switch
                      checked={formData.availability[day].isEnabled}
                      onCheckedChange={checked => handleDayToggle(day, checked)}
                    />
                    <span className="font-medium text-gray-700 w-28 text-base">
                      {day}
                    </span>
                  </div>
                  {formData.availability[day]?.isEnabled && (
                    <button
                      onClick={() => addSlot(day)}
                      className="flex items-center text-sm font-medium text-violet-600 hover:text-violet-800 transition-colors"
                    >
                      <PlusCircle className="w-4 h-4 mr-2" />
                      Add slot
                    </button>
                  )}
                </div>

                {formData.availability[day]?.isEnabled ? (
                  <div className="pl-12 pt-3 space-y-3">
                    <div className="flex flex-col">
                      {formData.availability[day].slots.length > 0 ? (
                        formData.availability[day].slots.map((slot, index) => (
                          <div
                            key={index}
                            className="flex items-center space-x-3 space-y-3 animate-in fade-in duration-300"
                          >
                            <Select
                              value={slot.from}
                              onValueChange={value =>
                                handleSlotChange(day, index, 'from', value)
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
                              value={slot.to}
                              onValueChange={value =>
                                handleSlotChange(day, index, 'to', value)
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
                            <button onClick={() => removeSlot(day, index)}>
                              <MinusCircle className="w-5 h-5 text-red-400 hover:text-red-600 transition-colors" />
                            </button>
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-gray-400 italic">
                          Click 'Add slot' to set your available times.
                        </p>
                      )}
                      {day === 'Monday' && (
                        <p className="mt-2 flex justify-start items-start">
                          To apply this slot to all days
                          <button
                            className="italic text-blue-900 ml-3 cursor-pointer"
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
    </section>
  )
}
