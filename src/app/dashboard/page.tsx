// src/app/dashboard/page.tsx
'use client'

import { useState, useEffect, useCallback } from 'react'
import { INVESTMENT_PLANS } from '@/lib/constants'
import { InvestmentCard } from '@/components/dashboard/InvestmentCard'
import { MiningConsole } from '@/components/dashboard/MiningConsole'
import { StatCard } from '@/components/dashboard/StatCard'

export default function Dashboard() {
  const [stats, setStats] = useState({
    balance: 0,
    activeInvestments: 0,
    totalEarnings: 0,
    miningPower: 0,
    hasActiveInvestment: false
  })
  const [investments, setInvestments] = useState([])
  const [loading, setLoading] = useState(true)

  // Fetch initial data
  const fetchData = useCallback(async () => {
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
      setInvestments(investmentsData.filter(inv => inv.status === 'active'))
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  // Update only earnings in real-time
  useEffect(() => {
    if (investments.length === 0) return

    const updateBalanceAndEarnings = () => {
      const newEarnings = investments.reduce((sum, inv) => {
        const planConfig = INVESTMENT_PLANS[inv.plan]
        const startDate = new Date(inv.startDate).getTime()
        const now = new Date().getTime()
        const elapsedDays = (now - startDate) / (1000 * 60 * 60 * 24)
        const totalDays = planConfig.duration
  
        // Calculate earnings per second
        const totalReturn = inv.amount * (planConfig.return / 100)
        const earningsPerDay = totalReturn / totalDays
        const currentEarnings = earningsPerDay * Math.min(elapsedDays, totalDays)
  
        return sum + currentEarnings
      }, 0)

      const totalInvested = investments.reduce((sum, inv) => sum + inv.amount, 0)

      setStats(prev => ({
        ...prev,
        totalEarnings: newEarnings,
        balance: totalInvested + newEarnings // Update balance to include earnings
      }))
    }

    const intervalId = setInterval(updateBalanceAndEarnings, 1000)
    return () => clearInterval(intervalId)
  }, [investments])

  // Fetch all data periodically (including mining power)
  useEffect(() => {
    fetchData()
    const dataInterval = setInterval(fetchData, 30000) // Every 30 seconds
    return () => clearInterval(dataInterval)
  }, [fetchData])

  if (loading) return <div className='text-gray-400'>Loading...</div>

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

      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4 text-gray-400">Your Investments</h2>
        {loading ? (
          <div className='text-gray-400'>Loading investments...</div>
        ) : investments.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {investments.map((investment) => (
              <InvestmentCard 
                key={investment._id} 
                investment={investment} 
                onUpdate={fetchData}
              />
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