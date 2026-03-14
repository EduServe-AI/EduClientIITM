'use client'

interface AuthLayoutProps {
  mode: 'instructor' | 'student'
  children: React.ReactNode
}

export default function AuthLayout({ mode, children }: AuthLayoutProps) {
  const isInstructor = mode === 'instructor'

  return (
    <div className="relative w-full min-h-screen overflow-hidden bg-white">
      <div
        className={`relative z-10 flex items-center justify-start min-h-screen px-4 sm:px-6 lg:px-8 transition-all duration-500 ${
          isInstructor ? 'lg:pl-16' : 'lg:pr-16'
        }`}
      >
        <div className="w-full max-w-md transition-all duration-700 transform">
          {children}
        </div>
      </div>
    </div>
  )
}
