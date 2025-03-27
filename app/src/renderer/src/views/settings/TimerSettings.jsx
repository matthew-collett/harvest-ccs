import { SectionHeader, Input, Button } from '@/components/ui'
import { useState, useEffect } from 'react'

export const TimerSettings = ({ settings, updateSettings }) => {
  const [localSettings, setLocalSettings] = useState({
    roundDurationMinutes: Math.floor((settings.roundDuration || 0) / 60)
  })

  useEffect(() => {
    setLocalSettings({
      roundDurationMinutes: Math.floor((settings.roundDuration || 0) / 60)
    })
  }, [settings])

  const handleSave = () => {
    updateSettings({
      roundDuration: localSettings.roundDurationMinutes * 60
    })
  }

  return (
    <div className="mb-8">
      <SectionHeader>Timer Settings</SectionHeader>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm mb-1">Round Duration (minutes)</label>
          <Input
            className="w-full"
            value={localSettings.roundDurationMinutes}
            onChange={(e) => {
              const value = e.target.value === '' ? 0 : parseInt(e.target.value || 0)
              setLocalSettings({ ...localSettings, roundDurationMinutes: value })
            }}
          />
        </div>
      </div>
      <div className="mt-4">
        <Button onClick={handleSave}>Save Settings</Button>
      </div>
    </div>
  )
}
