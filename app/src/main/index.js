import { app, shell, BrowserWindow } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import windowStateKeeper from 'electron-window-state'
import { setupIPC } from './ipc'
import serialManager from './serial'

let mainWindow = null
let cleanupDone = false

const iconPath =
  process.platform === 'darwin'
    ? join(__dirname, '../../resources/icons/mac/icon.icns')
    : process.platform === 'win32'
      ? join(__dirname, '../../resources/icons/win/icon.ico')
      : join(__dirname, '../../resources/icons/png/1024.png')

const createWindow = () => {
  const windowState = windowStateKeeper({
    defaultWidth: 1200,
    defaultHeight: 800
  })

  mainWindow = new BrowserWindow({
    width: windowState.width,
    height: windowState.height,
    show: false,
    autoHideMenuBar: true,
    icon: iconPath,
    center: true,
    title: 'Harvest Competition Control System',
    frame: false,
    vibrancy: 'under-window',
    visualEffectState: 'active',
    titleBarStyle: 'hidden',
    trafficLightPosition: { x: 15, y: 10 },
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false,
      contextIsolation: true,
      zoomFactor: 1.0,
      spellcheck: false
    },
    minWidth: 600,
    minHeight: 400
  })

  windowState.manage(mainWindow)

  mainWindow.webContents.on('before-input-event', (event, input) => {
    if (input.control || input.meta) {
      if (input.key === '=') {
        mainWindow.webContents.setZoomLevel(mainWindow.webContents.getZoomLevel() + 1)
        event.preventDefault()
      } else if (input.key === '-') {
        mainWindow.webContents.setZoomLevel(mainWindow.webContents.getZoomLevel() - 1)
        event.preventDefault()
      } else if (input.key === '0') {
        mainWindow.webContents.setZoomLevel(0)
        event.preventDefault()
      }
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()

    if (windowState.isMaximized) {
      mainWindow.maximize()
    }
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

const handleAppReady = () => {
  electronApp.setAppUserModelId('com.electron')
  setupIPC()
  createWindow()
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
}

const performCleanup = async () => {
  if (cleanupDone) return

  try {
    cleanupDone = true

    await serialManager.cleanup()

    for (const window of BrowserWindow.getAllWindows()) {
      if (!window.isDestroyed()) {
        window.destroy()
      }
    }
  } catch (error) {
    console.error('Error during cleanup:', error)
  }
}

app.whenReady().then(handleAppReady)

app.on('before-quit', async (event) => {
  if (!cleanupDone) {
    event.preventDefault()
    await performCleanup()
    app.quit()
  }
})

app.on('will-quit', async () => {
  await performCleanup()
})

app.on('window-all-closed', async () => {
  await performCleanup()

  if (process.platform !== 'darwin') {
    app.quit()
  }
})

process.on('SIGINT', async () => {
  await performCleanup()
  process.exit(0)
})
