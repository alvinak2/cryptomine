// src/components/dashboard/InvestmentCard.tsx
'use client'

import { useState, useCallback } from 'react'
import { INVESTMENT_PLANS } from '@/lib/constants'
import { CalendarIcon, ArrowPathIcon } from '@heroicons/react/24/outline'

// src/components/dashboard/InvestmentCard.tsx
export function InvestmentCard({ investment, onUpdate }) {
  const [loading, setLoading] = useState(false)

  const endDate = new Date(investment.endDate)
  const now = new Date()
  const remainingDays = Math.max(0, Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 3600 * 24)))
  const isCompleted = remainingDays === 0 && investment.status === 'active'

  const planDuration = INVESTMENT_PLANS[investment.plan]?.duration || 15
  const progress = Math.min(100, ((planDuration - remainingDays) / planDuration) * 100)

  const handleWithdrawal = useCallback(async () => {
    if (!confirm('Are you sure you want to withdraw this investment?')) return
    
    setLoading(true)
    try {
      const res = await fetch(`/api/investments/${investment._id}/withdraw`, {
        method: 'POST'
      })
      
      if (!res.ok) throw new Error('Failed to withdraw')
      onUpdate?.()
    } catch (error) {
      console.error('Withdrawal error:', error)
    } finally {
      setLoading(false)
    }
  }, [investment._id, onUpdate])

  return (
    <div className="bg-crypto-secondary text-gray-300 rounded-lg shadow p-6">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold">{investment.plan} Plan</h3>
          <p className="text-crypto-success">${investment.amount}</p>
        </div>
        <span className={`px-2 py-1 rounded-full text-xs ${
          investment.status === 'active' ? 'bg-crypto-success bg-opacity-20 text-crypto-success' :
          investment.status === 'pending' ? 'bg-crypto-warning bg-opacity-20 text-crypto-warning' :
          'bg-gray-500 bg-opacity-20 text-gray-400'
        }`}>
          {investment.status}
        </span>
      </div>

      <div className="space-y-4">
        <div className="flex items-center text-sm text-gray-500">
          <CalendarIcon className="h-4 w-4 mr-2" />
          {remainingDays > 0 ? (
            <span>{remainingDays} days remaining</span>
          ) : (
            <span>Investment period completed</span>
          )}
        </div>

        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-crypto-accent h-2 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>

        {isCompleted && (
          <button
            onClick={handleWithdrawal}
            disabled={loading}
            className="w-full py-2 px-4 bg-crypto-success text-white rounded hover:bg-crypto-success/90 disabled:opacity-50"
          >
            {loading ? (
              <ArrowPathIcon className="h-5 w-5 animate-spin mx-auto" />
            ) : (
              'Withdraw Investment'
            )}
          </button>
        )}
      </div>
    </div>
  )
}