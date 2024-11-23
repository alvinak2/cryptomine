// src/app/dashboard/investments/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { BanknotesIcon, ArrowTrendingUpIcon } from '@heroicons/react/24/outline'

const PLANS = [
  { name: 'Basic', min: 100, duration: 30, return: 50 },
  { name: 'Pro', min: 500, duration: 20, return: 50 },
  { name: 'Elite', min: 1000, duration: 10, return: 50 }
]

export default function InvestmentsPage() {
  const [investments, setInvestments] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchInvestments()
  }, [])

  async function fetchInvestments() {
    const res = await fetch('/api/investments')
    const data = await res.json()
    setInvestments(data)
    setLoading(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Investments</h1>
        <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
          New Investment
        </button>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {PLANS.map((plan) => (
          <div key={plan.name} className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4">{plan.name}</h3>
            <div className="space-y-2">
              <p>Minimum: ${plan.min}</p>
              <p>Duration: {plan.duration} days</p>
              <p>Return: {plan.return}%</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-6">
          <h2 className="text-lg font-semibold mb-4">Active Investments</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Plan</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Start Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Returns</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {investments.map((investment: any) => (
                  <tr key={investment._id}>
                    <td className="px-6 py-4">{investment.plan}</td>
                    <td className="px-6 py-4">${investment.amount}</td>
                    <td className="px-6 py-4">{new Date(investment.startDate).toLocaleDateString()}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        investment.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {investment.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">${investment.returns}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}