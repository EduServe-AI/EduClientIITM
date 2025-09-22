import { PricingTier } from '@/types/types'

// --- Data for Pricing Tiers ---
export const pricingTiers: PricingTier[] = [
  {
    level: 'foundation',
    title: 'Foundation',
    price: 100,
    color: 'bg-violet-50 border-violet-200',
    highlightColor: 'border-violet-500 ring-violet-500',
  },
  {
    level: 'diploma',
    title: 'Diploma',
    price: 200,
    color: 'bg-purple-50 border-purple-200',
    highlightColor: 'border-purple-500 ring-purple-500',
  },
  {
    level: 'bsc',
    title: 'Degree',
    price: 300,
    color: 'bg-pink-50 border-pink-200',
    highlightColor: 'border-pink-500 ring-pink-500',
  },
  {
    level: 'bs',
    title: 'BS Level',
    price: 400,
    color: 'bg-red-50 border-red-200',
    highlightColor: 'border-red-500 ring-red-500',
  },
]
