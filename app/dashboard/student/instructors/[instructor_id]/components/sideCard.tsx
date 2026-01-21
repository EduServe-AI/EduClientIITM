import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import {
  Calendar,
  Clock,
  IndianRupee,
  ShieldCheck,
  Star,
  Users,
} from 'lucide-react'
import Image from 'next/image'

interface SideCardProps {
  instructor: {
    name: string
    basePrice: number
  }
  profileUrl: string
}

export default function SideCard({ instructor, profileUrl }: SideCardProps) {
  return (
    <div className="lg:col-span-1">
      {/* Sticky only on large screens */}
      <div className="lg:sticky lg:top-6">
        <Card className="shadow-xl">
          <CardContent className="p-4 sm:p-6">
            <div className="space-y-4 sm:space-y-6">
              {/* Profile mini */}
              <div className="flex flex-col items-center gap-3 text-center">
                {/* Squared image with responsive size */}
                <div className="relative h-32 w-32 sm:h-40 sm:w-40 overflow-hidden rounded-lg border-2 border-black">
                  <Image
                    src={profileUrl || '/placeholder.jpg'}
                    alt={instructor.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 128px, 160px"
                  />
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-black">
                    {instructor.name}
                  </h3>
                  <div className="mt-1 flex items-center justify-center gap-1">
                    <Star className="h-4 w-4 fill-black text-black" />
                    <span className="text-xs sm:text-sm font-semibold text-black">
                      5
                    </span>
                    <span className="text-xs text-gray-600">(30 reviews)</span>
                  </div>
                </div>
              </div>

              <Separator className="bg-gray-300" />

              {/* Stats */}
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-gray-200 pb-3">
                  <span className="flex items-center gap-2 text-xs sm:text-sm font-medium text-gray-700">
                    <IndianRupee className="h-4 w-4" />
                    Rate
                  </span>
                  <span className="flex items-center text-base sm:text-lg font-bold text-black">
                    <IndianRupee className="h-4 w-4" />
                    {instructor.basePrice || '600'}/session
                  </span>
                </div>
                <div className="flex items-center justify-between border-b border-gray-200 pb-3">
                  <span className="flex items-center gap-2 text-xs sm:text-sm font-medium text-gray-700">
                    <Clock className="h-4 w-4" />
                    Response
                  </span>
                  <span className="text-base sm:text-lg font-bold text-black">
                    1h
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-xs sm:text-sm font-medium text-gray-700">
                    <Users className="h-4 w-4" />
                    Students
                  </span>
                  <span className="text-base sm:text-lg font-bold text-black">
                    50+
                  </span>
                </div>
              </div>

              <Separator className="bg-gray-300" />

              {/* CTA Button */}
              <Button
                size="lg"
                className="w-full bg-black text-sm sm:text-base font-semibold text-white transition-all hover:bg-gray-800 hover:shadow-lg"
              >
                <Calendar className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                Book a Session
              </Button>

              {/* Identity Verified */}
              <div className="flex items-center justify-center gap-1.5 text-xs font-medium text-gray-600 pb-3">
                <ShieldCheck className="h-4 w-4 text-green-600" />
                <span>Identity Verified</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
