import { useState, useEffect } from 'react'
import { Shield, Hammer, CheckCircle, Clock } from 'lucide-react'

export const DeviceStatus = ({ device, type, currentTask, completedTasks = [] }) => {
  const [isInactive, setIsInactive] = useState(false)

  const checkDeviceInactive = () => {
    const diff = (new Date().getTime() - device.lastSeen) / 1000
    return diff >= 7
  }

  useEffect(() => {
    setIsInactive(checkDeviceInactive())

    const intervalId = setInterval(() => {
      setIsInactive(checkDeviceInactive())
    }, 1000)

    return () => clearInterval(intervalId)
  }, [device.lastSeen])

  return (
    <div
      className={`bg-zinc-700 p-3 rounded ${
        isInactive ? 'opacity-50 border-2 border-red-500/70 relative' : 'opacity-100'
      }`}
    >
      {isInactive && (
        <div className="absolute top-0 right-0 bg-red-500 text-white text-xs px-2 py-1 rounded-bl rounded-tr">
          Inactive
        </div>
      )}
      <div className="flex justify-between items-start mb-2">
        <span className="text-sm">
          {type} <br />
          Player ID: {device.playerId}
        </span>
        <div className="flex gap-2">
          {device.shieldCodeFlag === 1 && <Shield className="w-4 h-4 text-blue-400" />}
          {device.repairCodeFlag === 1 && <Hammer className="w-4 h-4 text-yellow-400" />}
        </div>
      </div>
      <div className="space-y-2">
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span>Health</span>
            <span>{device.currentHealth}%</span>
          </div>
          <div className="w-full bg-zinc-600 rounded-full h-2">
            <div
              className={`${
                device.currentHealth > 50
                  ? 'bg-green-500'
                  : device.currentHealth > 20
                    ? 'bg-yellow-500'
                    : 'bg-red-500'
              } rounded-full h-2 transition-all`}
              style={{ width: `${device.currentHealth}%` }}
            />
          </div>
        </div>
        <div className="flex gap-2 text-sm">
          <span
            className={`px-2 py-1 rounded ${
              device.enabled === 0 ? 'bg-red-500/20 text-red-300' : 'bg-green-500/20 text-green-300'
            }`}
          >
            {device.enabled === 0 ? 'Disabled' : 'Active'}
          </span>
          {device.enabled === 0 && device.disabledTimer > 0 && (
            <span className="bg-zinc-600 px-2 py-1 rounded">{device.disabledTimer}s</span>
          )}
        </div>
        {device.type === 'rover' && (
          <div className="text-sm">
            <div className="mb-1">
              <span className="text-zinc-400">Current Task: </span>
              {currentTask ? (
                <div className="mt-1">
                  <div className="flex items-center">
                    <Clock className="w-3 h-3 text-blue-400 mr-1" />
                    <span className="bg-blue-500/20 text-blue-300 px-2 py-1 rounded text-xs">
                      {currentTask.name}
                    </span>
                  </div>
                </div>
              ) : (
                <span className="text-zinc-500">None</span>
              )}
            </div>
            {completedTasks && completedTasks.length > 0 && (
              <div>
                <span className="text-zinc-400">Completed: </span>
                <div className="mt-1 space-y-1 max-h-20 overflow-y-auto">
                  {completedTasks.map((task) => (
                    <div key={task.id} className="flex items-center">
                      <CheckCircle className="w-3 h-3 text-green-400 mr-1" />
                      <span className="bg-green-500/20 text-green-300 px-2 py-1 rounded text-xs">
                        {task.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
