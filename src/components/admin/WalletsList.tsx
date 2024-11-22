// src/components/admin/WalletsList.tsx
'use client'

import { useState } from 'react'
import type { WalletAddress } from '@/types/models'

type WalletsListProps = {
  initialWallets: WalletAddress[]
}

export default function WalletsList({ initialWallets }: WalletsListProps) {
  const [wallets, setWallets] = useState(initialWallets)

  const handleDeleteWallet = async (id: string) => {
    if (!confirm('Are you sure you want to delete this wallet?')) return

    try {
      const res = await fetch(`/api/admin/wallets/${id}`, {
        method: 'DELETE'
      })
      
      if (res.ok) {
        setWallets(wallets.filter(wallet => wallet.id !== id))
      }
    } catch (error) {
      console.error('Failed to delete wallet:', error)
    }
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-4 text-left">Type</th>
            <th className="p-4 text-left">Address</th>
            <th className="p-4 text-left">User</th>
            <th className="p-4 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {wallets.map(wallet => (
            <tr key={wallet.id} className="border-b">
              <td className="p-4">{wallet.type}</td>
              <td className="p-4">{wallet.address}</td>
              <td className="p-4">{wallet.userId}</td>
              <td className="p-4">
                <button
                  onClick={() => handleDeleteWallet(wallet.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}