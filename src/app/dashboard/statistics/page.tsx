// src/app/dashboard/statistics/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { 
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js'
import { Line, Bar, Doughnut } from 'react-chartjs-2'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
)

export default function StatisticsPage() {
  const [stats, setStats] = useState({
    totalInvested: 0,
    totalReturns: 0,
    activeInvestments: 0,
    miningPower: 0,
    monthlyData: [],
    investmentDistribution: [],
  })

  useEffect(() => {
    fetchStatistics()
  }, [])

  async function fetchStatistics() {
    const res = await fetch('/api/statistics')
    const data = await res.json()
    setStats(data)
  }

  const lineChartData = {
    labels: stats.monthlyData.map((d: any) => d.month),
    datasets: [
      {
        label: 'Investment Returns',
        data: stats.monthlyData.map((d: any) => d.returns),
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
      },
    ],
  }

  const doughnutData = {
    labels: ['Basic', 'Pro', 'Elite'],
    datasets: [
      {
        data: stats.investmentDistribution,
        backgroundColor: [
          'rgba(255, 99, 132, 0.5)',
          'rgba(54, 162, 235, 0.5)',
          'rgba(255, 206, 86, 0.5)',
        ],
      },
    ],
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Statistics</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <p className="text-gray-500">Total Invested</p>
          <p className="text-2xl font-bold">${stats.totalInvested}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <p className="text-gray-500">Total Returns</p>
          <p className="text-2xl font-bold">${stats.totalReturns}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <p className="text-gray-500">Active Investments</p>
          <p className="text-2xl font-bold">{stats.activeInvestments}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <p className="text-gray-500">Mining Power</p>
          <p className="text-2xl font-bold">{stats.miningPower} TH/s</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Monthly Returns</h3>
          <Line data={lineChartData} />
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Investment Distribution</h3>
          <Doughnut data={doughnutData} />
        </div>
      </div>
    </div>
  )
}