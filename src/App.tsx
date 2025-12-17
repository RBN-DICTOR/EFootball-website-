import { useEffect, useState } from 'react';
import { supabase } from './lib/supabase';
import { Profile, Match, ChatMessage, Tournament } from './types';
import Header from './components/Header';
import CreateMatch from './components/CreateMatch';
import MatchList from './components/MatchList';
import Leaderboard from './components/Leaderboard';
import Chat from './components/Chat';
import TournamentCard from './components/TournamentCard';
import Auth from './components/Auth';
import './App.css';

function App() {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [matches, setMatches] = useState<Match[]>([]);
  const [leaderboard, setLeaderboard] = useState<Profile[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [tournament, setTournament] = useState<Tournament | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (user) {
      loadProfile();
      loadMatches();
      loadLeaderboard();
      loadMessages();
      loadTournament();
      subscribeToRealtime();
    }
  }, [user]);

  const loadProfile = async () => {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .maybeSingle();

    if (data) {
      setProfile(data);
    }
  };

  const loadMatches = async () => {
    const { data } = await supabase
      .from('matches')
      .select('*, host:profiles!matches_host_id_fkey(*)')
      .order('created_at', { ascending: false })
      .limit(10);

    if (data) {
      setMatches(data);
    }
  };

  const loadLeaderboard = async () => {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .order('score', { ascending: false })
      .limit(5);

    if (data) {
      setLeaderboard(data);
    }
  };

  const loadMessages = async () => {
    const { data } = await supabase
      .from('chat_messages')
      .select('*, profile:profiles(*)')
      .order('created_at', { ascending: false })
      .limit(20);

    if (data) {
      setMessages(data.reverse());
    }
  };

  const loadTournament = async () => {
    const { data } = await supabase
      .from('tournaments')
      .select('*')
      .eq('status', 'open')
      .maybeSingle();

    if (data) {
      setTournament(data);
    }
  };

  const subscribeToRealtime = () => {
    const matchesChannel = supabase
      .channel('matches_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'matches' }, () => {
        loadMatches();
      })
      .subscribe();

    const messagesChannel = supabase
      .channel('messages_changes')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'chat_messages' }, () => {
        loadMessages();
      })
      .subscribe();

    const profilesChannel = supabase
      .channel('profiles_changes')
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'profiles' }, () => {
        loadLeaderboard();
        if (user) loadProfile();
      })
      .subscribe();

    return () => {
      matchesChannel.unsubscribe();
      messagesChannel.unsubscribe();
      profilesChannel.unsubscribe();
    };
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="loader"></div>
      </div>
    );
  }

  if (!user) {
    return <Auth />;
  }

  if (!profile) {
    return (
      <div className="loading">
        <p>Setting up your profile...</p>
      </div>
    );
  }

  return (
    <>
      <div id="particles-js"></div>
      <Header profile={profile} />
      <div className="container">
        <div className="left-column">
          <CreateMatch profile={profile} onMatchCreated={loadMatches} />
          <MatchList matches={matches} profile={profile} onUpdate={loadMatches} />
          <div className="ad-container">
            <div className="ad-label">Sponsored</div>
            <h3>Win Real Prizes!</h3>
            <p>Join our weekend tournament for a chance to win gaming gear and cash prizes.</p>
            <button className="btn btn-primary">
              <i className="fas fa-gem"></i>
              Enter Tournament (50 Coins)
            </button>
          </div>
        </div>
        <div className="right-column">
          <Leaderboard leaderboard={leaderboard} userProfile={profile} />
          {tournament && <TournamentCard tournament={tournament} />}
          <Chat messages={messages} profile={profile} onSend={loadMessages} />
        </div>
      </div>
    </>
  );
}

export default App;
