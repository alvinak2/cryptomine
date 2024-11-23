// src/components/navigation/Navbar.tsx
"use client"

import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Menu, Transition } from '@headlessui/react'
import { Fragment } from 'react'
import { UserCircleIcon } from '@heroicons/react/24/outline'

export default function Navbar() {
  const { data: session, status } = useSession()
  const isLoading = status === "loading"

  if (isLoading) {
    return (
      <nav className="bg-gradient-to-r from-gray-900 to-gray-800 text-white shadow-lg">
        <div className="container mx-auto px-4 py-3">
          <div className="flex justify-between items-center">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-500 rounded-lg animate-pulse" />
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-blue-600">
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
    <nav className="bg-gradient-to-r from-gray-900 to-gray-800 text-white shadow-lg">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
              <span className="font-bold text-lg">M</span>
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-blue-600">
              Mining Investment
            </span>
          </Link>

          <div className="hidden md:flex items-center space-x-6">
            {!session ? (
              <>
                <Link
                  href="/login"
                  className="px-4 py-2 rounded-md hover:bg-gray-700 transition-all duration-200"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="px-4 py-2 rounded-md bg-blue-500 hover:bg-blue-600 transition-all duration-200"
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
      onClick={() => {
        signOut({
          callbackUrl: '/',
          redirect: true
        }).catch(error => {
          console.error('Sign out error:', error)
        })
      }}
      className={`${
        active ? 'bg-gray-700' : ''
      } block w-full text-left px-4 py-2 text-sm text-gray-300 hover:text-white`}
    >
      Sign Out
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