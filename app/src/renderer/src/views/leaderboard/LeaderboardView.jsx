import { Header } from '@/components'
import { Button, SectionHeader } from '@/components/ui'
import { useStore } from '@/store/useStore'
import { RefreshCw, Trophy, AlertTriangle } from 'lucide-react'
import { MatchBox } from './MatchBox'

export const LeaderboardView = () => {
  const {
    tournament,
    teams,
    resetTournament,
    setTournamentTeam,
    setTournamentWinner,
    getTeamNameById
  } = useStore()

  const bracket = tournament?.bracket || {}
  const champion = tournament?.champion
  const isFinalized = tournament?.isFinalized

  return (
    <>
      <Header />
      <div className="flex justify-between items-center">
        <SectionHeader>4 Team Double Elimination</SectionHeader>
        <Button variant="outline" className="flex items-center gap-2" onClick={resetTournament}>
          <RefreshCw className="w-4 h-4" />
          Reset Bracket
        </Button>
      </div>
      {isFinalized && champion && (
        <div className="bg-green-900/30 border border-green-500/50 rounded-lg p-4 mb-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-green-400" />
            <span className="text-lg font-bold">{getTeamNameById(champion)} is the Champion!</span>
          </div>
        </div>
      )}
      <div className="bg-zinc-800 rounded p-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          <div className="lg:col-span-8">
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-4 text-zinc-300 border-b border-zinc-700 pb-2">
                Winner&apos;s Bracket
              </h3>

              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-8">
                  <MatchBox
                    label="Round 1"
                    matchData={bracket.G1}
                    onTeamSelect={(pos, team) => setTournamentTeam('G1', pos, team)}
                    onWinnerSelect={(idx) => setTournamentWinner('G1', idx)}
                    allTeams={teams}
                    getTeamName={getTeamNameById}
                    isFirstRound={true}
                  />

                  <MatchBox
                    label="Round 2"
                    matchData={bracket.G2}
                    onTeamSelect={(pos, team) => setTournamentTeam('G2', pos, team)}
                    onWinnerSelect={(idx) => setTournamentWinner('G2', idx)}
                    allTeams={teams}
                    getTeamName={getTeamNameById}
                    isFirstRound={true}
                  />
                </div>

                <div className="flex items-center justify-center">
                  <MatchBox
                    label="Round 3 (W)"
                    matchData={bracket.G3}
                    onWinnerSelect={(idx) => setTournamentWinner('G3', idx)}
                    getTeamName={getTeamNameById}
                  />
                </div>
              </div>
            </div>

            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-4 text-zinc-300 border-b border-zinc-700 pb-2">
                Loser&apos;s Bracket
              </h3>

              <div className="grid grid-cols-2 gap-8">
                <div>
                  <MatchBox
                    label="Round 4 (L)"
                    matchData={bracket.G4}
                    onWinnerSelect={(idx) => setTournamentWinner('G4', idx)}
                    getTeamName={getTeamNameById}
                  />
                </div>

                <div>
                  <MatchBox
                    label="Round 5 (L)"
                    matchData={bracket.G5}
                    onWinnerSelect={(idx) => setTournamentWinner('G5', idx)}
                    getTeamName={getTeamNameById}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 flex flex-col items-center justify-center">
            <MatchBox
              label="Round 6 - Championship"
              matchData={bracket.G6}
              onWinnerSelect={(idx) => setTournamentWinner('G6', idx)}
              getTeamName={getTeamNameById}
            />

            {bracket.G6?.winner && bracket.G6?.winner !== bracket.G3?.winner && (
              <div className="mt-8 w-full">
                <div className="text-sm text-zinc-400 mb-1 text-center">* Deciding game</div>
                <MatchBox
                  label="Round 7 - Final Round"
                  matchData={bracket.G7}
                  onWinnerSelect={(idx) => setTournamentWinner('G7', idx)}
                  getTeamName={getTeamNameById}
                />
              </div>
            )}
          </div>
        </div>
        <div className="text-sm text-zinc-500 flex justify-center gap-6 my-2">
          <div>W - Winner&apos;s Bracket</div>
          <div>L - Loser&apos;s Bracket</div>
        </div>
      </div>

      <div className="bg-zinc-800 p-4 rounded my-8">
        <div className="flex items-center gap-4 text-zinc-400">
          <AlertTriangle className="w-6 h-6 text-yellow-500" />
          <p className="text-sm">
            The double elimination format gives teams a second chance after losing one match.
            <br />A team is eliminated after losing twice, except in the championship where the
            winner of the loser&apos;s bracket must win twice against the winner&apos;s bracket
            champion.
          </p>
        </div>
      </div>
    </>
  )
}
