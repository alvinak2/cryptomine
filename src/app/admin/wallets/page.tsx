// Update src/app/admin/wallets/page.tsx

'use client'

import { useState, useEffect } from 'react'
import { PencilIcon, CheckIcon, XMarkIcon } from '@heroicons/react/24/outline'

const SUPPORTED_CURRENCIES = [
  { id: 'btc', name: 'Bitcoin (BTC)' },
  { id: 'eth', name: 'Ethereum (ETH)' },
  { id: 'usdt', name: 'USDT (TRC20)' },
  { id: 'sol', name: 'Solana (SOL)' }
]

export default function WalletsManagement() {
  const [wallets, setWallets] = useState([])
  const [editingId, setEditingId] = useState(null)
  const [editValue, setEditValue] = useState('')
  const [formData, setFormData] = useState({
    currency: 'btc',
    address: ''
  })
  const [message, setMessage] = useState({ type: '', text: '' })

  useEffect(() => {
    fetchWallets()
  }, [])

  async function fetchWallets() {
    const res = await fetch('/api/admin/wallets')
    const data = await res.json()
    setWallets(data)
  }

  async function handleUpdate(id: string) {
    try {
      const res = await fetch(`/api/admin/wallets/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ address: editValue })
      })
  
      if (!res.ok) throw new Error(await res.text())
  
      setMessage({ type: 'success', text: 'Wallet address updated successfully' })
      setEditingId(null)
      fetchWallets()
    } catch (error) {
      setMessage({ type: 'error', text: (error as Error).message })
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setMessage({ type: '', text: '' })

    try {
      const res = await fetch('/api/admin/wallets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (!res.ok) throw new Error(await res.text())

      setMessage({ type: 'success', text: 'Wallet address added successfully' })
      setFormData({ ...formData, address: '' })
      fetchWallets()
    } catch (error) {
      setMessage({ type: 'error', text: (error as Error).message })
    }
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6 text-gray-300">Wallet Management</h1>

      {/* Add/Update Form */}
      <div className="bg-crypto-secondary text-gray-300 rounded-lg shadow p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">Add/Update Wallet Address</h2>
        
        {message.text && (
          <div className={`p-4 rounded-md mb-4 ${
            message.type === 'success' ? 'bg-crypto-success bg-opacity-20 text-crypto-success' : 'bg-red-50 text-red-700'
          }`}>
            {message.text}
          </div>
        )}

<form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300">
              Currency
            </label>
            <select
              value={formData.currency}
              onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 bg-crypto-primary text-gray-300 shadow-sm focus:border-crypto-success focus:ring-crypto-success"
            >
              {SUPPORTED_CURRENCIES.map(currency => (
                <option key={currency.id} value={currency.id}>
                  {currency.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300">
              Wallet Address
            </label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 bg-crypto-primary text-gray-300 shadow-sm focus:border-crypto-success focus:ring-crypto-success"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-white bg-crypto-success hover:bg-crypto-success/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-crypto-success"
          >
            Save Wallet Address
          </button>
        </form>
      </div>

      {/* Existing Wallets Table */}
      <div className="overflow-x-auto">
        <div className="inline-block min-w-full align-middle">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-crypto-secondary">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Currency</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Address</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-crypto-primary divide-y divide-gray-700">
              {wallets.map((wallet: any) => (
                <tr key={wallet._id}>
                  <td className="px-6 py-4 text-gray-300">{wallet.currency.toUpperCase()}</td>
                  <td className="px-6 py-4 font-mono text-gray-300">
                    {editingId === wallet._id ? (
                      <input
                        type="text"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        className="w-full border rounded px-2 py-1 bg-crypto-primary text-gray-300"
                      />
                    ) : (
                      wallet.address
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {editingId === wallet._id ? (
                      <>
                        <button
                          onClick={() => handleUpdate(wallet._id)}
                          className="text-crypto-success hover:text-crypto-success/90 mr-2"
                        >
                          <CheckIcon className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <XMarkIcon className="h-5 w-5" />
                        </button>
                        </>
                    ) : (
                      <button
                        onClick={() => {
                          setEditingId(wallet._id)
                          setEditValue(wallet.address)
                        }}
                        className="text-crypto-ethereum hover:text-crypto-ethereum/90"
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
    </div>
  )
}