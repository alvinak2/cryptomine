// src/app/dashboard/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { MiningConsole } from '@/components/dashboard/MiningConsole'
import { StatCard } from '@/components/dashboard/StatCard'

interface DashboardStats {
  balance: number
  activeInvestments: number
  totalEarnings: number
  miningPower: number
  hasActiveInvestment: boolean
}

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    balance: 0,
    activeInvestments: 0,
    totalEarnings: 0,
    miningPower: 0,
    hasActiveInvestment: false
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardStats()
    const interval = setInterval(fetchDashboardStats, 30000) // Update every 30s
    return () => clearInterval(interval)
  }, [])

  async function fetchDashboardStats() {
    try {
      const res = await fetch('/api/dashboard/stats')
      const data = await res.json()
      setStats(data)
    } catch (error) {
      console.error('Failed to fetch dashboard stats:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard
          title="Balance"
          value={`$${stats.balance.toFixed(2)}`}
          icon="💰"
        />
        <StatCard
          title="Active Investments"
          value={stats.activeInvestments}
          icon="📈"
        />
        <StatCard
          title="Total Earnings"
          value={`$${stats.totalEarnings.toFixed(2)}`}
          icon="💵"
        />
        <StatCard
          title="Mining Power"
          value={`${stats.miningPower.toFixed(2)} TH/s`}
          icon="⚡"
        />
      </div>

      {stats.hasActiveInvestment && <MiningConsole />}
    </div>
  )
}