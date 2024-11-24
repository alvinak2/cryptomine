// src/components/dashboard/WalletAddresses.tsx
'use client'

import { useState } from 'react'

export function WalletAddresses() {
  const [wallets, setWallets] = useState({
    btc: '',
    eth: '',
    usdt: '',
    sol: ''
  })

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    await fetch('/api/user/wallets', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(wallets)
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {Object.entries(wallets).map(([type, address]) => (
        <div key={type}>
          <label className="block text-sm font-medium text-gray-700">
            {type.toUpperCase()} Wallet Address
          </label>
          <input
            type="text"
            value={address}
            onChange={(e) => setWallets(prev => ({ ...prev, [type]: e.target.value }))}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            placeholder={`Enter your ${type.toUpperCase()} address`}
          />
        </div>
      ))}
      <button
        type="submit"
        className="w-full py-2 px-4 bg-blue-600 text-white rounded-md"
      >
        Save Wallet Addresses
      </button>
    </form>
  )
}