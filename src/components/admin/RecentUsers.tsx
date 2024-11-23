// src/components/admin/RecentUsers.tsx
'use client'

import { useState, useEffect } from 'react'

export function RecentUsers() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchRecentUsers()
  }, [])

  async function fetchRecentUsers() {
    const res = await fetch('/api/admin/users/recent')
    const data = await res.json()
    setUsers(data)
    setLoading(false)
  }

  if (loading) return <div>Loading...</div>

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead>
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Joined</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {users.map((user: any) => (
            <tr key={user._id}>
              <td className="px-6 py-4">{user.name}</td>
              <td className="px-6 py-4">{user.email}</td>
              <td className="px-6 py-4">{new Date(user.createdAt).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}