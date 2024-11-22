'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { InvestmentPlan } from '@/types'
import { Card } from '@/components/ui/Card'

export default function AdminPlansPage() {
  const [plans, setPlans] = useState<InvestmentPlan[]>([])
  const [newPlan, setNewPlan] = useState({
    name: '',
    duration_days: 0,
    return_percentage: 0,
    minimum_amount: 0,
  })

  useEffect(() => {
    loadPlans()
  }, [])

  const loadPlans = async () => {
    const { data } = await supabase.from('investment_plans').select('*')
    if (data) setPlans(data)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await supabase.from('investment_plans').insert([newPlan])
    loadPlans()
    setNewPlan({ name: '', duration_days: 0, return_percentage: 0, minimum_amount: 0 })
  }

  return (
    <div className="space-y-8">
      <Card>
        <h2 className="text-xl font-bold mb-4">Create New Plan</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Plan Name"
            value={newPlan.name}
            onChange={e => setNewPlan({...newPlan, name: e.target.value})}
            className="input"
          />
          <input
            type="number"
            placeholder="Duration (days)"
            value={newPlan.duration_days}
            onChange={e => setNewPlan({...newPlan, duration_days: parseInt(e.target.value)})}
            className="input"
          />
          <input
            type="number"
            placeholder="Return Percentage"
            value={newPlan.return_percentage}
            onChange={e => setNewPlan({...newPlan, return_percentage: parseFloat(e.target.value)})}
            className="input"
          />
          <input
            type="number"
            placeholder="Minimum Amount"
            value={newPlan.minimum_amount}
            onChange={e => setNewPlan({...newPlan, minimum_amount: parseFloat(e.target.value)})}
            className="input"
          />
          <button type="submit" className="btn">Create Plan</button>
        </form>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {plans.map(plan => (
          <Card key={plan.id}>
            <div className="flex justify-between">
              <h3 className="font-bold">{plan.name}</h3>
              <button 
                onClick={async () => {
                  await supabase
                    .from('investment_plans')
                    .update({ is_active: !plan.is_active })
                    .eq('id', plan.id)
                  loadPlans()
                }}
                className={`px-2 py-1 rounded ${
                  plan.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}
              >
                {plan.is_active ? 'Active' : 'Inactive'}
              </button>
            </div>
            <p>Duration: {plan.duration_days} days</p>
            <p>Return: {plan.return_percentage}%</p>
            <p>Min Amount: ${plan.minimum_amount}</p>
          </Card>
        ))}
      </div>
    </div>
  )
}