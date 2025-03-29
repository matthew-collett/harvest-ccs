import { ipcMain } from 'electron'
import api from './api'
import serialManager from './serial'

export function setupIPC() {
  ipcMain.handle('state:get', async (_, token) => await api.getState(token))
  ipcMain.handle('state:save', async (_, state, token) => await api.saveState(state, token))

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
