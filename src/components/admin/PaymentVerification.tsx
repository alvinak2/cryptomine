// src/components/admin/PaymentVerification.tsx
'use client'

import { useState } from 'react'
import Image from 'next/image'

interface Payment {
  id: string
  amount: number
  walletType: string
  status: string
  proof: string
  requestedAt: string
  userId: string
}

export default function PaymentVerification({ payments }: { payments: Payment[] }) {
  const [loading, setLoading] = useState<string | null>(null)

  const handleVerification = async (paymentId: string, action: 'approve' | 'reject') => {
    setLoading(paymentId)
    try {
      const rejectionReason = action === 'reject' 
        ? window.prompt('Please provide rejection reason:')
        : null

      if (action === 'reject' && !rejectionReason) {
        return
      }

      await fetch(`/api/admin/payments/${paymentId}/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, rejectionReason })
      })

      window.location.reload()
    } catch (error) {
      console.error('Verification failed:', error)
    } finally {
      setLoading(null)
    }
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Pending Payment Verifications</h3>
      {payments.map(payment => (
        <div key={payment.id} className="border p-4 rounded">
          <div className="flex justify-between mb-2">
            <div>
              <p>Amount: ${payment.amount}</p>
              <p>Wallet: {payment.walletType}</p>
              <p>Requested: {new Date(payment.requestedAt).toLocaleString()}</p>
            </div>
            <div>
              {payment.proof && (
                <Image 
                  src={payment.proof}
                  alt="Payment proof"
                  width={200}
                  height={200}
                  className="rounded"
                />
              )}
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => handleVerification(payment.id, 'approve')}
              disabled={loading === payment.id}
              className="bg-green-500 text-white px-4 py-2 rounded"
            >
              Approve
            </button>
            <button
              onClick={() => handleVerification(payment.id, 'reject')}
              disabled={loading === payment.id}
              className="bg-red-500 text-white px-4 py-2 rounded"
            >
              Reject
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}