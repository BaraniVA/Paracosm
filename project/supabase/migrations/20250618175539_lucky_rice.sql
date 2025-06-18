/*
  # Add Community Tables for World Discussions

  1. New Tables
    - `community_posts`
      - `id` (uuid, primary key)
      - `world_id` (uuid, foreign key)
      - `author_id` (uuid, foreign key)
      - `title` (text)
      - `content` (text)
      - `upvotes` (integer)
      - `created_at` (timestamp)
    - `community_comments`
      - `id` (uuid, primary key)
      - `post_id` (uuid, foreign key)
      - `author_id` (uuid, foreign key)
      - `comment_text` (text)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on both tables
    - Add policies for authenticated users
*/

-- Community posts table
CREATE TABLE IF NOT EXISTS community_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  world_id uuid REFERENCES worlds(id) ON DELETE CASCADE,
  author_id uuid REFERENCES users(id) ON DELETE CASCADE,
  title text NOT NULL,
  content text NOT NULL,
  upvotes integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Community comments table
CREATE TABLE IF NOT EXISTS community_comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid REFERENCES community_posts(id) ON DELETE CASCADE,
  author_id uuid REFERENCES users(id) ON DELETE CASCADE,
  comment_text text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE community_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_comments ENABLE ROW LEVEL SECURITY;

-- Community posts policies
CREATE POLICY "Anyone can read community posts"
  ON community_posts
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create community posts"
  ON community_posts
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Authors can update their posts"
  ON community_posts
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = author_id)
  WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Authors can delete their posts"
  ON community_posts
  FOR DELETE
  TO authenticated
  USING (auth.uid() = author_id);

CREATE POLICY "World creators can delete any posts in their world"
  ON community_posts
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM worlds 
      WHERE worlds.id = community_posts.world_id 
      AND worlds.creator_id = auth.uid()
    )
  );

-- Community comments policies
CREATE POLICY "Anyone can read community comments"
  ON community_comments
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create community comments"
  ON community_comments
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Authors can update their comments"
  ON community_comments
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = author_id)
  WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Authors can delete their comments"
  ON community_comments
  FOR DELETE
  TO authenticated
  USING (auth.uid() = author_id);

CREATE POLICY "World creators can delete any comments in their world"
  ON community_comments
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM worlds 
      JOIN community_posts ON community_posts.world_id = worlds.id
      WHERE community_posts.id = community_comments.post_id
      AND worlds.creator_id = auth.uid()
    )
  );