import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          username: string;
          email: string;
          bio: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          username: string;
          email: string;
          bio?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          username?: string;
          email?: string;
          bio?: string;
          created_at?: string;
        };
      };
      worlds: {
        Row: {
          id: string;
          title: string;
          description: string;
          creator_id: string;
          origin_world_id: string | null;
          laws: any[];
          created_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          description: string;
          creator_id: string;
          origin_world_id?: string | null;
          laws?: any[];
          created_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string;
          creator_id?: string;
          origin_world_id?: string | null;
          laws?: any[];
          created_at?: string;
        };
      };
      roles: {
        Row: {
          id: string;
          world_id: string;
          name: string;
          description: string;
          created_by: string;
          is_system_role: boolean;
        };
        Insert: {
          id?: string;
          world_id: string;
          name: string;
          description?: string;
          created_by: string;
          is_system_role?: boolean;
        };
        Update: {
          id?: string;
          world_id?: string;
          name?: string;
          description?: string;
          created_by?: string;
          is_system_role?: boolean;
        };
      };
      inhabitants: {
        Row: {
          id: string;
          user_id: string;
          world_id: string;
          role_id: string;
          joined_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          world_id: string;
          role_id: string;
          joined_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          world_id?: string;
          role_id?: string;
          joined_at?: string;
        };
      };
      questions: {
        Row: {
          id: string;
          world_id: string;
          author_id: string;
          question_text: string;
          upvotes: number;
          answered_by: string | null;
          answer: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          world_id: string;
          author_id: string;
          question_text: string;
          upvotes?: number;
          answered_by?: string | null;
          answer?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          world_id?: string;
          author_id?: string;
          question_text?: string;
          upvotes?: number;
          answered_by?: string | null;
          answer?: string | null;
          created_at?: string;
        };
      };
      scrolls: {
        Row: {
          id: string;
          world_id: string;
          author_id: string;
          scroll_text: string;
          is_canon: boolean;
          approved_by: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          world_id: string;
          author_id: string;
          scroll_text: string;
          is_canon?: boolean;
          approved_by?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          world_id?: string;
          author_id?: string;
          scroll_text?: string;
          is_canon?: boolean;
          approved_by?: string | null;
          created_at?: string;
        };
      };
      forks: {
        Row: {
          id: string;
          original_world_id: string;
          new_world_id: string;
          forker_id: string;
          fork_reason: string;
        };
        Insert: {
          id?: string;
          original_world_id: string;
          new_world_id: string;
          forker_id: string;
          fork_reason?: string;
        };
        Update: {
          id?: string;
          original_world_id?: string;
          new_world_id?: string;
          forker_id?: string;
          fork_reason?: string;
        };
      };
      community_posts: {
        Row: {
          id: string;
          world_id: string;
          author_id: string;
          title: string;
          content: string;
          upvotes: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          world_id: string;
          author_id: string;
          title: string;
          content: string;
          upvotes?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          world_id?: string;
          author_id?: string;
          title?: string;
          content?: string;
          upvotes?: number;
          created_at?: string;
        };
      };
      community_comments: {
        Row: {
          id: string;
          post_id: string;
          author_id: string;
          comment_text: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          post_id: string;
          author_id: string;
          comment_text: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          post_id?: string;
          author_id?: string;
          comment_text?: string;
          created_at?: string;
        };
      };
    };
  };
};