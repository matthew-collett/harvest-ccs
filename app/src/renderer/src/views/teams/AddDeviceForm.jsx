import { useState } from 'react'
import { Button, Input } from '@/components/ui'
import { useStore } from '@/store'

export const AddDeviceForm = ({ onCancel }) => {
  const { teams, addDevice } = useStore()
  const [newDevice, setNewDevice] = useState({
    teamId: '',
    playerId: '',
    deviceId: 1,
    currentHealth: 100,
    enabled: 1,
    disabledTimer: 0,
    shieldCodeFlag: 1,
    repairCodeFlag: 1,
    shieldCode: 0,
    repairCode: 0,
    lastSeen: 0
  })

  const handleAddDevice = () => {
    if (!newDevice.teamId || !newDevice.playerId) {
      alert('Please fill out all device details')
      return
    }

    const teamIdNumber = Number(newDevice.teamId)
    const playerIdNumber = Number(newDevice.playerId)

    if (isNaN(teamIdNumber) || isNaN(playerIdNumber)) {
      alert('Team ID and Player ID must be valid numbers')
      return
    }

    const team = teams.find((t) => t.id === teamIdNumber)
    if (
      team &&
      team.devices &&
      team.devices.find((d) => d.id === `${teamIdNumber}-${playerIdNumber}-${newDevice.deviceId}`)
    ) {
      alert('An identical device already exists on this team')
      return
    }

    addDevice({
      ...newDevice,
      teamId: teamIdNumber,
      playerId: playerIdNumber
    })

    setNewDevice({
      teamId: '',
      playerId: '',
      deviceId: 1,
      currentHealth: 100,
      enabled: 1,
      disabledTimer: 0,
      shieldCodeFlag: 1,
      repairCodeFlag: 1,
      shieldCode: 0,
      repairCode: 0,
      lastSeen: 0
    })

    onCancel()
  }

  return (
    <div className="px-4 pb-4 border-t border-zinc-700/30">
      <div className="pt-4 grid grid-cols-3 gap-4">
        <div>
          <label className="block text-sm mb-1">Team</label>
          <select
            className="w-full p-2 rounded border border-zinc-700 bg-zinc-900 focus:outline-none"
            value={newDevice.teamId}
            onChange={(e) => setNewDevice({ ...newDevice, teamId: e.target.value })}
          >
            <option value="">Select Team</option>
            {teams.map((team) => (
              <option key={team.id} value={team.id}>
                {team.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm mb-1">Device Type</label>
          <select
            className="w-full p-2 rounded border border-zinc-700 bg-zinc-900 focus:outline-none"
            value={newDevice.deviceId}
            onChange={(e) => setNewDevice({ ...newDevice, deviceId: parseInt(e.target.value, 10) })}
          >
            <option value={1}>Rover</option>
            <option value={2}>Harvester</option>
          </select>
        </div>
        <div>
          <label className="block text-sm mb-1">Player ID</label>
          <Input
            type="number"
            value={newDevice.playerId}
            onChange={(e) => setNewDevice({ ...newDevice, playerId: e.target.value })}
            placeholder="Enter player ID"
          />
        </div>
      </div>
      <div className="mt-4 flex gap-2">
        <Button onClick={handleAddDevice}>Add Device</Button>
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </div>
  )
}
