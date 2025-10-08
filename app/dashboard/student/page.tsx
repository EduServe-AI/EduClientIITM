import Slidercarousel from '@/components/carousel'
import FeauturedInstructors from '@/components/featuredInstructors'
import FeaturedChatBots from '@/components/featuredChatBots'

export default function StudentDashboard() {
  return (
    <div className="p-4">
      {/* Teaser Carousel */}
      <Slidercarousel />

      {/* Featured Instructors */}
      <FeauturedInstructors />

      {/* Featured Chat-Bots */}
      <FeaturedChatBots />
    </div>
  )
}
