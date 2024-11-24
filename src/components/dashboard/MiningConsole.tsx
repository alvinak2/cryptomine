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

  useEffect(() => {
    if (!initialized) return

    const interval = setInterval(() => {
      const newHashRate = Math.random() * 36 + 20
      setHashRate(newHashRate)

      setLogs(prev => [...prev.slice(-50), {
        message: `Mining at ${newHashRate.toFixed(2)} TH/s`,
        timestamp: new Date().toLocaleTimeString()
      }])

      if (consoleRef.current) {
        consoleRef.current.scrollTop = consoleRef.current.scrollHeight
      }
    }, 5000)

    return () => clearInterval(interval)
  }, [initialized])

  useEffect(() => {
    return () => {
      localStorage.removeItem('miningInitialized')
    }
  }, [])

  return (
    <div className="bg-crypto-primary rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-white text-lg font-semibold">Mining Console</h2>
        <div className="flex items-center space-x-4">
          <span className="text-crypto-success">Hash Rate: {hashRate.toFixed(2)} TH/s</span>
          <div className="flex space-x-2">
            <div className="w-3 h-3 rounded-full bg-crypto-error"></div>
            <div className="w-3 h-3 rounded-full bg-crypto-warning"></div>
            <div className="w-3 h-3 rounded-full bg-crypto-success animate-pulse"></div>
          </div>
        </div>
      </div>
      <div ref={consoleRef} className="h-64 overflow-y-auto font-mono text-sm bg-crypto-secondary rounded p-4">
        {logs.map((log, i) => (
          <div key={i} className="py-1">
            <span className="text-crypto-ethereum">[{log.timestamp}]</span>{' '}
            <span className="text-gray-300">{log.message}</span>
          </div>
        ))}
      </div>
    </div>
  )
}