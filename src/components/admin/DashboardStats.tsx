// src/components/admin/DashboardStats.tsx
import prisma from '@/lib/db'

async function getStats() {
  const [usersCount, totalInvestments, activeInvestments] = await Promise.all([
    prisma.user.count(),
    prisma.investment.aggregate({
      _sum: { amount: true }
    }),
    prisma.investment.count({
      where: { status: 'ACTIVE' }
    })
  ])

  return {
    usersCount,
    totalInvestments: totalInvestments._sum.amount || 0,
    activeInvestments
  }
}

export default async function DashboardStats() {
  const stats = await getStats()

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <StatsCard 
        title="Total Users" 
        value={stats.usersCount} 
      />
      <StatsCard 
        title="Total Investments" 
        value={`$${stats.totalInvestments.toFixed(2)}`}
      />
      <StatsCard 
        title="Active Investments" 
        value={stats.activeInvestments} 
      />
    </div>
  )
}

function StatsCard({ title, value }: { title: string; value: string | number }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-gray-500 text-sm">{title}</h3>
      <p className="text-2xl font-bold mt-2">{value}</p>
    </div>
  )
}