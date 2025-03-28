import { create } from 'zustand'
import {
  createSettingsSlice,
  createTeamSlice,
  createDeviceSlice,
  createRoundSlice,
  createTaskSlice,
  createTournamentSlice
} from '@/store/slices'
import { getViewById } from '@/views'

let isStoreInitialized = false

const getStateToSync = (state) => ({
  settings: state.settings,
  teams: state.teams,
  currentRound: state.currentRound,
  rounds: state.rounds,
  tasks: state.tasks,
  tournament: state.tournament,
  isSidebarCollapsed: state.isSidebarCollapsed,
  currentViewId: state.currentViewId
})

export const useStore = create((set, get) => {
  let isSaving = false
  let pendingChanges = false
  let lastSavedState = null
  let serialCleanup = null
  let cleanupFunctions = []

  const initializeStore = async () => {
    if (isStoreInitialized) {
      return
    }

    if (typeof window !== 'undefined') {
      try {
        const savedState = await window.context.getState()
        if (savedState && Object.keys(savedState).length > 0) {
          set(savedState)
          lastSavedState = getStateToSync(savedState)
        }
      } catch (error) {
        console.error('Error loading initial state:', error)
      }

      const saveInterval = setInterval(() => {
        const currentState = getStateToSync(get())
        if (
          lastSavedState === null ||
          JSON.stringify(lastSavedState) !== JSON.stringify(currentState)
        ) {
          saveState()
        }
      }, 1000)
      cleanupFunctions.push(() => clearInterval(saveInterval))

      if (window.serialAPI && window.serialAPI.onData) {
        serialCleanup = window.serialAPI.onData((serialData) => {
          const { id, payload } = serialData
          console.log('Serial data received:', id, payload)

          const state = get()

          if (!state || !state.currentRound) {
            console.error('State or currentRound not available')
            return
          }

          if (id === 0x1100) {
            // SET_DEVICE_COMMAND
            try {
              const deviceStats = {
                playerId: payload[0],
                teamId: payload[1],
                deviceId: payload[2],
                currentHealth: payload[3],
                enabled: payload[4],
                disabledTimer: payload[5],
                shieldCodeFlag: payload[6],
                repairCodeFlag: payload[7],
                shieldCode: payload[8],
                repairCode: payload[10],
                lastSeen: new Date().getTime()
              }

              const id = `${deviceStats.teamId}-${deviceStats.playerId}-${deviceStats.deviceId}`

              const shouldListen =
                state.currentRound.team1Id === deviceStats.teamId ||
                state.currentRound.team2Id === deviceStats.teamId

              if (!shouldListen) {
                console.log(`Ignoring update for device ${id} (not competing)`)
                return
              }

              get().updateDeviceStatus(deviceStats.teamId, id, deviceStats)
            } catch (error) {
              console.error('Error processing serial data:', error)
            }
          } else if (id === 0x1101) {
            // SET_TASK_COMMAND
            try {
              const taskData = {
                teamId: payload[0],
                playerId: payload[1],
                deviceId: payload[2],
                taskId: payload[3],
                status: payload[4]
              }

              const isCompeting =
                state.currentRound.isActive &&
                !state.currentRound.isPaused &&
                (state.currentRound.team1Id === taskData.teamId ||
                  state.currentRound.team2Id === taskData.teamId)

              if (!isCompeting) {
                console.log(`Ignoring task update for team ${taskData.teamId} (not competing)`)
                return
              }

              const isTaskCompleted = get().isTaskCompleted(taskData.taskId)
              if (isTaskCompleted) {
                console.log(`Task ${taskData.taskId} is already completed, ignoring update request`)
                return
              }

              const uniqueId = `${taskData.teamId}-${taskData.playerId}-${taskData.deviceId}`

              get().updateTaskStatus(
                taskData.taskId,
                taskData.status,
                taskData.teamId,
                taskData.playerId,
                uniqueId
              )

              // also update activity
              get().updateDeviceStatus(taskData.teamId, id, {
                lastSeen: new Date().getTime()
              })
            } catch (error) {
              console.error('Error processing task data:', error)
            }
          }
        })
        cleanupFunctions.push(() => {
          if (serialCleanup) serialCleanup()
        })
      }
    }

    isStoreInitialized = true
  }

  const saveState = async () => {
    if (!isStoreInitialized) {
      return
    }

    if (isSaving) {
      pendingChanges = true
      return
    }
    const currentState = getStateToSync(get())
    // skip saving if nothing has changed
    if (lastSavedState && JSON.stringify(currentState) === JSON.stringify(lastSavedState)) {
      return
    }
    try {
      isSaving = true
      await window.context.saveState(currentState)
      lastSavedState = currentState
      if (pendingChanges) {
        pendingChanges = false
        setTimeout(() => saveState(), 50) // small delay to prevent CPU hogging
      }
    } catch (error) {
      console.error('Error saving state:', error)
    } finally {
      isSaving = false
    }
  }

  const storeApi = {
    isInitialized: false,
    initializeStore: async () => {
      await initializeStore()
      set({ isInitialized: true })
    },
    currentViewId: null,
    setCurrentView: (view) => set({ currentViewId: view.id }),
    getCurrentView: () => getViewById(get().currentViewId),
    isSidebarCollapsed: false,
    toggleSidebar: () => set((state) => ({ isSidebarCollapsed: !state.isSidebarCollapsed })),
    ...createSettingsSlice(set, get),
    ...createTeamSlice(set, get),
    ...createDeviceSlice(set, get),
    ...createRoundSlice(set, get),
    ...createTaskSlice(set, get),
    ...createTournamentSlice(set, get),
    saveState,

    resetRound: () => {
      if (!isStoreInitialized) {
        return
      }

      set((state) => ({
        currentRound: {
          ...state.currentRound,
          time: get().settings.roundDuration,
          isActive: false,
          isPaused: false,
          tasks: {}
        }
      }))
    },
    resetCompetition: () => {
      if (!isStoreInitialized) {
        return
      }

      set((state) => {
        return {
          currentRound: {
            roundNumber: 0,
            team1Id: null,
            team2Id: null,
            time: get().settings.roundDuration,
            isActive: false,
            isPaused: false,
            tasks: {}
          },
          rounds: [],
          teams: state.teams.map((team) => ({
            ...team
          }))
        }
      })
    }
  }

  return storeApi
})
