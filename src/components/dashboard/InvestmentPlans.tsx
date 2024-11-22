// src/components/dashboard/InvestmentPlans.tsx
'use client'

import { useState } from 'react'
import { Dialog } from '@headlessui/react'

const PLANS = [
  {
    name: 'Basic',
    price: 100,
    duration: 30,
    returnRate: 50,
    features: ['$100 minimum', '30 days duration', '50% return rate', '24/7 Support']
  },
  {
    name: 'Pro',
    price: 500,
    duration: 20,
    returnRate: 50,
    features: ['$500 minimum', '20 days duration', '50% return rate', 'Priority Support']
  },
  {
    name: 'Elite',
    price: 1000,
    duration: 10,
    returnRate: 50,
    features: ['$1000 minimum', '10 days duration', '50% return rate', 'VIP Support']
  }
]

export function InvestmentPlans() {
  const [selectedPlan, setSelectedPlan] = useState<typeof PLANS[0] | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handlePurchase(amount: number) {
    setLoading(true)
    try {
      const response = await fetch('/api/investments/purchase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          plan: selectedPlan?.name,
          amount 
        })
      })
      
      if (!response.ok) throw new Error('Purchase failed')
      
      setIsModalOpen(false)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {PLANS.map((plan) => (
          <div 
            key={plan.name}
            className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-lg transition-shadow"
          >
            <h3 className="text-xl font-bold mb-4">{plan.name}</h3>
            <p className="text-3xl font-bold mb-6">${plan.price}</p>
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
              onClick={() => {
                setSelectedPlan(plan)
                setIsModalOpen(true)
              }}
              className="w-full py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Invest Now
            </button>
          </div>
        ))}
      </div>

      <Dialog 
        open={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="bg-white rounded-lg p-6 max-w-sm w-full">
            <Dialog.Title className="text-lg font-bold mb-4">
              Invest in {selectedPlan?.name} Plan
            </Dialog.Title>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Investment Amount
                </label>
                <input
                  type="number"
                  min={selectedPlan?.price}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                />
              </div>
              <button
                onClick={() => handlePurchase(selectedPlan?.price || 0)}
                disabled={loading}
                className="w-full py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
              >
                {loading ? 'Processing...' : 'Confirm Investment'}
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </>
  )
}