'use client'

import { ReactNode } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

interface ImageAuthLayoutProps {
  mode: 'instructor' | 'student'
  children: ReactNode
}

const themes = {
  student: {
    bgDark: '#0a3d6b',
    bgLight: '#87CEEB',
    illustration: '/student-illustration.png',
    illustrationAlt: 'City skyline with bridge illustration',
  },
  instructor: {
    bgDark: '#4a1942',
    bgLight: '#e8b4cc',
    illustration: '/instructor-illustration.png',
    illustrationAlt: 'Office and study room illustration',
  },
}

export default function ImageAuthLayout({
  mode,
  children,
}: ImageAuthLayoutProps) {
  const theme = themes[mode]

  return (
    <div className="min-h-screen w-full relative flex items-center justify-center p-3 sm:p-4 lg:p-8 overflow-hidden">
      <div
        className="absolute inset-0 z-0"
        style={{ backgroundColor: theme.bgDark }}
      />
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundColor: theme.bgLight,
          clipPath: 'polygon(40% 0%, 100% 0%, 100% 100%, 20% 100%)',
        }}
      />

      {/* ─── Single Card ─── */}
      <div
        className="
          relative z-10 w-full
          max-w-[480px] sm:max-w-[540px] lg:max-w-[1100px]
          bg-white rounded-2xl
          shadow-[0_20px_60px_rgba(0,0,0,0.25)]
          overflow-hidden flex flex-col lg:flex-row
          min-h-0 lg:min-h-[560px] xl:min-h-[580px]
        "
      >
        {/* ─── Left Image Section (30%) — hidden on small/medium ─── */}
        <div className="relative hidden lg:block lg:w-[30%] flex-shrink-0">
          {/* Logo at top-left — original colors, larger */}
          <div className="absolute top-5 left-5 z-10 flex flex-col gap-2">
            <Link
              href="/"
              className="flex items-center gap-2 text-white/90 hover:text-white text-sm font-medium transition-colors bg-black/40 hover:bg-black/60 w-fit px-3 py-1 rounded-full backdrop-blur-sm"
            >
              <ArrowLeft size={16} />
              Back to Home
            </Link>
            <Image
              src="/EDU_WM2.png"
              alt="EduServe AI"
              width={200}
              height={52}
              className="drop-shadow-md"
              priority
            />
          </div>

          {/* Full-cover illustration image */}
          <Image
            src={theme.illustration}
            alt={theme.illustrationAlt}
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* ─── Right Form Section (70% on desktop, 100% on mobile) ─── */}
        <div className="w-full lg:w-[70%] flex flex-col">
          {/* Mobile/tablet logo bar */}
          <div className="lg:hidden flex items-center justify-between px-6 pt-5 pb-1">
            <Image
              src="/EDU_WM2.png"
              alt="EduServe AI"
              width={180}
              height={46}
              priority
            />
            <Link
              href="/"
              className="flex items-center gap-1.5 text-gray-500 hover:text-gray-800 text-sm font-medium transition-colors bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-full"
            >
              <ArrowLeft size={14} />
              Home
            </Link>
          </div>

          {/* Form content fills the space directly */}
          <div className="flex-1 px-6 py-5 sm:px-10 sm:py-6 lg:px-16 lg:py-10 flex flex-col justify-center">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}
