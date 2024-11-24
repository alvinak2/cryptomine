// src/app/admin/settings/page.tsx
'use client'

import { useState } from 'react'
import { Switch } from '@headlessui/react'

export default function AdminSettings() {
  const [settings, setSettings] = useState({
    enableRegistration: true,
    enableInvestments: true,
    maintenanceMode: false,
    emailNotifications: true
  })

  async function updateSetting(key: string, value: boolean) {
    await fetch('/api/admin/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ [key]: value })
    })
    setSettings(prev => ({ ...prev, [key]: value }))
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6 text-gray-300">Admin Settings</h1>

      <div className="bg-crypto-secondary text-gray-300 rounded-lg shadow p-6">
        <div className="space-y-6">
          {Object.entries(settings).map(([key, value]) => (
            <div key={key} className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-300">
                {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
              </span>
              <Switch
                checked={value}
                onChange={(checked) => updateSetting(key, checked)}
                className={`${
                  value ? 'bg-crypto-success' : 'bg-gray-200'
                } relative inline-flex h-6 w-11 items-center rounded-full`}
              >
                <span className="sr-only">Enable {key}</span>
                <span
                  className={`${
                    value ? 'translate-x-6' : 'translate-x-1'
                  } inline-block h-4 w-4 transform rounded-full bg-white transition`}
                />
              </Switch>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}