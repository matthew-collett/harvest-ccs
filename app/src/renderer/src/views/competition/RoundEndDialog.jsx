import { Button } from '@/components/ui'
import { Trophy } from 'lucide-react'
import { useStore } from '@/store/useStore'
import { useEffect, useState } from 'react'

export const RoundEndDialog = ({ team1, team2, onNewTeams }) => {
  const rounds = useStore((state) => state.rounds)
  const [roundScores, setRoundScores] = useState({ team1: 0, team2: 0 })

  useEffect(() => {
    if (rounds.length === 0) {
      return
    }

    const lastRound = rounds[rounds.length - 1]

    const team1RoundPoints = lastRound.roundPoints[team1.id] || 0
    const team2RoundPoints = lastRound.roundPoints[team2.id] || 0

    setRoundScores({
      team1: team1RoundPoints,
      team2: team2RoundPoints
    })
  }, [rounds, team1.id, team2.id])

  const roundWinner =
    roundScores.team1 > roundScores.team2
      ? team1
      : roundScores.team2 > roundScores.team1
        ? team2
        : null

  const isDraw = roundScores.team1 === roundScores.team2

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center">
      <div className="bg-zinc-800 p-6 rounded-lg shadow-lg max-w-md w-full mx-4">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold mb-2">Round Complete</h2>
          {isDraw ? (
            <div className="text-xl text-zinc-400">It&apos;s a draw!</div>
          ) : (
            <div className="space-y-2">
              <Trophy className="w-12 h-12 text-yellow-500 mx-auto" />
              <div className="text-xl text-yellow-500">{roundWinner?.name} wins this round!</div>
              <div className="text-zinc-400">
                Round score:{' '}
                {roundWinner
                  ? roundWinner.id === team1.id
                    ? roundScores.team1
                    : roundScores.team2
                  : 0}{' '}
                points
              </div>
            </div>
          )}
        </div>

        <div className="border-t border-zinc-700 my-4 pt-4">
          <h3 className="text-center font-semibold mb-3">Round Results</h3>
          <div className="flex justify-between mb-4">
            <div className="text-center">
              <div className="font-bold">{team1.name}</div>
              <div className="text-lg text-green-400">+{roundScores.team1} pts</div>
            </div>
            <div className="text-center">
              <div className="font-bold">{team2.name}</div>
              <div className="text-lg text-green-400">+{roundScores.team2} pts</div>
            </div>
          </div>
        </div>

        <div className="border-t border-zinc-700 my-4 pt-4">
          <h3 className="text-center font-semibold mb-3">Total Scores</h3>
          <div className="flex justify-between mb-4">
            <div className="text-center">
              <div className="font-bold">{team1.name}</div>
              <div className="text-lg">{team1.score + roundScores.team1} pts</div>
            </div>
            <div className="text-center">
              <div className="font-bold">{team2.name}</div>
              <div className="text-lg">{team2.score + roundScores.team2} pts</div>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Button className="w-full" onClick={onNewTeams}>
            Select New Teams
          </Button>
        </div>
      </div>
    </div>
  )
}
