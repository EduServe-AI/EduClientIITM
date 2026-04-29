'use client'

import { Monitor, Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

const themes = [
  { value: 'system', label: 'System', icon: Monitor },
  { value: 'light', label: 'Light', icon: Sun },
  { value: 'dark', label: 'Dark', icon: Moon },
] as const

export function ThemeSelector() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  if (!mounted) {
    return (
      <div className="flex gap-2">
        {themes.map(t => (
          <div
            key={t.value}
            className="h-10 flex-1 rounded-lg bg-muted animate-pulse"
          />
        ))}
      </div>
    )
  }

  return (
    <div className="flex gap-2">
      {themes.map(t => {
        const isActive = theme === t.value
        return (
          <button
            key={t.value}
            onClick={() => setTheme(t.value)}
            className={`
              flex-1 flex items-center justify-center gap-2 px-4 py-2.5
              rounded-lg text-sm font-medium transition-all duration-200
              cursor-pointer border
              ${
                isActive
                  ? 'bg-primary text-primary-foreground border-primary shadow-sm'
                  : 'bg-secondary text-secondary-foreground border-border hover:bg-accent hover:text-accent-foreground'
              }
            `}
          >
            <t.icon className="h-4 w-4" />
            <span>{t.label}</span>
          </button>
        )
      })}
    </div>
  )
}
