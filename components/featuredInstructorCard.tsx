import { Card } from '@/components/ui/card'
import { useImageUrl } from '@/lib/utils'
import { ProgramLevelId } from '@/types/types'
import { IndianRupee, Star } from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Badge } from './ui/badge'

// Defining the shape of the featured instructor object
interface FeaturedInstructorProps {
  id: string
  instructorId: string
  name: string
  bio: string
  level: ProgramLevelId
  profileUrl: string | null
  basePrice: string
  skills: { name: string }[]
}

export function FeaturedInstructorCard(instructor: FeaturedInstructorProps) {
  const router = useRouter()

  const profileUrl =
    useImageUrl(instructor.instructorId, 'profile') || '/placeholder.jpg'
  return (
    <div
      className="group cursor-pointer"
      onClick={() => {
        router.push(`/dashboard/student/instructors/${instructor.id}`)
      }}
    >
      {/* Card with Image and name */}
      <Card className="overflow-hidden rounded-2xl relative transition-transform duration-300 ease-in-out group-hover:scale-105">
        {/* Image should cover the whole card - overlay */}
        <div className="aspect-[16/9] w-full">
          <Image
            src={profileUrl}
            alt={`Profile picture of ${instructor.name}`}
            className="object-cover"
            fill
            loading="lazy"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />

          {/* Name and level at Footer */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-4 transition-all duration-300 ease-in-out group-hover:bottom-4">
            <h3 className="text-white text-xl font-bold">{instructor.name}</h3>
            <h6 className="text-white/80 text-sm font-medium uppercase tracking-wider">
              {instructor.level}
            </h6>
          </div>
        </div>
      </Card>

      {/* Contents below the card */}
      <div className="mt-3 space-y-2">
        {/* Rating and price */}
        <div className="flex items-center justify-between">
          <div className="flex items-center text-sm gap-1">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span className="font-semibold">5.0</span>
            <span className="text-gray-500">(30 reviews)</span>
          </div>
          <div className="flex items-center text-md font-bold text-gray-800">
            <IndianRupee className="w-4 h-4" />
            {instructor.basePrice}
            <span className="text-sm font-normal text-gray-500 ml-1">
              / session
            </span>
          </div>
        </div>

        {/* Skills */}
        <div className="flex items-center gap-1 flex-wrap">
          <span className="text-sm font-semibold">Teaches:</span>
          {instructor.skills.slice(0, 4).map(skill => (
            <Badge key={skill.name} variant="secondary" className="font-normal">
              {skill.name}
            </Badge>
          ))}
        </div>

        {/* Bio */}
        <p className="text-sm font-normal line-clamp-2">{instructor.bio}</p>
      </div>
    </div>
  )
}
