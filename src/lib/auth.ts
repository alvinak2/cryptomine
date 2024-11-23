// src/lib/auth.ts
import { signOut } from 'next-auth/react'

export async function handleLogout() {
  try {
    await signOut({
      callbackUrl: '/login',
      redirect: true
    })
  } catch (error) {
    console.error('Logout error:', error)
  }
}