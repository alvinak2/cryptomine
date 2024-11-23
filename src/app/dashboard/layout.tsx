// src/app/dashboard/layout.tsx
import { Sidebar } from '@/components/dashboard/Sidebar'

// src/app/(dashboard)/layout.tsx
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex">
      {/* Sidebar */}
      <div className="hidden lg:flex lg:w-64 lg:flex-col fixed top-16 bottom-16">
        <Sidebar />
      </div>

      {/* Main content - add left margin to account for sidebar */}
      <div className="flex-1 lg:ml-64">
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  )
}