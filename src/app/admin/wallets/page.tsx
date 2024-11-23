// src/app/admin/wallets/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { PencilIcon, TrashIcon, CheckIcon } from '@heroicons/react/24/outline'

interface Wallet {
  _id: string
  currency: string
  address: string
}

export default function AdminWallets() {
  const [wallets, setWallets] = useState<Wallet[]>([])
  const [editId, setEditId] = useState<string | null>(null)
  const [newAddress, setNewAddress] = useState('')

  useEffect(() => {
    fetchWallets()
  }, [])

  async function fetchWallets() {
    const res = await fetch('/api/admin/wallets')
    const data = await res.json()
    setWallets(data)
  }

  async function updateWallet(id: string, address: string) {
    const res = await fetch(`/api/admin/wallets/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ address })
    })
    if (res.ok) {
      await fetchWallets()
      setEditId(null)
    }
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Wallet Management</h2>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Currency</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Address</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {wallets.map((wallet) => (
              <tr key={wallet._id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  {wallet.currency.toUpperCase()}
                </td>
                <td className="px-6 py-4">
                  {editId === wallet._id ? (
                    <input
                      type="text"
                      value={newAddress}
                      onChange={(e) => setNewAddress(e.target.value)}
                      className="w-full border rounded px-2 py-1"
                    />
                  ) : (
                    <span className="font-mono">{wallet.address}</span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {editId === wallet._id ? (
                    <button
                      onClick={() => updateWallet(wallet._id, newAddress)}
                      className="text-green-600 hover:text-green-900 mr-2"
                    >
                      <CheckIcon className="h-5 w-5" />
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        setEditId(wallet._id)
                        setNewAddress(wallet.address)
                      }}
                      className="text-blue-600 hover:text-blue-900 mr-2"
                    >
                      <PencilIcon className="h-5 w-5" />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}