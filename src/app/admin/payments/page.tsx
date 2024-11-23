// src/app/admin/payments/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { CheckIcon, XMarkIcon } from '@heroicons/react/24/outline'

export default function PendingPayments() {
  const [payments, setPayments] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPendingPayments()
  }, [])

  async function fetchPendingPayments() {
    const res = await fetch('/api/admin/payments/pending')
    const data = await res.json()
    setPayments(data)
    setLoading(false)
  }

  async function handleVerification(id: string, status: 'approved' | 'rejected') {
    await fetch(`/api/admin/payments/verify/${id}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    })
    fetchPendingPayments()
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Pending Payment Verifications</h1>

      <div className="overflow-x-auto -mx-4 sm:mx-0">
  <div className="inline-block min-w-full align-middle">
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
            {payments.map((payment: any) => (
              <tr key={payment._id}>
                <td className="px-6 py-4">{payment.userName}</td>
                <td className="px-6 py-4">{payment.plan}</td>
                <td className="px-6 py-4">${payment.amount}</td>
                <td className="px-6 py-4">{payment.paymentMethod.toUpperCase()}</td>
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
      </div>
    </div>
  )
}