// src/components/dashboard/DashboardSummary.tsx
import getServerSession from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import prisma from '@/lib/db'
import { Suspense } from 'react'

async function getDashboardData(userId: string) {
  const data = await prisma.investment.aggregate({
    where: { userId },
    _sum: {
      amount: true,
      returnAmount: true
    },
    _count: true
  })

  return {
    totalInvested: data._sum.amount || 0,
    totalReturns: data._sum.returnAmount || 0,
    totalInvestments: data._count
  }
}

export default async function DashboardSummary() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    redirect('/auth/signin')
  }

  return (
    <Suspense fallback={<div>Loading summary...</div>}>
      <SummaryContent userId={session.user.id} />
    </Suspense>
  )
}

async function SummaryContent({ userId }: { userId: string }) {
  const data = await getDashboardData(userId)

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">Investment Summary</h2>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-gray-600">Total Invested</p>
          <p className="text-2xl font-bold">${data.totalInvested}</p>
        </div>
        <div>
          <p className="text-gray-600">Total Returns</p>
          <p className="text-2xl font-bold">${data.totalReturns}</p>
        </div>
        <div>
          <p className="text-gray-600">Active Investments</p>
          <p className="text-2xl font-bold">{data.totalInvestments}</p>
        </div>
      </div>
    </div>
  )
}