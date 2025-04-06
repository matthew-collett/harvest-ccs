import { useState } from 'react'
import { useStore } from '@/store'
import { Header } from '@/components'
import { SectionHeader, Input } from '@/components/ui'
import { TeamAction } from './TeamAction'
import { TeamCard } from './TeamCard'

export const TeamsView = () => {
  const { teams } = useStore()
  const [searchTerm, setSearchTerm] = useState('')
  const [expandedSection, setExpandedSection] = useState(null)

  const filteredTeams = teams.filter(
    (team) =>
      team.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(team.id).toLowerCase().includes(searchTerm.toLowerCase())
  )

  const toggleSection = (section) => {
    if (expandedSection === section) {
      setExpandedSection(null)
    } else {
      setExpandedSection(section)
    }
  }

  return (
    <>
      <Header />
      <SectionHeader>Teams Actions</SectionHeader>
      <TeamAction expandedSection={expandedSection} toggleSection={toggleSection} />

      <div className="flex justify-between items-center">
        <SectionHeader>Teams ({filteredTeams.length})</SectionHeader>
        <Input
          type="text"
          placeholder="Search teams..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-64 mb-4"
        />
      </div>

      {filteredTeams.length > 0 ? (
        filteredTeams.map((team) => <TeamCard key={team.id} team={team} />)
      ) : teams.length > 0 ? (
        <div className="text-center py-10 text-zinc-500 bg-zinc-800/50 rounded-lg border border-zinc-700/50">
          <p>No teams found</p>
          {searchTerm && <p className="mt-2">Try adjusting your search criteria</p>}
        </div>
      ) : (
        <div className="text-center py-10 text-zinc-500 bg-zinc-800/50 rounded-lg border border-zinc-700/50">
          <p>No teams have been created yet</p>
          <p className="mt-2">
            Use the &quot;New Team&quot; button above to create your first team
          </p>
        </div>
      )}
    </>
  )
}
