// src/components/dashboard/PaymentConfirmation.tsx
'use client'

import { useState } from 'react'
import { Dialog } from '@headlessui/react'

export function PaymentConfirmation({ investment, onClose }: { 
  investment: any, 
  onClose: () => void 
}) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handlePaymentConfirmation() {
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/investments/confirm-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ investmentId: investment._id })
      })

      if (!res.ok) throw new Error(await res.text())
      
      onClose()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog.Panel className="bg-white rounded-lg p-6 max-w-md w-full">
      <Dialog.Title className="text-lg font-medium mb-4">
        Confirm Payment
      </Dialog.Title>

      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg">
          {error}
        </div>
      )}

      <div className="space-y-4">
        <div>
          <p className="text-gray-600">Investment Details:</p>
          <ul className="mt-2 space-y-2">
            <li>Plan: {investment.plan}</li>
            <li>Amount: ${investment.amount}</li>
            <li>Payment Method: {investment.paymentMethod}</li>
          </ul>
        </div>

        <p className="text-sm text-gray-500">
          By clicking confirm, you verify that you have sent the payment to the provided wallet address.
          The admin will verify your payment and activate your investment.
        </p>

        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
          >
            Cancel
          </button>
          <button
            onClick={handlePaymentConfirmation}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Confirming...' : 'Confirm Payment Sent'}
          </button>
        </div>
      </div>
    </Dialog.Panel>
  )
}