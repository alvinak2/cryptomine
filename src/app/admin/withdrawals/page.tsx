// src/app/admin/withdrawals/page.tsx
'use client'

import { useState, useEffect } from "react"

interface WithdrawalRequest {
  _id: string
  userName: string
  amount: number
  walletAddress: string
  paymentMethod: string
  createdAt: string
}

export default function WithdrawalRequests() {
  const [requests, setRequests] = useState<WithdrawalRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  async function fetchRequests() {
    try {
      const res = await fetch('/api/admin/withdrawals')
      if (!res.ok) throw new Error('Failed to fetch withdrawal requests')
      const data = await res.json()
      setRequests(data)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchRequests()
  }, [])

  async function handleWithdrawal(id: string, status: 'approved' | 'rejected') {
    try {
      const res = await fetch(`/api/admin/withdrawals/${id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      })
      if (!res.ok) throw new Error('Failed to process withdrawal')
      await fetchRequests()
    } catch (err: any) {
      setError(err.message)
    }
  }

  if (loading) return <div>Loading...</div>

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 text-red-600 p-4 rounded-lg">{error}</div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Withdrawal Requests</h1>
      {requests.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-6 text-center text-gray-500">
          No withdrawal requests pending
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Wallet</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Method</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {requests.map((req) => (
                <tr key={req._id}>
                  <td className="px-6 py-4">{req.userName}</td>
                  <td className="px-6 py-4">${req.amount}</td>
                  <td className="px-6 py-4 font-mono text-sm">{req.walletAddress}</td>
                  <td className="px-6 py-4">{req.paymentMethod}</td>
                  <td className="px-6 py-4">{new Date(req.createdAt).toLocaleDateString()}</td>
                  <td className="px-6 py-4 space-x-2">
                    <button
                      onClick={() => handleWithdrawal(req._id, 'approved')}
                      className="text-green-600 hover:text-green-900"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleWithdrawal(req._id, 'rejected')}
                      className="text-red-600 hover:text-red-900"
                    >
                      Reject
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}