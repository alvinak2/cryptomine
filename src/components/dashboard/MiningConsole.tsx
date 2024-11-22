// src/components/dashboard/MiningConsole.tsx
'use client'

import { useEffect, useState, useRef } from 'react'

export function MiningConsole() {
  const [logs, setLogs] = useState<string[]>([])
  const consoleRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const miningMessages = [
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
      setLogs(prev => [...prev, miningMessages[index % miningMessages.length]])
      index++
      
      if (consoleRef.current) {
        consoleRef.current.scrollTop = consoleRef.current.scrollHeight
      }
    }, 2000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="bg-gray-900 rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-white text-lg font-semibold">Mining Console</h2>
        <div className="flex space-x-2">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
        </div>
      </div>
      <div 
        ref={consoleRef}
        className="h-64 overflow-y-auto font-mono text-sm text-green-400"
      >
        {logs.map((log, i) => (
          <div key={i} className="py-1">
            <span className="text-blue-400">$</span> {log}
          </div>
        ))}
      </div>
    </div>
  )
}