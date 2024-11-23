// src/components/dashboard/InvestmentModal.tsx
'use client'

import { useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { Fragment } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import { ClipboardIcon, CheckIcon } from '@heroicons/react/24/outline'

const PAYMENT_METHODS = [
  { id: 'btc', name: 'Bitcoin', icon: '₿' },
  { id: 'eth', name: 'Ethereum', icon: 'Ξ' },
  { id: 'usdt', name: 'USDT', icon: '₮' },
  { id: 'sol', name: 'Solana', icon: '◎' }
]

export function InvestmentModal({ isOpen, onClose, plan }: any) {
  const [step, setStep] = useState<'amount' | 'payment'>('amount')
  const [amount, setAmount] = useState(plan.min)
  const [selectedMethod, setSelectedMethod] = useState(PAYMENT_METHODS[0])
  const [walletAddress, setWalletAddress] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)
  const [investment, setInvestment] = useState(null)

  async function handleInvestment(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/investments/create', {  // Make sure this path matches your API route
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          plan: plan.name,
          amount
        })
      })

      if (!res.ok) throw new Error(await res.text())

      const data = await res.json()
      setInvestment(data)
      setStep('payment')
      await fetchWalletAddress(selectedMethod.id)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  async function fetchWalletAddress(currency: string) {
    try {
      console.log('Fetching wallet address for:', currency) // Debug log
      const res = await fetch(`/api/wallet/address/${currency.toLowerCase()}`)
      
      if (!res.ok) {
        const errorText = await res.text()
        throw new Error(errorText)
      }
      
      const data = await res.json()
      setWalletAddress(data.address)
    } catch (err: any) {
      console.error('Wallet fetch error:', err)
      setError(err.message)
    }
  }

  async function handlePaymentConfirmation() {
    setLoading(true)
    try {
      const res = await fetch('/api/investments/confirm-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          investmentId: investment?._id,
          paymentMethod: selectedMethod.id
        })
      })

      if (!res.ok) throw new Error(await res.text())
      onClose()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
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
              {step === 'amount' ? (
                <>
                  <Dialog.Title className="text-lg font-medium mb-4">
                    Invest in {plan.name} Plan
                  </Dialog.Title>

                  {error && (
                    <div className="mb-4 p-3 bg-red-50 text-red-600 rounded">
                      {error}
                    </div>
                  )}

                  <form onSubmit={handleInvestment}>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700">
                        Investment Amount (USD)
                      </label>
                      <input
                        type="number"
                        min={plan.min}
                        value={amount}
                        onChange={(e) => setAmount(Number(e.target.value))}
                        className="mt-1 block w-full rounded border-gray-300 shadow-sm"
                        required
                      />
                    </div>

                    <div className="flex justify-end space-x-3">
                      <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={loading || amount < plan.min}
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                      >
                        {loading ? 'Processing...' : 'Continue to Payment'}
                      </button>
                    </div>
                  </form>
                </>
              ) : (
                <>
                  <Dialog.Title className="text-lg font-medium mb-4">
                    Complete Payment
                  </Dialog.Title>

                  {error && (
                    <div className="mb-4 p-3 bg-red-50 text-red-600 rounded">
                      {error}
                    </div>
                  )}

                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      {PAYMENT_METHODS.map(method => (
                        <button
                          key={method.id}
                          onClick={() => {
                            setSelectedMethod(method)
                            fetchWalletAddress(method.id)
                          }}
                          className={`p-4 rounded-lg border ${
                            selectedMethod.id === method.id 
                              ? 'border-blue-500 bg-blue-50' 
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <span className="text-2xl mr-2">{method.icon}</span>
                          {method.name}
                        </button>
                      ))}
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
                            className="flex-1 p-2 border rounded bg-gray-50 font-mono text-sm"
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
                              <CheckIcon className="h-5 w-5 text-green-500" />
                            ) : (
                              <ClipboardIcon className="h-5 w-5" />
                            )}
                          </button>
                        </div>

                        <button
                          onClick={handlePaymentConfirmation}
                          disabled={loading}
                          className="w-full py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                        >
                          {loading ? 'Confirming...' : 'I Have Made the Payment'}
                        </button>
                      </div>
                    )}
                  </div>
                </>
              )}
            </Dialog.Panel>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}