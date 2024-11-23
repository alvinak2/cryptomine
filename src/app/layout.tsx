// src/app/layout.tsx
import { Inter } from 'next/font/google'
import { SessionProvider } from '@/components/providers/SessionProvider'
import Navbar from '@/components/navigation/Navbar'
import Footer from '@/components/navigation/Footer'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.className} min-h-screen flex flex-col bg-gray-50`}>
        <SessionProvider>
          <Navbar />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
        </SessionProvider>
      </body>
    </html>
  )
}