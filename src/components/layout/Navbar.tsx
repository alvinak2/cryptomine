'use client'

import Link from 'next/link'
import { signOut, useSession } from 'next-auth/react'

export default function Navbar() {
  const { data: session } = useSession()

  return (
    <nav className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-xl font-bold">
          Mining Investment
        </Link>
        
        <div className="space-x-4">
          {session ? (
            <>
              <Link href="/dashboard">Dashboard</Link>
              {session.user.role === 'ADMIN' && (
                <Link href="/admin/dashboard">Admin</Link>
              )}
              <button onClick={() => signOut()}>Sign Out</button>
            </>
          ) : (
            <>
              <Link href="/auth/signin">Sign In</Link>
              <Link href="/auth/signup">Sign Up</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}