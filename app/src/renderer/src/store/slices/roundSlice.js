export const createRoundSlice = (set, get) => {
  let timer = null
  const clearTimer = () => {
    if (timer) {
      clearInterval(timer)
      timer = null
    }
  }

  return {
    currentRound: {
      roundNumber: 0,
      team1Id: null,
      team2Id: null,
      time: 900,
      isActive: false,
      isPaused: false,
      tasks: {}
    },

    rounds: [],

    setTeams: (team1Id, team2Id) =>
      set((state) => ({
        currentRound: {
          ...state.currentRound,
          team1Id,
          team2Id,
          time: get().settings.roundDuration,
          tasks: {}
        }
      })),

    updateTaskStatus: (taskId, status, teamId, playerId, id) =>
      set((state) => {
        if (state.currentRound.tasks[taskId]?.status === 2) {
          console.log(`Task ${taskId} is already completed, ignoring update request`)
          return state
        }

        const completedAt =
          status === 2 ? get().settings.roundDuration - state.currentRound.time : null

        // points will be added to team scores at the end of the round
        return {
          currentRound: {
            ...state.currentRound,
            tasks: {
              ...state.currentRound.tasks,
              [taskId]: {
                status,
                teamId,
                playerId,
                id,
                completedAt
              }
            }
          }
        }
      }),

    updateRoundPoints: (roundIndex, teamId, pointAdjustment) =>
      set((state) => {
        const updatedRounds = [...state.rounds]
        const round = updatedRounds[roundIndex]

        if (!round) return state

        const currentPoints = round.roundPoints[teamId] || 0
        const newPoints = Math.max(0, currentPoints + pointAdjustment) // prevent negative scores

        // create a new round object with updated points
        updatedRounds[roundIndex] = {
          ...round,
          roundPoints: {
            ...round.roundPoints,
            [teamId]: newPoints
          }
        }

        // well calculate team scores dynamically based on round points in the UI

        return {
          rounds: updatedRounds
        }
      }),

    startRound: () => {
      clearTimer()

      const initTasks = () => {
        const taskDefinitions = get().tasks
        const tasks = {}

        Object.keys(taskDefinitions).forEach((taskId, index) => {
          const numericId = index + 1
          tasks[numericId] = {
            status: 0,
            teamId: null,
            playerId: null,
            deviceId: null,
            completedAt: null
          }
        })

        return tasks
      }

      timer = setInterval(() => {
        const state = get()
        if (state.currentRound.isActive && !state.currentRound.isPaused) {
          set((state) => {
            const newTime = state.currentRound.time - 1
            if (newTime <= 0) {
              clearTimer()
              return {
                currentRound: {
                  ...state.currentRound,
                  time: 0,
                  isActive: false
                }
              }
            }
            return {
              currentRound: {
                ...state.currentRound,
                time: newTime
              }
            }
          })
        }
      }, 1000)

      set((state) => ({
        currentRound: {
          ...state.currentRound,
          roundNumber: state.currentRound.roundNumber + 1,
          time: get().settings.roundDuration,
          isActive: true,
          isPaused: false,
          tasks: initTasks()
        }
      }))
    },

    pauseRound: () => {
      set((state) => ({
        currentRound: {
          ...state.currentRound,
          isPaused: true
        }
      }))
    },

    resumeRound: () => {
      set((state) => ({
        currentRound: {
          ...state.currentRound,
          isPaused: false
        }
      }))
    },

    endRound: () => {
      clearTimer()

      set((state) => {
        const taskDefinitions = get().tasks
        const completedTasks = {}
        const roundPoints = {
          [state.currentRound.team1Id]: 0,
          [state.currentRound.team2Id]: 0
        }

        Object.entries(state.currentRound.tasks).forEach(([taskId, task]) => {
          if (task.status === 2 && task.teamId) {
            const pointValue = taskDefinitions[taskId]?.pointValue || 0
            roundPoints[task.teamId] += pointValue
            completedTasks[taskId] = {
              ...task,
              pointValue
            }
          }
        })

        const completedRound = {
          roundNumber: state.currentRound.roundNumber,
          team1Id: state.currentRound.team1Id,
          team2Id: state.currentRound.team2Id,
          duration: get().settings.roundDuration - state.currentRound.time,
          completedTasks,
          roundPoints
        }

        return {
          rounds: [...state.rounds, completedRound],
          currentRound: {
            ...state.currentRound,
            isActive: false,
            isPaused: false,
            time: get().settings.roundDuration,
            tasks: {}
          }
        }
      })
    },

    calculateTeamPoints: (teamId) => {
      const rounds = get().rounds
      return rounds.reduce((total, round) => {
        return total + (round.roundPoints?.[teamId] || 0)
      }, 0)
    },

    getCurrentRoundPoints: (teamId) => {
      const { currentRound } = get()
      const taskDefinitions = get().tasks

      if (!currentRound.tasks) return 0

      return (
        Object.entries(currentRound.tasks)
          // eslint-disable-next-line no-unused-vars
          .filter(([_, task]) => task.teamId === teamId && task.status === 2)
          // eslint-disable-next-line no-unused-vars
          .reduce((total, [taskId, _]) => {
            const pointValue = taskDefinitions[taskId]?.pointValue || 0
            return total + pointValue
          }, 0)
      )
    },

    getTaskCompletion: (taskId) => {
      const { currentRound } = get()
      const task = currentRound.tasks[taskId]

      if (task && task.status === 2) {
        return {
          teamId: task.teamId,
          playerId: task.playerId,
          deviceId: task.deviceId,
          completedAt: task.completedAt
        }
      }

      return null
    },

    isTaskCompleted: (taskId) => {
      const { currentRound } = get()
      return currentRound.tasks[taskId]?.status === 2
    },

    cleanup: () => {
      clearTimer()
    }
  }
}
