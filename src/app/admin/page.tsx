// src/app/admin/page.tsx
import { UserManagement } from '@/components/admin/UserManagement'
import { InvestmentApprovals } from '@/components/admin/InvestmentApprovals'
import { WalletConfig } from '@/components/admin/WalletConfig'

export default function AdminDashboard() {
  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>
      <UserManagement />
      <InvestmentApprovals />
      <WalletConfig />
    </div>
  )
}