// src/app/dashboard/page.tsx
import { MiningConsole } from '@/components/dashboard/MiningConsole'
import { UserStats } from '@/components/dashboard/UserStats'
import { InvestmentPlans } from '@/components/dashboard/InvestmentPlans'

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <UserStats />
      <MiningConsole />
      <InvestmentPlans />
    </div>
  )
}