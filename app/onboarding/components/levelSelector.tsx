import { PROGRAM_LEVELS } from '@/constants/levels'
import { ProgramLevelId } from '@/types/types'
import { motion } from 'framer-motion'
import Image from 'next/image'

interface LevelSelectorProps {
  selectedLevel: ProgramLevelId | null
  setSelectedLevel: (value: ProgramLevelId) => void
  handleLevelClick: () => void
}

// Map each level to its image and border accent
const levelImages: Record<
  ProgramLevelId,
  { src: string; border: string; selectedBorder: string; selectedBg: string }
> = {
  foundation: {
    src: '/level-foundation-1.png',
    border: 'border-gray-200',
    selectedBorder: 'border-green-500 ring-2 ring-green-400/30',
    selectedBg: 'bg-green-50/50',
  },
  diploma: {
    src: '/level-diploma.png',
    border: 'border-gray-200',
    selectedBorder: 'border-blue-500 ring-2 ring-blue-400/30',
    selectedBg: 'bg-blue-50/50',
  },
  bsc: {
    src: '/level-bsc.png',
    border: 'border-gray-200',
    selectedBorder: 'border-indigo-500 ring-2 ring-indigo-400/30',
    selectedBg: 'bg-indigo-50/50',
  },
  bs: {
    src: '/level-bs.png',
    border: 'border-gray-200',
    selectedBorder: 'border-amber-500 ring-2 ring-amber-400/30',
    selectedBg: 'bg-amber-50/50',
  },
}

// color and icon for each level (used by subjectsSelector)
export const getLevelProperties = (level: ProgramLevelId) => {
  switch (level) {
    case 'foundation':
      return {
        color: 'bg-violet-100 hover:bg-violet-200 border-violet-300',
        hover: ' hover:bg-violet-200',
        selectedColor: 'border-violet-500',
        icon: null,
      }
    case 'diploma':
      return {
        color: 'bg-sky-100 hover:bg-sky-200 border-sky-300',
        hover: ' hover:bg-sky-200',
        selectedColor: 'border-sky-500',
        icon: null,
      }
    case 'bsc':
      return {
        color: 'bg-emerald-100 hover:bg-emerald-200 border-emerald-300',
        hover: ' hover:bg-emerald-200',
        selectedColor: 'border-emerald-500',
        icon: null,
      }
    case 'bs':
      return {
        color: 'bg-amber-100 hover:bg-amber-200 border-amber-300',
        hover: ' hover:bg-amber-200',
        selectedColor: 'border-amber-500',
        icon: null,
      }
    default:
      return {
        color: 'bg-gray-100 hover:bg-gray-200 border-gray-300',
        hover: ' hover:bg-gray-200',
        selectedColor: 'border-gray-500',
        icon: null,
      }
  }
}

export default function LevelSelector({
  selectedLevel,
  setSelectedLevel,
}: LevelSelectorProps) {
  return (
    <div className="w-full">
      <p className="text-gray-500 text-sm mb-4">
        Choose your current programme level to get started with the right
        subjects.
      </p>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {PROGRAM_LEVELS.map((level, index) => {
          const config = levelImages[level.name as ProgramLevelId]
          const isSelected = selectedLevel === level.name

          return (
            <motion.div
              key={level.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => setSelectedLevel(level.name)}
              className={`
                relative cursor-pointer rounded-xl overflow-hidden border-2 transition-all duration-300
                hover:shadow-lg hover:-translate-y-1
                ${
                  isSelected
                    ? `${config.selectedBorder} ${config.selectedBg} shadow-md`
                    : `${config.border} bg-white hover:border-gray-300`
                }
              `}
            >
              {/* Image — adjusted to show natural image dimensions */}
              <div className="relative w-full flex items-center justify-center">
                <Image
                  src={config.src}
                  alt={`${level.title} Level`}
                  width={500}
                  height={800}
                  className="w-full h-auto object-contain"
                />

                {/* Selected checkmark overlay */}
                {isSelected && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute top-2 right-2 w-7 h-7 rounded-full bg-green-500 flex items-center justify-center shadow-md"
                  >
                    <svg
                      className="w-4 h-4 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={3}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </motion.div>
                )}
              </div>

              {/* Description text at bottom of card */}
              <div className="px-2.5 py-2">
                <p className="text-xs sm:text-sm text-gray-600 leading-snug line-clamp-2">
                  {level.description}
                </p>
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
