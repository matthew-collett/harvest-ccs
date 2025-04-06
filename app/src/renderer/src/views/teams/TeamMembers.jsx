import { useState } from 'react'
import { Users, UserRoundX } from 'lucide-react'
import { Button, Input } from '@/components/ui'
import { useStore } from '@/store'

export const TeamMembers = ({ team }) => {
  const { addStudentToTeam, removeStudentFromTeam } = useStore()
  const [newStudent, setNewStudent] = useState({ name: '', teamId: '' })

  const handleAddStudent = (teamId) => {
    if (!newStudent.name.trim()) {
      return
    }

    addStudentToTeam(teamId, { name: newStudent.name })
    setNewStudent({ name: '', teamId: '' })
  }

  return (
    <div className="p-4">
      <div className="flex items-center gap-2 text-zinc-300 mb-3">
        <Users size={18} />
        <h3 className="font-medium">Team Members ({team.students.length})</h3>
      </div>

      {team.students.length > 0 ? (
        <div className="bg-zinc-900/50 rounded border border-zinc-700/40 divide-y divide-zinc-700/40">
          {team.students.map((student, index) => (
            <div key={index} className="p-3 flex justify-between items-center">
              <span>{student.name}</span>
              <Button
                variant="ghost"
                size="sm"
                className="p-1 text-zinc-400 hover:text-red-400"
                onClick={() => removeStudentFromTeam(team.id, index)}
              >
                <UserRoundX size={16} />
              </Button>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-zinc-500 bg-zinc-900/50 p-3 rounded border border-zinc-700/40">
          No team members
        </div>
      )}
      <div className="flex gap-2 mt-3">
        <Input
          type="text"
          placeholder="Enter student name"
          className="flex-1"
          value={newStudent.teamId === team.id ? newStudent.name : ''}
          onChange={(e) => setNewStudent({ name: e.target.value, teamId: team.id })}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && newStudent.name.trim()) {
              handleAddStudent(team.id)
            }
          }}
        />
        <Button onClick={() => handleAddStudent(team.id)}>Add</Button>
      </div>
    </div>
  )
}
