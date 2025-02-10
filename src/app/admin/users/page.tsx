// src/app/admin/users/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { 
  TrashIcon, 
  PencilIcon,
  MagnifyingGlassIcon,
  ChevronUpIcon,
  ChevronDownIcon 
} from '@heroicons/react/24/outline'

export default function UsersManagement() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [sortField, setSortField] = useState('createdAt')
  const [sortOrder, setSortOrder] = useState('desc')

  useEffect(() => {
    fetchUsers()
  }, [page, search, sortField, sortOrder])

  async function fetchUsers() {
    try {
      setLoading(true)
      const queryParams = new URLSearchParams({
        page: page.toString(),
        search,
        sortField,
        sortOrder,
        limit: '10'
      })

      const res = await fetch(`/api/admin/users?${queryParams}`)
      if (!res.ok) throw new Error('Failed to fetch users')
      
      const data = await res.json()
      setUsers(data.users)
      setTotalPages(data.totalPages)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to delete this user?')) return

    try {
      const res = await fetch(`/api/admin/users/${id}`, {
        method: 'DELETE'
      })
      if (!res.ok) throw new Error('Failed to delete user')
      fetchUsers()
    } catch (err: any) {
      setError(err.message)
    }
  }

  function handleSort(field: string) {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortOrder('asc')
    }
  }

  return (
    <div className="p-6">
    <h1 className="text-2xl font-bold mb-6 text-gray-300">Users Management</h1>

    {error && (
      <div className="mb-4 p-4 bg-red-50 text-red-600 rounded-lg">
        {error}
      </div>
    )}

    <div className="mb-4">
      <div className="relative">
        <input
          type="text"
          placeholder="Search users..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border rounded-lg bg-crypto-primary text-gray-300"
        />
        <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute left-3 top-3" />
      </div>
    </div>
    <div className="overflow-x-auto">
        <div className="inline-block min-w-full align-middle">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-crypto-secondary">
              <tr>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase cursor-pointer"
                  onClick={() => handleSort('name')}
                >
                  <div className="flex items-center">
                    Name
                    {sortField === 'name' && (
                      sortOrder === 'asc' ? <ChevronUpIcon className="h-4 w-4 ml-1" /> : 
                      <ChevronDownIcon className="h-4 w-4 ml-1" />
                    )}
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Role</th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase cursor-pointer"
                  onClick={() => handleSort('createdAt')}
                >
                <div className="flex items-center">
                    Joined
                    {sortField === 'createdAt' && (
                      sortOrder === 'asc' ? <ChevronUpIcon className="h-4 w-4 ml-1" /> : 
                      <ChevronDownIcon className="h-4 w-4 ml-1" />
                    )}
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-crypto-primary divide-y divide-gray-700">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-gray-300">Loading...</td>
                </tr>
              ) : users.map((user: any) => (
                <tr key={user._id}>
                  <td className="px-6 py-4 text-gray-300">{user.name}</td>
                  <td className="px-6 py-4 text-gray-300">{user.email}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      user.role === 'admin' ? 'bg-crypto-ethereum bg-opacity-20 text-crypto-ethereum' : 'bg-gray-500 bg-opacity-20 text-gray-400'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-300">{new Date(user.createdAt).toLocaleDateString()}</td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleDelete(user._id)}
                      className="text-red-600 hover:text-red-900 mr-2"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="mt-4 flex justify-center">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
          <button
            key={pageNum}
            onClick={() => setPage(pageNum)}
            className={`mx-1 px-4 py-2 rounded-md ${
              page === pageNum 
                ? 'bg-crypto-success text-white' 
                : 'bg-crypto-secondary text-gray-300 hover:bg-crypto-secondary/90'
            }`}
          >
            {pageNum}
          </button>
        ))}
      </div>
    </div>
  )
}