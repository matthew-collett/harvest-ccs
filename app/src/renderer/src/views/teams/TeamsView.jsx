import { useState } from 'react'
import { useStore } from '@/store'
import { Header } from '@/components'
import { Users, Cpu, UserRoundX, Trash2, Edit2, ChevronDown, ChevronUp } from 'lucide-react'
import { SectionHeader, Input, Button } from '@/components/ui'

export const TeamsView = () => {
  const {
    teams,
    updateTeam,
    removeStudentFromTeam,
    removeDeviceFromTeam,
    addTeam,
    addStudentToTeam,
    addDevice,
    removeTeam
  } = useStore()

  const [searchTerm, setSearchTerm] = useState('')
  const [editingTeam, setEditingTeam] = useState(null)
  const [expandedSection, setExpandedSection] = useState(null)

  // New team state
  const [newTeam, setNewTeam] = useState({ id: '', name: '' })

  // New student state
  const [newStudent, setNewStudent] = useState({ name: '', teamId: '' })

  // New device state
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

  const filteredTeams = teams.filter(
    (team) =>
      team.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(team.id).toLowerCase().includes(searchTerm.toLowerCase())
  )

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
    setExpandedSection(null)
  }

  const handleAddStudent = (teamId) => {
    if (!newStudent.name.trim()) {
      return
    }

    addStudentToTeam(teamId, { name: newStudent.name })
    setNewStudent({ name: '', teamId: '' })
  }

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

    setExpandedSection(null)
  }

  const handleRemoveTeam = (teamId) => {
    if (window.confirm('Are you sure you want to remove this team and all its members?')) {
      removeTeam(teamId)
    }
  }

  const toggleSection = (section) => {
    if (expandedSection === section) {
      setExpandedSection(null)
    } else {
      setExpandedSection(section)
    }
  }

  return (
    <>
      <Header />
      {/* Actions Card */}
      <SectionHeader>Teams Actions</SectionHeader>
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

        {/* Expandable Forms */}
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
              <Button variant="outline" onClick={() => setExpandedSection(null)}>
                Cancel
              </Button>
            </div>
          </div>
        )}

        {expandedSection === 'add-device' && (
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
                  onChange={(e) =>
                    setNewDevice({ ...newDevice, deviceId: parseInt(e.target.value, 10) })
                  }
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
              <Button variant="outline" onClick={() => setExpandedSection(null)}>
                Cancel
              </Button>
            </div>
          </div>
        )}
      </div>
      <div className="flex justify-between items-center">
        <SectionHeader>Teams ({filteredTeams.length})</SectionHeader>
        <Input
          type="text"
          placeholder="Search teams..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-64 mb-4"
        />
      </div>
      {filteredTeams.length > 0 ? (
        filteredTeams.map((team) => (
          <div
            key={team.id}
            className="mb-6 bg-zinc-800/50 rounded-lg border border-zinc-700/50 overflow-hidden"
          >
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
                  <Button
                    size="sm"
                    variant="ghost"
                    className="p-1"
                    onClick={() => handleEditTeam(team)}
                  >
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
              {/* Students Section */}
              <div className="p-4">
                <div className="flex items-center gap-2 text-zinc-300 mb-3">
                  <Users size={18} />
                  <h3 className="font-medium">Team Members ({team.students.length})</h3>
                </div>

                {team.students.length > 0 ? (
                  <div className="bg-zinc-900/50 rounded border border-zinc-700/40 divide-y divide-zinc-700/40">
                    {team.students.map((student, index) => (
                      <div key={index} className="p-3 flex justify-between items-center">
                        <span>{student.name}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="p-1 text-zinc-400 hover:text-red-400"
                          onClick={() => removeStudentFromTeam(team.id, index)}
                        >
                          <UserRoundX size={16} />
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-zinc-500 bg-zinc-900/50 p-3 rounded border border-zinc-700/40">
                    No team members
                  </div>
                )}
                <div className="flex gap-2 mt-3">
                  <Input
                    type="text"
                    placeholder="Enter student name"
                    className="flex-1"
                    value={newStudent.teamId === team.id ? newStudent.name : ''}
                    onChange={(e) => setNewStudent({ name: e.target.value, teamId: team.id })}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && newStudent.name.trim()) {
                        handleAddStudent(team.id)
                      }
                    }}
                  />
                  <Button onClick={() => handleAddStudent(team.id)}>Add</Button>
                </div>
              </div>

              {/* Devices Section */}
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
                              {device.type === 'rover' ? 'Rover' : 'Harvester'} (ID:{' '}
                              {device.playerId})
                            </div>
                            <div className="text-sm text-zinc-400">
                              Health: {device.currentHealth}%
                            </div>
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
            </div>
          </div>
        ))
      ) : teams.length > 0 ? (
        <div className="text-center py-10 text-zinc-500 bg-zinc-800/50 rounded-lg border border-zinc-700/50">
          <p>No teams found</p>
          {searchTerm && <p className="mt-2">Try adjusting your search criteria</p>}
        </div>
      ) : (
        <div className="text-center py-10 text-zinc-500 bg-zinc-800/50 rounded-lg border border-zinc-700/50">
          <p>No teams have been created yet</p>
          <p className="mt-2">
            Use the &quot;New Team&quot; button above to create your first team
          </p>
        </div>
      )}
    </>
  )
}
