// src/components/dashboard/UserStats.tsx
'use client'

import { useEffect, useState } from 'react'

export function UserStats() {
  const [stats, setStats] = useState({
    balance: 0,
    activeInvestments: 0,
    totalEarnings: 0,
    miningPower: 0
  })

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <StatsCard
        title="Balance"
        value={`$${stats.balance.toFixed(2)}`}
        icon="💰"
      />
      <StatsCard
        title="Active Investments"
        value={stats.activeInvestments}
        icon="📈"
      />
      <StatsCard
        title="Total Earnings"
        value={`$${stats.totalEarnings.toFixed(2)}`}
        icon="💵"
      />
      <StatsCard
        title="Mining Power"
        value={`${stats.miningPower} TH/s`}
        icon="⚡"
      />
    </div>
  )
}

function StatsCard({ title, value, icon }: { title: string; value: string | number; icon: string }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <div className="flex items-center space-x-3">
        <span className="text-2xl">{icon}</span>
        <div>
          <p className="text-sm text-gray-500">{title}</p>
          <p className="text-2xl font-bold">{value}</p>
        </div>
      </div>
    </div>
  )
}