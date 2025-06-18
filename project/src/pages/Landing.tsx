import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../lib/supabase';
import { Globe, Users, Scroll, GitBranch } from 'lucide-react';

interface World {
  id: string;
  title: string;
  description: string;
  created_at: string;
  creator: {
    username: string;
  };
  inhabitants_count: number;
  canon_scrolls_count: number;
}

export function Landing() {
  const { user } = useAuth();
  const [featuredWorlds, setFeaturedWorlds] = useState<World[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFeaturedWorlds() {
      try {
        // First get the worlds with creator info
        const { data: worldsData, error: worldsError } = await supabase
          .from('worlds')
          .select(`
            *,
            creator:users!creator_id(username)
          `)
          .order('created_at', { ascending: false })
          .limit(6);

        if (worldsError) throw worldsError;

        // Then get the inhabitant counts and canon scroll counts for each world
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

        setFeaturedWorlds(worldsWithCounts);
      } catch (error) {
        console.error('Error fetching worlds:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchFeaturedWorlds();
  }, []);

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <div className="text-center py-16">
        <h1 className="text-5xl font-bold text-white mb-6">
          Build Worlds. Tell Stories. Create Legends.
        </h1>
        <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
          Paracosm is a collaborative platform where imagination meets mythology. 
          Create fictional universes with unique laws, inhabit them with others, 
          and watch your stories evolve through collective storytelling.
        </p>
        <div className="flex justify-center space-x-4">
          {user ? (
            <>
              <Link
                to="/create-world"
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors"
              >
                Create Your World
              </Link>
              <Link
                to="/profile"
                className="bg-gray-700 hover:bg-gray-600 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors"
              >
                Your Profile
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/signup"
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors"
              >
                Start Creating
              </Link>
              <Link
                to="/login"
                className="bg-gray-700 hover:bg-gray-600 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors"
              >
                Explore Worlds
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Features */}
      <div className="grid md:grid-cols-4 gap-8">
        <div className="text-center p-6 bg-gray-800 rounded-lg">
          <Globe className="h-12 w-12 text-indigo-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-white mb-2">Create Worlds</h3>
          <p className="text-gray-300">Define unique laws and rules that govern your fictional universe</p>
        </div>
        <div className="text-center p-6 bg-gray-800 rounded-lg">
          <Users className="h-12 w-12 text-amber-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-white mb-2">Join Communities</h3>
          <p className="text-gray-300">Take on roles and collaborate with other world-builders</p>
        </div>
        <div className="text-center p-6 bg-gray-800 rounded-lg">
          <Scroll className="h-12 w-12 text-green-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-white mb-2">Write Lore</h3>
          <p className="text-gray-300">Submit scrolls and questions to expand world mythology</p>
        </div>
        <div className="text-center p-6 bg-gray-800 rounded-lg">
          <GitBranch className="h-12 w-12 text-purple-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-white mb-2">Fork & Remix</h3>
          <p className="text-gray-300">Create variations of existing worlds with your own interpretation</p>
        </div>
      </div>

      {/* Featured Worlds */}
      <div>
        <h2 className="text-3xl font-bold text-white mb-8 text-center">Featured Worlds</h2>
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto"></div>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredWorlds.map((world) => (
              <Link
                key={world.id}
                to={`/world/${world.id}`}
                className="block bg-gray-800 rounded-lg p-6 hover:bg-gray-750 transition-colors border border-gray-700 hover:border-indigo-500"
              >
                <h3 className="text-xl font-semibold text-white mb-2">{world.title}</h3>
                <p className="text-gray-300 mb-4 line-clamp-3">{world.description}</p>
                <div className="flex justify-between items-center text-sm text-gray-400">
                  <span>By {world.creator?.username}</span>
                  <div className="flex space-x-3">
                    <span>{world.inhabitants_count} inhabitants</span>
                    <span>{world.canon_scrolls_count} lore</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}