// src/components/admin/RecentInvestments.tsx
'use client'

import { useState, useEffect, useCallback } from 'react'

interface Investment {
  _id: string
  userName: string
  plan: string
  amount: number
  status: string
  createdAt: string
}

export function RecentInvestments() {
  const [investments, setInvestments] = useState<Investment[]>([])
  const [loading, setLoading] = useState(true)

  const fetchInvestments = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/investments/recent')
      if (!res.ok) throw new Error('Failed to fetch investments')
      const data = await res.json()
      setInvestments(data)
    } catch (error) {
      console.error('Error fetching recent investments:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchInvestments()
    // Refresh every 30 seconds
    const interval = setInterval(fetchInvestments, 30000)
    return () => clearInterval(interval)
  }, [fetchInvestments])

  if (loading) return <div>Loading investments...</div>

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead>
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Plan</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {investments.map((inv) => (
            <tr key={inv._id}>
              <td className="px-6 py-4">{inv.userName}</td>
              <td className="px-6 py-4">{inv.plan}</td>
              <td className="px-6 py-4">${inv.amount}</td>
              <td className="px-6 py-4">
                <span className={`px-2 py-1 rounded-full text-xs ${
                  inv.status === 'active' ? 'bg-green-100 text-green-800' :
                  inv.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {inv.status}
                </span>
              </td>
              <td className="px-6 py-4">{new Date(inv.createdAt).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}