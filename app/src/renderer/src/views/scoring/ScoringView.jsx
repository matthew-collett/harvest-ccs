import { Header } from '@/components'
import { SectionHeader } from '@/components/ui'
import { useStore } from '@/store'
import { TeamScores } from './TeamScores'
import { RoundHistory } from './RoundHistory'

export const ScoringView = () => {
  const { rounds, teams, tasks } = useStore()

  return (
    <>
      <Header />
      <SectionHeader>Team Scores</SectionHeader>
      <TeamScores teams={teams} rounds={rounds} />

      <SectionHeader>Round History</SectionHeader>
      <RoundHistory rounds={rounds} teams={teams} tasks={tasks} />
    </>
  )
}
