import { supabase } from '../lib/supabase';
import { Profile } from '../types';

interface HeaderProps {
  profile: Profile;
}

export default function Header({ profile }: HeaderProps) {
  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <header>
      <div className="logo">
        <div className="user-avatar">{profile.avatar || profile.username[0].toUpperCase()}</div>
        <div>
          <h1>eFootball Arena</h1>
          <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
            <span id="online-count">Online</span>
          </div>
        </div>
      </div>

      <div className="user-profile">
        <div className="user-avatar">{profile.avatar || profile.username[0].toUpperCase()}</div>
        <div>
          <div style={{ fontWeight: 'bold' }}>{profile.username}</div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            Level {profile.level} • {profile.xp} XP
          </div>
        </div>
        <button onClick={handleSignOut} className="btn-icon">
          <i className="fas fa-sign-out-alt"></i>
        </button>
      </div>
    </header>
  );
}
