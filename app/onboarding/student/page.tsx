'use client'

import { useState } from 'react'
import LevelSelector from '../components/levelSelector'
import SubjectSelector from '../components/subjectsSelector'
import { ProgramLevelId } from '@/types/types'
import Image from 'next/image'
import { toast } from 'sonner'
import { apiService } from '@/lib/api'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'

// ─── Step definitions (2 steps for student) ─────────────────────────────────
interface Step {
  id: number
  label: string
  title: string
}
const STEPS: Step[] = [
  { id: 1, label: 'Programme Level', title: 'Select Your Level' },
  { id: 2, label: 'Subjects', title: 'Choose Your Subjects' },
]

export default function StudentOnboarding() {
  const [currentStep, setCurrentStep] = useState(1)
  const [selectedLevel, setSelectedLevel] = useState<ProgramLevelId | null>(
    null
  )

  const progressPercentage = (currentStep / STEPS.length) * 100

  const handleLevelClick = async () => {
    if (!selectedLevel) {
      toast.error('Please select a level')
      return
    }

    const accessToken = localStorage.getItem('accessToken')
    if (!accessToken) {
      toast.error('No access token found. Please log in again.')
      return
    }

    try {
      await apiService('/user/update', {
        method: 'PATCH',
        body: { level: selectedLevel },
      })

      setCurrentStep(2)
    } catch (error) {
      console.error('Error ', error)
      if (error instanceof Error) {
        toast.error(error.message || 'Failed to update level')
      } else {
        toast.error('An unknown error occurred.')
      }
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
        {/* ── LEFT SIDEBAR — dark slate (hidden on mobile) ────────────── */}
        <div className="hidden lg:flex flex-col w-[280px] shrink-0 bg-slate-900 relative overflow-hidden">
          {/* Grid texture overlay */}
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

          {/* Soft glow */}
          <div className="absolute top-16 left-1/2 -translate-x-1/2 w-48 h-48 bg-blue-600 rounded-full opacity-10 blur-3xl pointer-events-none" />

          {/* Brand */}
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
                      >
                        <AnimatePresence mode="wait">
                          {isCompleted ? (
                            <motion.span
                              key="done"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0, scale: 0.5 }}
                              transition={{ duration: 0.12 }}
                            >
                              <Check className="w-5 h-5 text-emerald-400" />
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
        </div>

        {/* ── RIGHT CONTENT AREA ─────────────────────────────────────── */}
        <div className="w-full flex flex-col h-screen overflow-hidden">
          {/* Mobile tabs */}
          <div className="lg:hidden bg-white border-b border-gray-200 p-4 overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            <div className="flex gap-2 min-w-max">
              {STEPS.map(step => (
                <div
                  key={step.id}
                  className={`px-4 py-2 text-sm font-medium whitespace-nowrap rounded-full transition-all ${
                    currentStep === step.id
                      ? 'bg-blue-600 text-white'
                      : step.id < currentStep
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  {step.id < currentStep ? '✓ ' + step.label : step.label}
                </div>
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
            <div className="flex-1 overflow-y-auto px-4 sm:px-8 lg:px-14 py-8">
              <AnimatePresence mode="wait">
                <motion.div
                  key={`step-${currentStep}`}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.25 }}
                >
                  {currentStep === 1 && (
                    <LevelSelector
                      selectedLevel={selectedLevel}
                      setSelectedLevel={setSelectedLevel}
                      handleLevelClick={handleLevelClick}
                    />
                  )}
                  {currentStep === 2 && (
                    <SubjectSelector
                      selectedLevel={selectedLevel}
                      onBack={() => setCurrentStep(1)}
                    />
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Footer */}
            <div className="px-8 lg:px-14 py-6 border-t border-gray-100 flex items-center justify-between gap-4 flex-shrink-0">
              <Button
                onClick={() => {
                  if (currentStep > 1) setCurrentStep(currentStep - 1)
                }}
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

              {currentStep === 1 ? (
                <Button
                  onClick={handleLevelClick}
                  disabled={!selectedLevel}
                  className="px-6 py-2.5 flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white disabled:opacity-40 disabled:cursor-not-allowed rounded-xl shadow-md cursor-pointer"
                >
                  Continue
                  <ChevronRight className="w-4 h-4" />
                </Button>
              ) : (
                <span />
              )}
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}
