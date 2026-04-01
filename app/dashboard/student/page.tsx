import SliderCarousel from '@/components/carousel'
import FeaturedChatBots from '@/components/featuredChatBots'
import FeauturedInstructors from '@/components/featuredInstructors'
import { RecentChats } from '@/components/recentChats'
import { RecommendedBots } from '@/components/recommendedBots'

export default function StudentDashboard() {
  return (
    <div className="h-full p-4 overflow-y-auto overflow-x-hidden">
      {/* Teaser Carousel */}
      <SliderCarousel />

      {/* Recent Chats */}
      <RecentChats />

      {/* Featured Instructors */}
      <FeauturedInstructors />

      {/* Featured Chat-Bots */}
      <FeaturedChatBots />

      {/* Recommended Chat-Bots */}
      <RecommendedBots />
    </div>
  )
}
