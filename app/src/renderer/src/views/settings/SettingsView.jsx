import { useStore } from '@/store'
import { Header } from '@/components'
import { AlertOctagon } from 'lucide-react'
import { TimerSettings, SerialConnectionManager } from '@/views/settings'
import { SectionHeader, Button } from '@/components/ui'

export const SettingsView = () => {
  const { settings, updateSettings, resetCompetition } = useStore()

  const handleEndCompetition = () => {
    if (
      window.confirm(
        'Are you sure you want to end the competition? This will reset all scores and data.'
      )
    ) {
      resetCompetition()
    }
  }

  return (
    <>
      <Header />
      <SerialConnectionManager />
      <TimerSettings settings={settings} updateSettings={updateSettings} />
      <div className="mb-8">
        <SectionHeader>Reset & End Competition</SectionHeader>
        <div className="flex flex-col gap-4">
          <div>WARNING: This will reset all competition rounds and cannot be undone</div>
          <Button
            variant="danger"
            className="flex items-center gap-2 h-fit w-fit"
            onClick={handleEndCompetition}
          >
            <AlertOctagon className="w-4 h-4" />
            Reset Competition
          </Button>
        </div>
      </div>
    </>
  )
}
