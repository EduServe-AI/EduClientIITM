'use client'
import { Button } from '@/components/ui/button'
import { useIsMobile } from '@/hooks/use-mobile'
import { apiService } from '@/lib/api'
import { AvailabilityType, OnboardingFormData } from '@/types/types'
import { ChevronLeft, Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'
import Availability from '../components/availability'
import Expertise from '../components/expertise'
import Personalization from '../components/personalization'
import Pricing from '../components/pricing'
import Verification from '../components/verification'

const initialAvailability = (): AvailabilityType => {
  const days = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday',
  ] as const
  const availability = {} as AvailabilityType

  days.forEach(day => {
    availability[day] = {
      isEnabled: false,
      slots: [{ from: '09:00', to: '17:00' }],
    }
  })

  return availability
}

export default function InstructorOnboarding() {
  const steps = [
    'Verification',
    'Expertise',
    'Personalization',
    'Pricing',
    'Availability',
  ]
  const [currentStep, setCurrentStep] = useState(0)
  const isMobile = useIsMobile()
  const router = useRouter()

  const [isPending, setIsPending] = useState<boolean>(false)

  // state to hold all the onboarding form data for the entire process
  const [formData, setFormData] = useState<OnboardingFormData>({
    iitmProfileUrl: '',
    cgpa: 0,
    level: undefined,
    subjects: [],
    languages: [],
    profilePicture: null,
    bio: '',
    githubUrl: '',
    linkedinUrl: '',
    availability: initialAvailability(),
  })

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handleBack = () => {
    if (currentStep >= 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  // getStepValidationMessages function will return the validation messages for the currentStep
  const getStepValidationMessages = (): string[] => {
    if (currentStep === 0) {
      return getVerificationValidationMessages()
    }
    if (currentStep === 1) {
      return getExpertiseValidationMessages()
    }
    if (currentStep === 2) {
      return getPersonalizationValidationMessages()
    }
    if (currentStep === 4) {
      return getAvailabilityValidationMessages()
    }
    return []
  }

  const isStepValid = (): boolean => {
    if (currentStep === 0) {
      if (!formData.iitmProfileUrl || !formData.cgpa || !formData.level) {
        return false
      }
    }
    if (currentStep === 1) {
      if (formData.languages.length === 0 || formData.subjects.length === 0) {
        return false
      }
    }
    if (currentStep === 2) {
      if (!formData.profilePicture || !formData.bio) {
        return false
      }
    }
    if (currentStep === 4) {
      // Check if at least one day is enabled
      const hasEnabledDay = Object.values(formData.availability).some(
        day => day.isEnabled
      )

      // Check if enabled days have valid slots
      const hasValidSlots = Object.entries(formData.availability).every(
        ([, day]) => {
          if (!day.isEnabled) return true // Skip validation for disabled days
          return day.slots.every(slot => {
            const fromTime = new Date(`2000/01/01 ${slot.from}`)
            const toTime = new Date(`2000/01/01 ${slot.to}`)
            return fromTime < toTime // Ensure "from" time is before "to" time
          })
        }
      )

      return hasEnabledDay && hasValidSlots
    }
    return true
  }

  // seperate validation messages for step-1 : verification component
  const getVerificationValidationMessages = (): string[] => {
    const messages: string[] = []
    if (currentStep === 0) {
      // Need to implement
      if (!formData.iitmProfileUrl) {
        messages.push('IITM Public Profile Url is required')
      }
      if (!formData.cgpa || formData.cgpa <= 0) {
        messages.push('Valid CGPA is required')
      }
      if (!formData.level) {
        messages.push('Current Level is required')
      }
    }
    return messages
  }

  // seperate validation messages for step-2 : Expertise component
  const getExpertiseValidationMessages = (): string[] => {
    const messages: string[] = []
    if (currentStep === 1) {
      // Need to implement
      if (formData.subjects.length === 0) {
        messages.push(
          'Should select at least one subject you are expertised with'
        )
      }
      if (formData.languages.length === 0) {
        messages.push('Should be proficient with at least one language')
      }
    }
    return messages
  }

  // seperate validation messages for step-3 : Personalization component
  const getPersonalizationValidationMessages = (): string[] => {
    const messages: string[] = []
    if (currentStep === 2) {
      // Need to implement
      if (!formData.bio || formData.bio.trim() == '') {
        messages.push('Valid Bio should be provided')
      }
      if (!formData.profilePicture) {
        messages.push('Profile picture required')
      }
    }
    return messages
  }

  // seperate validation messages for step-4 : Pricing component
  const getAvailabilityValidationMessages = (): string[] => {
    const messages: string[] = []
    if (currentStep === 4) {
      // Need to implement
      // Check if at least one day is enabled
      const hasEnabledDay = Object.values(formData.availability).some(
        day => day.isEnabled
      )
      if (!hasEnabledDay) {
        messages.push('Please enable at least one day in your schedule')
        return messages
      }

      // Validate time slots for enabled days
      Object.entries(formData.availability).forEach(([day, schedule]) => {
        if (schedule.isEnabled) {
          if (schedule.slots.length === 0) {
            messages.push(`${day} is enabled but has no time slots`)
          }

          schedule.slots.forEach((slot, index) => {
            const fromTime = new Date(`2000/01/01 ${slot.from}`)
            const toTime = new Date(`2000/01/01 ${slot.to}`)

            if (fromTime >= toTime) {
              messages.push(
                `${day}: Slot #${index + 1} - End time must be after start time`
              )
            }

            // Optional: Check for minimum duration (e.g., 30 minutes)
            const duration =
              (toTime.getTime() - fromTime.getTime()) / (1000 * 60)
            if (duration < 30) {
              messages.push(
                `${day}: Slot #${index + 1} - Duration must be at least 30 minutes`
              )
            }
          })
        }
      })
    }
    return messages
  }

  const handleSubmit = async () => {
    setIsPending(true)

    console.log('profile picture', formData.profilePicture)

    try {
      // Step 3: Submit the onboarding data
      const submission_data = {
        iitmProfileUrl: formData.iitmProfileUrl,
        cgpa: formData.cgpa,
        level: formData.level,
        subjects: formData.subjects,
        languages: formData.languages,
        bio: formData.bio,
        githubUrl: formData.githubUrl,
        linkedinUrl: formData.linkedinUrl,
        availability: formData.availability,
      }

      await apiService('/instructor/onboarding', {
        body: submission_data,
        method: 'POST',
      })

      setIsPending(false)

      toast.success('Instructor Onboarded successfully')

      router.push('/verification')
      //here we redirect to verification
    } catch (error) {
      setIsPending(false)
      if (error instanceof Error) {
        console.error('Error has been occurred', error)
        toast.error(error.message || 'Failed to complete onboarding')
      } else {
        toast.error('An unknown error occurred.')
      }
    }
  }

  return (
    <>
      <div className="flex flex-col items-center p-4 pt-[120px] text-black">
        {/* Fixed Header for Progress Bar */}
        <div className="fixed top-0 left-0 w-full z-50 backdrop-blur-md p-2">
          <div className="relative max-w-2xl mx-auto flex items-center justify-start">
            {/* Back Arrow */}
            {currentStep >= 0 && (
              <ChevronLeft
                size={26}
                onClick={handleBack}
                className="cursor-pointer text-black absolute left-0"
              />
            )}

            {/* Steps + Progress Bar in the center */}
            <div className="flex flex-col w-full px-8">
              {/* Here comes the step lables */}
              <div className="flex gap-4 justify-between w-full h-8 pt-3 ">
                {isMobile ? (
                  <div className="w-full text-center text-lg font-semibold text-blue-500">
                    {steps[currentStep]}
                  </div>
                ) : (
                  steps.map((step, index) => (
                    <div
                      key={index}
                      className={`flex-1 text-center text-sm font-medium ${
                        currentStep >= index ? 'text-blue-500' : 'text-gray-500'
                      }`}
                    >
                      {step}
                    </div>
                  ))
                )}
              </div>
              {/* Here comes the progress bar track */}
              <div className="h-2 bg-neutral-300 rounded-md mt-4 w-full border-black">
                {/* Blue progressbar fill */}
                <div
                  className="h-2 bg-blue-600 rounded-full transition-all duration-300"
                  style={{
                    width: `${(currentStep / (steps.length - 1)) * 100}%`,
                  }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Here comes the main container */}
        <div className="max-w-2xl w-full flex flex-col items-center mb-1">
          {/* Conditionally rendering the step component */}
          {currentStep === 0 && (
            <Verification formData={formData} setFormData={setFormData} />
          )}
          {currentStep === 1 && (
            <Expertise formData={formData} setFormData={setFormData} />
          )}
          {currentStep === 2 && (
            <Personalization formData={formData} setFormData={setFormData} />
          )}
          {currentStep === 3 && <Pricing formData={formData} />}
          {currentStep === 4 && (
            <Availability formData={formData} setFormData={setFormData} />
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="fixed bottom-1 right-0 w-full z-50 backdrop-blur-sm p-4 flex items-center justify-end  gap-2 bg-gray-100">
          {currentStep < steps.length - 1 ? (
            <Button
              disabled={!isStepValid()}
              onClick={handleNext}
              className="bg-sky-500 text-white font-bold py-2 px-6 rounded-lg hover:bg-blue-700 transition-colors hover:cursor-pointer mr-50 min-w-[100px]"
            >
              {isStepValid()
                ? 'Next'
                : `Complete Fields ${getStepValidationMessages().length}`}
            </Button>
          ) : (
            <Button
              disabled={!isStepValid() || isPending}
              onClick={handleSubmit}
              className="bg-green-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-green-700 transition-colors hover:cursor-pointer mr-50 min-w-[100px]"
            >
              {isPending ? (
                <>
                  <Loader2 size="20" className="animate-spin" />
                  Submitting...
                </>
              ) : !isStepValid() ? (
                `Complete Fields ${getStepValidationMessages().length}`
              ) : (
                'Submit'
              )}
            </Button>
          )}
        </div>
      </div>
    </>
  )
}
