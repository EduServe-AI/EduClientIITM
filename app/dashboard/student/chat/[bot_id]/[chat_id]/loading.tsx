import { Spinner } from '@/components/ui/spinner'

export default function Loading() {
  return (
    <div className="flex items-center justify-center gap-2">
      <Spinner color="" />
      <div className="text-black">Loading</div>
    </div>
  )
}
