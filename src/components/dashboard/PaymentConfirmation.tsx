// src/components/dashboard/PaymentConfirmation.tsx
'use client'

import { useState } from 'react'

interface PaymentConfirmationProps {
  paymentId: string
}

export default function PaymentConfirmation({ paymentId }: PaymentConfirmationProps) {
  const [proof, setProof] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!proof) return

    setLoading(true)
    try {
      // Upload proof to storage (implement your upload logic)
      const formData = new FormData()
      formData.append('file', proof)
      const uploadRes = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      })
      const { url } = await uploadRes.json()

      // Request payment verification
      await fetch(`/api/payments/${paymentId}/request-verification`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ proof: url })
      })

      window.location.reload()
    } catch (error) {
      console.error('Failed to submit proof:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">
          Upload Payment Proof
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={e => setProof(e.target.files?.[0] || null)}
          className="w-full"
          required
        />
      </div>
      <button
        type="submit"
        disabled={!proof || loading}
        className={`w-full p-2 rounded text-white ${
          loading ? 'bg-blue-300' : 'bg-blue-500 hover:bg-blue-600'
        }`}
      >
        {loading ? 'Submitting...' : 'Submit for Verification'}
      </button>
    </form>
  )
}