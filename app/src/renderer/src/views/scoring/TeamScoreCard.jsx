import { useState } from 'react'
import { Edit, Check, X, Plus, Minus } from 'lucide-react'
import { useStore } from '@/store'

export const TeamScoreCard = ({ team, roundIndex, score }) => {
  const { updateRoundPoints } = useStore()
  const [isEditing, setIsEditing] = useState(false)
  const [pointAdjustment, setPointAdjustment] = useState(0)

  const startEditing = (e) => {
    e.stopPropagation()
    setIsEditing(true)
    setPointAdjustment(0)
  }

  const saveScoreAdjustment = (e) => {
    e.stopPropagation()
    if (pointAdjustment !== 0) {
      updateRoundPoints(roundIndex, team.id, pointAdjustment)
    }
    setIsEditing(false)
    setPointAdjustment(0)
  }

  const cancelEditing = (e) => {
    e.stopPropagation()
    setIsEditing(false)
    setPointAdjustment(0)
  }

  const incrementPoints = (e) => {
    e.stopPropagation()
    setPointAdjustment((prev) => prev + 1)
  }

  const decrementPoints = (e) => {
    e.stopPropagation()
    setPointAdjustment((prev) => prev - 1)
  }

  return (
    <div className="p-3 rounded bg-zinc-700/50">
      <div className="flex justify-between items-center mb-1">
        <h4 className="font-bold">{team.name}</h4>
        {isEditing ? (
          <div className="flex items-center space-x-2">
            <button onClick={decrementPoints} className="bg-zinc-600 p-1 rounded">
              <Minus size={16} />
            </button>
            <span
              className={`font-bold ${
                pointAdjustment > 0 ? 'text-green-400' : pointAdjustment < 0 ? 'text-red-400' : ''
              }`}
            >
              {pointAdjustment > 0 ? `+${pointAdjustment}` : pointAdjustment}
            </span>
            <button onClick={incrementPoints} className="bg-zinc-600 p-1 rounded">
              <Plus size={16} />
            </button>
          </div>
        ) : (
          <button onClick={startEditing} className="text-zinc-400">
            <Edit size={18} />
          </button>
        )}
      </div>
      <div>
        Score: <span className="font-bold">{score} pts</span>
      </div>

      {isEditing && (
        <div className="flex justify-end space-x-2 mt-2">
          <button onClick={cancelEditing} className="bg-red-600 p-1 rounded">
            <X size={16} />
          </button>
          <button onClick={saveScoreAdjustment} className="bg-green-600 p-1 rounded">
            <Check size={16} />
          </button>
        </div>
      )}
    </div>
  )
}
