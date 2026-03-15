'use client'

import { pricingTiers } from '@/constants/pricing'
import { ProgramLevelId } from '@/types/types'
import { IndianRupee, InfoIcon } from 'lucide-react'

interface PricingProps {
  formData: {
    level: ProgramLevelId | null
  }
}

export default function Pricing({ formData }: PricingProps) {
  return (
    <div className="w-full space-y-8">
      {/* Informational Note */}
      <div className="flex items-start gap-3 p-4 rounded-lg bg-blue-50 border border-blue-200">
        <InfoIcon className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
        <p className="text-sm text-blue-800">
          This base price is fixed to ensure fairness and accessibility for
          students. You can unlock custom pricing options by completing
          milestones on the platform.
        </p>
      </div>

      {/* Pricing Tiers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {pricingTiers.map(tier => {
          const isHighlighted = formData.level === tier.level

          return (
            <div
              key={tier.level}
              className={`relative rounded-lg border p-6 transition-all duration-300 flex flex-col h-full ${
                isHighlighted
                  ? `shadow-lg scale-105 ring-2 ${tier.highlightColor} ${tier.color}`
                  : `${tier.color} opacity-80 hover:opacity-100`
              }`}
            >
              {isHighlighted && (
                <div className="absolute top-0 right-4 -translate-y-1/2 px-3 py-1 bg-blue-600 text-white text-xs font-semibold rounded-full">
                  Your Level
                </div>
              )}

              <h3 className="text-lg font-bold text-gray-900 mb-4">
                {tier.title}
              </h3>

              <div className="flex items-baseline gap-1 mb-2">
                <IndianRupee className="h-6 w-6 text-gray-900" />
                <span className="text-4xl font-bold text-gray-900">
                  {tier.price}
                </span>
                <span className="text-gray-600 text-sm">/session</span>
              </div>

              <p className="text-sm text-gray-600 mb-4">
                For instructors at the {tier.title} level.
              </p>

              <div className="mt-auto pt-4 border-t border-gray-200">
                <p
                  className={`text-xs font-medium ${
                    isHighlighted ? 'text-blue-700' : 'text-gray-600'
                  }`}
                >
                  {tier.title} students prefer experienced instructors at this
                  pricing
                </p>
              </div>
            </div>
          )
        })}
      </div>

      {/* Additional Info */}
      <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
        <h4 className="font-semibold text-gray-900 mb-3">
          What&apos;s Included
        </h4>
        <ul className="space-y-2 text-sm text-gray-700">
          <li className="flex gap-2">
            <span className="text-blue-600 font-bold">✓</span>
            <span>Flexible session scheduling</span>
          </li>
          <li className="flex gap-2">
            <span className="text-blue-600 font-bold">✓</span>
            <span>Direct messaging with students</span>
          </li>
          <li className="flex gap-2">
            <span className="text-blue-600 font-bold">✓</span>
            <span>Access to student performance metrics</span>
          </li>
          <li className="flex gap-2">
            <span className="text-blue-600 font-bold">✓</span>
            <span>Professional profile and reviews</span>
          </li>
        </ul>
      </div>
    </div>
  )
}
