import { useState } from 'react'
import { ChevronUp, ChevronDown } from 'lucide-react'
import { Button, Input } from '@/components/ui'
import { useStore } from '@/store'
import { AddDeviceForm } from './AddDeviceForm'

export const TeamAction = ({ expandedSection, toggleSection }) => {
  const { teams, addTeam } = useStore()
  const [newTeam, setNewTeam] = useState({ id: '', name: '' })

  const handleAddTeam = () => {
    if (!newTeam.id.trim() || !newTeam.name.trim()) {
      alert('Please enter both team ID and name')
      return
    }

    const teamIdNumber = Number(newTeam.id)

    if (isNaN(teamIdNumber)) {
      alert('Team ID must be a valid number')
      return
    }

    if (teams.find((t) => t.id === teamIdNumber)) {
      alert('A team with this ID already exists')
      return
    }

    addTeam({
      id: teamIdNumber,
      name: newTeam.name,
      students: [],
      devices: []
    })

    setNewTeam({ id: '', name: '' })
    toggleSection(null)
  }

  return (
    <div className="mb-6 bg-zinc-800/50 rounded-lg border border-zinc-700/50 overflow-hidden">
      <div className="p-4 flex gap-4">
        <Button onClick={() => toggleSection('add-team')} className="flex items-center gap-2">
          {expandedSection === 'add-team' ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          New Team
        </Button>
        <Button onClick={() => toggleSection('add-device')} className="flex items-center gap-2">
          {expandedSection === 'add-device' ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          New Device
        </Button>
      </div>

      {expandedSection === 'add-team' && (
        <div className="px-4 pb-4 border-t border-zinc-700/30">
          <div className="pt-4 grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm mb-1">Team ID</label>
              <Input
                type="text"
                value={newTeam.id}
                onChange={(e) => setNewTeam({ ...newTeam, id: e.target.value })}
                placeholder="Enter Team ID"
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Team Name</label>
              <Input
                type="text"
                value={newTeam.name}
                onChange={(e) => setNewTeam({ ...newTeam, name: e.target.value })}
                placeholder="Enter team name"
              />
            </div>
          </div>
          <div className="mt-4 flex gap-2">
            <Button onClick={handleAddTeam}>Create Team</Button>
            <Button variant="outline" onClick={() => toggleSection(null)}>
              Cancel
            </Button>
          </div>
        </div>
      )}

      {expandedSection === 'add-device' && <AddDeviceForm onCancel={() => toggleSection(null)} />}
    </div>
  )
}
