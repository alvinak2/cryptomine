// src/components/admin/PendingInvestments.tsx
'use client'

import { useState, useEffect } from 'react'
import { CheckIcon, XMarkIcon } from '@heroicons/react/24/outline'

export function PendingInvestments() {
  const [investments, setInvestments] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPendingInvestments()
  }, [])

  async function fetchPendingInvestments() {
    const res = await fetch('/api/admin/investments/pending')
    const data = await res.json()
    setInvestments(data)
    setLoading(false)
  }

  async function handleApproval(id: string, status: 'approved' | 'rejected') {
    await fetch(`/api/admin/investments/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    })
    fetchPendingInvestments()
  }

  if (loading) return <div>Loading...</div>

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead>
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Plan</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {investments.map((inv: any) => (
            <tr key={inv._id}>
              <td className="px-6 py-4">{inv.userName}</td>
              <td className="px-6 py-4">{inv.plan}</td>
              <td className="px-6 py-4">${inv.amount}</td>
              <td className="px-6 py-4">
                <button
                  onClick={() => handleApproval(inv._id, 'approved')}
                  className="text-green-600 hover:text-green-900 mr-2"
                >
                  <CheckIcon className="h-5 w-5" />
                </button>
                <button
                  onClick={() => handleApproval(inv._id, 'rejected')}
                  className="text-red-600 hover:text-red-900"
                >
                  <XMarkIcon className="h-5 w-5" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}