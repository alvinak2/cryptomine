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

  useEffect(() => {
    fetchAddresses()
  }, [])

  async function fetchAddresses() {
    const res = await fetch('/api/wallet')
    const data = await res.json()
    setAddresses(data)
    setLoading(false)
  }

  async function handleAddressUpdate(crypto: string, address: string) {
    const res = await fetch('/api/wallet', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: crypto, address })
    })
    if (res.ok) {
      fetchAddresses()
    }
  }

  function copyToClipboard(text: string, crypto: string) {
    navigator.clipboard.writeText(text)
    setCopied(crypto)
    setTimeout(() => setCopied(''), 2000)
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Wallet Management</h1>

      <div className="grid md:grid-cols-2 gap-6">
        {SUPPORTED_CRYPTOS.map((crypto) => (
          <div key={crypto.symbol} className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold flex items-center">
                <span className="mr-2">{crypto.icon}</span>
                {crypto.name}
              </h3>
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
                    className="flex-1 border rounded-l-md px-3 py-2"
                    placeholder={`Enter your ${crypto.name} address`}
                  />
                  <button
                    onClick={() => copyToClipboard(addresses[crypto.symbol.toLowerCase()], crypto.symbol)}
                    className="px-3 py-2 bg-gray-100 border border-l-0 rounded-r-md hover:bg-gray-200"
                  >
                    {copied === crypto.symbol ? (
                      <CheckIcon className="w-5 h-5 text-green-500" />
                    ) : (
                      <ClipboardIcon className="w-5 h-5 text-gray-500" />
                    )}
                  </button>
                </div>
              </div>
              
              {addresses[crypto.symbol.toLowerCase()] && (
                <div className="flex justify-center">
                  <QRCodeSVG
                    value={addresses[crypto.symbol.toLowerCase()]}
                    size={120}
                    bgColor="#ffffff"
                    fgColor="#000000"
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