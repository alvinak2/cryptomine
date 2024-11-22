// src/components/dashboard/WalletAddresses.tsx
'use client'

import { useState } from 'react'
import type { WalletAddress } from '@/types/models'

export default function WalletAddresses() {
  const [wallets, setWallets] = useState<WalletAddress[]>([])
  const [newWallet, setNewWallet] = useState({
    type: 'BTC',
    address: ''
  })

  const handleAddWallet = async (e: React.FormEvent) => {
    e.preventDefault()
    const res = await fetch('/api/wallets', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newWallet)
    })
    if (res.ok) {
      const wallet = await res.json()
      setWallets([...wallets, wallet])
      setNewWallet({ type: 'BTC', address: '' })
    }
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">Wallet Addresses</h2>
      <form onSubmit={handleAddWallet} className="mb-4">
        <div className="flex gap-2">
          <select
            value={newWallet.type}
            onChange={e => setNewWallet({...newWallet, type: e.target.value})}
            className="border p-2 rounded"
          >
            <option value="BTC">BTC</option>
            <option value="ETH">ETH</option>
            <option value="USDT_TRC20">USDT</option>
            <option value="SOL">SOL</option>
          </select>
          <input
            type="text"
            value={newWallet.address}
            onChange={e => setNewWallet({...newWallet, address: e.target.value})}
            placeholder="Wallet Address"
            className="border p-2 rounded flex-1"
          />
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
            Add
          </button>
        </div>
      </form>
      <div className="space-y-2">
        {wallets.map(wallet => (
          <div key={wallet.id} className="flex justify-between border p-2 rounded">
            <span>{wallet.type}</span>
            <span className="text-sm text-gray-600">{wallet.address}</span>
          </div>
        ))}
      </div>
    </div>
  )
}