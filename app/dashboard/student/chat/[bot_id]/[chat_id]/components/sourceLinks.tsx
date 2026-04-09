'use client'

import { SourceLink } from '@/contexts/chatContext'
import { Link } from 'lucide-react'

interface SourceLinksProps {
  sources: SourceLink[]
}

export default function SourceLinks({ sources }: SourceLinksProps) {
  if (!sources || sources.length === 0) return null

  return (
    <div className="mt-3 flex flex-wrap gap-2">
      {sources.map((source, index) =>
        source.url ? (
          <a
            key={index}
            href={source.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-neutral-200 bg-neutral-100 text-sm font-medium text-black no-underline transition-colors duration-200 hover:bg-neutral-200"
          >
            <Link className="h-3.5 w-3.5 shrink-0 text-neutral-600" />
            <span className="truncate max-w-[250px]">{source.filename}</span>
          </a>
        ) : (
          <span
            key={index}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-neutral-200 bg-neutral-100 text-sm font-medium text-black"
          >
            <Link className="h-3.5 w-3.5 shrink-0 text-neutral-600" />
            <span className="truncate max-w-[250px]">{source.filename}</span>
          </span>
        )
      )}
    </div>
  )
}
