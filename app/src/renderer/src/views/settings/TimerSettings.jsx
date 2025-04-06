import { SectionHeader, Input, Button } from '@/components/ui'
import { useState, useEffect } from 'react'
import { Check, Loader } from 'lucide-react'

export const TimerSettings = ({ settings, updateSettings }) => {
  const [localSettings, setLocalSettings] = useState({
    roundDurationMinutes: Math.floor((settings.roundDuration || 0) / 60)
  })
  const [isLoading, setIsLoading] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  useEffect(() => {
    setLocalSettings({
      roundDurationMinutes: Math.floor((settings.roundDuration || 0) / 60)
    })
  }, [settings])

  const handleSave = () => {
    setIsLoading(true)
    setShowSuccess(false)

    updateSettings({
      roundDuration: localSettings.roundDurationMinutes * 60
    })

    setIsLoading(false)
    setShowSuccess(true)

    setTimeout(() => {
      setShowSuccess(false)
    }, 2000)
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
            disabled={isLoading}
          />
        </div>
      </div>
      <div className="mt-4 flex items-center">
        <Button onClick={handleSave} disabled={isLoading} className={isLoading ? 'opacity-75' : ''}>
          {isLoading && <Loader className="w-4 h-4 mr-2 animate-spin" />}
          {isLoading ? 'Saving...' : 'Save Settings'}
        </Button>

        {showSuccess && (
          <div className="ml-4 text-green-600 flex items-center">
            <Check className="w-5 h-5 mr-1" />
            <span>Settings saved!</span>
          </div>
        )}
      </div>
    </div>
  )
}
