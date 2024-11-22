import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { Inter } from 'next/font/google'
import Link from 'next/link'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

async function Navigation() {
  const supabase = createServerComponentClient({ cookies })
  const { data: { session } } = await supabase.auth.getSession()
  const { data: user } = session ? await supabase
    .from('users')
    .select('role')
    .eq('id', session.user.id)
    .single() : { data: null }

  return (
    <nav className="bg-white shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="font-bold text-xl">
            InvestApp
          </Link>
          
          {session ? (
            <div className="flex items-center space-x-4">
              <Link href="/dashboard" className="nav-link">
                Dashboard
              </Link>
              <Link href="/wallet" className="nav-link">
                Wallet
              </Link>
              {user?.role === 'admin' && (
                <Link href="/admin" className="nav-link">
                  Admin
                </Link>
              )}
              <button 
                onClick={async () => {
                  await supabase.auth.signOut()
                }}
                className="nav-link"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-4">
              <Link href="/login" className="nav-link">
                Login
              </Link>
              <Link href="/register" className="nav-link">
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen bg-gray-50`}>
        <Navigation />
        {children}
      </body>
    </html>
  )
}