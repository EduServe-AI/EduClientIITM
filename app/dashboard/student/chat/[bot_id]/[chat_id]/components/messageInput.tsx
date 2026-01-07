import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupText,
  InputGroupTextarea,
} from '@/components/ui/input-group'
import { Separator } from '@/components/ui/separator'
import { useChat } from '@/contexts/chatContext'
import { ArrowUpIcon, CirclePlus } from 'lucide-react'
import { useState } from 'react'

export default function MessageInput() {
  const { handleSendMessage } = useChat()

  const [userPrompt, setUserPrompt] = useState('')

  const handleSubmit = () => {
    const trimmedPrompt = userPrompt.trim()
    if (!trimmedPrompt) {
      return
    }
    handleSendMessage(trimmedPrompt)
    setUserPrompt('') // Clear the input after sending
  }

  return (
    <div className="w-full max-w-5xl mx-auto px-0 md:px-0 flex flex-col items-center justify-center gap-2">
      {/* Input component will go here */}
      <InputGroup className="border-2 border-black">
        <InputGroupTextarea
          placeholder="Ask anything ...."
          value={userPrompt}
          onChange={e => setUserPrompt(e.target.value)}
          onKeyDown={e => {
            // Submit on Enter without Shift key
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault()
              handleSubmit()
            }
          }}
        />
        <InputGroupAddon align="block-end">
          {/* plus button - non-clickable */}
          <InputGroupButton
            variant="outline"
            className="cursor-pointer"
            size="icon-xs"
          >
            <CirclePlus />
          </InputGroupButton>

          {/* Change Model */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild className="cursor-pointer">
              <InputGroupButton variant="secondary">Auto</InputGroupButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              side="top"
              align="start"
              className="[--radius:0.95rem]"
            >
              <DropdownMenuItem>Auto</DropdownMenuItem>
              <DropdownMenuItem>Agent</DropdownMenuItem>
              <DropdownMenuItem>Manual</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Usage */}
          <InputGroupText className="ml-auto text-gray-800">
            57% used
          </InputGroupText>
          <Separator orientation="vertical" className="!h-4" />

          {/* Trigger button */}
          <InputGroupButton
            variant="default"
            className="rounded-full"
            size="icon-xs"
            disabled={userPrompt.trim() === ''}
            onClick={handleSubmit}
          >
            <ArrowUpIcon />
            <span className="sr-only">Send</span>
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>

      {/* Disclaimer text */}
      <span className="text-xs text-center text-neutral-600">
        AI-generated, for reference only
      </span>
    </div>
  )
}
