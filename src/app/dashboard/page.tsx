// src/app/dashboard/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { MiningConsole } from '@/components/dashboard/MiningConsole'
import { StatCard } from '@/components/dashboard/StatCard'
import { InvestmentCard } from '@/components/dashboard/InvestmentCard'

interface Investment {
  _id: string
  plan: string
  amount: number
  startDate: string
  endDate: string
  status: string
  returns: number
}

export default function Dashboard() {
  const [stats, setStats] = useState({
    balance: 0,
    activeInvestments: 0,
    totalEarnings: 0,
    miningPower: 0,
    hasActiveInvestment: false
  })
  const [investments, setInvestments] = useState<Investment[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  async function fetchDashboardData() {
    try {
      const [statsRes, investmentsRes] = await Promise.all([
        fetch('/api/dashboard/stats'),
        fetch('/api/investments')
      ])
      
      const [statsData, investmentsData] = await Promise.all([
        statsRes.json(),
        investmentsRes.json()
      ])

      setStats(statsData)
      setInvestments(investmentsData)
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard title="Balance" value={`$${stats.balance.toFixed(2)}`} icon="💰" />
        <StatCard title="Active Investments" value={stats.activeInvestments} icon="📈" />
        <StatCard title="Total Earnings" value={`$${stats.totalEarnings.toFixed(2)}`} icon="💵" />
        <StatCard title="Mining Power" value={`${stats.miningPower.toFixed(2)} TH/s`} icon="⚡" />
      </div>

      {stats.hasActiveInvestment && <MiningConsole />}

      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Your Investments</h2>
        {loading ? (
          <div>Loading investments...</div>
        ) : investments.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {investments.map((investment) => (
              <InvestmentCard key={investment._id} investment={investment} />
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-500">
            No investments found. Start investing now!
          </div>
        )}
      </div>
    </div>
  )
}