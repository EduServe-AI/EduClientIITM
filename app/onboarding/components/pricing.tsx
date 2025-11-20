import { ProgramLevelId } from '@/types/types'
import { IndianRupee, InfoIcon } from 'lucide-react'
import { pricingTiers } from '@/constants/pricing'

interface PricingProps {
  formData: {
    level: ProgramLevelId
  }
  setFormData: React.Dispatch<React.SetStateAction<any>>
}

export default function Pricing({ formData, setFormData }: PricingProps) {
  return (
    <section className="max-w-4xl mx-auto w-full">
      {/* <header className="mb-8 text-center flex flex-row gap-3 items-center justify-center mr-5">
        <IndianRupee size={30} />
        <h3 className="text-3xl font-semibold text-gray-800">Pricing</h3>
      </header> */}

      {/* Pricing */}

      {/* --- Informational Note --- */}
      <div className="flex justify-center mb-8  ">
        <div className="flex items-start p-4 rounded-lg bg-blue-50 border border-blue-200 max-w-2xl">
          <InfoIcon className="w-5 h-5 mr-3 mt-0.5 text-blue-600 shrink-0" />
          <p className="text-sm text-blue-800">
            This base price is fixed to ensure fairness and accessibility for
            students. You can unlock custom pricing options by completing
            milestones on the platform.
          </p>
        </div>
      </div>

      {/* --- Pricing Tiers Grid --- */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {pricingTiers.map(tier => {
          const isHighlighted = formData.level === tier.level

          return (
            <div
              key={tier.level}
              className={`relative rounded-xl border p-6 transition-all duration-300 flex flex-col h-80 hover:cursor-pointer hover:scale-110 hover:shadow-xl
                ${
                  isHighlighted
                    ? `shadow-lg scale-105 ring-2 ${tier.highlightColor} ${tier.color}`
                    : `${tier.color} opacity-80 hover:opacity-100`
                }`}
            >
              {isHighlighted && (
                <div className="absolute top-0 right-4 -translate-y-1/2 px-3 py-1 bg-violet-600 text-white text-xs font-semibold rounded-full shadow-md">
                  Your Level
                </div>
              )}

              <div className="flex-1 flex items-start justify-center min-h-[20%]">
                <h3 className="text-lg font-semibold text-gray-800 text-center">
                  {tier.title}
                </h3>
              </div>

              <div className="flex-1 flex flex-col items-center justify-center min-h-[40%]">
                <div className="flex items-baseline">
                  <IndianRupee className="h-7 w-7 text-gray-900" />
                  <span className="text-4xl font-bold tracking-tight text-gray-900">
                    {tier.price}
                  </span>
                </div>
                <p className="mt-1 text-sm text-gray-600 italic text-center">
                  per session
                </p>
              </div>

              <div className="flex-1 flex items-end justify-center min-h-[20%] pt-4">
                <p
                  className={`text-sm font-medium text-center ${isHighlighted ? 'text-violet-700' : 'text-gray-500'}`}
                >
                  For instructors at the {tier.title} level.
                </p>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
