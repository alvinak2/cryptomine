// src/components/dashboard/InvestmentConfirmation.tsx
'use client'

import { useState, useEffect } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import { Dialog, RadioGroup } from '@headlessui/react'
import { ClipboardIcon, CheckIcon } from '@heroicons/react/24/outline'

const PAYMENT_METHODS = [
  { id: 'btc', name: 'Bitcoin', icon: '₿' },
  { id: 'eth', name: 'Ethereum', icon: 'Ξ' },
  { id: 'usdt', name: 'USDT', icon: '₮' },
  { id: 'sol', name: 'Solana', icon: '◎' }
]

export function InvestmentConfirmation({ 
  isOpen,
  onClose,
  investment 
}: {
  isOpen: boolean
  onClose: () => void
  investment: any
}) {
  const [selectedMethod, setSelectedMethod] = useState(PAYMENT_METHODS[0])
  const [walletAddress, setWalletAddress] = useState('')
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (selectedMethod) {
      fetchWalletAddress(selectedMethod.id)
    }
  }, [selectedMethod])

  async function fetchWalletAddress(currency: string) {
    const res = await fetch(`/api/wallet/address/${currency}`)
    const data = await res.json()
    setWalletAddress(data.address)
  }

  async function handlePaymentConfirmation() {
    await fetch('/api/investments/confirm-payment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        investmentId: investment._id,
        paymentMethod: selectedMethod.id
      })
    })
    onClose()
  }

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="mx-auto max-w-md bg-white rounded-xl p-6">
          <Dialog.Title className="text-lg font-medium mb-4">
            Complete Payment
          </Dialog.Title>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Select Payment Method
              </label>
              <RadioGroup value={selectedMethod} onChange={setSelectedMethod}>
                <div className="grid grid-cols-2 gap-3">
                  {PAYMENT_METHODS.map((method) => (
                    <RadioGroup.Option
                      key={method.id}
                      value={method}
                      className={({ checked }) =>
                        `${checked ? 'bg-blue-50 border-blue-500' : 'bg-white'}
                        border rounded-lg p-3 cursor-pointer flex items-center`
                      }
                    >
                      <span className="text-lg mr-2">{method.icon}</span>
                      <span>{method.name}</span>
                    </RadioGroup.Option>
                  ))}
                </div>
              </RadioGroup>
            </div>

            {walletAddress && (
              <div className="space-y-4">
                <div className="flex justify-center">
                  <QRCodeSVG
                    value={walletAddress}
                    size={200}
                    bgColor="#ffffff"
                    fgColor="#000000"
                    level="L"
                  />
                </div>
                
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={walletAddress}
                    readOnly
                    className="flex-1 p-2 border rounded bg-gray-50"
                  />
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(walletAddress)
                      setCopied(true)
                      setTimeout(() => setCopied(false), 2000)
                    }}
                    className="p-2"
                  >
                    {copied ? (
                      <CheckIcon className="w-5 h-5 text-green-500" />
                    ) : (
                      <ClipboardIcon className="w-5 h-5" />
                    )}
                  </button>
                </div>

                <p className="text-sm text-center text-gray-500">
                  Please send exactly ${investment.amount} worth of {selectedMethod.name}
                </p>

                <button
                  onClick={handlePaymentConfirmation}
                  className="w-full py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                >
                  I Have Made the Payment
                </button>
              </div>
            )}
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  )
}