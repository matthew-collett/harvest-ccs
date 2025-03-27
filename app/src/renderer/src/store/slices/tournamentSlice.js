export const createTournamentSlice = (set, get) => ({
  tournament: {
    bracket: {
      // winners bracket
      G1: { teams: [null, null], winner: null, loser: null },
      G2: { teams: [null, null], winner: null, loser: null },
      G3: { teams: [null, null], winner: null, loser: null },
      // losers bracket
      G4: { teams: [null, null], winner: null, loser: null },
      G5: { teams: [null, null], winner: null, loser: null },
      // final matches
      G6: { teams: [null, null], winner: null, loser: null },
      G7: { teams: [null, null], winner: null, loser: null }
    },
    champion: null,
    isFinalized: false
  },

  resetTournament: () => {
    if (
      window.confirm('Are you sure you want to reset the tournament? All progress will be lost.')
    ) {
      set({
        tournament: {
          bracket: {
            G1: { teams: [null, null], winner: null, loser: null },
            G2: { teams: [null, null], winner: null, loser: null },
            G3: { teams: [null, null], winner: null, loser: null },
            G4: { teams: [null, null], winner: null, loser: null },
            G5: { teams: [null, null], winner: null, loser: null },
            G6: { teams: [null, null], winner: null, loser: null },
            G7: { teams: [null, null], winner: null, loser: null }
          },
          champion: null,
          isFinalized: false
        }
      })
    }
  },

  setTournamentTeam: (matchId, position, teamId) => {
    set((state) => {
      const newBracket = JSON.parse(JSON.stringify(state.tournament.bracket))
      newBracket[matchId].teams[position] = teamId
      return {
        tournament: {
          ...state.tournament,
          bracket: newBracket
        }
      }
    })
  },

  setTournamentWinner: (matchId, winnerPosition) => {
    set((state) => {
      const newBracket = JSON.parse(JSON.stringify(state.tournament.bracket))
      const match = newBracket[matchId]

      if (!match.teams[0] || !match.teams[1]) return state

      const winnerTeamId = match.teams[winnerPosition]
      const loserTeamId = match.teams[winnerPosition === 0 ? 1 : 0]

      match.winner = winnerTeamId
      match.loser = loserTeamId

      switch (matchId) {
        case 'G1':
          newBracket.G3.teams[0] = winnerTeamId
          newBracket.G4.teams[0] = loserTeamId
          break
        case 'G2':
          newBracket.G3.teams[1] = winnerTeamId
          newBracket.G4.teams[1] = loserTeamId
          break
        case 'G3':
          newBracket.G6.teams[0] = winnerTeamId
          newBracket.G5.teams[0] = loserTeamId
          break
        case 'G4':
          newBracket.G5.teams[1] = winnerTeamId
          break
        case 'G5':
          newBracket.G6.teams[1] = winnerTeamId
          break
        case 'G6':
          if (winnerTeamId === newBracket.G3.winner) {
            return {
              tournament: {
                ...state.tournament,
                bracket: newBracket,
                champion: winnerTeamId,
                isFinalized: true
              }
            }
          } else {
            newBracket.G7.teams[0] = loserTeamId
            newBracket.G7.teams[1] = winnerTeamId
          }
          break
        case 'G7':
          return {
            tournament: {
              ...state.tournament,
              bracket: newBracket,
              champion: winnerTeamId,
              isFinalized: true
            }
          }
      }

      return {
        tournament: {
          ...state.tournament,
          bracket: newBracket
        }
      }
    })
  },

  getTeamNameById: (teamId) => {
    if (!teamId) return '---'
    const team = get().teams.find((t) => t.id === teamId)
    return team ? team.name : `Team ${teamId}`
  }
})
