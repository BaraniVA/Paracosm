/*
  # Paracosm Database Schema

  1. New Tables
    - `users`
      - `id` (uuid, primary key)
      - `username` (text, unique)
      - `email` (text, unique)
      - `bio` (text)
      - `created_at` (timestamp)
    - `worlds`
      - `id` (uuid, primary key)
      - `title` (text)
      - `description` (text)
      - `creator_id` (uuid, foreign key)
      - `origin_world_id` (uuid, foreign key, nullable)
      - `laws` (jsonb array)
      - `created_at` (timestamp)
    - `roles`
      - `id` (uuid, primary key)
      - `world_id` (uuid, foreign key)
      - `name` (text)
      - `description` (text)
      - `created_by` (uuid, foreign key)
      - `is_system_role` (boolean)
    - `inhabitants`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key)
      - `world_id` (uuid, foreign key)
      - `role_id` (uuid, foreign key)
      - `joined_at` (timestamp)
    - `questions`
      - `id` (uuid, primary key)
      - `world_id` (uuid, foreign key)
      - `author_id` (uuid, foreign key)
      - `question_text` (text)
      - `upvotes` (integer)
      - `answered_by` (uuid, foreign key, nullable)
      - `answer` (text, nullable)
      - `created_at` (timestamp)
    - `scrolls`
      - `id` (uuid, primary key)
      - `world_id` (uuid, foreign key)
      - `author_id` (uuid, foreign key)
      - `scroll_text` (text)
      - `is_canon` (boolean)
      - `approved_by` (uuid, foreign key, nullable)
      - `created_at` (timestamp)
    - `forks`
      - `id` (uuid, primary key)
      - `original_world_id` (uuid, foreign key)
      - `new_world_id` (uuid, foreign key)
      - `forker_id` (uuid, foreign key)
      - `fork_reason` (text)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  username text UNIQUE NOT NULL,
  email text UNIQUE NOT NULL,
  bio text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

-- Worlds table
CREATE TABLE IF NOT EXISTS worlds (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  creator_id uuid REFERENCES users(id) ON DELETE CASCADE,
  origin_world_id uuid REFERENCES worlds(id) ON DELETE SET NULL,
  laws jsonb DEFAULT '[]'::jsonb,
  created_at timestamptz DEFAULT now()
);

-- Roles table
CREATE TABLE IF NOT EXISTS roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  world_id uuid REFERENCES worlds(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text DEFAULT '',
  created_by uuid REFERENCES users(id) ON DELETE CASCADE,
  is_system_role boolean DEFAULT false
);

-- Inhabitants table
CREATE TABLE IF NOT EXISTS inhabitants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  world_id uuid REFERENCES worlds(id) ON DELETE CASCADE,
  role_id uuid REFERENCES roles(id) ON DELETE CASCADE,
  joined_at timestamptz DEFAULT now(),
  UNIQUE(user_id, world_id)
);

-- Questions table
CREATE TABLE IF NOT EXISTS questions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  world_id uuid REFERENCES worlds(id) ON DELETE CASCADE,
  author_id uuid REFERENCES users(id) ON DELETE CASCADE,
  question_text text NOT NULL,
  upvotes integer DEFAULT 0,
  answered_by uuid REFERENCES users(id) ON DELETE SET NULL,
  answer text,
  created_at timestamptz DEFAULT now()
);

-- Scrolls table
CREATE TABLE IF NOT EXISTS scrolls (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  world_id uuid REFERENCES worlds(id) ON DELETE CASCADE,
  author_id uuid REFERENCES users(id) ON DELETE CASCADE,
  scroll_text text NOT NULL,
  is_canon boolean DEFAULT false,
  approved_by uuid REFERENCES users(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now()
);

-- Forks table
CREATE TABLE IF NOT EXISTS forks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  original_world_id uuid REFERENCES worlds(id) ON DELETE CASCADE,
  new_world_id uuid REFERENCES worlds(id) ON DELETE CASCADE,
  forker_id uuid REFERENCES users(id) ON DELETE CASCADE,
  fork_reason text DEFAULT ''
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE worlds ENABLE ROW LEVEL SECURITY;
ALTER TABLE roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE inhabitants ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE scrolls ENABLE ROW LEVEL SECURITY;
ALTER TABLE forks ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can read all profiles" ON users FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can update own profile" ON users FOR UPDATE TO authenticated USING (auth.uid() = id);

-- Worlds policies
CREATE POLICY "Anyone can read worlds" ON worlds FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can create worlds" ON worlds FOR INSERT TO authenticated WITH CHECK (auth.uid() = creator_id);
CREATE POLICY "Creators can update their worlds" ON worlds FOR UPDATE TO authenticated USING (auth.uid() = creator_id);

-- Roles policies
CREATE POLICY "Anyone can read roles" ON roles FOR SELECT TO authenticated USING (true);
CREATE POLICY "World creators can manage roles" ON roles FOR ALL TO authenticated USING (
  EXISTS (SELECT 1 FROM worlds WHERE worlds.id = world_id AND worlds.creator_id = auth.uid())
);

-- Inhabitants policies
CREATE POLICY "Anyone can read inhabitants" ON inhabitants FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can join worlds" ON inhabitants FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can leave worlds" ON inhabitants FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Questions policies
CREATE POLICY "Anyone can read questions" ON questions FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can create questions" ON questions FOR INSERT TO authenticated WITH CHECK (auth.uid() = author_id);
CREATE POLICY "World creators can answer questions" ON questions FOR UPDATE TO authenticated USING (
  EXISTS (SELECT 1 FROM worlds WHERE worlds.id = world_id AND worlds.creator_id = auth.uid())
);

-- Scrolls policies
CREATE POLICY "Anyone can read scrolls" ON scrolls FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can create scrolls" ON scrolls FOR INSERT TO authenticated WITH CHECK (auth.uid() = author_id);
CREATE POLICY "World creators can approve scrolls" ON scrolls FOR UPDATE TO authenticated USING (
  EXISTS (SELECT 1 FROM worlds WHERE worlds.id = world_id AND worlds.creator_id = auth.uid())
);

-- Forks policies
CREATE POLICY "Anyone can read forks" ON forks FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can create forks" ON forks FOR INSERT TO authenticated WITH CHECK (auth.uid() = forker_id);