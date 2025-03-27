import { ipcMain } from 'electron'
import api from './api'
import serialManager from './serial'

export function setupIPC() {
  ipcMain.handle('state:get', async () => await api.getState())
  ipcMain.handle('state:save', async (_, state) => await api.saveState(state))
  ipcMain.handle('auth:set', (_, token) => api.setToken(token))
  ipcMain.handle('auth:clear', () => api.clearToken())

  ipcMain.handle('serial:list-ports', async () => {
    const { SerialPort } = await import('serialport')
    return SerialPort.list()
  })

  ipcMain.handle('serial:connect', async (_, { path, baudRate }) =>
    serialManager.initialize(path, baudRate)
  )

  ipcMain.handle('serial:disconnect', async () => {
    await serialManager.cleanup()
    return true
  })

  ipcMain.handle('serial:get-status', () => {
    return serialManager.getConnectionStatus()
  })
}
