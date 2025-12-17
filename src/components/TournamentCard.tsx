import { Tournament } from '../types';

interface TournamentCardProps {
  tournament: Tournament;
}

export default function TournamentCard({ tournament }: TournamentCardProps) {
  const getTimeLeft = () => {
    if (!tournament.end_date) return 'N/A';
    const end = new Date(tournament.end_date);
    const now = new Date();
    const diff = end.getTime() - now.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    return `${days}d ${hours}h`;
  };

  return (
    <div className="card tournament-card">
      <div className="card-header">
        <h2 className="card-title">
          <i className="fas fa-trophy"></i>
          {tournament.name}
        </h2>
        <div className="prize-pool">
          <i className="fas fa-gem"></i> {tournament.prize_pool}
        </div>
      </div>
      <p style={{ marginBottom: '1rem', color: 'var(--text-secondary)' }}>
        Join the weekly championship. Top 3 players win real prizes!
      </p>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <div>
          <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Participants</div>
          <div style={{ fontWeight: 'bold' }}>
            {tournament.current_participants}/{tournament.max_participants}
          </div>
        </div>
        <div>
          <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Time Left</div>
          <div style={{ fontWeight: 'bold' }}>{getTimeLeft()}</div>
        </div>
      </div>
      <button className="btn btn-primary btn-block">
        <i className="fas fa-sign-in-alt"></i>
        Register Now
      </button>
    </div>
  );
}
