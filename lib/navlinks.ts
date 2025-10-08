import { NavItem } from '@/types/types'
import {
  Home,
  Bot,
  Users,
  CalendarClockIcon,
  LayoutDashboard,
  MessageSquare,
  BarChart3,
  UserCircle,
  LogOut,
  LucideIcon,
} from 'lucide-react'

// ----------- NAV Links for Student -----------
export const studentNavItems: NavItem[] = [
  {
    title: 'Home',
    href: '/dashboard/student',
    icon: Home,
  },
  {
    title: 'Chat-Bots',
    href: '/dashboard/student/bots',
    icon: Bot,
  },
  {
    title: 'Instructors',
    href: '/dashboard/student/instructors',
    icon: Users,
  },
  {
    title: 'My Sessions',
    href: '/dashboard/student/sessions',
    icon: CalendarClockIcon,
  },
]

// ----------- NAV Links for Student -----------
export const instructorNavItems: NavItem[] = []

// ----------- Common Footer Links -------------
export const footerNavItems: NavItem[] = [
  {
    title: 'Profile',
    href: '/dashboard/profile',
    icon: UserCircle,
  },
  {
    title: 'Logout',
    href: '/logout',
    icon: LogOut,
  },
]
