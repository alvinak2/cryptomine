// src/components/dashboard/Sidebar.tsx
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut, useSession } from 'next-auth/react'
import { handleLogout } from '@/lib/auth'
import {
  HomeIcon,
  CurrencyDollarIcon,
  WalletIcon,
  UserIcon,
  Cog6ToothIcon,
  ArrowLeftOnRectangleIcon,
  ChartBarIcon,
  ComputerDesktopIcon
} from '@heroicons/react/24/outline'

const navigation = [
  { name: 'Overview', href: '/dashboard', icon: HomeIcon },
  { name: 'Investments', href: '/dashboard/investments', icon: CurrencyDollarIcon },
  { name: 'Statistics', href: '/dashboard/statistics', icon: ChartBarIcon },
  { name: 'Profile', href: '/dashboard/profile', icon: UserIcon },
  { name: 'Settings', href: '/dashboard/settings', icon: Cog6ToothIcon },
]

export function Sidebar() {
  const pathname = usePathname()
  const { data: session } = useSession()

  return (
    <div className="hidden lg:flex lg:w-64 lg:flex-col fixed top-16 bottom-16 my-2"> {/* Add margin-y */}
      <div className="flex flex-col h-full bg-gray-900 rounded-lg"> {/* Add rounded corners */}
        <div className="flex-1 flex flex-col overflow-y-auto">
          <nav className="flex-1 px-4 py-4 space-y-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                    isActive
                      ? 'bg-gray-800 text-white'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  <item.icon
                    className={`mr-3 flex-shrink-0 h-6 w-6 ${
                      isActive ? 'text-white' : 'text-gray-400 group-hover:text-white'
                    }`}
                  />
                  {item.name}
                </Link>
              )
            })}
          </nav>

          <div className="flex-shrink-0 border-t border-gray-800 p-4">
            <div className="group block w-full flex-shrink-0">
              <div className="flex items-center">
                <div>
                  <img
                    className="inline-block h-9 w-9 rounded-full"
                    src={`https://ui-avatars.com/api/?name=${session?.user?.name}`}
                    alt=""
                  />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-white">{session?.user?.name}</p>
                  <button
  onClick={handleLogout}
  className="text-gray-300 hover:text-white transition-colors"
>
  <ArrowLeftOnRectangleIcon className="h-4 w-4 mr-1" />
  Sign out
</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}