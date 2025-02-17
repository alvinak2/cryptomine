// src/app/admin/investments/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { CheckIcon, XMarkIcon } from '@heroicons/react/24/outline'

interface Investment {
  _id: string
  userName: string
  plan: string
  amount: number
  status: 'pending' | 'active' | 'completed' | 'rejected'
  createdAt: string
}

export default function InvestmentsManagement() {
  const [investments, setInvestments] = useState<Investment[]>([]) // Initialize as empty array
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchInvestments()
  }, [])

  async function fetchInvestments() {
    try {
      setLoading(true)
      const res = await fetch('/api/admin/investments')
      
      if (!res.ok) {
        throw new Error('Failed to fetch investments')
      }
      
      const data = await res.json()
      setInvestments(data.investments) // Ensure we're setting an array
    } catch (err: any) {
      setError(err.message)
      setInvestments([]) // Reset to empty array on error
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="p-6">Loading...</div>
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 text-red-600 p-4 rounded-lg">
          {error}
        </div>
      </div>
    )
  }

  async function handleStatusUpdate(id: string, status: 'active' | 'rejected') {
    try {
      const res = await fetch(`/api/admin/investments/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      })
  
      if (!res.ok) {
        throw new Error('Failed to update investment status')
      }
  
      // Refresh investments list
      fetchInvestments()
    } catch (err: any) {
      setError(err.message)
    }
  }

  return (
    <div className="p-6">
    <h1 className="text-2xl font-bold mb-6 text-gray-300">Investments Management</h1>

    {error && (
      <div className="mb-4 p-4 bg-red-50 text-red-600 rounded-lg">
        {error}
      </div>
    )}

    {investments.length === 0 ? (
      <div className="bg-crypto-secondary rounded-lg shadow p-6 text-center text-gray-500">
        No investments found
      </div>
    ) : (
      <div className="overflow-x-auto">
      <div className="inline-block min-w-full align-middle">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-crypto-secondary">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">User</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Plan</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Amount</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-crypto-primary divide-y divide-gray-700">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-4 text-center text-gray-300">Loading...</td>
                  </tr>
                ) : investments.map((inv: any) => (
                  <tr key={inv._id}>
                    <td className="px-6 py-4 text-gray-300">{inv.userName}</td>
                    <td className="px-6 py-4 text-gray-300">{inv.plan}</td>
                    <td className="px-6 py-4 text-gray-300">${inv.amount}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        inv.status === 'active' ? 'bg-crypto-success bg-opacity-20 text-crypto-success' :
                        inv.status === 'pending' ? 'bg-crypto-warning bg-opacity-20 text-crypto-warning' :
                        'bg-gray-500 bg-opacity-20 text-gray-400'
                      }`}>
                        {inv.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-300">{new Date(inv.createdAt).toLocaleDateString()}</td>
                    <td className="px-6 py-4">
                      {inv.status === 'pending' && (
                        <>
                          <button
                            onClick={() => handleStatusUpdate(inv._id, 'active')}
                            className="text-crypto-success hover:text-crypto-success/90 mr-2"
                          >
                            <CheckIcon className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => handleStatusUpdate(inv._id, 'rejected')}
                            className="text-red-600 hover:text-red-900"
                          >
                            <XMarkIcon className="h-5 w-5" />
                          </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
          </table>
          </div>
        </div>
      )}
    </div>
  )
}