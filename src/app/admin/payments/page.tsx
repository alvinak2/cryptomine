// src/app/admin/payments/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { CheckIcon, XMarkIcon } from '@heroicons/react/24/outline'

export default function AdminPayments() {
  const [pendingPayments, setPendingPayments] = useState([])

  useEffect(() => {
    fetchPendingPayments()
  }, [])

  async function fetchPendingPayments() {
    const res = await fetch('/api/admin/payments/pending')
    const data = await res.json()
    setPendingPayments(data)
  }

  async function handleVerification(investmentId: string, status: 'approved' | 'rejected') {
    await fetch(`/api/admin/payments/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ investmentId, status })
    })
    fetchPendingPayments()
  }

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Pending Payment Verifications</h2>
      <div className="bg-white rounded-lg shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Plan</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Payment Method</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {pendingPayments.map((payment: any) => (
              <tr key={payment._id}>
                <td className="px-6 py-4">{payment.userName}</td>
                <td className="px-6 py-4">{payment.plan}</td>
                <td className="px-6 py-4">${payment.amount}</td>
                <td className="px-6 py-4">{payment.paymentMethod}</td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => handleVerification(payment._id, 'approved')}
                    className="text-green-600 hover:text-green-900 mr-2"
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
  )
}