import Slidercarousel from '@/components/carousel'
import FeaturedChatBots from '@/components/featuredChatBots'
import FeauturedInstructors from '@/components/featuredInstructors'
import Header from '@/components/header'

export default function StudentDashboard() {
  return (
    <div className="p-4 overflow-y-auto overflow-x-hidden">
      {/* Header */}
      <Header />

      {/* Teaser Carousel */}
      <Slidercarousel />

      {/* Featured Instructors */}
      <FeauturedInstructors />

      {/* Featured Chat-Bots */}
      <FeaturedChatBots />
    </div>
  )
}
