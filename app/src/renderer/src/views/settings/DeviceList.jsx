import { IconButton } from '@/components/ui'
import { X } from 'lucide-react'

export const DeviceList = ({ title, devices = [], type, teamId, removeDeviceFromTeam }) => (
  <div>
    <h4 className="text-sm font-semibold mb-2">{title}</h4>
    {devices?.length > 0 ? (
      <ul className="space-y-1">
        {devices.map((device) => (
          <li key={device.id} className="text-sm rounded flex justify-between items-center group">
            <span>{device.name || `${type} (Player ${device.playerId})`}</span>
            <IconButton
              icon={X}
              onClick={() => removeDeviceFromTeam(teamId, device.id)}
              className="opacity-0 group-hover:opacity-100 hover:bg-red-500/10"
              title={`Remove ${type}`}
            />
          </li>
        ))}
      </ul>
    ) : (
      <p className="text-sm text-zinc-500">No {title.toLowerCase()} added</p>
    )}
  </div>
)
