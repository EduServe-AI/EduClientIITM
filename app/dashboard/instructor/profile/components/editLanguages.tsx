'use client'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Languages as AvailableLanguages } from '@/constants/languages'
import { Language } from '@/contexts/instructorContext'
import { Languages } from '@/types/types'
import { XIcon } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

export function EditLanguages({
  languages,
  setLanguages,
}: {
  languages: Language[]
  setLanguages: (languages: Language[]) => void
}) {
  const [isOpen, setIsOpen] = useState(false)

  // Local state to manage selected languages
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>(
    languages?.map(lang => lang.language.name) || []
  )

  // Update local state when dialog opens
  const handleOpen = (open: boolean) => {
    if (open) {
      setSelectedLanguages(languages?.map(lang => lang.language.name) || [])
    }
    setIsOpen(open)
  }

  // Handle language selection
  const handleLanguageToggle = (languageName: string) => {
    if (selectedLanguages.includes(languageName)) {
      // Remove language
      setSelectedLanguages(selectedLanguages.filter(l => l !== languageName))
    } else {
      // Add language
      setSelectedLanguages([...selectedLanguages, languageName])
    }
  }

  // Apply changes to parent component
  const handleApply = () => {
    // Create new languages array based on selected languages
    const updatedLanguages: Language[] = selectedLanguages.map(langName => {
      // Find existing language or create new one
      const existingLanguage = languages?.find(
        l => l.language.name === langName
      )

      return (
        existingLanguage || {
          id: `temp-${Date.now()}-${langName}`,
          languageId: `temp-lang-${langName}`,
          language: {
            name: langName,
          },
        }
      )
    })

    setLanguages(updatedLanguages)
    toast.success('Languages updated')
    setIsOpen(false)
  }

  // Reset to current languages when dialog closes without saving
  const handleCancel = () => {
    setSelectedLanguages(languages?.map(lang => lang.language.name) || [])
    setIsOpen(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" color="black">
          Edit Languages
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Edit Languages</DialogTitle>
          <DialogDescription>
            Select the languages you are proficient with. You can select
            multiple languages.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Current Selected Languages */}
          <div className="space-y-2">
            <h4 className="font-medium text-sm">
              Current Languages ({selectedLanguages.length})
            </h4>
            <div className="min-h-[60px] p-3 rounded-md border bg-muted/30">
              {selectedLanguages.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {selectedLanguages.map(langName => (
                    <div
                      key={langName}
                      className="px-3 py-1.5 rounded-full bg-green-100 text-green-800 text-sm font-medium flex items-center gap-1.5"
                    >
                      {langName}
                      <button
                        onClick={() => handleLanguageToggle(langName)}
                        className="hover:bg-green-200 rounded-full p-0.5"
                      >
                        <XIcon className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground italic">
                  No languages selected yet
                </p>
              )}
            </div>
          </div>

          {/* Available Languages */}
          <div className="space-y-2">
            <h4 className="font-medium text-sm">Available Languages</h4>
            <ScrollArea className="h-[300px] w-full rounded-md border p-4">
              <div className="flex flex-wrap gap-3">
                {AvailableLanguages.map(language => {
                  const isSelected = selectedLanguages.includes(language)

                  return (
                    <Button
                      key={language}
                      onClick={() =>
                        handleLanguageToggle(language as Languages)
                      }
                      className={`px-4 py-2 rounded-md border text-sm font-medium shadow-sm transition ${
                        isSelected
                          ? 'bg-blue-700 border-blue-300 text-white hover:bg-blue-600'
                          : 'bg-white border-gray-300 text-gray-800 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700'
                      }`}
                    >
                      {language}
                    </Button>
                  )
                })}
              </div>
            </ScrollArea>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <DialogClose asChild>
            <Button type="button" variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
          </DialogClose>
          <Button type="button" onClick={handleApply}>
            Apply Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
