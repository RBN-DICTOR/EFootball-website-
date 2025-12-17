import { supabase } from '../lib/supabase';
import { Match, Profile } from '../types';

interface MatchListProps {
  matches: Match[];
  profile: Profile;
  onUpdate: () => void;
}

export default function MatchList({ matches, profile, onUpdate }: MatchListProps) {
  const handleJoinMatch = async (matchId: string) => {
    const match = matches.find((m) => m.id === matchId);
    if (!match) return;

    if (match.current_players >= match.max_players) {
      alert('Match is full!');
      return;
    }

    const { error: participantError } = await supabase.from('match_participants').insert({
      match_id: matchId,
      user_id: profile.id,
    });

    if (!participantError) {
      const newPlayerCount = match.current_players + 1;
      await supabase
        .from('matches')
        .update({
          current_players: newPlayerCount,
          status: newPlayerCount === match.max_players ? 'live' : 'waiting',
        })
        .eq('id', matchId);

      onUpdate();
    }
  };

  return (
    <div className="card">
      <div className="card-header">
        <h2 className="card-title">
          <i className="fas fa-broadcast-tower"></i>
          Live Matches
        </h2>
        <div style={{ color: 'var(--primary)', fontSize: '0.9rem' }}>
          <i className="fas fa-sync-alt" style={{ cursor: 'pointer' }} onClick={onUpdate}></i>
        </div>
      </div>

      <div id="matchesContainer">
        {matches.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
            <i className="fas fa-tv" style={{ fontSize: '3rem', marginBottom: '1rem' }}></i>
            <h3>No Active Matches</h3>
            <p>Be the first to create a match!</p>
          </div>
        ) : (
          matches.map((match) => (
            <div
              key={match.id}
              className="match-card"
              style={{
                marginBottom: '1rem',
                paddingBottom: '1rem',
                borderBottom: '1px solid rgba(255,255,255,0.1)',
              }}
            >
              <div className="match-info">
                <div className="match-teams">
                  <div className="team">
                    <div className="team-logo">
                      {match.host?.avatar || match.host?.username[0].toUpperCase()}
                    </div>
                    <div className="team-name">{match.host?.username}</div>
                  </div>
                  <div className="vs">VS</div>
                  <div className="team">
                    <div className="team-logo">?</div>
                    <div className="team-name">Waiting...</div>
                  </div>
                </div>
                <div className="match-meta">
                  <div className={`match-status ${match.status === 'live' ? 'status-live' : 'status-waiting'}`}>
                    {match.status === 'live' ? 'LIVE' : 'WAITING'}
                  </div>
                  <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                    {match.duration} • {match.difficulty}
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <strong>{match.name}</strong>
                  <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                    <i
                      className={`fas fa-${
                        match.mode === 'Competitive' ? 'trophy' : match.mode === 'Tournament' ? 'shield-alt' : 'users'
                      }`}
                    ></i>
                    {match.mode} • {match.current_players}/{match.max_players} players
                  </div>
                </div>
                <div className="match-actions">
                  <button className="btn btn-primary" onClick={() => handleJoinMatch(match.id)}>
                    {match.status === 'live' ? 'Spectate' : 'Join'}
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
