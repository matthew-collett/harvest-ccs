import { useEffect, useState } from 'react'
import { Header } from '@/components'
import { RoundControls, TeamPanel, TeamSelect, RoundEndDialog } from '@/views/competition'
import { useStore } from '@/store'

export const CompetitionView = () => {
  const {
    currentRound,
    teams,
    startRound,
    pauseRound,
    resumeRound,
    endRound,
    setTeams,
    resetRound,
    settings
  } = useStore()
  const [showRoundEnd, setShowRoundEnd] = useState(false)
  const [lastRoundTeams, setLastRoundTeams] = useState({ team1: null, team2: null })

  useEffect(() => {
    if (!currentRound.isActive) {
      resetRound()
    }
  }, [resetRound, settings?.roundDuration])

  useEffect(() => {
    if (!currentRound.isActive && currentRound.time === 0) {
      const team1 = teams.find((t) => t.id === currentRound.team1Id)
      const team2 = teams.find((t) => t.id === currentRound.team2Id)
      setLastRoundTeams({ team1, team2 })
      endRound()
      resetRound()
      setShowRoundEnd(true)
      setTeams(null, null)
    }
  }, [
    currentRound.isActive,
    currentRound.time,
    endRound,
    resetRound,
    teams,
    setTeams,
    currentRound.team1Id,
    currentRound.team2Id
  ])

  useEffect(() => {
    let timer
    if (currentRound.isActive && !currentRound.isPaused) {
      timer = setInterval(() => {}, 1000)
    }
    return () => clearInterval(timer)
  }, [currentRound.isActive, currentRound.isPaused])

  const team1 = teams.find((t) => t.id === currentRound.team1Id)
  const team2 = teams.find((t) => t.id === currentRound.team2Id)

  const handleEndRound = () => {
    setLastRoundTeams({ team1, team2 })
    endRound()
    resetRound()
    setShowRoundEnd(true)
    setTeams(null, null)
  }

  const handleNewTeams = () => {
    setShowRoundEnd(false)
  }

  return (
    <>
      <Header />
      <div className="space-y-4">
        <RoundControls
          isActive={currentRound.isActive}
          isPaused={currentRound.isPaused}
          roundNumber={currentRound.roundNumber}
          roundTime={currentRound.time}
          onStart={startRound}
          onPause={pauseRound}
          onResume={resumeRound}
          onStop={handleEndRound}
          canStart={!!team1 && !!team2 && !currentRound.isActive}
        />
        {!currentRound.isActive && <TeamSelect teams={teams} onSelectTeams={setTeams} />}
        <div className="grid grid-cols-[1fr_auto_1fr] items-stretch gap-4 w-full">
          {team1 ? (
            <TeamPanel team={team1} />
          ) : (
            <div className="bg-zinc-800 rounded p-4 flex items-center justify-center text-zinc-500">
              Select Team 1
            </div>
          )}
          <div className="flex items-center justify-center relative">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-32 h-32 bg-blue-500/10 rounded-full blur-xl" />
            </div>
            <div className="text-5xl font-bold text-blue-500/80 relative">VS</div>
          </div>
          {team2 ? (
            <TeamPanel team={team2} />
          ) : (
            <div className="bg-zinc-800 rounded p-4 flex items-center justify-center text-zinc-500">
              Select Team 2
            </div>
          )}
        </div>
      </div>
      {showRoundEnd && (
        <RoundEndDialog
          team1={lastRoundTeams.team1}
          team2={lastRoundTeams.team2}
          onNewTeams={handleNewTeams}
        />
      )}
    </>
  )
}
