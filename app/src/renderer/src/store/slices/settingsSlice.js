export const createSettingsSlice = (set) => ({
  settings: {
    roundDuration: 900
  },
  updateSettings: (newSettings) =>
    set((state) => ({
      settings: { ...state.settings, ...newSettings }
    }))
})
