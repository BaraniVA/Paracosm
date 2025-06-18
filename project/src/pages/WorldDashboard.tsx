import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../lib/supabase';
import { Users, MessageSquare, Scroll, GitBranch, Settings, Check, X, Trash2, ArrowUp } from 'lucide-react';

interface World {
  id: string;
  title: string;
  description: string;
  laws: string[];
  creator_id: string;
}

interface Question {
  id: string;
  question_text: string;
  upvotes: number;
  answer: string | null;
  created_at: string;
  author: { username: string };
}

interface ScrollItem {
  id: string;
  scroll_text: string;
  is_canon: boolean;
  created_at: string;
  author: { username: string };
}

interface Inhabitant {
  id: string;
  joined_at: string;
  user: { username: string };
  role: { name: string };
}

export function WorldDashboard() {
  const { worldId } = useParams<{ worldId: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('pending');
  const [world, setWorld] = useState<World | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [allScrolls, setAllScrolls] = useState<ScrollItem[]>([]);
  const [inhabitants, setInhabitants] = useState<Inhabitant[]>([]);
  const [loading, setLoading] = useState(true);
  const [answerInputs, setAnswerInputs] = useState<{ [key: string]: string }>({});
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (!worldId || !user) return;
    fetchWorldData();
  }, [worldId, user]);

  const fetchWorldData = async () => {
    if (!user) {
      setError('User not authenticated');
      setLoading(false);
      return;
    }

    try {
      console.log('Fetching world data for user:', user.id, 'world:', worldId);
      
      // Fetch world
      const { data: worldData, error: worldError } = await supabase
        .from('worlds')
        .select('*')
        .eq('id', worldId)
        .single();

      if (worldError) {
        console.error('World fetch error:', worldError);
        throw worldError;
      }

      console.log('World data:', worldData);
      console.log('Creator ID:', worldData.creator_id);
      console.log('Current user ID:', user.id);
      console.log('IDs match:', worldData.creator_id === user.id);

      // Check if user is creator
      if (worldData.creator_id !== user.id) {
        console.log('User is not creator, redirecting to world view');
        navigate(`/world/${worldId}`);
        return;
      }

      setWorld(worldData);

      // Fetch questions
      const { data: questionsData, error: questionsError } = await supabase
        .from('questions')
        .select(`
          *,
          author:users!author_id(username)
        `)
        .eq('world_id', worldId)
        .order('created_at', { ascending: false });

      if (questionsError) throw questionsError;
      setQuestions(questionsData || []);

      // Fetch ALL scrolls (both pending and canon) for the dashboard
      const { data: scrollsData, error: scrollsError } = await supabase
        .from('scrolls')
        .select(`
          *,
          author:users!author_id(username)
        `)
        .eq('world_id', worldId)
        .order('created_at', { ascending: false });

      if (scrollsError) throw scrollsError;
      setAllScrolls(scrollsData || []);

      // Fetch inhabitants
      const { data: inhabitantsData, error: inhabitantsError } = await supabase
        .from('inhabitants')
        .select(`
          *,
          user:users!user_id(username),
          role:roles!role_id(name)
        `)
        .eq('world_id', worldId)
        .order('joined_at', { ascending: false });

      if (inhabitantsError) throw inhabitantsError;
      setInhabitants(inhabitantsData || []);
    } catch (error: any) {
      console.error('Error fetching world data:', error);
      setError(error.message || 'Failed to load world data');
    } finally {
      setLoading(false);
    }
  };

  const answerQuestion = async (questionId: string, answer: string) => {
    try {
      const { error } = await supabase
        .from('questions')
        .update({
          answer,
          answered_by: user?.id,
        })
        .eq('id', questionId);

      if (error) throw error;
      
      // Clear the input
      setAnswerInputs(prev => ({ ...prev, [questionId]: '' }));
      
      // Refresh data
      fetchWorldData();
    } catch (error) {
      console.error('Error answering question:', error);
    }
  };

  const approveScroll = async (scrollId: string) => {
    try {
      const { error } = await supabase
        .from('scrolls')
        .update({
          is_canon: true,
          approved_by: user?.id,
        })
        .eq('id', scrollId);

      if (error) throw error;
      fetchWorldData();
    } catch (error) {
      console.error('Error approving scroll:', error);
    }
  };

  const rejectScroll = async (scrollId: string) => {
    try {
      const { error } = await supabase
        .from('scrolls')
        .delete()
        .eq('id', scrollId);

      if (error) throw error;
      fetchWorldData();
    } catch (error) {
      console.error('Error rejecting scroll:', error);
    }
  };

  const removeFromCanon = async (scrollId: string) => {
    try {
      const { error } = await supabase
        .from('scrolls')
        .update({
          is_canon: false,
          approved_by: null,
        })
        .eq('id', scrollId);

      if (error) throw error;
      fetchWorldData();
    } catch (error) {
      console.error('Error removing from canon:', error);
    }
  };

  const deleteScroll = async (scrollId: string) => {
    if (!confirm('Are you sure you want to delete this scroll? This action cannot be undone.')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('scrolls')
        .delete()
        .eq('id', scrollId);

      if (error) throw error;
      fetchWorldData();
    } catch (error) {
      console.error('Error deleting scroll:', error);
    }
  };

  const handleAnswerInputChange = (questionId: string, value: string) => {
    setAnswerInputs(prev => ({ ...prev, [questionId]: value }));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-indigo-500 border-t-transparent"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-400 mb-4">{error}</div>
        <button
          onClick={() => navigate('/')}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
        >
          Go Home
        </button>
      </div>
    );
  }

  if (!world) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 mb-4">World not found or you don't have access to this dashboard</div>
        <button
          onClick={() => navigate('/')}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
        >
          Go Home
        </button>
      </div>
    );
  }

  const unansweredQuestions = questions.filter(q => !q.answer);
  const canonScrolls = allScrolls.filter(s => s.is_canon);
  const pendingScrolls = allScrolls.filter(s => !s.is_canon);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">{world.title}</h1>
          <p className="text-gray-400 text-sm">Creator Dashboard</p>
        </div>
        <button
          onClick={() => navigate(`/world/${worldId}`)}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium"
        >
          View Public World
        </button>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-gray-800 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-white">{inhabitants.length}</div>
          <div className="text-gray-400 text-sm">Inhabitants</div>
        </div>
        <div className="bg-gray-800 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-orange-400">{pendingScrolls.length}</div>
          <div className="text-gray-400 text-sm">Pending Scrolls</div>
        </div>
        <div className="bg-gray-800 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-green-400">{canonScrolls.length}</div>
          <div className="text-gray-400 text-sm">Canon Lore</div>
        </div>
        <div className="bg-gray-800 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-blue-400">{unansweredQuestions.length}</div>
          <div className="text-gray-400 text-sm">Unanswered</div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-gray-700">
        <nav className="flex space-x-8">
          {[
            { id: 'pending', label: 'Pending Review', count: pendingScrolls.length, color: 'orange' },
            { id: 'canon', label: 'Canon Lore', count: canonScrolls.length, color: 'green' },
            { id: 'questions', label: 'Questions', count: unansweredQuestions.length, color: 'blue' },
            { id: 'inhabitants', label: 'Inhabitants', count: inhabitants.length, color: 'gray' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center px-1 py-3 font-medium text-sm border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-indigo-500 text-indigo-400'
                  : 'border-transparent text-gray-400 hover:text-gray-300'
              }`}
            >
              {tab.label}
              {tab.count > 0 && (
                <span className={`ml-2 px-2 py-0.5 text-xs rounded-full ${
                  tab.color === 'orange' ? 'bg-orange-600 text-white' :
                  tab.color === 'green' ? 'bg-green-600 text-white' :
                  tab.color === 'blue' ? 'bg-blue-600 text-white' :
                  'bg-gray-600 text-white'
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="space-y-4">
        {activeTab === 'pending' && (
          <div>
            {pendingScrolls.length === 0 ? (
              <div className="text-center py-12">
                <Scroll className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400">No scrolls pending review</p>
              </div>
            ) : (
              <div className="space-y-3">
                {pendingScrolls.map((scroll) => (
                  <div key={scroll.id} className="bg-gray-800 rounded-lg p-4 border-l-4 border-orange-500">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-orange-600 rounded-full flex items-center justify-center">
                          <span className="text-white text-sm font-medium">
                            {scroll.author.username[0].toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <p className="text-white font-medium">{scroll.author.username}</p>
                          <p className="text-gray-400 text-sm">
                            {new Date(scroll.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => approveScroll(scroll.id)}
                          className="flex items-center px-3 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                        >
                          <Check className="h-4 w-4 mr-1" />
                          Approve
                        </button>
                        <button
                          onClick={() => rejectScroll(scroll.id)}
                          className="flex items-center px-3 py-1.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
                        >
                          <X className="h-4 w-4 mr-1" />
                          Reject
                        </button>
                      </div>
                    </div>
                    <p className="text-gray-200 leading-relaxed">{scroll.scroll_text}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'canon' && (
          <div>
            {canonScrolls.length === 0 ? (
              <div className="text-center py-12">
                <Scroll className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400">No canon lore yet</p>
              </div>
            ) : (
              <div className="space-y-3">
                {canonScrolls.map((scroll) => (
                  <div key={scroll.id} className="bg-gray-800 rounded-lg p-4 border-l-4 border-green-500">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                          <span className="text-white text-sm font-medium">
                            {scroll.author.username[0].toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <p className="text-white font-medium">{scroll.author.username}</p>
                          <p className="text-gray-400 text-sm">
                            {new Date(scroll.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <span className="px-2 py-1 bg-green-600 text-white text-xs rounded-full font-medium">
                          Canon
                        </span>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => removeFromCanon(scroll.id)}
                          className="flex items-center px-3 py-1.5 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors text-sm font-medium"
                        >
                          <X className="h-4 w-4 mr-1" />
                          Remove
                        </button>
                        <button
                          onClick={() => deleteScroll(scroll.id)}
                          className="flex items-center px-3 py-1.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Delete
                        </button>
                      </div>
                    </div>
                    <p className="text-gray-200 leading-relaxed">{scroll.scroll_text}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'questions' && (
          <div>
            {unansweredQuestions.length === 0 ? (
              <div className="text-center py-12">
                <MessageSquare className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400">No unanswered questions</p>
              </div>
            ) : (
              <div className="space-y-4">
                {unansweredQuestions.map((question) => (
                  <div key={question.id} className="bg-gray-800 rounded-lg p-4 border-l-4 border-blue-500">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                          <span className="text-white text-sm font-medium">
                            {question.author.username[0].toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <p className="text-white font-medium">{question.author.username}</p>
                          <p className="text-gray-400 text-sm">
                            {new Date(question.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 text-gray-400">
                        <ArrowUp className="h-4 w-4" />
                        <span className="text-sm">{question.upvotes}</span>
                      </div>
                    </div>
                    <p className="text-gray-200 mb-4 leading-relaxed">{question.question_text}</p>
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        placeholder="Write your answer..."
                        value={answerInputs[question.id] || ''}
                        onChange={(e) => handleAnswerInputChange(question.id, e.target.value)}
                        className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter' && answerInputs[question.id]?.trim()) {
                            answerQuestion(question.id, answerInputs[question.id].trim());
                          }
                        }}
                      />
                      <button
                        onClick={() => {
                          if (answerInputs[question.id]?.trim()) {
                            answerQuestion(question.id, answerInputs[question.id].trim());
                          }
                        }}
                        disabled={!answerInputs[question.id]?.trim()}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                      >
                        Answer
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'inhabitants' && (
          <div>
            {inhabitants.length === 0 ? (
              <div className="text-center py-12">
                <Users className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400">No inhabitants yet</p>
              </div>
            ) : (
              <div className="bg-gray-800 rounded-lg overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-700">
                  <h3 className="text-lg font-medium text-white">World Inhabitants</h3>
                </div>
                <div className="divide-y divide-gray-700">
                  {inhabitants.map((inhabitant) => (
                    <div key={inhabitant.id} className="px-6 py-4 flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center">
                          <span className="text-white font-medium">
                            {inhabitant.user.username[0].toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <p className="text-white font-medium">{inhabitant.user.username}</p>
                          <p className="text-gray-400 text-sm">{inhabitant.role.name}</p>
                        </div>
                      </div>
                      <p className="text-gray-400 text-sm">
                        Joined {new Date(inhabitant.joined_at).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}