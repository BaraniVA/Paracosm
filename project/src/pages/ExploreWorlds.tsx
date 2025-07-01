import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../lib/supabase';
import { Globe, Users, Scroll, Search, Filter, Calendar, ArrowUp, Star, Compass, BookOpen } from 'lucide-react';
import { UserLink } from '../components/UserLink';

interface World {
  id: string;
  title: string;
  description: string;
  created_at: string;  creator: {
    id: string;
    username: string;
  };
  parent_world?: {
    id: string;
    title: string;
    creator: {
      id: string;
      username: string;
    };
  };
  inhabitants_count: number;
  canon_scrolls_count: number;
  questions_count: number;
  community_posts_count: number;
}

type SortOption = 'newest' | 'oldest' | 'most_popular' | 'most_active';

export function ExploreWorlds() {
  const { user } = useAuth();
  const [worlds, setWorlds] = useState<World[]>([]);
  const [filteredWorlds, setFilteredWorlds] = useState<World[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchWorlds();
  }, []);

  useEffect(() => {
    filterAndSortWorlds();
  }, [worlds, searchTerm, sortBy]);

  const fetchWorlds = async () => {
    try {
      // Use the optimized database function if available, otherwise fallback to current method
      let worldsData;
      
      try {
        // Try to use the optimized function first
        const { data, error } = await supabase
          .rpc('get_worlds_with_stats', {
            limit_count: 50,
            offset_count: 0,
            search_term: null
          });
        
        if (!error && data) {
          worldsData = data.map((world: any) => ({
            ...world,
            creator: {
              id: world.creator_id,
              username: world.creator_username
            }
          }));
        }
      } catch (rpcError) {
        console.log('RPC function not available, falling back to direct queries');
        // Fallback to original method
        const { data, error: worldsError } = await supabase
          .from('worlds')
          .select(`
            *,
            creator:users!creator_id(id, username)
          `)
          .order('created_at', { ascending: false })
          .limit(50);

        if (worldsError) throw worldsError;
        worldsData = data;
      }

      if (!worldsData) {
        setWorlds([]);
        return;
      }

      // If we have computed columns, use them directly
      if (worldsData[0] && 'inhabitants_count' in worldsData[0]) {
        // Data already has computed counts
        const worldsWithCounts = await Promise.all(
          worldsData.map(async (world: any) => {
            // Only fetch parent world info if needed
            let parent_world = null;
            if (world.origin_world_id) {
              const { data: parentWorldData } = await supabase
                .from('worlds')
                .select(`
                  id,
                  title,
                  creator:users!creator_id(id, username)
                `)
                .eq('id', world.origin_world_id)
                .single();
              
              parent_world = parentWorldData;
            }

            return { 
              ...world, 
              parent_world,
              // Use computed columns if available, otherwise default to 0
              inhabitants_count: world.inhabitants_count || 0,
              canon_scrolls_count: world.canon_scrolls_count || 0,
              questions_count: world.questions_count || 0,
              community_posts_count: world.community_posts_count || 0
            };
          })
        );
        setWorlds(worldsWithCounts);
      } else {
        // Fallback to individual count queries (original method)
        const worldsWithCounts = await Promise.all(
          worldsData.map(async (world: any) => {
            const [
              { count: inhabitantCount },
              { count: canonScrollCount },
              { count: questionsCount },
              { count: communityPostsCount }
            ] = await Promise.all([
              supabase
                .from('inhabitants')
                .select('*', { count: 'exact', head: true })
                .eq('world_id', world.id),
              supabase
                .from('scrolls')
                .select('*', { count: 'exact', head: true })
                .eq('world_id', world.id)
                .eq('is_canon', true),
              supabase
                .from('questions')
                .select('*', { count: 'exact', head: true })
                .eq('world_id', world.id),
              supabase
                .from('community_posts')
                .select('*', { count: 'exact', head: true })
                .eq('world_id', world.id)
            ]);

            // Fetch parent world info if this is a fork
            let parent_world = null;
            if (world.origin_world_id) {
              const { data: parentWorldData } = await supabase
                .from('worlds')
                .select(`
                  id,
                  title,
                  creator:users!creator_id(id, username)
                `)
                .eq('id', world.origin_world_id)
                .single();
              
              parent_world = parentWorldData;
            }

            return { 
              ...world, 
              parent_world,
              inhabitants_count: inhabitantCount || 0,
              canon_scrolls_count: canonScrollCount || 0,
              questions_count: questionsCount || 0,
              community_posts_count: communityPostsCount || 0
            };
          })
        );
        setWorlds(worldsWithCounts);
      }
    } catch (error) {
      console.error('Error fetching worlds:', error);
      // Set empty array so the page still renders
      setWorlds([]);
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortWorlds = () => {
    let filtered = worlds;

    // Apply search filter
    if (searchTerm.trim()) {
      filtered = filtered.filter(world =>
        world.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        world.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        world.creator.username.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply sorting
    switch (sortBy) {
      case 'newest':
        filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        break;
      case 'oldest':
        filtered.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
        break;
      case 'most_popular':
        filtered.sort((a, b) => b.inhabitants_count - a.inhabitants_count);
        break;
      case 'most_active':
        filtered.sort((a, b) => 
          (b.community_posts_count + b.questions_count + b.canon_scrolls_count) - 
          (a.community_posts_count + a.questions_count + a.canon_scrolls_count)
        );
        break;
    }

    setFilteredWorlds(filtered);
  };

  const getSortLabel = (option: SortOption) => {
    switch (option) {
      case 'newest': return 'Newest First';
      case 'oldest': return 'Oldest First';
      case 'most_popular': return 'Most Popular';
      case 'most_active': return 'Most Active';
    }
  };

  const getActivityScore = (world: World) => {
    return world.community_posts_count + world.questions_count + world.canon_scrolls_count;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="flex items-center justify-center mb-4">
          <Compass className="h-8 w-8 text-indigo-400 mr-3" />
          <h1 className="text-3xl sm:text-4xl font-bold text-white">Explore Worlds</h1>
        </div>
        <p className="text-xl text-gray-300 max-w-3xl mx-auto">
          Discover incredible fictional universes created by our community of world-builders
        </p>
      </div>

      {/* Search and Filters */}
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search worlds, descriptions, or creators..."
              className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          {/* Sort Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white hover:bg-gray-600 transition-colors"
            >
              <Filter className="h-5 w-5 mr-2" />
              {getSortLabel(sortBy)}
              <ArrowUp className={`h-4 w-4 ml-2 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
            </button>

            {showFilters && (
              <div className="absolute top-full right-0 mt-2 bg-gray-700 border border-gray-600 rounded-lg shadow-lg z-10 min-w-[200px]">
                {(['newest', 'oldest', 'most_popular', 'most_active'] as SortOption[]).map((option) => (
                  <button
                    key={option}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSortBy(option);
                      setShowFilters(false);
                      
                      // Immediately apply the new sort to avoid delay
                      let filtered = worlds;
                      if (searchTerm.trim()) {
                        filtered = filtered.filter(world =>
                          world.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          world.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          world.creator.username.toLowerCase().includes(searchTerm.toLowerCase())
                        );
                      }
                      
                      switch (option) {
                        case 'newest':
                          filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
                          break;
                        case 'oldest':
                          filtered.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
                          break;
                        case 'most_popular':
                          filtered.sort((a, b) => b.inhabitants_count - a.inhabitants_count);
                          break;
                        case 'most_active':
                          filtered.sort((a, b) => 
                            (b.community_posts_count + b.questions_count + b.canon_scrolls_count) - 
                            (a.community_posts_count + a.questions_count + a.canon_scrolls_count)
                          );
                          break;
                      }
                      
                      setFilteredWorlds(filtered);
                    }}
                    className={`w-full px-4 py-3 text-left hover:bg-gray-600 transition-colors ${
                      sortBy === option ? 'bg-indigo-600 text-white' : 'text-gray-300'
                    }`}
                  >
                    {getSortLabel(option)}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Results Count */}
        <div className="mt-4 text-gray-400 text-sm">
          {searchTerm ? (
            <>Showing {filteredWorlds.length} of {worlds.length} worlds matching "{searchTerm}"</>
          ) : (
            <>Showing all {worlds.length} worlds</>
          )}
        </div>
      </div>

      {/* Worlds Grid */}
      {filteredWorlds.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredWorlds.map((world) => (
            <Link
              key={world.id}
              to={user ? `/world/${world.id}` : '/login'}
              className="group block bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-indigo-500 transition-all duration-200 transform hover:scale-105"
            >
              {/* World Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1 min-w-0">
                  {/* Parent World Reference */}
                  {world.parent_world && (
                    <div className="mb-2 text-xs text-gray-500">
                      Fork of: <span className="text-indigo-400">{world.parent_world.title}</span>
                    </div>
                  )}
                  <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-indigo-400 transition-colors line-clamp-2">
                    {world.title}
                  </h3>                  <div className="flex items-center space-x-2 text-gray-400 text-sm mb-3">
                    <Users className="h-4 w-4 flex-shrink-0" />
                    <span className="truncate">By <UserLink userId={world.creator.id} username={world.creator.username} /></span>
                  </div>
                </div>
                
                {/* Popularity Indicator */}
                {world.inhabitants_count > 5 && (
                  <div className="flex items-center space-x-1 bg-indigo-600/20 text-indigo-400 px-2 py-1 rounded-full text-xs">
                    <Star className="h-3 w-3" />
                    <span>Popular</span>
                  </div>
                )}
              </div>

              {/* Description */}
              <p className="text-gray-300 text-sm leading-relaxed mb-4 line-clamp-3">
                {world.description}
              </p>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="flex items-center space-x-2 text-gray-400 text-sm">
                  <Users className="h-4 w-4 text-amber-400" />
                  <span>{world.inhabitants_count} inhabitants</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-400 text-sm">
                  <Scroll className="h-4 w-4 text-green-400" />
                  <span>{world.canon_scrolls_count} lore</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-400 text-sm">
                  <BookOpen className="h-4 w-4 text-purple-400" />
                  <span>{world.questions_count} questions</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-400 text-sm">
                  <Globe className="h-4 w-4 text-blue-400" />
                  <span>{getActivityScore(world)} activity</span>
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-700">
                <div className="flex items-center space-x-1 text-gray-400 text-xs">
                  <Calendar className="h-3 w-3" />
                  <span>{new Date(world.created_at).toLocaleDateString()}</span>
                </div>
                
                <div className="text-indigo-400 text-sm font-medium group-hover:text-indigo-300 transition-colors">
                  {user ? 'Explore →' : 'Login to Explore →'}
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <Globe className="h-16 w-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">
            {searchTerm ? 'No worlds found' : 'No worlds created yet'}
          </h3>
          <p className="text-gray-400 mb-6">
            {searchTerm 
              ? `No worlds match your search for "${searchTerm}". Try different keywords.`
              : 'Be the first to create an amazing world!'
            }
          </p>
          {searchTerm ? (
            <button
              onClick={() => setSearchTerm('')}
              className="px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              Clear Search
            </button>
          ) : user ? (
            <Link
              to="/create-world"
              className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
            >
              <Globe className="h-5 w-5 mr-2" />
              Create Your First World
            </Link>
          ) : (
            <Link
              to="/signup"
              className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
            >
              Sign Up to Create Worlds
            </Link>
          )}
        </div>
      )}

      {/* Call to Action */}
      {filteredWorlds.length > 0 && (
        <div className="bg-gradient-to-r from-indigo-900/30 to-purple-900/30 rounded-xl p-8 border border-indigo-500/20 text-center">
          <h3 className="text-2xl font-bold text-white mb-4">Ready to Create Your Own World?</h3>
          <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
            Join these amazing creators and build your own fictional universe with unique laws, roles, and mythology.
          </p>
          {user ? (
            <Link
              to="/create-world"
              className="inline-flex items-center px-8 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-semibold"
            >
              <Globe className="h-5 w-5 mr-2" />
              Create Your World
            </Link>
          ) : (
            <Link
              to="/signup"
              className="inline-flex items-center px-8 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-semibold"
            >
              Sign Up to Get Started
            </Link>
          )}
        </div>
      )}
    </div>
  );
}