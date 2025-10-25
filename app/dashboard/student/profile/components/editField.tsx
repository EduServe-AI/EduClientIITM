'use client'

import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Pencil, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

interface EditProfileFieldProps {
  label: string
  currentValue: string | undefined
}

export default function EditProfileField({
  label,
  currentValue,
}: EditProfileFieldProps) {
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState(currentValue)
  const [isSaving, setIsSaving] = useState(false)

  // Reset the value if the prop changes
  useEffect(() => {
    setValue(currentValue)
  }, [currentValue])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="text-gray-500 hover:text-black cursor-pointer mr-3"
        >
          <Pencil className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit {label}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Label htmlFor={label.toLowerCase()} className="text-left">
            New {label}
          </Label>
          <Input
            id={label.toLowerCase()}
            value={value}
            onChange={e => setValue(e.target.value)}
            className="col-span-3"
          />
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" className="cursor-pointer">
              Cancel
            </Button>
          </DialogClose>
          <Button
            onClick={() => {
              alert('saving')
            }}
            disabled={isSaving}
            className="cursor-pointer"
          >
            {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
