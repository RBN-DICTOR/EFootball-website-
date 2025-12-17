import { Profile } from '../types';

interface LeaderboardProps {
  leaderboard: Profile[];
  userProfile: Profile;
}

export default function Leaderboard({ leaderboard, userProfile }: LeaderboardProps) {
  return (
    <div className="card">
      <div className="card-header">
        <h2 className="card-title">
          <i className="fas fa-crown"></i>
          Top Players
        </h2>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <div className="stats">
            <div className="stat-item">
              <div className="stat-value">#{userProfile.rank || 'N/A'}</div>
              <div className="stat-label">Your Rank</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">{userProfile.score}</div>
              <div className="stat-label">Points</div>
            </div>
          </div>
        </div>
      </div>

      <table className="leaderboard-table">
        <thead>
          <tr>
            <th>Rank</th>
            <th>Player</th>
            <th>Wins</th>
            <th>Points</th>
          </tr>
        </thead>
        <tbody>
          {leaderboard.map((player, index) => (
            <tr key={player.id}>
              <td>
                <div className={`player-rank ${index < 3 ? `rank-${index + 1}` : ''}`}>{index + 1}</div>
              </td>
              <td>
                <div className="player-info">
                  <div className="user-avatar" style={{ width: '35px', height: '35px', fontSize: '1rem' }}>
                    {player.avatar || player.username[0].toUpperCase()}
                  </div>
                  <div>
                    <div style={{ fontWeight: 'bold' }}>{player.username}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Level {player.level}</div>
                  </div>
                </div>
              </td>
              <td>{player.wins}</td>
              <td>
                <strong>{player.score}</strong>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
