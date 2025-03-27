export const createTaskSlice = (set, get) => ({
  tasks: {
    1: {
      // RFID_SEQUENCE
      id: 1,
      name: 'RFID Sequence',
      description: 'RFID tag read and beamed to home base',
      pointValue: 10,
      isComplete: false,
      isLocked: false,
      oreAvailable: true
    },
    2: {
      // OPTICAL_SIGNAL
      id: 2,
      name: 'Optical Signal Decoding',
      description: 'Convert colours to tones to unlock ore',
      pointValue: 10,
      isComplete: false,
      isLocked: false,
      oreAvailable: true
    },
    3: {
      // ENVIRONMENTAL_REMEDIATION
      id: 3,
      name: 'Environmental Remediation Task',
      description: 'Drain tailings pond to unlock ore gate',
      pointValue: 10,
      isComplete: false,
      isLocked: false,
      oreAvailable: true
    },
    4: {
      // SOLAR_ARRAY
      id: 4,
      name: 'Solar Array',
      description: 'Charge solar array to unlock ore gate',
      pointValue: 5,
      isComplete: false,
      isLocked: false,
      oreAvailable: true
    },
    5: {
      // LASER_TURRET
      id: 5,
      name: 'Laser Turret',
      description: 'Activate Harvester Shields to provide safe passage to ore',
      pointValue: 10,
      isComplete: false,
      isLocked: false,
      oreAvailable: true
    },
    6: {
      // MAGNETIC_ANOMALY
      id: 6,
      name: 'Magnetic Anomaly',
      description: 'Detect magnetic fields to unlock ore gate',
      pointValue: 5,
      isComplete: false,
      isLocked: false,
      oreAvailable: true
    },
    7: {
      // AUTONOMOUS_LINE
      id: 7,
      name: 'Autonomous Line',
      description: 'Autonomous line follow to unlock ore gate',
      pointValue: 15,
      isComplete: false,
      isLocked: false,
      oreAvailable: true
    },
    8: {
      // ALIEN_FREQUENCY
      id: 8,
      name: 'Alien Frequency',
      description: 'Find the fundamental to unlock ore gate',
      pointValue: 20,
      isComplete: false,
      isLocked: false,
      oreAvailable: true
    },
    9: {
      // ELECTRICAL_CONDUCTIVITY
      id: 9,
      name: 'Electrical Conductivity',
      description: 'Detect conductive material to unlock ore gate',
      pointValue: 10,
      isComplete: false,
      isLocked: false,
      oreAvailable: true
    },
    10: {
      // IR_DETECTION
      id: 10,
      name: 'IR Detection',
      description: 'Detect IR emission to unlock ore gate',
      pointValue: 10,
      isComplete: false,
      isLocked: false,
      oreAvailable: true
    }
  },

  updateTask: (taskId, updates) =>
    set((state) => ({
      tasks: {
        ...state.tasks,
        [taskId]: {
          ...(state.tasks[taskId] || {}),
          ...updates
        }
      }
    })),

  resetTasks: () =>
    set((state) => {
      const resetTasks = {}

      Object.keys(state.tasks).forEach((taskId) => {
        resetTasks[taskId] = {
          ...state.tasks[taskId],
          isComplete: false,
          isLocked: false
        }
      })

      return { tasks: resetTasks }
    }),

  getTask: (taskId) => {
    return get().tasks[taskId]
  },

  getAllTasks: () => {
    return get().tasks
  }
})
