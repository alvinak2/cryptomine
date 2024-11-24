// src/components/dashboard/MiningConsole.tsx
'use client'

import { useState, useEffect, useRef } from 'react'

interface MiningLog {
  message: string
  timestamp: string
}

export function MiningConsole() {
  const [logs, setLogs] = useState<MiningLog[]>([])
  const [hashRate, setHashRate] = useState(0)
  const [initialized, setInitialized] = useState(false)
  const consoleRef = useRef<HTMLDivElement>(null)

  // One-time initialization
  useEffect(() => {
    const hasInitialized = localStorage.getItem('miningInitialized')
    if (!hasInitialized) {
      const initializationMessages = [
        'Initializing mining protocols...',
        'Connecting to mining pool...',
        'Verifying blockchain headers...',
        'Starting hash computation...',
      ]

      initializationMessages.forEach((message, index) => {
        setTimeout(() => {
          setLogs(prev => [...prev, {
            message,
            timestamp: new Date().toLocaleTimeString()
          }])
        }, index * 1000)
      })

      localStorage.setItem('miningInitialized', 'true')
      setInitialized(true)
    }
  }, [])

  // Regular mining updates
useEffect(() => {
  if (!initialized) return

  const interval = setInterval(() => {
    // Random hash rate between 20-56 TH/s
    const newHashRate = Math.random() * 36 + 20 // 20 + (0-36) = 20-56
    setHashRate(newHashRate)

    setLogs(prev => [...prev.slice(-50), {
      message: `Mining at ${newHashRate.toFixed(2)} TH/s`,
      timestamp: new Date().toLocaleTimeString()
    }])

    // Additional mining messages for variety
    if (Math.random() < 0.2) { // 20% chance for these messages
      const messages = [
        'Block candidate found...',
        'Verifying solution...',
        'Submitting shares to pool...',
        'Network difficulty adjusted...',
      ]
      const randomMessage = messages[Math.floor(Math.random() * messages.length)]
      setLogs(prev => [...prev.slice(-50), {
        message: randomMessage,
        timestamp: new Date().toLocaleTimeString()
      }])
    }

    if (consoleRef.current) {
      consoleRef.current.scrollTop = consoleRef.current.scrollHeight
    }
  }, 5000)

  return () => clearInterval(interval)
}, [initialized])

  // Clear initialization on logout
  useEffect(() => {
    return () => {
      localStorage.removeItem('miningInitialized')
    }
  }, [])

  return (
    <div className="bg-gray-900 rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-white text-lg font-semibold">Mining Console</h2>
        <div className="flex items-center space-x-4">
          <span className="text-green-400">Hash Rate: {hashRate.toFixed(2)} TH/s</span>
          <div className="flex space-x-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></div>
          </div>
        </div>
      </div>
      <div 
        ref={consoleRef}
        className="h-64 overflow-y-auto font-mono text-sm bg-gray-950 rounded p-4"
      >
        {logs.map((log, i) => (
          <div key={i} className="py-1 text-gray-300">
            <span className="text-blue-400">[{log.timestamp}]</span> {log.message}
          </div>
        ))}
      </div>
    </div>
  )
}