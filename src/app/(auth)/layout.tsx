// src/app/(auth)/layout.tsx
import '@/app/globals.css'

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <main className="w-full max-w-md">
        {children}
      </main>
    </div>
  )
}