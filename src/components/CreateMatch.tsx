import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { Profile } from '../types';

interface CreateMatchProps {
  profile: Profile;
  onMatchCreated: () => void;
}

export default function CreateMatch({ profile, onMatchCreated }: CreateMatchProps) {
  const [matchName, setMatchName] = useState('My Championship Match');
  const [difficulty, setDifficulty] = useState('Normal');
  const [duration, setDuration] = useState('10 Minutes');
  const [stadium, setStadium] = useState('Old Trafford');
  const [mode, setMode] = useState('Competitive');

  const handleCreateMatch = async () => {
    const { error } = await supabase.from('matches').insert({
      name: matchName,
      host_id: profile.id,
      mode,
      difficulty,
      duration,
      stadium,
      prize: '50 Coins',
      status: 'waiting',
    });

    if (!error) {
      onMatchCreated();
      setMatchName('My Championship Match');
    }
  };

  return (
    <div className="card create-match">
      <div className="card-header">
        <h2 className="card-title">
          <i className="fas fa-plus-circle"></i>
          Create New Match
        </h2>
      </div>

      <div className="form-group">
        <label className="form-label">Match Name</label>
        <input
          type="text"
          className="form-input"
          value={matchName}
          onChange={(e) => setMatchName(e.target.value)}
          placeholder="Enter match name"
        />
      </div>

      <div className="form-group">
        <label className="form-label">Game Mode</label>
        <div className="match-settings">
          <div
            className={`setting-option ${mode === 'Competitive' ? 'active' : ''}`}
            onClick={() => setMode('Competitive')}
          >
            <i className="fas fa-trophy"></i>
            <div>Competitive</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Ranked</div>
          </div>
          <div
            className={`setting-option ${mode === 'Friendly' ? 'active' : ''}`}
            onClick={() => setMode('Friendly')}
          >
            <i className="fas fa-users"></i>
            <div>Friendly</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Casual</div>
          </div>
          <div
            className={`setting-option ${mode === 'Tournament' ? 'active' : ''}`}
            onClick={() => setMode('Tournament')}
          >
            <i className="fas fa-shield-alt"></i>
            <div>Tournament</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Pro Rules</div>
          </div>
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">Match Settings</label>
        <div className="match-settings">
          <select className="form-select" value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
            <option>Easy</option>
            <option>Normal</option>
            <option>Hard</option>
            <option>Expert</option>
          </select>
          <select className="form-select" value={duration} onChange={(e) => setDuration(e.target.value)}>
            <option>5 Minutes</option>
            <option>10 Minutes</option>
            <option>15 Minutes</option>
            <option>20 Minutes</option>
          </select>
          <select className="form-select" value={stadium} onChange={(e) => setStadium(e.target.value)}>
            <option>Camp Nou</option>
            <option>Old Trafford</option>
            <option>San Siro</option>
            <option>Allianz Arena</option>
          </select>
        </div>
      </div>

      <button className="btn btn-primary btn-block" onClick={handleCreateMatch}>
        <i className="fas fa-play-circle"></i>
        Create Match & Enter Lobby
      </button>
    </div>
  );
}
