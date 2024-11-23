// src/app/dashboard/statistics/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { LineChart, DoughnutChart } from '@/components/dashboard/Charts'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js'
import { StatCard } from '@/components/dashboard/StatCard'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
)

interface Stats {
  totalInvested: number
  totalReturns: number
  activeInvestments: number
  miningPower: number
  monthlyData: Array<{
    month: string
    returns: number
  }>
  investmentDistribution: Array<number>
}

export default function StatisticsPage() {
  const [stats, setStats] = useState<Stats>({
    totalInvested: 0,
    totalReturns: 0,
    activeInvestments: 0,
    miningPower: 0,
    monthlyData: [],
    investmentDistribution: []
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStatistics()
  }, [])

  async function fetchStatistics() {
    try {
      const res = await fetch('/api/dashboard/statistics')
      if (!res.ok) throw new Error('Failed to fetch statistics')
      const data = await res.json()
      setStats(data)
    } catch (error) {
      console.error('Statistics fetch error:', error)
    } finally {
      setLoading(false)
    }
  }

  const lineChartData = {
    labels: stats.monthlyData.map(d => d.month),
    datasets: [
      {
        label: 'Monthly Returns',
        data: stats.monthlyData.map(d => d.returns),
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1
      }
    ]
  }

  const doughnutData = {
    labels: ['Basic', 'Pro', 'Elite'],
    datasets: [
      {
        data: stats.investmentDistribution,
        backgroundColor: [
          'rgba(255, 99, 132, 0.5)',
          'rgba(54, 162, 235, 0.5)',
          'rgba(255, 206, 86, 0.5)'
        ]
      }
    ]
  }

  if (loading) {
    return <div className="p-6">Loading statistics...</div>
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Investment Statistics</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          title="Total Invested"
          value={`$${stats.totalInvested.toFixed(2)}`}
          className="bg-blue-50"
        />
        <StatCard
          title="Total Returns"
          value={`$${stats.totalReturns.toFixed(2)}`}
          className="bg-green-50"
        />
        <StatCard
          title="Active Investments"
          value={stats.activeInvestments}
          className="bg-yellow-50"
        />
        <StatCard
          title="Mining Power"
          value={`${stats.miningPower.toFixed(2)} TH/s`}
          className="bg-purple-50"
        />
      </div>

      <div className="grid md:grid-cols-2 gap-6">
  <LineChart 
    data={lineChartData} 
    title="Monthly Returns" 
  />
  <DoughnutChart 
    data={doughnutData} 
    title="Investment Distribution" 
  />
</div>
    </div>
  )
}