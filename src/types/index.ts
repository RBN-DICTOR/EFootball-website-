export interface Profile {
  id: string;
  username: string;
  level: number;
  xp: number;
  rank: number;
  score: number;
  wins: number;
  losses: number;
  avatar: string | null;
  created_at: string;
  updated_at: string;
}

export interface Match {
  id: string;
  name: string;
  host_id: string;
  mode: string;
  status: string;
  difficulty: string;
  duration: string;
  stadium: string | null;
  prize: string | null;
  max_players: number;
  current_players: number;
  score: string | null;
  minute: string | null;
  created_at: string;
  started_at: string | null;
  completed_at: string | null;
  host?: Profile;
}

export interface ChatMessage {
  id: string;
  user_id: string;
  message: string;
  created_at: string;
  profile?: Profile;
}

export interface Tournament {
  id: string;
  name: string;
  prize_pool: string;
  max_participants: number;
  current_participants: number;
  status: string;
  start_date: string | null;
  end_date: string | null;
  created_at: string;
}
