'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';
import {
  HomeIcon,
  UsersIcon,
  CurrencyDollarIcon,
  WalletIcon,
  Cog6ToothIcon,
  ArrowLeftOnRectangleIcon,
  BanknotesIcon,
} from '@heroicons/react/24/outline';

const navigation = [
  { name: 'Dashboard', href: '/admin', icon: HomeIcon },
  { name: 'Users', href: '/admin/users', icon: UsersIcon },
  { name: 'Investments', href: '/admin/investments', icon: CurrencyDollarIcon },
  { name: 'Pending Payments', href: '/admin/payments', icon: BanknotesIcon },
  { name: 'Wallets', href: '/admin/wallets', icon: WalletIcon },
  { name: 'Settings', href: '/admin/settings', icon: Cog6ToothIcon },
];

export function AdminSidebar() {
  const pathname = usePathname() || ''; // Ensure pathname always has a fallback

  return (
    <div className="hidden md:flex md:w-64 md:flex-col fixed top-0 bottom-0">
      <div className="flex flex-col h-full bg-crypto-primary border-r border-gray-800">
        <div className="pt-6 px-4">
          <div className="flex items-center">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-r from-crypto-bitcoin to-crypto-ethereum flex items-center justify-center">
              <span className="text-white font-bold">A</span>
            </div>
            <span className="ml-2 text-xl font-bold bg-gradient-to-r from-crypto-bitcoin via-crypto-ethereum to-crypto-solana bg-clip-text text-transparent">
              Admin Panel
            </span>
          </div>
        </div>

        <div className="mt-6 flex-grow flex flex-col overflow-y-auto">
          <nav className="flex-1 px-4 space-y-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
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
              );
            })}
          </nav>

          <div className="flex-shrink-0 border-t border-gray-800 p-4">
            <button
              onClick={async () => {
                try {
                  await signOut({ callbackUrl: '/' });
                } catch (err) {
                  console.error('Error signing out:', err);
                }
              }}
              className="w-full flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-300 hover:bg-crypto-secondary hover:text-crypto-bitcoin transition-colors"
            >
              <ArrowLeftOnRectangleIcon className="mr-3 flex-shrink-0 h-6 w-6" />
              Sign out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
