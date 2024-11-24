// src/components/dashboard/Sidebar.tsx
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSession, signOut } from 'next-auth/react'
import {
  HomeIcon,
  BanknotesIcon,
  WalletIcon,
  ChartBarIcon,
  UserIcon,
  Cog6ToothIcon,
  ArrowLeftOnRectangleIcon
} from '@heroicons/react/24/outline'

const navigation = [
  { name: 'Overview', href: '/dashboard', icon: HomeIcon },
  { name: 'Investments', href: '/dashboard/investments', icon: BanknotesIcon },
  { name: 'Mining Stats', href: '/dashboard/statistics', icon: ChartBarIcon },
  { name: 'Wallet', href: '/dashboard/wallet', icon: WalletIcon },
  { name: 'Profile', href: '/dashboard/profile', icon: UserIcon },
  { name: 'Settings', href: '/dashboard/settings', icon: Cog6ToothIcon },
]

// src/components/dashboard/Sidebar.tsx
// src/components/dashboard/Sidebar.tsx
export function Sidebar() {
  const pathname = usePathname()
  const { data: session } = useSession()

  return (
    <div className="hidden lg:flex lg:w-64 lg:flex-col fixed top-0 bottom-0">
      <div className="flex flex-col h-full bg-crypto-primary border-r border-gray-800">
        <div className="pt-6 px-4">
          <div className="flex items-center">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-r from-crypto-bitcoin to-crypto-ethereum flex items-center justify-center">
              <span className="text-white font-bold">M</span>
            </div>
            <span className="ml-2 text-xl font-bold bg-gradient-to-r from-crypto-bitcoin via-crypto-ethereum to-crypto-solana bg-clip-text text-transparent">
              Mining
            </span>
          </div>
        </div>

        <div className="flex-1 flex flex-col overflow-y-auto mt-6">
          <nav className="flex-1 px-4 space-y-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors ${
                    isActive
                      ? 'bg-crypto-secondary text-crypto-success'
                      : 'text-gray-300 hover:bg-crypto-secondary hover:text-crypto-bitcoin'
                  }`}
                >
                  <item.icon
                    className={`mr-3 flex-shrink-0 h-6 w-6 ${
                      isActive 
                        ? 'text-crypto-success' 
                        : 'text-gray-400 group-hover:text-crypto-bitcoin'
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
                    className="inline-block h-9 w-9 rounded-full ring-2 ring-crypto-accent"
                    src={`https://ui-avatars.com/api/?name=${session?.user?.name}`}
                    alt=""
                  />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-300">{session?.user?.name}</p>
                  <button
                    onClick={() => signOut({ callbackUrl: '/' })}
                    className="text-xs font-medium text-gray-400 group-hover:text-crypto-bitcoin flex items-center"
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