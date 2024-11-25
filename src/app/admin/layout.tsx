// src/app/admin/layout.tsx
import {AdminSidebar} from '@/components/admin/AdminSidebar'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="h-full">
      <div className='min-h-screen flex'>  
        <AdminSidebar />
        <div className="flex-1 ml-64 p-6 overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  )
}