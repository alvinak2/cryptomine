'use client'

import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { useState } from 'react'
import { InvestmentModal } from '@/components/dashboard/InvestmentModal'
import { InvestmentConfirmation } from '@/components/dashboard/InvestmentConfirmation'

export default function PlansPage() {
  const router = useRouter()
  const { data: session } = useSession()
  const [hoveredPlan, setHoveredPlan] = useState<string | null>(null)
  const [selectedPlan, setSelectedPlan] = useState<{ name: string; min: number; duration: number; return: number; features: string[] } | null>(null)
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [currentInvestment, setCurrentInvestment] = useState(null)

  function handleInvestNow(plan: { name: string; min: number; duration: number; return: number; features: string[] }) {
    if (!session) {
      router.push('/login')
    } else {
      setSelectedPlan(plan)
    }
  }

  function handleInvestmentComplete(investment: any) {
    setSelectedPlan(null)
    setCurrentInvestment(investment)
    setShowPaymentModal(true)
  }

  const plans = [
    { 
      name: 'Basic', 
      min: 100, 
      duration: 15, 
      return: 50, 
      features: ['24/7 Support']
    },
    { 
      name: 'Pro', 
      min: 500, 
      duration: 10, 
      return: 50, 
      features: ['Priority Support']
    },
    { 
      name: 'Elite', 
      min: 1000, 
      duration: 5, 
      return: 50, 
      features: ['VIP Support']
    },
  ]

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-5xl mx-auto text-center space-y-8">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-300 mb-4">
          Investment Plans
        </h1>
        <p className="text-lg text-gray-400 max-w-3xl mx-auto">
          Choose the investment plan that suits you best. Our plans are designed to maximize your profits while minimizing risks. Start your journey in cryptocurrency mining today!
        </p>

        <section className="grid md:grid-cols-3 gap-8 mt-16">
          {plans.map((plan) => (
            <article 
              key={plan.name} 
              className="bg-crypto-secondary p-8 rounded-xl shadow-lg transition-all duration-300 ease-in-out transform hover:-translate-y-2"
              onMouseEnter={() => setHoveredPlan(plan.name)}
              onMouseLeave={() => setHoveredPlan(null)}
            >
              <h3 className="text-2xl font-bold mb-4 text-gray-300">{plan.name}</h3>
              <div className="text-4xl font-bold text-crypto-success mb-6">
                ${plan.min}
                <span className="text-sm text-gray-400 font-normal block mt-1">minimum investment</span>
              </div>
              <ul className="space-y-3 text-left mb-8">
                <li className="flex items-center text-gray-300">
                  <svg className="w-5 h-5 text-crypto-success mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {plan.duration} days duration
                </li>
                <li className="flex items-center text-gray-300">
                  <svg className="w-5 h-5 text-crypto-success mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  {plan.return}% return rate
                </li>
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-center text-gray-300">
                    <svg className="w-5 h-5 text-crypto-success mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
              <div className="mt-8">
                <button
                  onClick={() => handleInvestNow(plan)}
                  className={`w-full px-6 py-3 bg-crypto-success text-white font-medium rounded-lg hover:bg-crypto-success/90 focus:outline-none focus:ring-2 focus:ring-crypto-success focus:ring-offset-2 transition-colors duration-300 ${hoveredPlan === plan.name ? 'animate-pulse' : ''}`}
                >
                  Invest Now
                </button>
              </div>
            </article>
          ))}
        </section>

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
    </div>
  )
}