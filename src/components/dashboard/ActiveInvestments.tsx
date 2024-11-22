// src/components/dashboard/ActiveInvestments.tsx
'use client'

import { useState, useEffect } from 'react'
import type { Investment } from '@/types/models'

export default function ActiveInvestments() {
  const [investments, setInvestments] = useState<Investment[]>([])

  useEffect(() => {
    fetch('/api/investments')
      .then(res => res.json())
      .then(data => setInvestments(data))
  }, [])

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">Active Investments</h2>
      {investments.length === 0 ? (
        <p>No active investments</p>
      ) : (
        <div className="space-y-4">
          {investments.map(investment => (
            <div key={investment.id} className="border p-4 rounded">
              <div className="flex justify-between">
                <div>
                  <p className="font-semibold">{investment.type}</p>
                  <p className="text-sm text-gray-600">
                    Amount: ${investment.amount}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">
                    Return: ${investment.returnAmount}
                  </p>
                  <p className="text-sm text-gray-600">
                    Ends: {new Date(investment.endDate!).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}