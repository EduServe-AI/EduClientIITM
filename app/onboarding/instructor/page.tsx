'use client'
import { Button } from '@/components/ui/button'
import { useIsMobile } from '@/hooks/use-mobile'
import { apiService } from '@/lib/api'
import { AvailabilityType, OnboardingFormData } from '@/types/types'
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'sonner'
import Verification from '../components/verification'
import Expertise from '../components/expertise'
import Personalization from '../components/personalization'
import Pricing from '../components/pricing'
import Availability from '../components/availability'

// ─── Hand-drawn tick ───────────────────────────────────────────────────────
function HandDrawnTick() {
  return (
    <svg
      width="26"
      height="26"
      viewBox="0 0 26 26"
      fill="none"
      style={{ overflow: 'visible' }}
    >
      <motion.circle
        cx="5.5"
        cy="13.5"
        r="1.4"
        fill="#16a34a"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: [0, 1.6, 1], opacity: [0, 1, 0.7] }}
        transition={{ duration: 0.16, ease: 'backOut', delay: 0.05 }}
      />
      <motion.path
        d="M5.5 13.5 C6.3 14.4 7.6 15.9 8.9 17.6"
        stroke="#16a34a"
        strokeWidth="2.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{
          pathLength: { duration: 0.2, ease: [0.4, 0, 0.2, 1], delay: 0.08 },
          opacity: { duration: 0.01, delay: 0.08 },
        }}
      />
      <motion.path
        d="M8.9 17.6 C11.8 14.0 16.0 9.6 20.8 6.2"
        stroke="#16a34a"
        strokeWidth="2.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{
          pathLength: {
            duration: 0.3,
            ease: [0.25, 0.46, 0.45, 0.94],
            delay: 0.28,
          },
          opacity: { duration: 0.01, delay: 0.28 },
        }}
      />
    </svg>
  )
}

// ─── Confetti burst ────────────────────────────────────────────────────────
const PARTICLE_COLORS = [
  '#34d399',
  '#60a5fa',
  '#fbbf24',
  '#f472b6',
  '#a78bfa',
  '#fb923c',
]
const PARTICLES = Array.from({ length: 16 }, (_, i) => {
  const angle = (i / 16) * 360 + (i % 2 === 0 ? 8 : -8)
  const dist = i % 2 === 0 ? 30 : 22
  const rad = (angle * Math.PI) / 180
  return {
    id: i,
    x: Math.cos(rad) * dist,
    y: Math.sin(rad) * dist,
    color: PARTICLE_COLORS[i % PARTICLE_COLORS.length],
    size: i % 3 === 0 ? 5 : i % 3 === 1 ? 4 : 3,
    delay: 0.02 + (i % 5) * 0.03,
  }
})
function ConfettiBurst() {
  return (
    <div
      className="absolute inset-0 pointer-events-none"
      style={{ overflow: 'visible' }}
    >
      {PARTICLES.map(p => (
        <motion.span
          key={p.id}
          className="absolute rounded-full"
          style={{
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
            top: '50%',
            left: '50%',
            marginTop: -p.size / 2,
            marginLeft: -p.size / 2,
            boxShadow: `0 0 4px 1px ${p.color}88`,
          }}
          initial={{ x: 0, y: 0, scale: 0, opacity: 1 }}
          animate={{
            x: p.x,
            y: p.y,
            scale: [0, 1.5, 1.2, 0],
            opacity: [1, 1, 0.8, 0],
          }}
          transition={{
            duration: 0.7,
            delay: p.delay,
            ease: [0.15, 0.85, 0.35, 1],
            times: [0, 0.3, 0.6, 1],
          }}
        />
      ))}
    </div>
  )
}
function CompletionBurst() {
  return (
    <>
      <ConfettiBurst />
      <HandDrawnTick />
    </>
  )
}

// ─── Peeking Student Character ─────────────────────────────────────────────
// The student peeks from the right edge of the sidebar.
// State: 'peeking' = head visible from right edge
//        'hiding'  = ducked down off screen (transitioning between steps)
//        'celebrating' = jumps up with arms raised when step completes
type StudentMood = 'peeking' | 'hiding' | 'celebrating'

function PeekingStudent({ mood }: { mood: StudentMood }) {
  return (
    <motion.div
      className="absolute bottom-24 -right-2 z-20 pointer-events-none select-none"
      animate={
        mood === 'peeking'
          ? { y: 0, x: 0, rotate: 0, opacity: 1 }
          : mood === 'hiding'
            ? { y: 90, x: 0, rotate: 0, opacity: 0 }
            : { y: -18, x: 0, rotate: [-2, 2, -2, 0], opacity: 1 }
      }
      transition={
        mood === 'hiding'
          ? { duration: 0.3, ease: [0.4, 0, 1, 1] }
          : mood === 'celebrating'
            ? {
                duration: 0.5,
                ease: 'backOut',
                rotate: { repeat: 1, duration: 0.2 },
              }
            : { duration: 0.45, ease: [0, 0, 0.2, 1.4] }
      }
    >
      <svg
        width="56"
        height="80"
        viewBox="0 0 56 80"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Body */}
        <rect x="14" y="44" width="28" height="26" rx="6" fill="#3b82f6" />
        {/* Collar / shirt detail */}
        <path
          d="M22 44 L28 52 L34 44"
          stroke="white"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />

        {/* Left arm */}
        <motion.g
          animate={
            mood === 'celebrating'
              ? { rotate: [-60, -80, -60], originX: '20px', originY: '50px' }
              : { rotate: 0 }
          }
          transition={{
            duration: 0.4,
            ease: 'easeInOut',
            repeat: mood === 'celebrating' ? 2 : 0,
          }}
        >
          <rect
            x="6"
            y="46"
            width="10"
            height="5"
            rx="2.5"
            fill="#3b82f6"
            transform="rotate(-20 6 46)"
          />
          {/* Left hand */}
          <circle cx="5" cy="57" r="4" fill="#FBBF8A" />
        </motion.g>

        {/* Right arm */}
        <motion.g
          animate={
            mood === 'celebrating'
              ? { rotate: [60, 80, 60], originX: '36px', originY: '50px' }
              : { rotate: 0 }
          }
          transition={{
            duration: 0.4,
            ease: 'easeInOut',
            repeat: mood === 'celebrating' ? 2 : 0,
          }}
        >
          <rect
            x="40"
            y="46"
            width="10"
            height="5"
            rx="2.5"
            fill="#3b82f6"
            transform="rotate(20 40 46)"
          />
          {/* Right hand */}
          <circle cx="51" cy="57" r="4" fill="#FBBF8A" />
        </motion.g>

        {/* Neck */}
        <rect x="23" y="38" width="10" height="8" rx="4" fill="#FBBF8A" />

        {/* Head */}
        <circle cx="28" cy="28" r="16" fill="#FBBF8A" />

        {/* Hair */}
        <path d="M12 24 C12 14 20 10 28 10 C36 10 44 14 44 24" fill="#1e293b" />
        <path
          d="M12 22 C10 20 11 16 13 15"
          stroke="#1e293b"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <path
          d="M44 22 C46 20 45 16 43 15"
          stroke="#1e293b"
          strokeWidth="3"
          strokeLinecap="round"
        />

        {/* Eyes */}
        <motion.g
          animate={
            mood === 'celebrating'
              ? { scaleY: [1, 0.1, 1], originY: '27px' }
              : { scaleY: 1 }
          }
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <ellipse cx="22" cy="27" rx="2.5" ry="3" fill="#1e293b" />
          <ellipse cx="34" cy="27" rx="2.5" ry="3" fill="#1e293b" />
          {/* Eye shine */}
          <circle cx="23.2" cy="25.8" r="0.9" fill="white" />
          <circle cx="35.2" cy="25.8" r="0.9" fill="white" />
        </motion.g>

        {/* Eyebrows */}
        <path
          d="M19 22.5 Q22 21 25 22.5"
          stroke="#1e293b"
          strokeWidth="1.5"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M31 22.5 Q34 21 37 22.5"
          stroke="#1e293b"
          strokeWidth="1.5"
          strokeLinecap="round"
          fill="none"
        />

        {/* Mouth — smile when celebrating, neutral when peeking */}
        <motion.path
          animate={
            mood === 'celebrating'
              ? { d: 'M22 33 Q28 39 34 33', opacity: 1 }
              : { d: 'M23 33 Q28 36 33 33', opacity: 1 }
          }
          stroke="#c2410c"
          strokeWidth="1.8"
          strokeLinecap="round"
          fill="none"
          transition={{ duration: 0.25 }}
        />

        {/* Blush cheeks when celebrating */}
        <AnimatePresence>
          {mood === 'celebrating' && (
            <>
              <motion.ellipse
                cx="17"
                cy="31"
                rx="4"
                ry="2.5"
                fill="#fca5a5"
                opacity="0.6"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 0.6, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              />
              <motion.ellipse
                cx="39"
                cy="31"
                rx="4"
                ry="2.5"
                fill="#fca5a5"
                opacity="0.6"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 0.6, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              />
            </>
          )}
        </AnimatePresence>

        {/* Speech bubble when celebrating */}
        <AnimatePresence>
          {mood === 'celebrating' && (
            <motion.g
              initial={{ opacity: 0, scale: 0, x: 10, y: -5 }}
              animate={{ opacity: 1, scale: 1, x: 0, y: 0 }}
              exit={{ opacity: 0, scale: 0 }}
              transition={{ duration: 0.3, delay: 0.2, ease: 'backOut' }}
            >
              <rect
                x="30"
                y="-12"
                width="28"
                height="16"
                rx="6"
                fill="white"
                stroke="#e2e8f0"
                strokeWidth="1"
              />
              <path
                d="M34 4 L30 8 L38 4"
                fill="white"
                stroke="#e2e8f0"
                strokeWidth="1"
              />
              <text x="33" y="-1" fontSize="9" fontWeight="bold" fill="#3b82f6">
                ✓ Done!
              </text>
            </motion.g>
          )}
        </AnimatePresence>
      </svg>
    </motion.div>
  )
}

// ─── Types & constants ─────────────────────────────────────────────────────
interface Step {
  id: number
  label: string
  title: string
}
const STEPS: Step[] = [
  { id: 1, label: 'Verification', title: 'Programme Verification' },
  { id: 2, label: 'Expertise', title: 'Subjects & Languages' },
  { id: 3, label: 'Personalization', title: 'Profile Setup' },
  { id: 4, label: 'Pricing', title: 'Pricing Information' },
  { id: 5, label: 'Availability', title: 'Weekly Schedule' },
]
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

// ─── Main component ─────────────────────────────────────────────────────────
export default function InstructorOnboarding() {
  const [currentStep, setCurrentStep] = useState(1)
  const isMobile = useIsMobile()
  const router = useRouter()
  const [isPending, setIsPending] = useState(false)
  const [studentMood, setStudentMood] = useState<StudentMood>('peeking')

  const [formData, setFormData] = useState<OnboardingFormData>({
    iitmProfileUrl: '',
    cgpa: 0,
    level: null,
    subjects: [],
    languages: [],
    profilePicture: null,
    about: '',
    bio: '',
    githubUrl: '',
    linkedinUrl: '',
    availability: initialAvailability(),
  })

  const progressPercentage = (currentStep / STEPS.length) * 100

  // Student reacts when step changes
  const advanceStep = (next: number) => {
    // 1. student celebrates
    setStudentMood('celebrating')
    setTimeout(() => {
      // 2. student hides
      setStudentMood('hiding')
      setTimeout(() => {
        // 3. step changes
        setCurrentStep(next)
        setTimeout(() => {
          // 4. student peeks back
          setStudentMood('peeking')
        }, 300)
      }, 350)
    }, 900)
  }

  const handleNext = () => {
    if (currentStep < STEPS.length) advanceStep(currentStep + 1)
  }
  const handlePrevious = () => {
    if (currentStep > 1) {
      setStudentMood('hiding')
      setTimeout(() => {
        setCurrentStep(currentStep - 1)
        setTimeout(() => setStudentMood('peeking'), 300)
      }, 300)
    }
  }

  const getStepValidationMessages = (): string[] => {
    if (currentStep === 1) return getVerificationValidationMessages()
    if (currentStep === 2) return getExpertiseValidationMessages()
    if (currentStep === 3) return getPersonalizationValidationMessages()
    if (currentStep === 5) return getAvailabilityValidationMessages()
    return []
  }

  const isStepValid = (): boolean => {
    if (currentStep === 1) {
      if (!formData.iitmProfileUrl || !formData.cgpa || !formData.level)
        return false
    }
    if (currentStep === 2) {
      if (formData.languages.length === 0 || formData.subjects.length === 0)
        return false
    }
    if (currentStep === 3) {
      if (!formData.profilePicture || !formData.bio) return false
    }
    if (currentStep === 5) {
      const hasEnabledDay = Object.values(formData.availability).some(
        d => d.isEnabled
      )
      const hasValidSlots = Object.entries(formData.availability).every(
        ([, day]) => {
          if (!day.isEnabled) return true
          return day.slots.every(slot => {
            const from = new Date(`2000/01/01 ${slot.from}`)
            const to = new Date(`2000/01/01 ${slot.to}`)
            return from < to
          })
        }
      )
      return hasEnabledDay && hasValidSlots
    }
    return true
  }

  const getVerificationValidationMessages = (): string[] => {
    const msgs: string[] = []
    if (!formData.iitmProfileUrl)
      msgs.push('IITM Public Profile Url is required')
    if (!formData.cgpa || formData.cgpa <= 0)
      msgs.push('Valid CGPA is required')
    if (!formData.level) msgs.push('Current Level is required')
    return msgs
  }
  const getExpertiseValidationMessages = (): string[] => {
    const msgs: string[] = []
    if (formData.subjects.length === 0)
      msgs.push('Should select at least one subject')
    if (formData.languages.length === 0)
      msgs.push('Should be proficient with at least one language')
    return msgs
  }
  const getPersonalizationValidationMessages = (): string[] => {
    const msgs: string[] = []
    if (!formData.bio || formData.bio.trim() === '')
      msgs.push('Valid Bio should be provided')
    if (!formData.profilePicture) msgs.push('Profile picture required')
    return msgs
  }
  const getAvailabilityValidationMessages = (): string[] => {
    const msgs: string[] = []
    const hasEnabledDay = Object.values(formData.availability).some(
      d => d.isEnabled
    )
    if (!hasEnabledDay) {
      msgs.push('Please enable at least one day')
      return msgs
    }
    Object.entries(formData.availability).forEach(([day, schedule]) => {
      if (schedule.isEnabled) {
        if (schedule.slots.length === 0)
          msgs.push(`${day} is enabled but has no time slots`)
        schedule.slots.forEach((slot, i) => {
          const from = new Date(`2000/01/01 ${slot.from}`)
          const to = new Date(`2000/01/01 ${slot.to}`)
          if (from >= to)
            msgs.push(
              `${day}: Slot #${i + 1} - End time must be after start time`
            )
          if ((to.getTime() - from.getTime()) / 60000 < 30)
            msgs.push(
              `${day}: Slot #${i + 1} - Duration must be at least 30 minutes`
            )
        })
      }
    })
    return msgs
  }

  const handleSubmit = async () => {
    setStudentMood('celebrating')
    setIsPending(true)
    try {
      await apiService('/instructor/onboarding', {
        body: {
          iitmProfileUrl: formData.iitmProfileUrl,
          cgpa: formData.cgpa,
          level: formData.level,
          subjects: formData.subjects,
          languages: formData.languages,
          bio: formData.bio,
          githubUrl: formData.githubUrl,
          linkedinUrl: formData.linkedinUrl,
          availability: formData.availability,
        },
        method: 'POST',
      })
      setIsPending(false)
      toast.success('Instructor Onboarded successfully')
      router.push('/verification')
    } catch (error) {
      setIsPending(false)
      setStudentMood('peeking')
      if (error instanceof Error)
        toast.error(error.message || 'Failed to complete onboarding')
      else toast.error('An unknown error occurred.')
    }
  }

  return (
    <div className="h-screen bg-slate-50 flex items-stretch">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="w-full flex flex-col lg:flex-row"
      >
        {/* ── LEFT SIDEBAR — professional dark slate ────────────────────── */}
        <div className="hidden lg:flex flex-col w-[280px] shrink-0 bg-slate-900 relative overflow-hidden">
          {/* Subtle grid texture overlay */}
          <div
            className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage:
                'radial-gradient(circle, #fff 1px, transparent 1px)',
              backgroundSize: '24px 24px',
            }}
          />

          {/* Top accent line */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-indigo-400 to-cyan-400" />

          {/* Soft glow orb */}
          <div className="absolute top-16 left-1/2 -translate-x-1/2 w-48 h-48 bg-blue-600 rounded-full opacity-10 blur-3xl pointer-events-none" />

          {/* Brand / logo area */}
          <div className="relative z-10 px-8 pt-8 pb-6 border-b border-white/5">
            <div className="flex items-center justify-center">
              <Image
                src="/EDU_WM2.png"
                alt="EduServe Logo"
                width={180}
                height={50}
                className="object-contain brightness-0 invert opacity-90"
              />
            </div>
          </div>

          {/* Steps */}
          <div className="relative z-10 flex-1 px-8 py-8 overflow-hidden">
            <p className="text-slate-500 text-[10px] font-semibold uppercase tracking-widest mb-6">
              Your Progress
            </p>

            <div className="flex flex-col gap-1">
              {STEPS.map((step, index) => {
                const isActive = step.id === currentStep
                const isCompleted = step.id < currentStep

                return (
                  <motion.div
                    key={step.id}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.08 }}
                    className={`relative flex items-center gap-3.5 px-3 py-3 rounded-xl transition-all duration-200 ${
                      isActive ? 'bg-white/8' : 'hover:bg-white/4'
                    }`}
                  >
                    {/* Active left accent bar */}
                    {isActive && (
                      <motion.div
                        layoutId="activeBar"
                        className="absolute left-0 top-2 bottom-2 w-0.5 rounded-full bg-gradient-to-b from-blue-400 to-cyan-400"
                      />
                    )}

                    {/* Step circle */}
                    <div
                      className="relative flex-shrink-0 w-10 h-10"
                      style={{ overflow: 'visible' }}
                    >
                      <motion.div
                        animate={
                          isCompleted
                            ? { scale: [1, 1.15, 1] }
                            : isActive
                              ? { scale: 1.05 }
                              : { scale: 1 }
                        }
                        transition={{ duration: 0.35, ease: 'easeOut' }}
                        className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ${
                          isActive
                            ? 'bg-gradient-to-br from-blue-500 to-cyan-400 text-white shadow-lg shadow-blue-500/40'
                            : isCompleted
                              ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                              : 'bg-white/5 text-slate-500 border border-white/8'
                        }`}
                        style={{ position: 'relative', overflow: 'visible' }}
                      >
                        <AnimatePresence mode="wait">
                          {isCompleted ? (
                            <motion.span
                              key="done"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0, scale: 0.5 }}
                              transition={{ duration: 0.12 }}
                              className="relative flex items-center justify-center w-full h-full"
                              style={{ overflow: 'visible' }}
                            >
                              <CompletionBurst />
                            </motion.span>
                          ) : (
                            <motion.span
                              key="num"
                              initial={{ opacity: 0, scale: 0.6 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.6 }}
                              transition={{ duration: 0.2, ease: 'backOut' }}
                            >
                              {step.id}
                            </motion.span>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    </div>

                    {/* Label */}
                    <div className="overflow-hidden flex-1 min-w-0">
                      <AnimatePresence mode="wait">
                        {!isCompleted ? (
                          <motion.div
                            key={`label-${step.id}`}
                            initial={
                              isActive
                                ? { opacity: 0, x: -16 }
                                : { opacity: 1, x: 0 }
                            }
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -40 }}
                            transition={{
                              duration: 0.4,
                              ease: [0.4, 0, 0.2, 1],
                            }}
                          >
                            <p
                              className={`text-sm font-semibold truncate ${isActive ? 'text-white' : 'text-slate-400'}`}
                            >
                              {step.label}
                            </p>
                            {isActive && (
                              <motion.p
                                initial={{ opacity: 0, y: 3 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.15, duration: 0.25 }}
                                className="text-xs text-slate-400 mt-0.5 truncate"
                              >
                                {step.title}
                              </motion.p>
                            )}
                          </motion.div>
                        ) : (
                          <motion.p
                            key={`done-label-${step.id}`}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-xs font-medium text-emerald-400/70 truncate"
                          >
                            Completed
                          </motion.p>
                        )}
                      </AnimatePresence>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </div>

          {/* Progress bar */}
          <div className="relative z-10 px-8 pb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-slate-500">
                Overall
              </span>
              <motion.span
                key={Math.round(progressPercentage)}
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-xs font-bold text-slate-300 tabular-nums"
              >
                {Math.round(progressPercentage)}%
              </motion.span>
            </div>
            <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
              <motion.div
                animate={{ width: `${progressPercentage}%` }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                className="h-full bg-gradient-to-r from-blue-500 via-indigo-400 to-cyan-400 rounded-full"
              />
            </div>
          </div>

          {/* ── Peeking student character — lives at right edge of sidebar ── */}
          {/* <PeekingStudent mood={studentMood} /> */}
        </div>

        {/* ── RIGHT CONTENT AREA ────────────────────────────────────────── */}
        <div className="w-full flex flex-col h-screen overflow-hidden">
          {/* Mobile tabs */}
          <div className="lg:hidden bg-white border-b border-gray-200 p-4 overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            <div className="flex gap-2 min-w-max">
              {STEPS.map(step => (
                <button
                  key={step.id}
                  onClick={() => setCurrentStep(step.id)}
                  className={`px-4 py-2 text-sm font-medium whitespace-nowrap rounded-full transition-all ${
                    currentStep === step.id
                      ? 'bg-blue-600 text-white'
                      : step.id < currentStep
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  {step.id < currentStep ? '✓' : step.label}
                </button>
              ))}
            </div>
          </div>

          {/* Main card */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.1 }}
            className="bg-white shadow-2xl flex flex-col flex-1 min-h-0"
          >
            {/* Header */}
            <div className="px-8 lg:px-14 py-7 border-b border-gray-100 flex-shrink-0 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
                    Step {currentStep} of {STEPS.length}
                  </span>
                </div>
                <h2 className="text-2xl lg:text-3xl font-bold text-gray-900">
                  {STEPS[currentStep - 1]?.title}
                </h2>
                <motion.div
                  key={currentStep}
                  initial={{ width: 0 }}
                  animate={{ width: 56 }}
                  transition={{ duration: 0.4, delay: 0.1, ease: 'easeOut' }}
                  className="h-1 mt-2.5 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full"
                />
              </div>

              {/* Step dot indicators (desktop) */}
              <div className="hidden lg:flex items-center gap-1.5">
                {STEPS.map(step => (
                  <motion.div
                    key={step.id}
                    animate={{
                      width: step.id === currentStep ? 24 : 8,
                      backgroundColor:
                        step.id < currentStep
                          ? '#10b981'
                          : step.id === currentStep
                            ? '#3b82f6'
                            : '#e2e8f0',
                    }}
                    transition={{ duration: 0.3 }}
                    className="h-2 rounded-full"
                  />
                ))}
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto px-8 lg:px-14 py-8">
              <AnimatePresence mode="wait">
                <motion.div
                  key={`step-${currentStep}`}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.25 }}
                >
                  {currentStep === 1 && (
                    <Verification
                      formData={formData}
                      setFormData={setFormData}
                    />
                  )}
                  {currentStep === 2 && (
                    <Expertise formData={formData} setFormData={setFormData} />
                  )}
                  {currentStep === 3 && (
                    <Personalization
                      formData={formData}
                      setFormData={setFormData}
                    />
                  )}
                  {currentStep === 4 && <Pricing formData={formData} />}
                  {currentStep === 5 && (
                    <Availability
                      formData={formData}
                      setFormData={setFormData}
                    />
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Footer */}
            <div className="px-8 lg:px-14 py-6 border-t border-gray-100 flex items-center justify-between gap-4 flex-shrink-0">
              <Button
                onClick={handlePrevious}
                disabled={currentStep === 1}
                variant="outline"
                className="px-5 py-2.5 flex items-center gap-2 border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed rounded-xl"
              >
                <ChevronLeft className="w-4 h-4" />
                Back
              </Button>

              {/* Mobile progress dots */}
              <div className="lg:hidden flex items-center gap-1">
                {STEPS.map(step => (
                  <div
                    key={step.id}
                    className={`h-1.5 rounded-full transition-all ${step.id <= currentStep ? 'w-6 bg-blue-600' : 'w-1.5 bg-gray-200'}`}
                  />
                ))}
              </div>

              {currentStep < STEPS.length ? (
                <Button
                  onClick={handleNext}
                  disabled={!isStepValid()}
                  className="px-6 py-2.5 flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white disabled:opacity-40 disabled:cursor-not-allowed rounded-xl shadow-md"
                >
                  {!isStepValid() ? (
                    <span className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                      {getStepValidationMessages().length} field
                      {getStepValidationMessages().length !== 1 ? 's' : ''}{' '}
                      remaining
                    </span>
                  ) : (
                    'Continue'
                  )}
                  <ChevronRight className="w-4 h-4" />
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  disabled={!isStepValid() || isPending}
                  className="px-6 py-2.5 flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white disabled:opacity-40 disabled:cursor-not-allowed rounded-xl shadow-md shadow-emerald-500/20"
                >
                  {isPending ? (
                    <>
                      <Loader2 size="16" className="animate-spin" />{' '}
                      Submitting...
                    </>
                  ) : !isStepValid() ? (
                    'Continue'
                  ) : (
                    '🎉 Submit Application'
                  )}
                </Button>
              )}
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}
