// src/components/admin/InvestmentsList.tsx
'use client'

import { useState } from 'react'
import type { Investment } from '@/types/models'

const INVESTMENT_STATUSES = ['PENDING', 'ACTIVE', 'COMPLETED', 'CANCELLED'] as const
type InvestmentStatus = typeof INVESTMENT_STATUSES[number]

export default function InvestmentsList({ initialInvestments }: { initialInvestments: Investment[] }) {
  const [investments, setInvestments] = useState<Investment[]>(initialInvestments)

  const handleUpdateStatus = async (id: string, newStatus: InvestmentStatus) => {
    try {
      const res = await fetch(`/api/admin/investments/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      })
      
      if (!res.ok) throw new Error('Failed to update status')
      const updatedInvestment: Investment = await res.json()
      
      setInvestments(prev => 
        prev.map(inv => inv.id === id ? updatedInvestment : inv)
      )
    } catch (error) {
      console.error('Failed to update investment:', error)
    }
  }

  return (
    <table className="min-w-full">
      <thead>
        <tr className="bg-gray-100">
        <th className="p-4 text-left">Type</th>
        <th className="p-4 text-left">Amount</th>
        <th className="p-4 text-left">Status</th>
        <th className="p-4 text-left">User</th>
        <th className="p-4 text-left">Actions</th>
        </tr>
      </thead>
      <tbody>
        {investments.map(investment => (
          <tr key={investment.id}>
            <td className="p-4">{investment.type}</td>
            <td className="p-4">${investment.amount}</td>
            <td className="p-4">{investment.status}</td>
            <td className="p-4">{investment.userId}</td>
            <td className="p-4">
              <select
                value={investment.status}
                onChange={(e) => handleUpdateStatus(
                  investment.id,
                  e.target.value as InvestmentStatus
                )}
                className="border rounded p-1"
              >
                {INVESTMENT_STATUSES.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

  