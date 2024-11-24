// src/components/dashboard/MiningConsole.tsx
'use client'

import { useState, useEffect, useRef, useCallback } from 'react'

export function MiningConsole() {
  const [logs, setLogs] = useState<Array<{message: string, timestamp: string}>>([])
  const [hashRate, setHashRate] = useState(0)
  const [isActive, setIsActive] = useState(false)
  const consoleRef = useRef<HTMLDivElement>(null)

  const checkMiningStatus = useCallback(async () => {
    try {
      const res = await fetch('/api/mining/status')
      const data = await res.json()
      setIsActive(data.active)
    } catch (error) {
      console.error('Mining status check failed:', error)
    }
  }, [])

  useEffect(() => {
    checkMiningStatus()

    if (isActive) {
      const messages = [
        'Initializing mining protocols...',
        'Connecting to mining pool...',
        'Verifying blockchain headers...',
        'Starting hash computation...',
        'Mining block #1234567...',
        'Hash rate: 45.7 TH/s',
        'Found new block candidate...',
        'Validating solution...',
      ]

      let index = 0
      const interval = setInterval(() => {
        setLogs(prev => [...prev.slice(-50), {
          message: messages[index % messages.length],
          timestamp: new Date().toLocaleTimeString()
        }])

        setHashRate(prev => {
          const change = (Math.random() - 0.5) * 2
          return Math.max(0, prev + change)
        })

        if (consoleRef.current) {
          consoleRef.current.scrollTop = consoleRef.current.scrollHeight
        }

        index++
      }, 2000)

      return () => clearInterval(interval)
    }
  }, [isActive, checkMiningStatus])

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