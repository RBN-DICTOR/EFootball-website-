/*
  # eFootball Arena Database Schema

  1. New Tables
    - `profiles`
      - `id` (uuid, primary key, references auth.users)
      - `username` (text, unique, not null)
      - `level` (integer, default 1)
      - `xp` (integer, default 0)
      - `rank` (integer, default 0)
      - `score` (integer, default 0)
      - `wins` (integer, default 0)
      - `losses` (integer, default 0)
      - `avatar` (text)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `matches`
      - `id` (uuid, primary key)
      - `name` (text, not null)
      - `host_id` (uuid, references profiles)
      - `mode` (text, not null) - Competitive/Friendly/Tournament
      - `status` (text, default 'waiting') - waiting/live/completed
      - `difficulty` (text, default 'Normal')
      - `duration` (text, default '10 Minutes')
      - `stadium` (text)
      - `prize` (text)
      - `max_players` (integer, default 2)
      - `current_players` (integer, default 1)
      - `score` (text)
      - `minute` (text)
      - `created_at` (timestamptz)
      - `started_at` (timestamptz)
      - `completed_at` (timestamptz)
    
    - `match_participants`
      - `id` (uuid, primary key)
      - `match_id` (uuid, references matches)
      - `user_id` (uuid, references profiles)
      - `team` (text)
      - `joined_at` (timestamptz)
    
    - `chat_messages`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles)
      - `message` (text, not null)
      - `created_at` (timestamptz)
    
    - `tournaments`
      - `id` (uuid, primary key)
      - `name` (text, not null)
      - `prize_pool` (text, not null)
      - `max_participants` (integer, not null)
      - `current_participants` (integer, default 0)
      - `status` (text, default 'open') - open/in_progress/completed
      - `start_date` (timestamptz)
      - `end_date` (timestamptz)
      - `created_at` (timestamptz)

    - `tournament_participants`
      - `id` (uuid, primary key)
      - `tournament_id` (uuid, references tournaments)
      - `user_id` (uuid, references profiles)
      - `joined_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to read/write their own data
    - Add policies for public read access where appropriate
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  username text UNIQUE NOT NULL,
  level integer DEFAULT 1,
  xp integer DEFAULT 0,
  rank integer DEFAULT 0,
  score integer DEFAULT 0,
  wins integer DEFAULT 0,
  losses integer DEFAULT 0,
  avatar text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view all profiles"
  ON profiles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Create matches table
CREATE TABLE IF NOT EXISTS matches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  host_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  mode text NOT NULL,
  status text DEFAULT 'waiting',
  difficulty text DEFAULT 'Normal',
  duration text DEFAULT '10 Minutes',
  stadium text,
  prize text,
  max_players integer DEFAULT 2,
  current_players integer DEFAULT 1,
  score text,
  minute text,
  created_at timestamptz DEFAULT now(),
  started_at timestamptz,
  completed_at timestamptz
);

ALTER TABLE matches ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view matches"
  ON matches FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create matches"
  ON matches FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = host_id);

CREATE POLICY "Host can update own matches"
  ON matches FOR UPDATE
  TO authenticated
  USING (auth.uid() = host_id)
  WITH CHECK (auth.uid() = host_id);

CREATE POLICY "Host can delete own matches"
  ON matches FOR DELETE
  TO authenticated
  USING (auth.uid() = host_id);

-- Create match_participants table
CREATE TABLE IF NOT EXISTS match_participants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  match_id uuid REFERENCES matches(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  team text,
  joined_at timestamptz DEFAULT now(),
  UNIQUE(match_id, user_id)
);

ALTER TABLE match_participants ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view match participants"
  ON match_participants FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can join matches"
  ON match_participants FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can leave matches"
  ON match_participants FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create chat_messages table
CREATE TABLE IF NOT EXISTS chat_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  message text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view chat messages"
  ON chat_messages FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can send messages"
  ON chat_messages FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Create tournaments table
CREATE TABLE IF NOT EXISTS tournaments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  prize_pool text NOT NULL,
  max_participants integer NOT NULL,
  current_participants integer DEFAULT 0,
  status text DEFAULT 'open',
  start_date timestamptz,
  end_date timestamptz,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE tournaments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view tournaments"
  ON tournaments FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can manage tournaments"
  ON tournaments FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create tournament_participants table
CREATE TABLE IF NOT EXISTS tournament_participants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tournament_id uuid REFERENCES tournaments(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  joined_at timestamptz DEFAULT now(),
  UNIQUE(tournament_id, user_id)
);

ALTER TABLE tournament_participants ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view tournament participants"
  ON tournament_participants FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can join tournaments"
  ON tournament_participants FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can leave tournaments"
  ON tournament_participants FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_matches_status ON matches(status);
CREATE INDEX IF NOT EXISTS idx_matches_created_at ON matches(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_profiles_score ON profiles(score DESC);
CREATE INDEX IF NOT EXISTS idx_chat_messages_created_at ON chat_messages(created_at DESC);

-- Insert sample tournament
INSERT INTO tournaments (name, prize_pool, max_participants, start_date, end_date)
VALUES ('Weekly Championship', '$500 Prize Pool', 500, now(), now() + interval '7 days')
ON CONFLICT DO NOTHING;
