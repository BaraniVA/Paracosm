/*
  # Fix RLS Policies for Better User Experience

  1. Security Updates
    - Update RLS policies to allow proper CRUD operations
    - Ensure users can create, read, update, and delete their own content
    - Allow proper world interaction for inhabitants

  2. Policy Changes
    - Users can insert their own profiles
    - World creators can manage all aspects of their worlds
    - Inhabitants can interact with worlds they've joined
    - Proper question and scroll management
*/

-- Drop existing policies that might be too restrictive
DROP POLICY IF EXISTS "Users can read all profiles" ON users;
DROP POLICY IF EXISTS "Users can update own profile" ON users;
DROP POLICY IF EXISTS "Anyone can read worlds" ON worlds;
DROP POLICY IF EXISTS "Creators can update their worlds" ON worlds;
DROP POLICY IF EXISTS "Users can create worlds" ON worlds;
DROP POLICY IF EXISTS "Anyone can read roles" ON roles;
DROP POLICY IF EXISTS "World creators can manage roles" ON roles;
DROP POLICY IF EXISTS "Anyone can read inhabitants" ON inhabitants;
DROP POLICY IF EXISTS "Users can join worlds" ON inhabitants;
DROP POLICY IF EXISTS "Users can leave worlds" ON inhabitants;
DROP POLICY IF EXISTS "Anyone can read questions" ON questions;
DROP POLICY IF EXISTS "Users can create questions" ON questions;
DROP POLICY IF EXISTS "World creators can answer questions" ON questions;
DROP POLICY IF EXISTS "Anyone can read scrolls" ON scrolls;
DROP POLICY IF EXISTS "Users can create scrolls" ON scrolls;
DROP POLICY IF EXISTS "World creators can approve scrolls" ON scrolls;
DROP POLICY IF EXISTS "Anyone can read forks" ON forks;
DROP POLICY IF EXISTS "Users can create forks" ON forks;

-- Users table policies
CREATE POLICY "Users can read all profiles"
  ON users
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert own profile"
  ON users
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON users
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Worlds table policies
CREATE POLICY "Anyone can read worlds"
  ON worlds
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create worlds"
  ON worlds
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = creator_id);

CREATE POLICY "Creators can update their worlds"
  ON worlds
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = creator_id)
  WITH CHECK (auth.uid() = creator_id);

CREATE POLICY "Creators can delete their worlds"
  ON worlds
  FOR DELETE
  TO authenticated
  USING (auth.uid() = creator_id);

-- Roles table policies
CREATE POLICY "Anyone can read roles"
  ON roles
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "World creators can manage roles"
  ON roles
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM worlds 
      WHERE worlds.id = roles.world_id 
      AND worlds.creator_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM worlds 
      WHERE worlds.id = roles.world_id 
      AND worlds.creator_id = auth.uid()
    )
  );

-- Inhabitants table policies
CREATE POLICY "Anyone can read inhabitants"
  ON inhabitants
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can join worlds"
  ON inhabitants
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can leave worlds"
  ON inhabitants
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their inhabitant record"
  ON inhabitants
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Questions table policies
CREATE POLICY "Anyone can read questions"
  ON questions
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create questions"
  ON questions
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Authors can update their questions"
  ON questions
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = author_id)
  WITH CHECK (auth.uid() = author_id);

CREATE POLICY "World creators can answer questions"
  ON questions
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM worlds 
      WHERE worlds.id = questions.world_id 
      AND worlds.creator_id = auth.uid()
    )
  );

-- Scrolls table policies
CREATE POLICY "Anyone can read scrolls"
  ON scrolls
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create scrolls"
  ON scrolls
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Authors can update their scrolls"
  ON scrolls
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = author_id)
  WITH CHECK (auth.uid() = author_id);

CREATE POLICY "World creators can approve scrolls"
  ON scrolls
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM worlds 
      WHERE worlds.id = scrolls.world_id 
      AND worlds.creator_id = auth.uid()
    )
  );

-- Forks table policies
CREATE POLICY "Anyone can read forks"
  ON forks
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create forks"
  ON forks
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = forker_id);