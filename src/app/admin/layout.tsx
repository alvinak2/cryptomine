// src/app/admin/layout.tsx

import { Inter } from 'next/font/google'
import { SessionProvider } from '@/components/providers/SessionProvider'
import {AdminSidebar} from '@/components/admin/AdminSidebar'
import '@/app/globals.css'

const inter = Inter({ subsets: ['latin'] })

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.className} min-h-screen flex bg-crypto-primary`}>
        <SessionProvider>
            <AdminSidebar />
            <main className="flex-1 ml-64 p-6 overflow-y-auto">
              {children}
            </main>
        </SessionProvider>
      </body>
    </html>
  )
}