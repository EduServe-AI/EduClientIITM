'use client'

import { StudentProvider } from '@/contexts/studentContext'

export default function MeetingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <StudentProvider>
      <div className="w-full h-full">{children}</div>
    </StudentProvider>
  )
}
