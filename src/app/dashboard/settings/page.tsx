// src/app/dashboard/settings/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { Switch } from '@headlessui/react'
import { BellIcon, ShieldCheckIcon, SunIcon, GlobeAltIcon } from '@heroicons/react/24/outline'

interface UserSettings {
  notifications: {
    email: boolean
    push: boolean
    marketing: boolean
  }
  security: {
    twoFactor: boolean
    loginAlerts: boolean
  }
  preferences: {
    theme: 'light' | 'dark' | 'system'
    language: string
  }
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<UserSettings>({
    notifications: {
      email: true,
      push: true,
      marketing: false
    },
    security: {
      twoFactor: false,
      loginAlerts: true
    },
    preferences: {
      theme: 'system',
      language: 'en'
    }
  })

  async function updateSettings(newSettings: Partial<UserSettings>) {
    const res = await fetch('/api/user/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newSettings)
    })
    if (res.ok) {
      setSettings(prev => ({ ...prev, ...newSettings }))
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Settings</h1>

      <div className="bg-white rounded-lg shadow">
        <div className="p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center">
            <BellIcon className="w-5 h-5 mr-2" />
            Notification Settings
          </h2>
          <div className="space-y-4">
            {Object.entries(settings.notifications).map(([key, value]) => (
              <Switch.Group key={key}>
                <div className="flex items-center justify-between">
                  <Switch.Label className="capitalize">{key} notifications</Switch.Label>
                  <Switch
                    checked={value}
                    onChange={(checked) => 
                      updateSettings({ 
                        notifications: { ...settings.notifications, [key]: checked }
                      })
                    }
                    className={`${
                      value ? 'bg-blue-600' : 'bg-gray-200'
                    } relative inline-flex h-6 w-11 items-center rounded-full transition-colors`}
                  >
                    <span className={`${
                      value ? 'translate-x-6' : 'translate-x-1'
                    } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`} />
                  </Switch>
                </div>
              </Switch.Group>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center">
            <ShieldCheckIcon className="w-5 h-5 mr-2" />
            Security Settings
          </h2>
          <div className="space-y-4">
            {Object.entries(settings.security).map(([key, value]) => (
              <Switch.Group key={key}>
                <div className="flex items-center justify-between">
                  <Switch.Label className="capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</Switch.Label>
                  <Switch
                    checked={value}
                    onChange={(checked) =>
                      updateSettings({
                        security: { ...settings.security, [key]: checked }
                      })
                    }
                    className={`${
                      value ? 'bg-blue-600' : 'bg-gray-200'
                    } relative inline-flex h-6 w-11 items-center rounded-full transition-colors`}
                  >
                    <span className={`${
                      value ? 'translate-x-6' : 'translate-x-1'
                    } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`} />
                  </Switch>
                </div>
              </Switch.Group>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center">
            <SunIcon className="w-5 h-5 mr-2" />
            Preferences
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Theme</label>
              <select
                value={settings.preferences.theme}
                onChange={(e) => updateSettings({
                  preferences: { ...settings.preferences, theme: e.target.value as 'light' | 'dark' | 'system' }
                })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="light">Light</option>
                <option value="dark">Dark</option>
                <option value="system">System</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Language</label>
              <select
                value={settings.preferences.language}
                onChange={(e) => updateSettings({
                  preferences: { ...settings.preferences, language: e.target.value }
                })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="en">English</option>
                <option value="es">Spanish</option>
                <option value="fr">French</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}