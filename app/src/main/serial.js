import { SerialPort } from 'serialport'
import { BrowserWindow } from 'electron'

// circular buffer setup
const BUFFER_SIZE = 200

class SerialManager {
  constructor() {
    this.PCURxbuffer = new Uint8Array(BUFFER_SIZE)
    this.PCUWriteIndex = 0
    this.PCUReadIndex = 0
    this.PCUMessageQueue = []
    this.port = null
    this.portPath = null
    this.baudRate = null
    this.intervalId = null
    this.isCleanedUp = false
  }

  isConnected() {
    return !!this.port?.isOpen
  }

  getConnectionStatus() {
    return {
      connected: this.isConnected(),
      port: this.portPath,
      baudRate: this.baudRate
    }
  }

  initialize(portPath, baudRate = 115200) {
    this.isCleanedUp = false
    this.portPath = portPath
    this.baudRate = baudRate
    this.PCURxbuffer = new Uint8Array(BUFFER_SIZE)
    this.PCUWriteIndex = 0
    this.PCUReadIndex = 0
    this.PCUMessageQueue = []

    try {
      // dont create a new port if one exists
      if (this.port && this.port.isOpen) {
        return true // already connected
      }

      this.port = new SerialPort({
        path: portPath,
        baudRate: baudRate
      })

      this.port.on('open', () => console.log('Serial port opened'))

      // read raw data directly from the port
      this.port.on('data', (data) => {
        // skip if buffer would overflow
        if ((this.PCUWriteIndex + 1) % BUFFER_SIZE === this.PCUReadIndex) return

        this.PCURxbuffer.set(data, this.PCUWriteIndex)
        this.PCUWriteIndex = (this.PCUWriteIndex + data.length) % BUFFER_SIZE
      })

      this.port.on('error', (err) => {
        console.error('Serial port error:', err.message)
        this.cleanup().catch(console.error)
      })

      this.startMessageProcessing()
      return true
    } catch (error) {
      console.error('Failed to initialize serial port:', error)
      return false
    }
  }

  startMessageProcessing() {
    if (this.intervalId !== null) clearInterval(this.intervalId)
    this.intervalId = setInterval(() => {
      this.parsePCUMessages()
      this.processPCUMessages()
    }, 10)
  }

  stopMessageProcessing() {
    if (this.intervalId !== null) {
      clearInterval(this.intervalId)
      this.intervalId = null
    }
  }

  parsePCUMessages() {
    let shouldContinue = true
    while (shouldContinue) {
      // calculate available bytes
      let availableBytes =
        this.PCUWriteIndex >= this.PCUReadIndex
          ? this.PCUWriteIndex - this.PCUReadIndex
          : BUFFER_SIZE - this.PCUReadIndex + this.PCUWriteIndex

      // need at least 6 bytes for header
      if (availableBytes < 6) {
        shouldContinue = false
        return
      }

      // scan for sync bytes (0xFE, 0x19)
      while (availableBytes >= 2) {
        if (
          this.PCURxbuffer[this.PCUReadIndex] === 0xfe &&
          this.PCURxbuffer[(this.PCUReadIndex + 1) % BUFFER_SIZE] === 0x19
        ) {
          break // found valid sync
        }
        this.PCUReadIndex = (this.PCUReadIndex + 1) % BUFFER_SIZE
        availableBytes--
      }

      if (availableBytes < 6) {
        shouldContinue = false
        return
      } // not enough for header

      // read message ID (2 bytes) and payload length (2 bytes)
      let msgIdLSB = this.PCURxbuffer[(this.PCUReadIndex + 2) % BUFFER_SIZE]
      let msgIdMSB = this.PCURxbuffer[(this.PCUReadIndex + 3) % BUFFER_SIZE]
      let messageID = (msgIdMSB << 8) | msgIdLSB

      let lengthLSB = this.PCURxbuffer[(this.PCUReadIndex + 4) % BUFFER_SIZE]
      let lengthMSB = this.PCURxbuffer[(this.PCUReadIndex + 5) % BUFFER_SIZE]
      let payloadLength = (lengthMSB << 8) | lengthLSB

      let totalMessageLength = 6 + payloadLength // header + Payload

      // check if we have the complete message
      if (availableBytes < totalMessageLength) {
        // not enough bytes, look for another sync
        let tempReadIndex = (this.PCUReadIndex + 2) % BUFFER_SIZE
        let tempAvailBytes = availableBytes - 2

        while (tempAvailBytes > 2) {
          if (
            this.PCURxbuffer[tempReadIndex] === 0xfe &&
            this.PCURxbuffer[(tempReadIndex + 1) % BUFFER_SIZE] === 0x19
          ) {
            this.PCUReadIndex = tempReadIndex
            break
          }
          tempReadIndex = (tempReadIndex + 1) % BUFFER_SIZE
          tempAvailBytes--
        }
        shouldContinue = false
        return
      }

      // check for sync bytes mid-message (indicating corruption)
      for (let i = 6; i < totalMessageLength; i++) {
        let index = (this.PCUReadIndex + i) % BUFFER_SIZE
        if (
          this.PCURxbuffer[index] === 0xfe &&
          this.PCURxbuffer[(index + 1) % BUFFER_SIZE] === 0x19
        ) {
          // found new sync mid-message, discard current message
          this.PCUReadIndex = index
          shouldContinue = false
          return
        }
      }

      // extract payload
      let payload = []
      for (let i = 0; i < payloadLength; i++) {
        payload.push(this.PCURxbuffer[(this.PCUReadIndex + 6 + i) % BUFFER_SIZE])
      }

      // queue the parsed message
      this.PCUMessageQueue.push({ id: messageID, payload })

      // move read index forward
      this.PCUReadIndex = (this.PCUReadIndex + totalMessageLength) % BUFFER_SIZE

      // reset indices if buffer is empty
      if (this.PCUWriteIndex === this.PCUReadIndex) {
        this.PCUReadIndex = 0
        this.PCUWriteIndex = 0
      }
    }
  }

  processPCUMessages() {
    while (this.PCUMessageQueue.length > 0) {
      const msg = this.PCUMessageQueue.shift()
      if (!msg) return

      BrowserWindow.getAllWindows().forEach((window) => {
        if (!window.isDestroyed()) {
          window.webContents.send('serial:data', {
            id: msg.id,
            payload: msg.payload
          })
        }
      })
    }
  }

  async cleanup() {
    if (this.isCleanedUp) return true
    this.isCleanedUp = true

    this.stopMessageProcessing()

    if (this.port) {
      try {
        await Promise.race([
          new Promise((resolve, reject) => {
            if (!this.port.isOpen) {
              resolve()
              return
            }

            // remove all listeners before closing
            this.port.removeAllListeners()

            this.port.close((err) => {
              if (err) {
                console.error('Error closing port:', err)
                reject(err)
              } else {
                console.log('Serial port closed successfully')
                resolve()
              }
            })
          }),

          // timeout promise
          new Promise((_, reject) =>
            setTimeout(() => reject(new Error('Port close timeout')), 3000)
          )
        ])
      } catch (err) {
        console.error('Exception when closing serial port:', err)
      } finally {
        this.port = null
        this.portPath = null
        this.baudRate = null
      }
    }

    return true
  }
}

// create and export a singleton
const serialManager = new SerialManager()
export default serialManager
