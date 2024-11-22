// src/app/admin/dashboard/page.tsx
import { Suspense } from 'react'
import UsersList from '@/components/admin/UsersList'
import InvestmentsList from '@/components/admin/InvestmentsList'
import WalletsList from '@/components/admin/WalletsList'
import DashboardStats from '@/components/admin/DashboardStats'

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>
      
      <Suspense fallback={<div>Loading stats...</div>}>
        <DashboardStats />
      </Suspense>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <h2 className="text-xl font-semibold mb-4">Users</h2>
          <Suspense fallback={<div>Loading users...</div>}>
            <UsersList />
          </Suspense>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Investments</h2>
          <Suspense fallback={<div>Loading investments...</div>}>
            <InvestmentsList />
          </Suspense>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Wallet Addresses</h2>
          <Suspense fallback={<div>Loading wallets...</div>}>
            <WalletsList />
          </Suspense>
        </div>
      </div>
    </div>
  )
}