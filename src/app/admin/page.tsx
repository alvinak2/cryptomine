// src/app/admin/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { UserIcon, CurrencyDollarIcon, WalletIcon } from '@heroicons/react/24/outline'
import { RecentInvestments } from '@/components/admin/RecentInvestments'
import { RecentUsers } from '@/components/admin/RecentUsers'

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    pendingInvestments: 0,
    totalInvested: 0,
    activeInvestments: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  async function fetchStats() {
    try {
      const res = await fetch('/api/admin/stats')
      if (!res.ok) throw new Error('Failed to fetch stats')
      const data = await res.json()
      setStats(data)
    } catch (error) {
      console.error('Stats fetch error:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="p-6 text-gray-300">Loading...</div>
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6 text-gray-300">Admin Dashboard</h1>
      
      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Users"
          value={stats.totalUsers}
          icon={<UserIcon className="h-6 w-6" />}
          colorClass="bg-crypto-bitcoin"
        />
        <StatCard
          title="Pending Investments"
          value={stats.pendingInvestments}
          icon={<CurrencyDollarIcon className="h-6 w-6" />}
          colorClass="bg-crypto-warning"
        />
        <StatCard
          title="Total Invested"
          value={`$${stats.totalInvested}`}
          icon={<CurrencyDollarIcon className="h-6 w-6" />}
          colorClass="bg-crypto-success"
        />
        <StatCard
          title="Active Investments"
          value={stats.activeInvestments}
          icon={<WalletIcon className="h-6 w-6" />}
          colorClass="bg-crypto-ethereum"
        />
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-crypto-secondary rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4 text-gray-300">Recent Investments</h2>
          <RecentInvestments />
        </div>
        <div className="bg-crypto-secondary rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4 text-gray-300">New Users</h2>
          <RecentUsers />
        </div>
      </div>
    </div>
  )
}

function StatCard({ title, value, icon, colorClass }: any) {
  return (
    <div className="bg-crypto-secondary rounded-lg shadow p-6">
      <div className="flex items-center">
        <div className={`${colorClass} p-3 rounded-lg text-white mr-4`}>
          {icon}
        </div>
        <div>
          <p className="text-sm text-gray-300">{title}</p>
          <p className="text-2xl font-bold text-gray-300">{value}</p>
        </div>
      </div>
    </div>
  )
}