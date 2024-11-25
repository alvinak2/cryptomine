// src/components/navigation/Navbar.tsx
"use client"

import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { handleLogout } from '@/lib/auth'
import { Menu, Transition } from '@headlessui/react'
import { Fragment } from 'react'
import { UserCircleIcon } from '@heroicons/react/24/outline'
import { ArrowLeftOnRectangleIcon } from '@heroicons/react/24/outline'

export default function Navbar() {
  const { data: session, status } = useSession()
  const isLoading = status === "loading"

  if (isLoading) {
    return (
      <nav className="bg-crypto-primary border-b border-gray-800">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center">
              <span className="text-xl font-bold bg-gradient-to-r from-crypto-bitcoin via-crypto-ethereum to-crypto-solana bg-clip-text text-transparent">
                Mining Investment
              </span>
            </Link>
            <div className="animate-pulse bg-gray-700 h-8 w-32 rounded-md" />
          </div>
        </div>
      </nav>
    )
  }

  return (
    <nav className="bg-crypto-primary border-b border-gray-800">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-crypto-bitcoin to-crypto-ethereum rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">I</span>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-crypto-bitcoin via-crypto-ethereum to-crypto-solana bg-clip-text text-transparent">
              Investopia
            </span>
          </Link>

          <div className="hidden md:flex items-center space-x-6">
            {!session ? (
              <>
                <Link
                  href="/login"
                  className="px-4 py-2 rounded-md hover:bg-gray-700 transition-all duration-200 text-gray-500"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="px-4 py-2 rounded-md bg-crypto-success/90 hover:bg-crypto-solana transition-all duration-200"
                >
                  Register
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/dashboard"
                  className="px-4 py-2 rounded-md hover:bg-gray-700 transition-all duration-200"
                >
                  Dashboard
                </Link>
                <Menu as="div" className="relative">
                  <Menu.Button className="flex items-center space-x-2 hover:bg-gray-700 rounded-md px-3 py-2 transition-all duration-200">
                    <UserCircleIcon className="h-6 w-6" />
                    <span>{session.user?.name}</span>
                  </Menu.Button>
                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <Menu.Items className="absolute right-0 mt-2 w-48 origin-top-right bg-gray-800 rounded-md shadow-lg py-1">
                    <Menu.Item>
  {({ active }) => (
    <button
    onClick={handleLogout}
    className="text-gray-300 hover:text-white transition-colors"
  >
    <ArrowLeftOnRectangleIcon className="h-4 w-4 mr-1" />
    Sign out
  </button>
  )}
</Menu.Item>
                    </Menu.Items>
                  </Transition>
                </Menu>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}