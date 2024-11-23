// src/components/dashboard/MiningConsole.tsx
'use client'

import { useState, useEffect, useRef } from 'react'
import { useSession } from 'next-auth/react'

export function MiningConsole() {
  const { data: session } = useSession()
  const [hasActiveInvestment, setHasActiveInvestment] = useState(false)
  const [logs, setLogs] = useState<string[]>([])
  const [hashRate, setHashRate] = useState(0)
  const consoleRef = useRef<HTMLDivElement>(null)
  const [miningStarted, setMiningStarted] = useState(false)

  useEffect(() => {
    checkActiveInvestments()
  }, [])

  async function checkActiveInvestments() {
    const res = await fetch('/api/investments/active')
    const data = await res.json()
    setHasActiveInvestment(data.hasActive)
    if (data.hasActive && !miningStarted) {
      startMining()
    }
  }

  function startMining() {
    setMiningStarted(true)
    const miningMessages = [
      'Initializing mining protocols...',
      'Connecting to mining pool...',
      'Verifying blockchain headers...',
      'Starting hash computation...',
      'Mining block #1234567...',
      'Network difficulty: 23.14T',
      'Found new block candidate...',
      'Validating solution...',
    ]

    let index = 0
    const interval = setInterval(() => {
      setLogs(prev => [...prev, miningMessages[index % miningMessages.length]])
      setHashRate(prev => prev + Math.random() * 5)
      index++
      
      if (consoleRef.current) {
        consoleRef.current.scrollTop = consoleRef.current.scrollHeight
      }
    }, 2000)

    return () => clearInterval(interval)
  }

  if (!hasActiveInvestment) {
    return (
      <div className="bg-gray-900 rounded-lg p-6 text-center">
        <h2 className="text-white text-lg mb-2">Mining Console Inactive</h2>
        <p className="text-gray-400">Start an investment to begin mining operations</p>
      </div>
    )
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
        className="h-64 overflow-y-auto font-mono text-sm text-green-400 bg-gray-950 p-4 rounded"
      >
        {logs.map((log, i) => (
          <div key={i} className="py-1">
            <span className="text-blue-400">[{new Date().toLocaleTimeString()}]</span> {log}
          </div>
        ))}
      </div>
    </div>
  )
}