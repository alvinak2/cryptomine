// src/components/dashboard/InvestmentModal.tsx
'use client'

import { Fragment, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { InvestmentConfirmation } from './InvestmentConfirmation'

interface Plan {
  name: string
  min: number
  duration: number
  return: number
}

interface InvestmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  plan: Plan;
  onInvestmentComplete: (investment: any) => void;
}

export function InvestmentModal({ isOpen, onClose, plan, onInvestmentComplete}: InvestmentModalProps) {
  const [amount, setAmount] = useState(plan.min)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPayment, setShowPayment] = useState(false)
  const [newInvestment, setNewInvestment] = useState(null)

  async function handleInvestment(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
  
    try {
      const res = await fetch('/api/investments/purchase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          plan: plan.name,
          amount
        })
      })

      if (!res.ok) {
        throw new Error(await res.text())
      }

      const data = await res.json()
      onInvestmentComplete(data) // Call parent handler instead of managing state locally
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const expectedReturn = amount * (1 + plan.return/100)

  return (
    <>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-40" onClose={onClose}>
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
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
                    Invest in {plan.name} Plan
                  </Dialog.Title>
                  
                  {error && (
                    <div className="mt-2 p-2 bg-red-50 text-red-500 rounded">
                      {error}
                    </div>
                  )}

                  <form onSubmit={handleInvestment} className="mt-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Investment Amount (USD)
                      </label>
                      <input
                        type="number"
                        min={plan.min}
                        step="0.01"
                        value={amount}
                        onChange={(e) => setAmount(Number(e.target.value))}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                      <p className="mt-1 text-sm text-gray-500">
                        Minimum investment: ${plan.min}
                      </p>
                    </div>

                    <div className="mt-4 space-y-2">
                      <p>Duration: {plan.duration} days</p>
                      <p>Return Rate: {plan.return}%</p>
                      <p className="font-semibold">
                        Expected Return: ${expectedReturn.toFixed(2)}
                      </p>
                    </div>

                    <div className="mt-6 flex justify-end space-x-3">
                      <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-md border"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={loading || amount < plan.min}
                        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md disabled:opacity-50"
                      >
                        {loading ? 'Processing...' : 'Invest Now'}
                      </button>
                    </div>
                  </form>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

      {showPayment && newInvestment && (
  <InvestmentConfirmation
    isOpen={showPayment}
    onClose={() => {
      setShowPayment(false)
      onClose() // Close both modals
    }}
    investment={newInvestment}
      />
  )}
    </>
  )
}