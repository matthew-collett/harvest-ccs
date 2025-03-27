import { Play, Pause, Square } from 'lucide-react'
import { Button } from '@/components/ui'

export const RoundControls = ({
  isActive,
  isPaused,
  roundNumber,
  roundTime,
  onStart,
  onPause,
  onResume,
  onStop,
  canStart
}) => (
  <div className="bg-zinc-800 p-4 rounded-lg flex items-center justify-between">
    <div className="flex gap-4 items-center">
      <div className="text-4xl font-bold font-mono">
        {String(Math.floor(roundTime / 60)).padStart(2, '0')}:
        {String(roundTime % 60).padStart(2, '0')}
      </div>
      <div className="text-zinc-400">
        {roundNumber > 0 ? `Round ${roundNumber}` : 'Waiting to Start'}
      </div>
    </div>

    <div className="flex gap-2">
      {!isActive ? (
        <Button className="flex items-center gap-2" onClick={onStart} disabled={!canStart}>
          <Play className="w-4 h-4" />
          Start Round
        </Button>
      ) : (
        <>
          {isPaused ? (
            <Button className="flex items-center gap-2" onClick={onResume}>
              <Play className="w-4 h-4" />
              Resume
            </Button>
          ) : (
            <Button className="flex items-center gap-2" onClick={onPause}>
              <Pause className="w-4 h-4" />
              Pause
            </Button>
          )}
          <Button className="flex items-center gap-2" variant="danger" onClick={onStop}>
            <Square className="w-4 h-4" />
            End Round
          </Button>
        </>
      )}
    </div>
  </div>
)
