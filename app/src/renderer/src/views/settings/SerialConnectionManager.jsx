import { useState, useEffect } from 'react'
import { Usb, RefreshCw } from 'lucide-react'
import { SectionHeader, Button } from '@/components/ui'

export const SerialConnectionManager = () => {
  const [ports, setPorts] = useState([])
  const [selectedPort, setSelectedPort] = useState('')
  const [baudRate, setBaudRate] = useState(115200)
  const [isConnected, setIsConnected] = useState(false)
  const [status, setStatus] = useState({ message: '', isError: false })
  const [isLoading, setIsLoading] = useState(false)

  const scanPorts = async () => {
    try {
      setIsLoading(true)
      const availablePorts = await window.serialAPI.listPorts()
      setPorts(availablePorts)
    } catch (error) {
      setStatus({ message: `Error scanning ports: ${error.message}`, isError: true })
    } finally {
      setIsLoading(false)
    }
  }

  const checkConnectionStatus = async () => {
    try {
      const connectionStatus = await window.serialAPI.getConnectionStatus()

      if (connectionStatus.connected) {
        setIsConnected(true)

        if (connectionStatus.port) {
          setSelectedPort(connectionStatus.port)
        }

        if (connectionStatus.baudRate) {
          setBaudRate(connectionStatus.baudRate)
        }
      } else {
        setIsConnected(false)
      }
    } catch (error) {
      console.error('Error checking connection status:', error)
    }
  }

  useEffect(() => {
    const initialize = async () => {
      await scanPorts()
      await checkConnectionStatus()
    }

    initialize()
    const statusInterval = setInterval(checkConnectionStatus, 3000)
    return () => clearInterval(statusInterval)
  }, [])

  const handleConnect = async () => {
    if (!selectedPort) {
      setStatus({ message: 'Please select a port', isError: true })
      return
    }

    try {
      setIsLoading(true)
      const result = await window.serialAPI.connect({
        path: selectedPort,
        baudRate
      })

      if (result) {
        setIsConnected(true)
      } else {
        setStatus({ message: 'Failed to connect', isError: true })
      }
    } catch (error) {
      setStatus({ message: `Connection error: ${error.message}`, isError: true })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDisconnect = async () => {
    try {
      setIsLoading(true)
      await window.serialAPI.disconnect()
      setIsConnected(false)
    } catch (error) {
      setStatus({ message: `Disconnection error: ${error.message}`, isError: true })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="mb-8">
      <SectionHeader>Serial Connection</SectionHeader>

      <div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end mb-4">
          <div>
            <label className="block text-sm mb-1">Port</label>
            <div className="flex gap-2">
              <select
                className="w-full p-2 rounded border border-zinc-700 bg-zinc-900"
                value={selectedPort}
                onChange={(e) => setSelectedPort(e.target.value)}
                disabled={isConnected || isLoading}
              >
                <option value="">Select Port</option>
                {ports.map((port) => (
                  <option key={port.path} value={port.path}>
                    {port.path} {port.manufacturer ? `(${port.manufacturer})` : ''}
                  </option>
                ))}
              </select>
              <Button
                className="bg-transparent hover:bg-transparent"
                size="icon"
                onClick={scanPorts}
                disabled={isLoading}
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div>
            <label className="block text-sm mb-1">Baud Rate</label>
            <select
              className="w-full p-2 rounded border border-zinc-700 bg-zinc-900"
              value={baudRate}
              onChange={(e) => setBaudRate(parseInt(e.target.value, 10))}
              disabled={isConnected || isLoading}
            >
              <option value={9600}>9600</option>
              <option value={19200}>19200</option>
              <option value={38400}>38400</option>
              <option value={57600}>57600</option>
              <option value={115200}>115200</option>
            </select>
          </div>

          <div>
            <Button
              className="w-full flex items-center justify-center gap-2"
              onClick={isConnected ? handleDisconnect : handleConnect}
              disabled={isLoading || (!isConnected && !selectedPort)}
              variant={isConnected ? 'danger' : 'primary'}
            >
              <Usb className="h-4 w-4" />
              {isLoading ? 'Processing...' : isConnected ? 'Disconnect' : 'Connect'}
            </Button>
          </div>
        </div>

        <div className="mt-4">
          <div className="text-sm text-zinc-400">
            <span className="font-semibold">Status:</span>{' '}
            {status.isError && status.message ? (
              <span className="text-red-400">{status.message}</span>
            ) : isConnected ? (
              <span className="text-green-400">Connected to {selectedPort}</span>
            ) : (
              <span className="text-zinc-500">Disconnected</span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
