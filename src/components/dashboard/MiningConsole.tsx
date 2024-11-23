// src/components/dashboard/MiningConsole.tsx
'use client'

import { useState, useEffect, useRef } from 'react'

interface MiningLog {
  timestamp: string
  message: string
  type: 'info' | 'success' | 'error'
}

export function MiningConsole() {
  const [logs, setLogs] = useState<MiningLog[]>([])
  const [hashRate, setHashRate] = useState(0)
  const [isActive, setIsActive] = useState(false)
  const consoleRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let interval: NodeJS.Timeout
    
    async function checkMiningStatus() {
      const res = await fetch('/api/mining/status')
      const data = await res.json()
      
      if (data.active && !isActive) {
        setIsActive(true)
        startMining()
      }
    }

    checkMiningStatus()
    return () => clearInterval(interval)
  }, [])

  function startMining() {
    const miningMessages = [
      'Initializing mining protocols...',
      'Connecting to mining pool...',
      'Verifying blockchain headers...',
      'Starting hash computation...',
      'Block candidate found...',
      'Submitting proof of work...',
      'Mining rewards calculated...',
    ]

    let index = 0
    const interval = setInterval(() => {
      // Add new log
      const newLog = {
        timestamp: new Date().toLocaleTimeString(),
        message: miningMessages[index % miningMessages.length],
        type: 'info' as const
      }
      setLogs(prev => [...prev.slice(-50), newLog]) // Keep last 50 logs

      // Update hash rate randomly
      setHashRate(prev => {
        const change = (Math.random() - 0.5) * 2 // Random change between -1 and 1
        return Math.max(0, prev + change)
      })

      // Auto scroll to bottom
      if (consoleRef.current) {
        consoleRef.current.scrollTop = consoleRef.current.scrollHeight
      }

      index++
    }, 3000)

    return () => clearInterval(interval)
  }

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
  className="h-48 sm:h-64 overflow-y-auto font-mono text-xs sm:text-sm bg-gray-950 rounded p-2 sm:p-4"
>
        {logs.map((log, i) => (
          <div 
            key={i} 
            className={`py-1 ${
              log.type === 'success' ? 'text-green-400' :
              log.type === 'error' ? 'text-red-400' :
              'text-gray-300'
            }`}
          >
            <span className="text-blue-400">[{log.timestamp}]</span> {log.message}
          </div>
        ))}
      </div>
    </div>
  )
}