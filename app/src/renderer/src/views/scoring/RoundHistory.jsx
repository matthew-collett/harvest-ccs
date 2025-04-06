import { useState } from 'react'
import { RoundItem } from './RoundItem'

export const RoundHistory = ({ rounds, teams, tasks }) => {
  const [expandedRounds, setExpandedRounds] = useState({})

  const toggleRound = (roundNumber) => {
    setExpandedRounds((prev) => ({
      ...prev,
      [roundNumber]: !prev[roundNumber]
    }))
  }

  if (rounds.length === 0) {
    return (
      <div className="text-center py-10 text-zinc-500 bg-zinc-800/50 rounded-lg border border-zinc-700/50 mb-8">
        No rounds have been played yet.
      </div>
    )
  }

  const getTeamName = (teamId) => {
    const team = teams.find((t) => t.id === teamId)
    return team ? team.name : `Team ${teamId}`
  }

  const getTaskName = (taskId) => {
    return tasks[taskId]?.name || `Task ${taskId}`
  }

  return (
    <div className="space-y-4">
      {rounds
        .sort((a, b) => b.roundNumber - a.roundNumber)
        .map((round, index) => (
          <RoundItem
            key={index}
            round={round}
            index={index}
            expanded={expandedRounds[round.roundNumber]}
            toggleRound={toggleRound}
            getTeamName={getTeamName}
            getTaskName={getTaskName}
          />
        ))}
    </div>
  )
}
