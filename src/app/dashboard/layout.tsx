// src/app/dashboard/layout.tsx
import { Sidebar } from '@/components/dashboard/Sidebar'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="h-full">
      <div className="min-h-screen flex">
        <Sidebar />
        <div className="flex-1 ml-64 p-6 overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  )
}