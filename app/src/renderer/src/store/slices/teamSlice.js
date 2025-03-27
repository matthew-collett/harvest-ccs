// eslint-disable-next-line no-unused-vars
export const createTeamSlice = (set, get) => ({
  teams: [],

  addTeam: (team) =>
    set((state) => {
      if (state.teams.some((t) => t.id === team.id)) {
        console.warn(`Team with ID ${team.id} already exists`)
        return state
      }
      return {
        teams: [
          ...state.teams,
          {
            ...team,
            devices: [],
            students: []
          }
        ]
      }
    }),

  removeTeam: (teamId) =>
    set((state) => ({
      teams: state.teams.filter((team) => team.id !== teamId)
    })),

  addStudentToTeam: (teamId, student) =>
    set((state) => {
      const studentExists = state.teams.some((team) =>
        team.students.some((s) => s.name === student.name)
      )
      if (studentExists) {
        console.warn(`Student ${student.name} already exists in a team`)
        return state
      }
      return {
        teams: state.teams.map((team) =>
          team.id === teamId ? { ...team, students: [...team.students, student] } : team
        )
      }
    }),

  removeStudentFromTeam: (teamId, studentIndex) =>
    set((state) => ({
      teams: state.teams.map((team) =>
        team.id === teamId
          ? {
              ...team,
              students: team.students.filter((_, index) => index !== studentIndex)
            }
          : team
      )
    })),

  removeDeviceFromTeam: (teamId, deviceId) =>
    set((state) => ({
      teams: state.teams.map((team) =>
        team.id === teamId
          ? {
              ...team,
              devices: team.devices.filter((device) => device.id !== deviceId)
            }
          : team
      )
    })),

  updateTeam: (teamId, updates) =>
    set((state) => ({
      teams: state.teams.map((team) => (team.id === teamId ? { ...team, ...updates } : team))
    }))
})
