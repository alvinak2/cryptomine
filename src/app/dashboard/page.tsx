// src/app/dashboard/page.tsx
import getServerSession from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import DashboardSummary from '@/components/dashboard/DashboardSummary'
import ActiveInvestments from '@/components/dashboard/ActiveInvestments'
import WalletAddresses from '@/components/dashboard/WalletAddresses'
import NewInvestment from '@/components/dashboard/NewInvestment'

export default async function Dashboard() {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/auth/signin')

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <DashboardSummary />
        <ActiveInvestments />
        <WalletAddresses />
        <NewInvestment />
      </div>
    </div>
  )
}