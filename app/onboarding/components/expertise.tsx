'use client'

import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { Languages as Medium } from '@/constants/languages'
import { subjectNames } from '@/lib/utils'
import type { OnboardingFormData } from '@/types/types'
import { Languages, Subjects } from '@/types/types'
import { AnimatePresence, motion } from 'framer-motion'
import {
  BookOpen,
  Check,
  GraduationCap,
  InfoIcon,
  Languages as LangIcon,
  Search,
  X,
} from 'lucide-react'
import { useMemo, useRef, useState } from 'react'
import { toast } from 'sonner'

interface ExpertiseProps {
  formData: OnboardingFormData
  setFormData: React.Dispatch<React.SetStateAction<OnboardingFormData>>
}

const foundation_subjects = subjectNames('foundation')
const diploma_subjects = subjectNames('diploma')
const bsc_subjects = subjectNames('bsc')

const LEVEL_CONFIG = {
  foundation: {
    label: 'Foundation',
    color: 'blue',
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    badge: 'bg-blue-100 text-blue-700 border-blue-200',
    activeBg: 'bg-blue-600',
    dot: 'bg-blue-400',
    ring: 'ring-blue-400',
    tabActive: 'bg-blue-600 text-white shadow-blue-200',
    tabInactive: 'text-blue-600 hover:bg-blue-50',
  },
  diploma: {
    label: 'Diploma',
    color: 'emerald',
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
    badge: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    activeBg: 'bg-emerald-600',
    dot: 'bg-emerald-400',
    ring: 'ring-emerald-400',
    tabActive: 'bg-emerald-600 text-white shadow-emerald-200',
    tabInactive: 'text-emerald-600 hover:bg-emerald-50',
  },
  bsc: {
    label: 'BSc',
    color: 'violet',
    bg: 'bg-violet-50',
    border: 'border-violet-200',
    badge: 'bg-violet-100 text-violet-700 border-violet-200',
    activeBg: 'bg-violet-600',
    dot: 'bg-violet-400',
    ring: 'ring-violet-400',
    tabActive: 'bg-violet-600 text-white shadow-violet-200',
    tabInactive: 'text-violet-600 hover:bg-violet-50',
  },
} as const

type LevelKey = keyof typeof LEVEL_CONFIG

export default function Expertise({ formData, setFormData }: ExpertiseProps) {
  const [search, setSearch] = useState('')
  const [activeTab, setActiveTab] = useState<LevelKey | 'all'>('all')
  const searchRef = useRef<HTMLInputElement>(null)

  const allSubjectsGrouped = useMemo(() => {
    switch (formData.level) {
      case 'foundation':
        return { foundation: foundation_subjects, diploma: [], bsc: [] }
      case 'diploma':
        return {
          foundation: foundation_subjects,
          diploma: diploma_subjects,
          bsc: [],
        }
      case 'bsc':
      case 'bs':
        return {
          foundation: foundation_subjects,
          diploma: diploma_subjects,
          bsc: bsc_subjects,
        }
      default:
        return { foundation: [], diploma: [], bsc: [] }
    }
  }, [formData.level])

  const availableTabs = useMemo(() => {
    const tabs: (LevelKey | 'all')[] = ['all']
    if (allSubjectsGrouped.foundation.length) tabs.push('foundation')
    if (allSubjectsGrouped.diploma.length) tabs.push('diploma')
    if (allSubjectsGrouped.bsc.length) tabs.push('bsc')
    return tabs
  }, [allSubjectsGrouped])

  const filteredSubjects = useMemo(() => {
    const q = search.toLowerCase().trim()
    const groups: { level: LevelKey; subjects: Subjects[] }[] = []

    const addGroup = (level: LevelKey, list: string[]) => {
      if (!list.length) return
      if (activeTab !== 'all' && activeTab !== level) return
      const filtered = q ? list.filter(s => s.toLowerCase().includes(q)) : list
      if (filtered.length)
        groups.push({ level, subjects: filtered as Subjects[] })
    }

    addGroup('foundation', allSubjectsGrouped.foundation)
    addGroup('diploma', allSubjectsGrouped.diploma)
    addGroup('bsc', allSubjectsGrouped.bsc)

    return groups
  }, [allSubjectsGrouped, search, activeTab])

  const totalFiltered = filteredSubjects.reduce(
    (acc, g) => acc + g.subjects.length,
    0
  )

  const handleSubjectSelect = (subject: Subjects) => {
    if (formData.subjects.includes(subject)) {
      setFormData({
        ...formData,
        subjects: formData.subjects.filter(s => s !== subject),
      })
    } else {
      if (formData.subjects.length >= 5) {
        toast.error("You can't select more than 5 subjects")
        return
      }
      setFormData({ ...formData, subjects: [...formData.subjects, subject] })
    }
  }

  const handleLanguageSelect = (language: Languages) => {
    if (!formData.languages.includes(language)) {
      setFormData({ ...formData, languages: [...formData.languages, language] })
    } else {
      setFormData({
        ...formData,
        languages: formData.languages.filter(l => l !== language),
      })
    }
  }

  return (
    <div className="w-full space-y-8">
      {/* ── SUBJECTS SECTION ─────────────────────────────────────────── */}
      <div className="space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-100 flex items-center justify-center">
              <GraduationCap size={18} className="text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 leading-tight">
                Subjects
              </h3>
              <p className="text-xs text-gray-400">
                Pick up to 5 you&apos;re expert in
              </p>
            </div>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <InfoIcon
                    size={15}
                    className="text-gray-300 cursor-pointer hover:text-gray-400 transition-colors"
                  />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-sm">
                    Subjects are shown based on your programme level
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          {/* Counter pill */}
          <div
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
              formData.subjects.length === 5
                ? 'bg-amber-100 text-amber-700'
                : formData.subjects.length > 0
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-gray-100 text-gray-400'
            }`}
          >
            <span>{formData.subjects.length}</span>
            <span className="opacity-60">/</span>
            <span>5</span>
            <span className="opacity-60 ml-0.5">selected</span>
          </div>
        </div>

        {/* Selected subjects chips */}
        <AnimatePresence>
          {formData.subjects.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="flex flex-wrap gap-2 p-3 bg-gray-50 rounded-xl border border-gray-100">
                {formData.subjects.map(subject => {
                  // find which level this subject belongs to
                  const level: LevelKey = allSubjectsGrouped.bsc.includes(
                    subject
                  )
                    ? 'bsc'
                    : allSubjectsGrouped.diploma.includes(subject)
                      ? 'diploma'
                      : 'foundation'
                  const cfg = LEVEL_CONFIG[level]
                  return (
                    <motion.button
                      key={subject}
                      layout
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.8, opacity: 0 }}
                      onClick={() => handleSubjectSelect(subject)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border ${cfg.badge} hover:opacity-80 transition-opacity group`}
                    >
                      <span>{subject}</span>
                      <X
                        size={11}
                        className="opacity-50 group-hover:opacity-100 transition-opacity"
                      />
                    </motion.button>
                  )
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Search + Tabs row */}
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search input */}
          <div className="relative flex-1">
            <Search
              size={15}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
            />
            <input
              ref={searchRef}
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search subjects…"
              className="w-full pl-9 pr-9 py-2.5 text-sm bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent placeholder-gray-400 text-gray-800 transition-all"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Level filter tabs */}
          {availableTabs.length > 2 && (
            <div className="flex gap-1.5 p-1 bg-gray-100 rounded-xl shrink-0">
              {availableTabs.map(tab => {
                const isActive = activeTab === tab
                const cfg = tab !== 'all' ? LEVEL_CONFIG[tab] : null
                return (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all capitalize ${
                      isActive
                        ? cfg
                          ? `${cfg.tabActive} shadow-sm`
                          : 'bg-white text-gray-800 shadow-sm'
                        : cfg
                          ? `${cfg.tabInactive}`
                          : 'text-gray-500 hover:bg-white/60'
                    }`}
                  >
                    {tab === 'all' ? 'All' : cfg?.label}
                  </button>
                )
              })}
            </div>
          )}
        </div>

        {/* Subject grid */}
        <div className="relative">
          {totalFiltered === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center mb-3">
                <BookOpen size={20} className="text-gray-400" />
              </div>
              <p className="text-sm font-medium text-gray-500">
                No subjects found
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Try a different search term
              </p>
            </div>
          ) : (
            <div className="space-y-5 max-h-72 overflow-y-auto pr-4 scrollbar-thin">
              {filteredSubjects.map(({ level, subjects }) => {
                const cfg = LEVEL_CONFIG[level]
                return (
                  <div key={level}>
                    {/* Group header */}
                    {activeTab === 'all' && filteredSubjects.length > 1 && (
                      <div className="flex pl-2 items-center gap-2 mb-2.5">
                        <span className={`w-2 h-2 rounded-full ${cfg.dot}`} />
                        <span
                          className={`text-xs font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full border ${cfg.badge}`}
                        >
                          {cfg.label}
                        </span>
                        <span className="text-xs text-gray-400">
                          {subjects.length} subjects
                        </span>
                      </div>
                    )}

                    {/* Subject chips — inline flow layout */}
                    <div className="flex flex-wrap gap-2">
                      {subjects.map(subject => {
                        const isSelected = formData.subjects.includes(subject)
                        const isMaxed =
                          !isSelected && formData.subjects.length >= 5
                        return (
                          <motion.button
                            key={subject}
                            layout
                            whileHover={!isMaxed ? { scale: 1.03 } : {}}
                            whileTap={!isMaxed ? { scale: 0.97 } : {}}
                            onClick={() => handleSubjectSelect(subject)}
                            disabled={isMaxed}
                            className={`
                              relative flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-medium
                              border transition-all duration-150 select-none
                              ${
                                isSelected
                                  ? `${cfg.bg} ${cfg.border} text-gray-800 ring-2 ${cfg.ring} shadow-sm`
                                  : isMaxed
                                    ? 'bg-gray-50 border-gray-200 text-gray-300 cursor-not-allowed'
                                    : `bg-white border-gray-200 text-gray-700 hover:${cfg.bg} hover:${cfg.border} hover:text-gray-900`
                              }
                            `}
                          >
                            <AnimatePresence>
                              {isSelected && (
                                <motion.span
                                  initial={{
                                    scale: 0,
                                    width: 0,
                                    marginRight: 0,
                                  }}
                                  animate={{
                                    scale: 1,
                                    width: 14,
                                    marginRight: 2,
                                  }}
                                  exit={{ scale: 0, width: 0, marginRight: 0 }}
                                  className="overflow-hidden"
                                >
                                  <Check
                                    size={12}
                                    className="text-green-600 shrink-0"
                                  />
                                </motion.span>
                              )}
                            </AnimatePresence>
                            {subject}
                          </motion.button>
                        )
                      })}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* ── DIVIDER ───────────────────────────────────────────────────── */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-100" />
        </div>
      </div>

      {/* ── LANGUAGES SECTION ─────────────────────────────────────────── */}
      <div className="space-y-5">
        {/* Header */}
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-green-100 flex items-center justify-center">
            <LangIcon size={18} className="text-green-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 leading-tight">
              Languages
            </h3>
            <p className="text-xs text-gray-400">
              Select languages you can teach in
            </p>
          </div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <InfoIcon
                  size={15}
                  className="text-gray-300 cursor-pointer hover:text-gray-400 transition-colors"
                />
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-sm">
                  Select the languages you are proficient in
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        {/* Language toggle buttons */}
        <div className="flex flex-wrap gap-2.5">
          {Medium.map(language => {
            const isSelected = formData.languages.includes(
              language as Languages
            )
            return (
              <motion.button
                key={language}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => handleLanguageSelect(language as Languages)}
                className={`
                  flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium
                  border transition-all duration-150
                  ${
                    isSelected
                      ? 'bg-green-600 border-green-600 text-white shadow-md shadow-green-100'
                      : 'bg-white border-gray-200 text-gray-700 hover:border-green-300 hover:bg-green-50 hover:text-green-700'
                  }
                `}
              >
                <AnimatePresence>
                  {isSelected && (
                    <motion.span
                      initial={{ scale: 0, width: 0 }}
                      animate={{ scale: 1, width: 14 }}
                      exit={{ scale: 0, width: 0 }}
                      className="overflow-hidden"
                    >
                      <Check size={13} className="shrink-0" />
                    </motion.span>
                  )}
                </AnimatePresence>
                {language}
              </motion.button>
            )
          })}
        </div>

        {/* Selected languages summary */}
        <AnimatePresence>
          {formData.languages.length > 0 && (
            <motion.p
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              className="text-xs text-green-600 font-medium"
            >
              ✓ Teaching in {formData.languages.join(', ')}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
