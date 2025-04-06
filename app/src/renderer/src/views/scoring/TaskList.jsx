import { ChevronDown, ChevronUp } from 'lucide-react'

export const TaskList = ({
  tasks,
  roundNumber,
  expandedTasks,
  toggleTask,
  getTeamName,
  getTaskName
}) => {
  return (
    <>
      <h4 className="font-bold mb-2">Completed Tasks</h4>
      {Object.keys(tasks).length === 0 ? (
        <div className="text-zinc-400 py-2">No tasks were completed in this round.</div>
      ) : (
        <div className="space-y-2">
          {Object.entries(tasks).map(([taskId, task]) => (
            <div key={taskId} className="bg-zinc-700/50 rounded">
              <div
                className="flex justify-between items-center p-3 cursor-pointer"
                onClick={() => toggleTask(roundNumber, taskId)}
              >
                <div>
                  <span className="font-bold">{getTaskName(taskId)}</span>
                  <span className="text-zinc-400 ml-2">{getTeamName(task.teamId)}</span>
                </div>
                <div className="flex items-center">
                  <span className="text-green-400 font-bold mr-2">+{task.pointValue} pts</span>
                  {expandedTasks[`${roundNumber}-${taskId}`] ? (
                    <ChevronUp size={16} />
                  ) : (
                    <ChevronDown size={16} />
                  )}
                </div>
              </div>

              {expandedTasks[`${roundNumber}-${taskId}`] && (
                <div className="p-3 border-t border-zinc-700 text-sm">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      Team: <span className="font-bold">{getTeamName(task.teamId)}</span>
                    </div>
                    <div>
                      Player ID: <span className="font-bold">{task.playerId}</span>
                    </div>
                    <div>
                      Completed At:{' '}
                      <span className="font-bold">
                        {task.completedAt !== null ? `${task.completedAt}s` : 'Unknown'}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </>
  )
}
