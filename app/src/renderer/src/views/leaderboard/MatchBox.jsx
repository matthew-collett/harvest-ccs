export const MatchBox = ({
  label,
  matchData = { teams: [null, null], winner: null },
  onTeamSelect,
  onWinnerSelect,
  allTeams = [],
  getTeamName,
  isFirstRound
}) => {
  const hasWinner = !!matchData.winner

  return (
    <div className="bg-zinc-900/50 p-3 rounded-lg w-full">
      <div className="text-xs font-bold mb-2 text-zinc-400">{label}</div>
      <div className="flex flex-col gap-2">
        <div className="flex items-center">
          {isFirstRound && !hasWinner ? (
            <select
              className="w-full p-2 rounded bg-zinc-900 border border-zinc-600 text-white focus:outline-none"
              value={matchData.teams[0] || ''}
              onChange={(e) => onTeamSelect(0, e.target.value)}
            >
              <option value="">Select Team</option>
              {allTeams.map((team) => (
                <option key={team.id} value={team.id}>
                  {team.name}
                </option>
              ))}
            </select>
          ) : (
            <div
              className={`
                p-2 rounded w-full
                ${matchData.teams[0] ? 'bg-zinc-900' : 'bg-zinc-900/50 border border-dashed border-zinc-600'}
                ${matchData.winner === matchData.teams[0] ? 'bg-green-900/30 text-blue-500 font-bold' : ''}
              `}
            >
              {matchData.teams[0] ? getTeamName(matchData.teams[0]) : '---'}
            </div>
          )}
          {matchData.teams[0] && matchData.teams[1] && !matchData.winner && (
            <button
              className="ml-2 px-2 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-500 transition-colors"
              onClick={() => onWinnerSelect(0)}
            >
              Win
            </button>
          )}
        </div>

        <div className="flex items-center">
          {isFirstRound && !hasWinner ? (
            <select
              className="w-full p-2 rounded bg-zinc-900 border border-zinc-600 text-white focus:outline-none"
              value={matchData.teams[1] || ''}
              onChange={(e) => onTeamSelect(1, e.target.value)}
            >
              <option value="">Select Team</option>
              {allTeams.map((team) => (
                <option key={team.id} value={team.id}>
                  {team.name}
                </option>
              ))}
            </select>
          ) : (
            <div
              className={`
                p-2 rounded w-full
                ${matchData.teams[1] ? 'bg-zinc-900' : 'bg-zinc-900/50 border border-dashed border-zinc-600'}
                ${matchData.winner === matchData.teams[1] ? 'bg-green-900/30 text-blue-500 font-bold' : ''}
              `}
            >
              {matchData.teams[1] ? getTeamName(matchData.teams[1]) : '---'}
            </div>
          )}
          {matchData.teams[0] && matchData.teams[1] && !matchData.winner && (
            <button
              className="ml-2 px-2 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-500 transition-colors"
              onClick={() => onWinnerSelect(1)}
            >
              Win
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
