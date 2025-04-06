export const createDeviceSlice = (set) => ({
  addDevice: (deviceStats) =>
    set((state) => {
      const { playerId, teamId, deviceId } = deviceStats

      return {
        teams: state.teams.map((team) => {
          if (team.id !== teamId) return team

          return {
            ...team,
            devices: [
              ...team.devices,
              {
                id: `${teamId}-${playerId}-${deviceId}`,
                type: getDeviceType(deviceId),
                ...deviceStats
              }
            ]
          }
        })
      }
    }),

  updateDeviceStatus: (teamId, id, updates) =>
    set((state) => ({
      teams: state.teams.map((team) => {
        if (team.id !== teamId) return team

        return {
          ...team,
          devices: team.devices.map((device) =>
            device.id === id ? { ...device, ...updates } : device
          )
        }
      })
    }))
})

export const getDeviceType = (deviceId) => {
  switch (deviceId) {
    case 1:
      return 'rover'
    case 2:
      return 'harvester'
    default:
      return 'unknown'
  }
}
