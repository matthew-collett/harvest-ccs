import { useState, useEffect } from 'react'
import { useStore } from '@/store'

export const TeamSelect = ({ teams, onSelectTeams }) => {
  const store = useStore()

  const [selectedTeams, setSelectedTeams] = useState({
    team1: store.currentRound.team1Id || '',
    team2: store.currentRound.team2Id || ''
  })

  useEffect(() => {
    setSelectedTeams({
      team1: store.currentRound.team1Id || '',
      team2: store.currentRound.team2Id || ''
    })
  }, [store.currentRound.team1Id, store.currentRound.team2Id])

  const handleTeamSelect = (field, value) => {
    // Just convert the string value to a number once
    const numericValue = value === '' ? '' : Number(value)

    const newSelections = {
      ...selectedTeams,
      [field]: numericValue
    }

    setSelectedTeams(newSelections)
    onSelectTeams(newSelections.team1, newSelections.team2)
  }

  return (
    <div className="bg-zinc-800 p-4 rounded-lg">
      <h2 className="text-lg font-semibold mb-4">Select Teams</h2>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm mb-2">Team 1</label>
          <select
            className="w-full p-2 rounded border border-zinc-700 bg-zinc-900 focus:outline-none"
            value={selectedTeams.team1}
            onChange={(e) => handleTeamSelect('team1', e.target.value)}
          >
            <option value="">Select Team</option>
            {teams
              .sort((a, b) => a.id - b.id)
              .map((team) => (
                <option key={team.id} value={team.id} disabled={team.id === selectedTeams.team2}>
                  {team.name}
                </option>
              ))}
          </select>
        </div>
        <div>
          <label className="block text-sm mb-2">Team 2</label>
          <select
            className="w-full p-2 rounded border border-zinc-700 bg-zinc-900 focus:outline-none"
            value={selectedTeams.team2}
            onChange={(e) => handleTeamSelect('team2', e.target.value)}
          >
            <option value="">Select Team</option>
            {teams
              .sort((a, b) => a.id - b.id)
              .map((team) => (
                <option key={team.id} value={team.id} disabled={team.id === selectedTeams.team1}>
                  {team.name}
                </option>
              ))}
          </select>
        </div>
      </div>
    </div>
  )
}
