import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../lib/supabase';
import { Globe, Users, Scroll, MessageSquare, Calendar } from 'lucide-react';

interface World {
  id: string;
  title: string;
  description: string;
  created_at: string;
  inhabitants_count: number;
  canon_scrolls_count: number;
}

interface Inhabitant {
  world: {
    id: string;
    title: string;
  };
  role: {
    name: string;
  };
  joined_at: string;
}

interface UserScroll {
  id: string;
  scroll_text: string;
  is_canon: boolean;
  created_at: string;
  world: {
    title: string;
  };
}

interface UserQuestion {
  id: string;
  question_text: string;
  upvotes: number;
  answer: string | null;
  created_at: string;
  world: {
    title: string;
  };
}

export function Profile() {
  const { user } = useAuth();
  const [userWorlds, setUserWorlds] = useState<World[]>([]);
  const [joinedWorlds, setJoinedWorlds] = useState<Inhabitant[]>([]);
  const [userScrolls, setUserScrolls] = useState<UserScroll[]>([]);
  const [userQuestions, setUserQuestions] = useState<UserQuestion[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchUserData();
    }
  }, [user]);

  const fetchUserData = async () => {
    if (!user) return;

    try {
      // Fetch user's created worlds
      const { data: worldsData, error: worldsError } = await supabase
        .from('worlds')
        .select('*')
        .eq('creator_id', user.id)
        .order('created_at', { ascending: false });

      if (worldsError) throw worldsError;

      // Get inhabitant counts and canon scroll counts for each world
      const worldsWithCounts = await Promise.all(
        (worldsData || []).map(async (world) => {
          // Get inhabitant count
          const { count: inhabitantCount, error: countError } = await supabase
            .from('inhabitants')
            .select('*', { count: 'exact', head: true })
            .eq('world_id', world.id);

          if (countError) {
            console.error('Error counting inhabitants:', countError);
          }

          // Get canon scroll count
          const { count: canonScrollCount, error: scrollError } = await supabase
            .from('scrolls')
            .select('*', { count: 'exact', head: true })
            .eq('world_id', world.id)
            .eq('is_canon', true);

          if (scrollError) {
            console.error('Error counting canon scrolls:', scrollError);
          }

          return { 
            ...world, 
            inhabitants_count: inhabitantCount || 0,
            canon_scrolls_count: canonScrollCount || 0
          };
        })
      );

      setUserWorlds(worldsWithCounts);

      // Fetch worlds user has joined
      const { data: inhabitantsData, error: inhabitantsError } = await supabase
        .from('inhabitants')
        .select(`
          joined_at,
          world:worlds!world_id(id, title),
          role:roles!role_id(name)
        `)
        .eq('user_id', user.id)
        .order('joined_at', { ascending: false });

      if (inhabitantsError) throw inhabitantsError;
      setJoinedWorlds(inhabitantsData || []);

      // Fetch user's scrolls
      const { data: scrollsData, error: scrollsError } = await supabase
        .from('scrolls')
        .select(`
          *,
          world:worlds!world_id(title)
        `)
        .eq('author_id', user.id)
        .order('created_at', { ascending: false });

      if (scrollsError) throw scrollsError;
      setUserScrolls(scrollsData || []);

      // Fetch user's questions
      const { data: questionsData, error: questionsError } = await supabase
        .from('questions')
        .select(`
          *,
          world:worlds!world_id(title)
        `)
        .eq('author_id', user.id)
        .order('created_at', { ascending: false });

      if (questionsError) throw questionsError;
      setUserQuestions(questionsData || []);
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400">Please log in to view your profile</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  const canonScrolls = userScrolls.filter(s => s.is_canon);
  const answeredQuestions = userQuestions.filter(q => q.answer);

  return (
    <div className="space-y-8">
      {/* Profile Header */}
      <div className="bg-gray-800 rounded-lg p-6">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-indigo-600 rounded-full flex items-center justify-center">
            <span className="text-2xl font-bold text-white">
              {user.user_metadata?.username?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase()}
            </span>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">
              {user.user_metadata?.username || 'User'}
            </h1>
            <p className="text-gray-400">{user.email}</p>
            <p className="text-gray-400 text-sm">
              <Calendar className="h-4 w-4 inline mr-1" />
              Joined {new Date(user.created_at).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-4 gap-4">
        <div className="bg-gray-800 rounded-lg p-4 text-center">
          <Globe className="h-8 w-8 text-indigo-400 mx-auto mb-2" />
          <div className="text-2xl font-bold text-white">{userWorlds.length}</div>
          <div className="text-gray-400 text-sm">Worlds Created</div>
        </div>
        <div className="bg-gray-800 rounded-lg p-4 text-center">
          <Users className="h-8 w-8 text-amber-400 mx-auto mb-2" />
          <div className="text-2xl font-bold text-white">{joinedWorlds.length}</div>
          <div className="text-gray-400 text-sm">Worlds Joined</div>
        </div>
        <div className="bg-gray-800 rounded-lg p-4 text-center">
          <Scroll className="h-8 w-8 text-green-400 mx-auto mb-2" />
          <div className="text-2xl font-bold text-white">{canonScrolls.length}</div>
          <div className="text-gray-400 text-sm">Canon Scrolls</div>
        </div>
        <div className="bg-gray-800 rounded-lg p-4 text-center">
          <MessageSquare className="h-8 w-8 text-purple-400 mx-auto mb-2" />
          <div className="text-2xl font-bold text-white">{answeredQuestions.length}</div>
          <div className="text-gray-400 text-sm">Answered Questions</div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Your Worlds */}
        <div className="bg-gray-800 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-white mb-4">
            <Globe className="h-5 w-5 inline mr-2" />
            Your Worlds
          </h2>
          <div className="space-y-3">
            {userWorlds.map((world) => (
              <Link
                key={world.id}
                to={`/world/${world.id}`}
                className="block p-3 rounded-md hover:bg-gray-600 transition-colors"
              >
                <h3 className="font-medium text-white">{world.title}</h3>
                <p className="text-gray-300 text-sm line-clamp-2">{world.description}</p>
                <div className="flex justify-between items-center mt-2 text-xs text-gray-400">
                  <div className="flex space-x-3">
                    <span>{world.inhabitants_count} inhabitants</span>
                    <span>{world.canon_scrolls_count} lore</span>
                  </div>
                  <span>{new Date(world.created_at).toLocaleDateString()}</span>
                </div>
              </Link>
            ))}
            {userWorlds.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-400 mb-4">You haven't created any worlds yet</p>
                <Link
                  to="/create-world"
                  className="inline-block px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                >
                  Create Your First World
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Worlds You Joined */}
        <div className="bg-gray-800 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-white mb-4">
            <Users className="h-5 w-5 inline mr-2" />
            Worlds You Joined
          </h2>
          <div className="space-y-3">
            {joinedWorlds.map((inhabitant, index) => (
              <Link
                key={index}
                to={`/world/${inhabitant.world.id}`}
                className="block p-3 rounded-md hover:bg-gray-600 transition-colors"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium text-white">{inhabitant.world.title}</h3>
                    <p className="text-indigo-400 text-sm">Role: {inhabitant.role.name}</p>
                  </div>
                  <span className="text-gray-400 text-xs">
                    {new Date(inhabitant.joined_at).toLocaleDateString()}
                  </span>
                </div>
              </Link>
            ))}
            {joinedWorlds.length === 0 && (
              <p className="text-gray-400 text-center py-8">
                You haven't joined any worlds yet
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Your Scrolls */}
        <div className="bg-gray-800 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-white mb-4">
            <Scroll className="h-5 w-5 inline mr-2" />
            Your Scrolls
          </h2>
          <div className="space-y-3">
            {userScrolls.map((scroll) => (
              <div key={scroll.id} className="p-3 rounded-md">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-indigo-400 text-sm">{scroll.world.title}</span>
                  {scroll.is_canon && (
                    <span className="px-2 py-1 bg-green-600 text-white text-xs rounded-full">
                      Canon
                    </span>
                  )}
                </div>
                <p className="text-gray-200 text-sm">{scroll.scroll_text}</p>
                <p className="text-gray-400 text-xs mt-2">
                  {new Date(scroll.created_at).toLocaleDateString()}
                </p>
              </div>
            ))}
            {userScrolls.length === 0 && (
              <p className="text-gray-400 text-center py-8">
                You haven't submitted any scrolls yet
              </p>
            )}
          </div>
        </div>

        {/* Your Questions */}
        <div className="bg-gray-800 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-white mb-4">
            <MessageSquare className="h-5 w-5 inline mr-2" />
            Your Questions
          </h2>
          <div className="space-y-3">
            {userQuestions.map((question) => (
              <div key={question.id} className="p-3 rounded-md">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-indigo-400 text-sm">{question.world.title}</span>
                  <div className="flex items-center space-x-2 text-xs text-gray-400">
                    <span>{question.upvotes} upvotes</span>
                    {question.answer && (
                      <span className="text-green-400">Answered</span>
                    )}
                  </div>
                </div>
                <p className="text-gray-200 text-sm">{question.question_text}</p>
                {question.answer && (
                  <div className="mt-2 p-2 rounded text-sm text-gray-300">
                    {question.answer}
                  </div>
                )}
                <p className="text-gray-400 text-xs mt-2">
                  {new Date(question.created_at).toLocaleDateString()}
                </p>
              </div>
            ))}
            {userQuestions.length === 0 && (
              <p className="text-gray-400 text-center py-8">
                You haven't asked any questions yet
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}