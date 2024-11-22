// src/components/admin/WalletConfig.tsx
'use client'

import { useState, useEffect } from 'react'

export function WalletConfig() {
  const [wallets, setWallets] = useState({
    btc: '',
    eth: '',
    usdt: '',
    sol: ''
  })

  useEffect(() => {
    fetchWalletAddresses()
  }, [])

  async function fetchWalletAddresses() {
    const res = await fetch('/api/admin/wallets')
    const data = await res.json()
    setWallets(data)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    await fetch('/api/admin/wallets', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(wallets)
    })
  }

  return (
    <div className="bg-white rounded-lg shadow mt-8">
      <div className="p-6">
        <h2 className="text-xl font-semibold mb-4">Wallet Configuration</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {Object.entries(wallets).map(([type, address]) => (
            <div key={type}>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {type.toUpperCase()} Wallet Address
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => setWallets(prev => ({ ...prev, [type]: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
          ))}
          <button
            type="submit"
            className="w-full py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Save Changes
          </button>
        </form>
      </div>
    </div>
  )
}