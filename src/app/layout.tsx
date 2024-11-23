// src/app/layout.tsx
import { Inter } from 'next/font/google'
import { SessionProvider } from '@/components/providers/SessionProvider'
import Navbar from '@/components/navigation/Navbar'
import Footer from '@/components/navigation/Footer'
import './globals.css'
import { Sidebar } from '@/components/dashboard/Sidebar'

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.className} h-full bg-gray-50`}>
        <SessionProvider>
          <div className="flex h-full">
            {/* Mobile menu button */}
            <div className="lg:hidden fixed inset-0 z-40 flex">
              <button className="p-4">
                <span className="sr-only">Open sidebar</span>
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
            {/* Main content */}
            <div className="flex flex-1 flex-col overflow-hidden">
              <Navbar />
              <main className="flex-1 overflow-y-auto">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                  {children}
                </div>
              </main>
              <Footer />
            </div>
          </div>
        </SessionProvider>
      </body>
    </html>
  )
}