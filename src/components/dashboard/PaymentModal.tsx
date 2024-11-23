// src/components/dashboard/PaymentModal.tsx
'use client'

import { Fragment, useState, useEffect } from 'react'
import { Dialog, Transition, RadioGroup } from '@headlessui/react'
import { QRCodeSVG } from 'qrcode.react'
import { ClipboardIcon, CheckIcon } from '@heroicons/react/24/outline'

const PAYMENT_METHODS = [
  { id: 'btc', name: 'Bitcoin', icon: '₿' },
  { id: 'eth', name: 'Ethereum', icon: 'Ξ' },
  { id: 'usdt', name: 'USDT', icon: '₮' },
  { id: 'sol', name: 'Solana', icon: '◎' }
]

interface PaymentModalProps {
  isOpen: boolean
  onClose: () => void
  investment: {
    plan: string
    amount: number
  }
}

export function PaymentModal({ isOpen, onClose, investment }: PaymentModalProps) {
  const [selectedMethod, setSelectedMethod] = useState(PAYMENT_METHODS[0])
  const [walletAddress, setWalletAddress] = useState('')
  const [copied, setCopied] = useState(false)
  const [paymentStatus, setPaymentStatus] = useState('pending')

  useEffect(() => {
    if (isOpen) {
      fetchWalletAddress(selectedMethod.id)
      startPaymentCheck()
    }
  }, [isOpen, selectedMethod])

  async function fetchWalletAddress(currency: string) {
    const res = await fetch(`/api/wallet/address/${currency}`)
    const data = await res.json()
    setWalletAddress(data.address)
  }

  function startPaymentCheck() {
    const interval = setInterval(async () => {
      const res = await fetch('/api/payments/check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          investmentId: investment.id,
          currency: selectedMethod.id 
        })
      })
      const data = await res.json()
      
      if (data.status === 'confirmed') {
        setPaymentStatus('confirmed')
        clearInterval(interval)
        setTimeout(() => {
          onClose()
          window.location.reload() // Refresh to show mining console
        }, 2000)
      }
    }, 10000) // Check every 10 seconds

    return () => clearInterval(interval)
  }

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
              <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
                Complete Payment
              </Dialog.Title>

              <div className="mt-4">
                <RadioGroup value={selectedMethod} onChange={setSelectedMethod}>
                  <div className="grid grid-cols-2 gap-4">
                    {PAYMENT_METHODS.map((method) => (
                      <RadioGroup.Option
                        key={method.id}
                        value={method}
                        className={({ checked }) =>
                          `${checked ? 'bg-blue-50 border-blue-500' : 'bg-white'}
                          border rounded-lg p-4 cursor-pointer`
                        }
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-lg">{method.icon}</span>
                          <span>{method.name}</span>
                        </div>
                      </RadioGroup.Option>
                    ))}
                  </div>
                </RadioGroup>
              </div>

              {walletAddress && (
                <div className="mt-6 space-y-4">
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
                      className="flex-1 p-2 border rounded"
                    />
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(walletAddress)
                        setCopied(true)
                        setTimeout(() => setCopied(false), 2000)
                      }}
                      className="p-2 text-gray-500 hover:text-gray-700"
                    >
                      {copied ? (
                        <CheckIcon className="w-5 h-5 text-green-500" />
                      ) : (
                        <ClipboardIcon className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                  <p className="text-sm text-gray-500 text-center">
                    Please send exactly ${investment.amount} worth of {selectedMethod.name}
                  </p>
                  {paymentStatus === 'confirmed' && (
                    <div className="p-4 bg-green-50 text-green-700 rounded-lg text-center">
                      Payment confirmed! Redirecting...
                    </div>
                  )}
                </div>
              )}
            </Dialog.Panel>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}