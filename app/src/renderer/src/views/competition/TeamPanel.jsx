import { DeviceStatus } from '@/views/competition'
import { useStore } from '@/store/useStore'

export const TeamPanel = ({ team }) => {
  const harvesters = team.devices.filter((device) => device.type === 'harvester')
  const rovers = team.devices.filter((device) => device.type === 'rover')
  const currentRound = useStore((state) => state.currentRound)
  const tasks = useStore((state) => state.tasks)

  // TODO these functions should probably be in their respsective slices
  const getRoundPoints = () => {
    if (!currentRound.tasks) {
      return 0
    }
    return (
      Object.entries(currentRound.tasks)
        // eslint-disable-next-line no-unused-vars
        .filter(([_, task]) => task.teamId === team.id && task.status === 2)
        // eslint-disable-next-line no-unused-vars
        .reduce((total, [taskId, _]) => {
          const pointValue = tasks[taskId]?.pointValue || 0
          return total + pointValue
        }, 0)
    )
  }

  const roundPoints = getRoundPoints()

  const getCurrentTask = (rover) => {
    if (!currentRound.tasks || !currentRound.isActive) return null
    const activeTask = Object.entries(currentRound.tasks).find(
      // eslint-disable-next-line no-unused-vars
      ([_, task]) => task.teamId === team.id && task.uniqueId === rover.id && task.status === 1
    )
    if (!activeTask) return null
    const [taskId, taskInfo] = activeTask
    const taskName = tasks[taskId]?.name || `Task ${taskId}`
    return {
      id: taskId,
      name: taskName,
      status: taskInfo.status // 1=attempting
    }
  }

  const getCompletedTasks = (rover) => {
    if (!currentRound.tasks || !currentRound.isActive) return []
    const completedTasks = Object.entries(currentRound.tasks)
      .filter(
        // eslint-disable-next-line no-unused-vars
        ([_, task]) => task.teamId === team.id && task.uniqueId === rover.id && task.status === 2
      )
      .map(([taskId, taskInfo]) => {
        const taskName = tasks[taskId]?.name || `Task ${taskId}`
        return {
          id: taskId,
          name: taskName,
          status: taskInfo.status, // 2=completed
          completedAt: taskInfo.completedAt
        }
      })

    return completedTasks.sort((a, b) => b.completedAt - a.completedAt)
  }

  return (
    <div className="bg-zinc-800 p-4 rounded-lg">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">{team.name}</h2>
        <div className="flex flex-col items-end">
          <div className="text-2xl font-bold">{roundPoints} pts</div>
        </div>
      </div>
      <div className="mb-4">
        <h3 className="text-sm font-semibold mb-2">Harvesters</h3>
        <div className="grid lg:grid-cols-2 gap-4">
          {harvesters.map((harvester) => (
            <DeviceStatus key={harvester.id} device={harvester} type="Harvester" />
          ))}
        </div>
      </div>
      <div>
        <h3 className="text-sm font-semibold mb-2">Rovers</h3>
        <div className="grid lg:grid-cols-2 gap-4">
          {rovers.map((rover) => (
            <DeviceStatus
              key={rover.id}
              device={rover}
              type="Rover"
              currentTask={getCurrentTask(rover)}
              completedTasks={getCompletedTasks(rover)}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
