// src/app/dashboard/investments/page.tsx
'use client'

import { useState } from 'react'
import { InvestmentModal } from '@/components/dashboard/InvestmentModal'
import { InvestmentConfirmation } from '@/components/dashboard/InvestmentConfirmation'

const INVESTMENT_PLANS = [
  { 
    name: 'Basic',
    min: 100,
    duration: 15,
    return: 50,
    features: [
      '$100 minimum investment',
      '30 days duration',
      '50% return rate',
      '24/7 Support'
    ]
  },
  {
    name: 'Pro',
    min: 500,
    duration: 10,
    return: 50,
    features: [
      '$500 minimum investment',
      '20 days duration',
      '50% return rate',
      'Priority Support'
    ]
  },
  {
    name: 'Elite',
    min: 1000,
    duration: 5,
    return: 50,
    features: [
      '$1000 minimum investment',
      '10 days duration',
      '50% return rate',
      'VIP Support'
    ]
  }
]

export default function InvestmentPlans() {
  const [selectedPlan, setSelectedPlan] = useState(null)
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [currentInvestment, setCurrentInvestment] = useState(null)

  const handleInvestmentComplete = (investment: any) => {
    setSelectedPlan(null)
    setCurrentInvestment(investment)
    setShowPaymentModal(true)
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Investment Plans</h1>
      
      <div className="grid md:grid-cols-3 gap-6">
        {INVESTMENT_PLANS.map((plan) => (
          <div 
            key={plan.name}
            className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow"
          >
            <div className="text-center mb-6">
              <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
              <p className="text-3xl font-bold text-blue-600">
                ${plan.min}
                <span className="text-sm text-gray-500 font-normal">minimum</span>
              </p>
            </div>

            <ul className="space-y-3 mb-6">
              {plan.features.map((feature, index) => (
                <li key={index} className="flex items-center text-gray-600">
                  <svg 
                    className="w-5 h-5 mr-2 text-green-500" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M5 13l4 4L19 7" 
                    />
                  </svg>
                  {feature}
                </li>
              ))}
            </ul>

            <button
              onClick={() => setSelectedPlan(plan)}
              className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              Invest Now
            </button>
          </div>
        ))}
      </div>

      {selectedPlan && (
        <InvestmentModal
          isOpen={!!selectedPlan}
          onClose={() => setSelectedPlan(null)}
          plan={selectedPlan}
          onInvestmentComplete={handleInvestmentComplete}
        />
      )}

      {showPaymentModal && currentInvestment && (
        <InvestmentConfirmation
          isOpen={showPaymentModal}
          onClose={() => setShowPaymentModal(false)}
          investment={currentInvestment}
        />
      )}
    </div>
  )
}