import { Settings as SettingsIcon, PlayCircle, Award, Trophy, Users } from 'lucide-react'
import { SettingsView } from '@/views/settings'
import { TeamsView } from '@/views/teams'
import { CompetitionView } from '@/views/competition'
import { ScoringView } from '@/views/scoring'
import { LeaderboardView } from '@/views/leaderboard'

export const VIEWS = {
  SETTINGS: {
    id: 'settings',
    label: 'Settings',
    component: SettingsView,
    icon: SettingsIcon,
    description: 'Configure competition settings and data communication'
  },
  TEAMS: {
    id: 'teams',
    label: 'Teams',
    component: TeamsView,
    icon: Users,
    description: 'Manage teams, devices, and students'
  },
  COMPETITION: {
    id: 'competition',
    label: 'Competition',
    component: CompetitionView,
    icon: PlayCircle,
    description: 'Manage active rounds, select teams, monitor device status'
  },
  SCORING: {
    id: 'scoring',
    label: 'Scoring',
    component: ScoringView,
    icon: Award,
    description: 'Track points, manage manual adjustments, and verify end-of-round scoring'
  },
  LEADERBOARD: {
    id: 'leaderboard',
    label: 'Leaderboard',
    component: LeaderboardView,
    icon: Trophy,
    description: 'Track brackets, manage round progression, and view leaderboards'
  }
}

export const VIEW_LIST = Object.values(VIEWS)

export const getViewById = (id) => {
  const found = Object.keys(VIEWS).find((key) => VIEWS[key].id === id)
  return found ? VIEWS[found] : VIEWS.SETTINGS
}
