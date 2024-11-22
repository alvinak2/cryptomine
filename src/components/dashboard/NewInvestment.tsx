// src/components/dashboard/NewInvestment.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

const INVESTMENT_PLANS = [
  { type: 'BASIC', minimum: 100, days: 30, return: 50 },
  { type: 'PRO', minimum: 500, days: 20, return: 50 },
  { type: 'ELITE', minimum: 1000, days: 10, return: 50 }
] as const

type InvestmentType = typeof INVESTMENT_PLANS[number]['type']

export default function NewInvestment() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    type: 'BASIC' as InvestmentType,
    amount: '',
    walletType: 'BTC'
  })
  const [error, setError] = useState('')

  const selectedPlan = INVESTMENT_PLANS.find(plan => plan.type === formData.type)
  const returnAmount = selectedPlan ? Number(formData.amount) * (selectedPlan.return / 100) : 0
  const isValidAmount = selectedPlan && Number(formData.amount) >= selectedPlan.minimum

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    if (!isValidAmount) {
      setError(`Minimum investment for ${formData.type} is $${selectedPlan?.minimum}`)
      setLoading(false)
      return
    }

    try {
      const res = await fetch('/api/investments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: formData.type,
          amount: Number(formData.amount),
          walletType: formData.walletType
        })
      })

      if (!res.ok) {
        throw new Error('Failed to create investment')
      }

      router.refresh()
      setFormData({ type: 'BASIC', amount: '', walletType: 'BTC' })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">New Investment</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Investment Plan</label>
          <select
            value={formData.type}
            onChange={e => setFormData({...formData, type: e.target.value as InvestmentType})}
            className="w-full p-2 border rounded"
            disabled={loading}
          >
            {INVESTMENT_PLANS.map(plan => (
              <option key={plan.type} value={plan.type}>
                {plan.type} (Min: ${plan.minimum}, {plan.days} days)
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Amount ($)</label>
          <input
            type="number"
            value={formData.amount}
            onChange={e => setFormData({...formData, amount: e.target.value})}
            className="w-full p-2 border rounded"
            min={selectedPlan?.minimum}
            required
            disabled={loading}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Payment Method</label>
          <select
            value={formData.walletType}
            onChange={e => setFormData({...formData, walletType: e.target.value})}
            className="w-full p-2 border rounded"
            disabled={loading}
          >
            <option value="BTC">Bitcoin</option>
            <option value="ETH">Ethereum</option>
            <option value="USDT_TRC20">USDT (TRC20)</option>
            <option value="SOL">Solana</option>
          </select>
        </div>

        {formData.amount && (
          <div className="bg-gray-50 p-4 rounded">
            <p className="text-sm text-gray-600">Investment Summary:</p>
            <p>Amount: ${Number(formData.amount).toFixed(2)}</p>
            <p>Expected Return: ${returnAmount.toFixed(2)}</p>
            <p>Duration: {selectedPlan?.days} days</p>
          </div>
        )}

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button
          type="submit"
          className={`w-full p-2 rounded text-white ${
            loading ? 'bg-blue-300' : 'bg-blue-500 hover:bg-blue-600'
          }`}
          disabled={loading || !isValidAmount}
        >
          {loading ? 'Creating Investment...' : 'Create Investment'}
        </button>
      </form>
    </div>
  )
}