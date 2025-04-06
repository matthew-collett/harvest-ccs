import { Cpu, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui'
import { useStore } from '@/store'

export const Devices = ({ team }) => {
  const { removeDeviceFromTeam } = useStore()

  return (
    <div className="p-4">
      <div className="flex items-center gap-2 text-zinc-300 mb-3">
        <Cpu size={18} />
        <h3 className="font-medium">Devices ({team.devices.length})</h3>
      </div>

      {team.devices.length > 0 ? (
        <div className="bg-zinc-900/50 rounded border border-zinc-700/40 divide-y divide-zinc-700/40">
          {team.devices.map((device) => (
            <div key={device.id} className="p-3">
              <div className="flex justify-between items-center">
                <div className="flex flex-col gap-1">
                  <div className="font-medium">
                    {device.type.charAt(0).toUpperCase() + device.type.slice(1)} (ID:{' '}
                    {device.playerId})
                  </div>
                  <div className="text-sm text-zinc-400">Health: {device.currentHealth}%</div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="p-1 text-zinc-400 hover:text-red-400"
                  onClick={() => removeDeviceFromTeam(team.id, device.id)}
                >
                  <Trash2 size={16} />
                </Button>
              </div>
              <div className="mt-2 text-xs text-zinc-400">
                Last Seen:{' '}
                {device.lastSeen
                  ? new Date(parseInt(device.lastSeen)).toLocaleString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      hour: 'numeric',
                      minute: '2-digit',
                      hour12: true
                    })
                  : 'Never'}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-zinc-500 bg-zinc-900/50 p-3 rounded border border-zinc-700/40">
          No devices
        </div>
      )}
    </div>
  )
}
