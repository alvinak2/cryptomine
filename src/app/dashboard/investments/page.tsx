// src/app/dashboard/investments/page.tsx
'use client'

import { useState } from 'react'
import { InvestmentModal } from '@/components/dashboard/InvestmentModal'
import { InvestmentConfirmation } from '@/components/dashboard/InvestmentConfirmation'
import { INVESTMENT_PLANS } from '@/lib/constants'

export default function InvestmentsPage() {
  const [selectedPlan, setSelectedPlan] = useState(null)
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [currentInvestment, setCurrentInvestment] = useState(null)

  const plans = [
    { 
      name: 'Basic', 
      min: INVESTMENT_PLANS.Basic.min,
      duration: INVESTMENT_PLANS.Basic.duration, // 15 days
      return: INVESTMENT_PLANS.Basic.return,
      features: [
        `$${INVESTMENT_PLANS.Basic.min} minimum`,
        `${INVESTMENT_PLANS.Basic.duration} days duration`,
        `${INVESTMENT_PLANS.Basic.return}% return rate`,
        '24/7 Support'
      ]
    },
    { 
      name: 'Pro', 
      min: INVESTMENT_PLANS.Pro.min,
      duration: INVESTMENT_PLANS.Pro.duration, // 10 days
      return: INVESTMENT_PLANS.Pro.return,
      features: [
        `$${INVESTMENT_PLANS.Pro.min} minimum`,
        `${INVESTMENT_PLANS.Pro.duration} days duration`,
        `${INVESTMENT_PLANS.Pro.return}% return rate`,
        'Priority Support'
      ]
    },
    { 
      name: 'Elite', 
      min: INVESTMENT_PLANS.Elite.min,
      duration: INVESTMENT_PLANS.Elite.duration, // 5 days
      return: INVESTMENT_PLANS.Elite.return,
      features: [
        `$${INVESTMENT_PLANS.Elite.min} minimum`,
        `${INVESTMENT_PLANS.Elite.duration} days duration`,
        `${INVESTMENT_PLANS.Elite.return}% return rate`,
        'VIP Support'
      ]
    }
  ]

  const handleInvestmentComplete = (investment: any) => {
    setSelectedPlan(null)
    setCurrentInvestment(investment)
    setShowPaymentModal(true)
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Investment Plans</h1>
      
      <div className="grid md:grid-cols-3 gap-8">
      {plans.map((plan) => (
        <div key={plan.name} className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition-shadow">
          <h3 className="text-xl font-bold mb-4">{plan.name}</h3>
          <p className="text-3xl font-bold mb-6">${plan.min}</p>
          <ul className="space-y-3 mb-6">
            {plan.features.map((feature, index) => (
              <li key={index} className="flex items-center">
                <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                {feature}
              </li>
            ))}
          </ul>
          <button
            onClick={() => setSelectedPlan(plan)}
            className="w-full py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
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