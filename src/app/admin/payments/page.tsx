// src/app/admin/payments/page.tsx
'use client'

import { useState, useEffect, useCallback } from 'react'
import { CheckIcon, XMarkIcon } from '@heroicons/react/24/outline'

interface Payment {
  _id: string
  userName: string
  userEmail: string
  plan: string
  amount: number
  paymentMethod: string
  createdAt: string
}

export default function PendingPayments() {
  const [payments, setPayments] = useState<Payment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchPendingPayments = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/payments/pending')
      if (!res.ok) throw new Error('Failed to fetch payments')
      const data = await res.json()
      setPayments(data)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchPendingPayments()
    const interval = setInterval(fetchPendingPayments, 30000)
    return () => clearInterval(interval)
  }, [fetchPendingPayments])

  async function handleVerification(id: string, status: 'approved' | 'rejected') {
    try {
      const res = await fetch(`/api/admin/payments/verify/${id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      })
  
      if (!res.ok) {
        const error = await res.text()
        throw new Error(error)
      }
  
      fetchPendingPayments()
    } catch (err: any) {
      setError(err.message)
    }
  }

  if (loading) return <div className="p-6">Loading...</div>

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 text-red-600 p-4 rounded-lg">{error}</div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Pending Payment Verifications</h1>

      {payments.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-6 text-center text-gray-500">
          No pending payments to verify
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Plan</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Payment Method</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {payments.map((payment) => (
                <tr key={payment._id}>
                  <td className="px-6 py-4">{payment.userName}</td>
                  <td className="px-6 py-4">{payment.plan}</td>
                  <td className="px-6 py-4">${payment.amount}</td>
                  <td className="px-6 py-4">{payment.paymentMethod?.toUpperCase() || 'N/A'}</td>
                  <td className="px-6 py-4">{new Date(payment.createdAt).toLocaleDateString()}</td>
                  <td className="px-6 py-4 space-x-2">
                    <button
                      onClick={() => handleVerification(payment._id, 'approved')}
                      className="text-green-600 hover:text-green-900"
                    >
                      <CheckIcon className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleVerification(payment._id, 'rejected')}
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
      )}
    </div>
  )
}