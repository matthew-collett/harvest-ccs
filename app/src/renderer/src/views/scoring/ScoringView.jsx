import { useState } from 'react'
import { Header } from '@/components'
import { SectionHeader } from '@/components/ui'
import { useStore } from '@/store/useStore'
import { ChevronDown, ChevronUp, Edit, Check, X, Plus, Minus } from 'lucide-react'

export const ScoringView = () => {
  const rounds = useStore((state) => state.rounds)
  const teams = useStore((state) => state.teams)
  const tasks = useStore((state) => state.tasks)
  const updateRoundPoints = useStore((state) => state.updateRoundPoints)

  const [expandedRounds, setExpandedRounds] = useState({})
  const [expandedTasks, setExpandedTasks] = useState({})
  const [editingScore, setEditingScore] = useState(null)
  const [pointAdjustment, setPointAdjustment] = useState(0)

  const toggleRound = (roundNumber) => {
    setExpandedRounds((prev) => ({
      ...prev,
      [roundNumber]: !prev[roundNumber]
    }))
  }

  const toggleTask = (roundNumber, taskId) => {
    const key = `${roundNumber}-${taskId}`
    setExpandedTasks((prev) => ({
      ...prev,
      [key]: !prev[key]
    }))
  }

  const startEditing = (roundIndex, teamId) => {
    setEditingScore(`${roundIndex}-${teamId}`)
    setPointAdjustment(0)
  }

  const saveScoreAdjustment = (roundIndex, teamId) => {
    if (pointAdjustment !== 0) {
      updateRoundPoints(roundIndex, teamId, pointAdjustment)
    }
    setEditingScore(null)
    setPointAdjustment(0)
  }

  const cancelEditing = () => {
    setEditingScore(null)
    setPointAdjustment(0)
  }

  const getTeamName = (teamId) => {
    const team = teams.find((t) => t.id === teamId)
    return team ? team.name : `Team ${teamId}`
  }

  const getTaskName = (taskId) => {
    return tasks[taskId]?.name || `Task ${taskId}`
  }

  const calculateTotalScores = () => {
    const totalScores = {}
    teams.forEach((team) => {
      totalScores[team.id] = rounds.reduce((total, round) => {
        return total + (round.roundPoints?.[team.id] || 0)
      }, 0)
    })
    return totalScores
  }

  const totalScores = calculateTotalScores()

  return (
    <>
      <Header />
      <SectionHeader>Team Scores</SectionHeader>
      {teams.length === 0 ? (
        <div className="text-center py-10 text-zinc-500 bg-zinc-800/50 rounded-lg border border-zinc-700/50 mb-8">
          <p>No teams have been created yet</p>
          <p className="mt-2">
            Use the &quot;New Team&quot; button above to create your first team
          </p>
        </div>
      ) : (
        <div className="mb-8">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {teams.map((team) => (
              <div key={team.id} className="bg-zinc-800 rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-bold">{team.name}</h3>
                </div>
                <div className="text-2xl font-bold">{totalScores[team.id] || 0} pts</div>
              </div>
            ))}
          </div>
        </div>
      )}
      <SectionHeader>Round History</SectionHeader>
      {rounds.length === 0 ? (
        <div className="text-center py-10 text-zinc-500 bg-zinc-800/50 rounded-lg border border-zinc-700/50 mb-8">
          No rounds have been played yet.
        </div>
      ) : (
        <div className="space-y-4">
          {rounds
            .sort((a, b) => b.roundNumber - a.roundNumber)
            .map((round, index) => (
              <div key={index} className="bg-zinc-800 rounded overflow-hidden">
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
                        <span className="font-bold">
                          {round.roundPoints[round.team1Id] || 0} pts
                        </span>
                      </div>
                      <div>
                        {getTeamName(round.team2Id)}:{' '}
                        <span className="font-bold">
                          {round.roundPoints[round.team2Id] || 0} pts
                        </span>
                      </div>
                    </div>
                    {expandedRounds[round.roundNumber] ? (
                      <ChevronUp size={20} />
                    ) : (
                      <ChevronDown size={20} />
                    )}
                  </div>
                </div>

                {expandedRounds[round.roundNumber] && (
                  <div className="p-4 border-t border-zinc-700">
                    <div className="mb-4 grid grid-cols-2 gap-4">
                      <div className="p-3 rounded bg-zinc-700/50">
                        <div className="flex justify-between items-center mb-1">
                          <h4 className="font-bold">{getTeamName(round.team1Id)}</h4>
                          {editingScore === `${index}-${round.team1Id}` ? (
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  setPointAdjustment((prev) => prev - 1)
                                }}
                                className="bg-zinc-600 p-1 rounded"
                              >
                                <Minus size={16} />
                              </button>
                              <span
                                className={`font-bold ${pointAdjustment > 0 ? 'text-green-400' : pointAdjustment < 0 ? 'text-red-400' : ''}`}
                              >
                                {pointAdjustment > 0 ? `+${pointAdjustment}` : pointAdjustment}
                              </span>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  setPointAdjustment((prev) => prev + 1)
                                }}
                                className="bg-zinc-600 p-1 rounded"
                              >
                                <Plus size={16} />
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                startEditing(index, round.team1Id)
                              }}
                              className="text-zinc-400"
                            >
                              <Edit size={18} />
                            </button>
                          )}
                        </div>
                        <div>
                          Score:{' '}
                          <span className="font-bold">
                            {round.roundPoints[round.team1Id] || 0} pts
                          </span>
                        </div>

                        {editingScore === `${index}-${round.team1Id}` && (
                          <div className="flex justify-end space-x-2 mt-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                cancelEditing()
                              }}
                              className="bg-red-600 p-1 rounded"
                            >
                              <X size={16} />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                saveScoreAdjustment(index, round.team1Id)
                              }}
                              className="bg-green-600 p-1 rounded"
                            >
                              <Check size={16} />
                            </button>
                          </div>
                        )}
                      </div>

                      <div className="p-3 rounded bg-zinc-700/50">
                        <div className="flex justify-between items-center mb-1">
                          <h4 className="font-bold">{getTeamName(round.team2Id)}</h4>
                          {editingScore === `${index}-${round.team2Id}` ? (
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  setPointAdjustment((prev) => prev - 1)
                                }}
                                className="bg-zinc-600 p-1 rounded"
                              >
                                <Minus size={16} />
                              </button>
                              <span
                                className={`font-bold ${pointAdjustment > 0 ? 'text-green-400' : pointAdjustment < 0 ? 'text-red-400' : ''}`}
                              >
                                {pointAdjustment > 0 ? `+${pointAdjustment}` : pointAdjustment}
                              </span>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  setPointAdjustment((prev) => prev + 1)
                                }}
                                className="bg-zinc-600 p-1 rounded"
                              >
                                <Plus size={16} />
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                startEditing(index, round.team2Id)
                              }}
                              className="text-zinc-400"
                            >
                              <Edit size={18} />
                            </button>
                          )}
                        </div>
                        <div>
                          Score:{' '}
                          <span className="font-bold">
                            {round.roundPoints[round.team2Id] || 0} pts
                          </span>
                        </div>

                        {editingScore === `${index}-${round.team2Id}` && (
                          <div className="flex justify-end space-x-2 mt-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                cancelEditing()
                              }}
                              className="bg-red-600 p-1 rounded"
                            >
                              <X size={16} />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                saveScoreAdjustment(index, round.team2Id)
                              }}
                              className="bg-green-600 p-1 rounded"
                            >
                              <Check size={16} />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    <h4 className="font-bold mb-2">Completed Tasks</h4>
                    {Object.keys(round.completedTasks).length === 0 ? (
                      <div className="text-zinc-400 py-2">
                        No tasks were completed in this round.
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {Object.entries(round.completedTasks).map(([taskId, task]) => (
                          <div key={taskId} className="bg-zinc-700/50 rounded">
                            <div
                              className="flex justify-between items-center p-3 cursor-pointer"
                              onClick={() => toggleTask(round.roundNumber, taskId)}
                            >
                              <div>
                                <span className="font-bold">{getTaskName(taskId)}</span>
                                <span className="text-zinc-400 ml-2">
                                  {getTeamName(task.teamId)}
                                </span>
                              </div>
                              <div className="flex items-center">
                                <span className="text-green-400 font-bold mr-2">
                                  +{task.pointValue} pts
                                </span>
                                {expandedTasks[`${round.roundNumber}-${taskId}`] ? (
                                  <ChevronUp size={16} />
                                ) : (
                                  <ChevronDown size={16} />
                                )}
                              </div>
                            </div>

                            {expandedTasks[`${round.roundNumber}-${taskId}`] && (
                              <div className="p-3 border-t border-zinc-700 text-sm">
                                <div className="grid grid-cols-2 gap-2">
                                  <div>
                                    Team:{' '}
                                    <span className="font-bold">{getTeamName(task.teamId)}</span>
                                  </div>
                                  <div>
                                    Player ID: <span className="font-bold">{task.playerId}</span>
                                  </div>
                                  <div>
                                    Device Type:{' '}
                                    <span className="font-bold">
                                      {task.deviceId?.includes('-')
                                        ? task.deviceId.split('-')[2] === '1'
                                          ? 'Rover'
                                          : 'Harvester'
                                        : 'Unknown'}
                                    </span>
                                  </div>
                                  <div>
                                    Completed At:{' '}
                                    <span className="font-bold">
                                      {task.completedAt !== null
                                        ? `${task.completedAt}s`
                                        : 'Unknown'}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
        </div>
      )}
    </>
  )
}
