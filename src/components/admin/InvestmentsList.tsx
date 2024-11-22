// src/components/admin/InvestmentsList.tsx
'use client'

import { useState } from 'react'
import type { Investment } from '@/types/models'

type InvestmentsListProps = {
  initialInvestments: Investment[]
}

export default function InvestmentsList({ initialInvestments }: InvestmentsListProps) {
  const [investments, setInvestments] = useState(initialInvestments)

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      const res = await fetch(`/api/admin/investments/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      })
      
      if (res.ok) {
        setInvestments(investments.map(inv => 
          inv.id === id ? { ...inv, status } : inv
        ))
      }
    } catch (error) {
      console.error('Failed to update investment:', error)
    }
  }

  return (
    <div className="overflow-x-auto">
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
            <tr key={investment.id} className="border-b">
              <td className="p-4">{investment.type}</td>
              <td className="p-4">${investment.amount}</td>
              <td className="p-4">{investment.status}</td>
              <td className="p-4">{investment.userId}</td>
              <td className="p-4">
                <select
                  value={investment.status}
                  onChange={(e) => handleUpdateStatus(investment.id, e.target.value)}
                  className="border rounded p-1"
                >
                  <option value="PENDING">Pending</option>
                  <option value="ACTIVE">Active</option>
                  <option value="COMPLETED">Completed</option>
                  <option value="CANCELLED">Cancelled</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}