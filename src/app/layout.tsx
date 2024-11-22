// src/app/layout.tsx
import { Inter } from 'next/font/google'
import { SessionProvider } from '@/components/providers/SessionProvider'
import Navbar from '@/components/navigation/Navbar'
import Footer from '@/components/navigation/Footer'
import './globals.css'

import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: {
    default: 'Mining Investment Platform',
    template: '%s | Mining Investment'
  },
  description: 'Professional cryptocurrency mining investment platform',
  keywords: ['mining', 'investment', 'cryptocurrency', 'bitcoin', 'ethereum'],
  authors: [{ name: 'Mining Investment Team' }],
  openGraph: {
    title: 'Mining Investment Platform',
    description: 'Professional cryptocurrency mining investment platform',
    url: 'https://mininginvestment.com',
    siteName: 'Mining Investment',
    type: 'website'
  }
}

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.className} min-h-full flex flex-col bg-gray-50`}>
        <div className="fixed inset-0 -z-10 h-full w-full bg-white bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>
        <SessionProvider>
          <Navbar />
          <main className="flex-grow container mx-auto px-4 py-8">
            <div className="max-w-7xl mx-auto">
              {children}
            </div>
          </main>
          <Footer />
        </SessionProvider>
      </body>
    </html>
  )
}