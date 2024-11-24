// src/components/dashboard/InvestmentCard.tsx
'use client'

import { useState, useCallback } from 'react'
import { CalendarIcon, ArrowPathIcon } from '@heroicons/react/24/outline'
import { INVESTMENT_PLANS } from '@/lib/constants'
import { toast } from 'react-hot-toast'

interface InvestmentCardProps {
  investment: {
    _id: string
    plan: string
    amount: number
    startDate: string
    endDate: string
    status: string
    returns: number
  }
}

export function InvestmentCard({ investment, onUpdate }) {
  const [loading, setLoading] = useState(false)

  const getDuration = (plan: string) => {
    return INVESTMENT_PLANS[plan]?.duration || 30
  }

  // Calculate remaining days
  const endDate = new Date(investment.endDate)
  const now = new Date()
  const totalDays = getDuration(investment.plan)
  const elapsedDays = Math.floor((now.getTime() - new Date(investment.startDate).getTime()) / (1000 * 3600 * 24))
  const remainingDays = Math.max(0, totalDays - elapsedDays)
  const isCompleted = remainingDays === 0 && investment.status === 'active'

  const handleWithdrawal = useCallback(async () => {
    if (!confirm('Are you sure you want to withdraw this investment?')) return
    
    setLoading(true)
    try {
      const res = await fetch(`/api/investments/${investment._id}/withdraw`, {
        method: 'POST'
      })
      
      if (!res.ok) throw new Error('Failed to withdraw')
      onUpdate?.() // Callback to refresh parent data
    } catch (error) {
      console.error('Withdrawal error:', error)
    } finally {
      setLoading(false)
    }
  }, [investment._id, onUpdate])

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold">{investment.plan} Plan</h3>
          <p className="text-gray-600">${investment.amount}</p>
        </div>
        <span className={`px-2 py-1 rounded-full text-xs ${
          investment.status === 'active' ? 'bg-green-100 text-green-800' :
          investment.status === 'completed' ? 'bg-blue-100 text-blue-800' :
          'bg-gray-100 text-gray-800'
        }`}>
          {investment.status}
        </span>
      </div>

      <div className="space-y-2">
        <div className="flex items-center text-sm text-gray-500">
          <CalendarIcon className="h-4 w-4 mr-2" />
          {remainingDays > 0 ? (
            <span>{remainingDays} days remaining</span>
          ) : (
            <span>Investment period completed</span>
          )}
        </div>
        
        <div className="text-sm">
          <span className="text-gray-500">Returns:</span>
          <span className="ml-2 font-semibold">${investment.returns.toFixed(2)}</span>
        </div>
      </div>

      {isCompleted && (
        <button
          onClick={handleWithdrawal}
          disabled={loading}
          className="mt-4 w-full py-2 px-4 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
        >
          {loading ? (
            <ArrowPathIcon className="h-5 w-5 animate-spin mx-auto" />
          ) : (
            'Withdraw Investment'
          )}
        </button>
      )}
    </div>
  )
}