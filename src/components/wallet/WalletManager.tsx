'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Card } from '../ui/Card'

export function WalletManager({ userId }: { userId: string }) {
  const [amount, setAmount] = useState('')
  const [address, setAddress] = useState('')
  const [type, setType] = useState<'deposit' | 'withdrawal'>('deposit')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const transaction = {
      user_id: userId,
      type,
      amount: parseFloat(amount),
      status: 'pending',
    }

    if (type === 'withdrawal') {
      const { data: user } = await supabase
        .from('users')
        .select('balance')
        .eq('id', userId)
        .single()

      if (user && user.balance < parseFloat(amount)) {
        alert('Insufficient balance')
        return
      }
    }

    await supabase.from('transactions').insert([transaction])
    
    if (type === 'withdrawal') {
      await supabase.from('wallet_addresses').insert([{
        user_id: userId,
        currency: 'USD',
        address,
      }])
    }

    setAmount('')
    setAddress('')
  }

  return (
    <Card>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <select 
            value={type}
            onChange={e => setType(e.target.value as 'deposit' | 'withdrawal')}
            className="select"
          >
            <option value="deposit">Deposit</option>
            <option value="withdrawal">Withdrawal</option>
          </select>
        </div>

        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={e => setAmount(e.target.value)}
          className="input"
        />

        {type === 'withdrawal' && (
          <input
            type="text"
            placeholder="Wallet Address"
            value={address}
            onChange={e => setAddress(e.target.value)}
            className="input"
          />
        )}

        <button type="submit" className="btn">
          Submit {type}
        </button>
      </form>
    </Card>
  )
}