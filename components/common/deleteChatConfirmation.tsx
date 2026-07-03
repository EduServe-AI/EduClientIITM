'use client'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Loader2 } from 'lucide-react'

interface DeleteChatConfirmationProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  isPending?: boolean
  botName?: string
}

export function DeleteChatConfirmation({
  isOpen,
  onClose,
  onConfirm,
  isPending = false,
  botName,
}: DeleteChatConfirmationProps) {
  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent onClick={e => e.stopPropagation()}>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Chat Session?</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete your conversation
            {botName ? ` with ${botName}` : ''}? This action cannot be undone
            and all message history will be permanently lost.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel
            onClick={e => {
              e.stopPropagation()
              onClose()
            }}
            disabled={isPending}
            className="cursor-pointer hover:opacity-80 transition"
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={e => {
              e.stopPropagation()
              onConfirm()
            }}
            disabled={isPending}
            className="bg-red-600 hover:bg-red-700 text-white cursor-pointer transition flex items-center gap-2"
          >
            {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
            {isPending ? 'Deleting...' : 'Delete'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
