import { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { TeamScoreCard } from './TeamScoreCard'
import { TaskList } from './TaskList'

export const RoundItem = ({ round, index, expanded, toggleRound, getTeamName, getTaskName }) => {
  const [expandedTasks, setExpandedTasks] = useState({})

  const toggleTask = (roundNumber, taskId) => {
    const key = `${roundNumber}-${taskId}`
    setExpandedTasks((prev) => ({
      ...prev,
      [key]: !prev[key]
    }))
  }

  return (
    <div className="bg-zinc-800 rounded overflow-hidden">
      <div
        className="flex justify-between items-center p-4 cursor-pointer bg-zinc-800"
        onClick={() => toggleRound(round.roundNumber)}
      >
        <div>
          <span className="font-bold">Round {round.roundNumber}</span>
          <span className="text-zinc-400 ml-2">
            {getTeamName(round.team1Id)} vs {getTeamName(round.team2Id)}
          </span>
        </div>
        <div className="flex items-center">
          <div className="text-right mr-4">
            <div>
              {getTeamName(round.team1Id)}:{' '}
              <span className="font-bold">{round.roundPoints[round.team1Id] || 0} pts</span>
            </div>
            <div>
              {getTeamName(round.team2Id)}:{' '}
              <span className="font-bold">{round.roundPoints[round.team2Id] || 0} pts</span>
            </div>
          </div>
          {expanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </div>
      </div>

      {expanded && (
        <div className="p-4 border-t border-zinc-700">
          <div className="mb-4 grid grid-cols-2 gap-4">
            <TeamScoreCard
              team={{ id: round.team1Id, name: getTeamName(round.team1Id) }}
              roundIndex={index}
              score={round.roundPoints[round.team1Id] || 0}
            />

            <TeamScoreCard
              team={{ id: round.team2Id, name: getTeamName(round.team2Id) }}
              roundIndex={index}
              score={round.roundPoints[round.team2Id] || 0}
            />
          </div>

          <TaskList
            tasks={round.completedTasks}
            roundNumber={round.roundNumber}
            expandedTasks={expandedTasks}
            toggleTask={toggleTask}
            getTeamName={getTeamName}
            getTaskName={getTaskName}
          />
        </div>
      )}
    </div>
  )
}
