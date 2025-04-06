import { useMemo } from 'react'

export const TeamScores = ({ teams, rounds }) => {
  const totalScores = useMemo(() => {
    const scores = {}
    teams.forEach((team) => {
      scores[team.id] = rounds.reduce((total, round) => {
        return total + (round.roundPoints?.[team.id] || 0)
      }, 0)
    })
    return scores
  }, [teams, rounds])

  if (teams.length === 0) {
    return (
      <div className="text-center py-10 text-zinc-500 bg-zinc-800/50 rounded-lg border border-zinc-700/50 mb-8">
        <p>No teams have been created yet</p>
        <p className="mt-2">Use the &quot;New Team&quot; button above to create your first team</p>
      </div>
    )
  }

  return (
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
  )
}
