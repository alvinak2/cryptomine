// src/app/dashboard/wallet/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import { ClipboardIcon, CheckIcon } from '@heroicons/react/24/outline'

const SUPPORTED_CRYPTOS = [
  { name: 'Bitcoin', symbol: 'BTC', icon: '₿' },
  { name: 'Ethereum', symbol: 'ETH', icon: 'Ξ' },
  { name: 'USDT', symbol: 'USDT', icon: '₮' },
  { name: 'Solana', symbol: 'SOL', icon: '◎' },
]

export default function WalletPage() {
  const [addresses, setAddresses] = useState<Record<string, string>>({})
  const [copied, setCopied] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchAddresses()
  }, [])


  async function fetchAddresses() {
    try {
      const res = await fetch('/api/user/wallets')
      if (!res.ok) throw new Error('Failed to fetch wallet addresses')
      const data = await res.json()
      setAddresses(data)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Wallet Management</h1>
        <div className="grid md:grid-cols-2 gap-6">
          {SUPPORTED_CRYPTOS.map((crypto) => (
            <div key={crypto.symbol} className="bg-white p-6 rounded-lg shadow animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
              <div className="h-10 bg-gray-200 rounded mb-4"></div>
              <div className="h-32 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 text-red-600 p-4 rounded-lg">
          {error}
        </div>
      </div>
    )
  }

async function handleAddressUpdate(crypto: string, address: string) {
  try {
    const res = await fetch('/api/user/wallets', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ [crypto]: address })
    })
    if (!res.ok) throw new Error('Failed to update address')
    fetchAddresses()
  } catch (error) {
    console.error('Error updating address:', error)
  }
}

function copyToClipboard(text: string, crypto: string) {
  navigator.clipboard.writeText(text)
  setCopied(crypto)
  setTimeout(() => setCopied(''), 2000)
}

return (
  <div className="p-6">
    <h1 className="text-2xl font-bold mb-6">Wallet Management</h1>
    
    <div className="grid md:grid-cols-2 gap-6">
      {SUPPORTED_CRYPTOS.map((crypto) => (
        <div key={crypto.symbol} className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center mb-4">
            <span className="text-2xl mr-2">{crypto.icon}</span>
            <h2 className="text-lg font-semibold">{crypto.name}</h2>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Your {crypto.name} Address
              </label>
              <div className="flex">
                <input
                  type="text"
                  value={addresses[crypto.symbol.toLowerCase()] || ''}
                  onChange={(e) => handleAddressUpdate(crypto.symbol.toLowerCase(), e.target.value)}
                  className="flex-1 rounded-l-md border-r-0 border-gray-300"
                  placeholder={`Enter your ${crypto.name} address`}
                />
                <button
                  onClick={() => copyToClipboard(addresses[crypto.symbol.toLowerCase()], crypto.symbol)}
                  className="px-3 py-2 bg-gray-50 border border-l-0 border-gray-300 rounded-r-md hover:bg-gray-100"
                >
                  {copied === crypto.symbol ? (
                    <CheckIcon className="h-5 w-5 text-green-500" />
                  ) : (
                    <ClipboardIcon className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            {addresses[crypto.symbol.toLowerCase()] && (
              <div className="flex justify-center">
                <QRCodeSVG
                  value={addresses[crypto.symbol.toLowerCase()]}
                  size={120}
                  level="L"
                />
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  </div>
)
}