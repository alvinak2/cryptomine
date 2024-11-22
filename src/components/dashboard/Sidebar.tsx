// src/components/dashboard/Sidebar.tsx
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { HomeIcon, ChartBarIcon, WalletIcon, CogIcon } from '@heroicons/react/24/outline'

const navigation = [
  { name: 'Overview', href: '/dashboard', icon: HomeIcon },
  { name: 'Investments', href: '/dashboard/investments', icon: ChartBarIcon },
  { name: 'Wallet', href: '/dashboard/wallet', icon: WalletIcon },
  { name: 'Settings', href: '/dashboard/settings', icon: CogIcon },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="w-64 bg-gray-900 text-white">
      <div className="p-6 space-y-8">
        <nav className="space-y-2">
          {navigation.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center space-x-3 px-4 py-2 rounded-lg transition-colors ${
                  isActive 
                    ? 'bg-blue-500 text-white' 
                    : 'text-gray-300 hover:bg-gray-800'
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.name}</span>
              </Link>
            )
          })}
        </nav>
      </div>
    </div>
  )
}