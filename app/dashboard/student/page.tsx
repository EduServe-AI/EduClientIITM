import Slidercarousel from '@/components/carousel'
import FeaturedChatBots from '@/components/featuredChatBots'
import FeauturedInstructors from '@/components/featuredInstructors'
import Header from '@/components/header'
import { RecentChats } from '@/components/recentChats'
import { RecommendedBots } from '@/components/recommendedBots'

export default function StudentDashboard() {
  return (
    <div className="p-4 overflow-y-auto overflow-x-hidden">
      {/* Header */}
      <Header />

      {/* Teaser Carousel */}
      <Slidercarousel />

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
