import { useState } from 'react'
import { Edit2, Trash2 } from 'lucide-react'
import { Button, Input } from '@/components/ui'
import { useStore } from '@/store'
import { TeamMembers } from './TeamMembers'
import { Devices } from './Devices'

export const TeamCard = ({ team }) => {
  const { updateTeam, removeTeam } = useStore()
  const [editingTeam, setEditingTeam] = useState(null)

  const handleEditTeam = (team) => {
    setEditingTeam({
      id: team.id,
      name: team.name
    })
  }

  const handleSaveEdit = () => {
    if (editingTeam) {
      updateTeam(editingTeam.id, { name: editingTeam.name })
      setEditingTeam(null)
    }
  }

  const cancelEdit = () => {
    setEditingTeam(null)
  }

  const handleRemoveTeam = (teamId) => {
    if (window.confirm('Are you sure you want to remove this team and all its members?')) {
      removeTeam(teamId)
    }
  }

  return (
    <div className="mb-6 bg-zinc-800/50 rounded-lg border border-zinc-700/50 overflow-hidden">
      <div className="p-4 border-b border-zinc-700/50 flex justify-between items-center">
        {editingTeam && editingTeam.id === team.id ? (
          <div className="flex gap-2 items-center">
            <Input
              type="text"
              value={editingTeam.name}
              onChange={(e) => setEditingTeam({ ...editingTeam, name: e.target.value })}
              className="w-64"
            />
            <Button size="sm" onClick={handleSaveEdit}>
              Save
            </Button>
            <Button size="sm" variant="outline" onClick={cancelEdit}>
              Cancel
            </Button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-semibold">{team.name}</h2>
            <span className="text-xs bg-zinc-700 px-2 py-1 rounded">ID: {team.id}</span>
            <Button size="sm" variant="ghost" className="p-1" onClick={() => handleEditTeam(team)}>
              <Edit2 size={16} />
            </Button>
          </div>
        )}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            className="p-1 text-zinc-400 hover:text-red-400"
            onClick={() => handleRemoveTeam(team.id)}
          >
            <Trash2 size={16} />
          </Button>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-0 divide-x divide-zinc-700/50">
        <TeamMembers team={team} />
        <Devices team={team} />
      </div>
    </div>
  )
}
