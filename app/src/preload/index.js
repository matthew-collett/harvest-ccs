import { contextBridge, ipcRenderer } from 'electron'

if (!process.contextIsolated) {
  throw new Error('contextIsolation must be enabled in the BrowserWindow')
}

try {
  contextBridge.exposeInMainWorld('context', {
    getState: () => ipcRenderer.invoke('state:get'),
    saveState: (state) => ipcRenderer.invoke('state:save', state),
    setToken: (token) => ipcRenderer.invoke('auth:set', token),
    clearToken: () => ipcRenderer.invoke('auth:clear')
  })

  contextBridge.exposeInMainWorld('serialAPI', {
    listPorts: () => ipcRenderer.invoke('serial:list-ports'),
    connect: (options) => ipcRenderer.invoke('serial:connect', options),
    disconnect: () => ipcRenderer.invoke('serial:disconnect'),
    getConnectionStatus: () => ipcRenderer.invoke('serial:get-status'),
    onData: (callback) => {
      const listener = (event, data) => {
        // only process messages for this window or broadcast messages
        if (!data.windowTarget || data.windowTarget === 'primary') {
          callback(data)
        }
      }
      ipcRenderer.on('serial:data', listener)
      return () => ipcRenderer.removeListener('serial:data', listener)
    }
  })
} catch (error) {
  console.error(error)
}
