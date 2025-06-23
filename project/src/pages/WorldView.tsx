import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../lib/supabase';
import { ArrowUp, MessageSquare, Scroll, GitBranch, Settings, Users, Send, Plus, X, MessageCircle, BookOpen, ChevronDown, ChevronRight } from 'lucide-react';
import { WorldRecordCard } from '../components/WorldRecordCard';
import { WorldRecordModal } from '../components/WorldRecordModal';
import { CreateEditWorldRecordForm } from '../components/CreateEditWorldRecordForm';
import { TimelineView } from '../components/TimelineView';
import { CreateEditTimelineEntryForm } from '../components/CreateEditTimelineEntryForm';
import { VotingSystem } from '../components/VotingSystem';

interface World {
  id: string;
  title: string;
  description: string;
  laws: string[];
  creator_id: string;
  creator: { username: string };
}

interface Role {
  id: string;
  name: string;
  description: string;
  created_at?: string;
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

interface CommunityPost {
  id: string;
  title: string;
  content: string;
  upvotes: number;
  created_at: string;
  author: { username: string };
  comments_count: number;
}

interface WorldRecord {
  id: string;
  title: string;
  description: string;
  category: string;
  linked_to_type: string | null;
  linked_to_id: string | null;
  created_at: string;
}

interface TimelineEntry {
  id: string;
  era_title: string;
  year: string;
  event_title?: string;
  description: string;
  tag?: string;
  location?: string;
  roles_involved?: string[];
  is_private?: boolean;
  subnotes?: string[];
  created_at: string;
}

export function WorldView() {
  const { worldId } = useParams<{ worldId: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [world, setWorld] = useState<World | null>(null);
  const [roles, setRoles] = useState<Role[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [scrolls, setScrolls] = useState<ScrollItem[]>([]);
  const [communityPosts, setCommunityPosts] = useState<CommunityPost[]>([]);
  const [worldRecords, setWorldRecords] = useState<WorldRecord[]>([]);  const [timelineEntries, setTimelineEntries] = useState<TimelineEntry[]>([]);  const [userRole, setUserRole] = useState<string | null>(null);
  const [userLastRoleCheck, setUserLastRoleCheck] = useState<string | null>(null);
  const [newRoles, setNewRoles] = useState<Role[]>([]);
  const [newQuestion, setNewQuestion] = useState('');
  const [newScroll, setNewScroll] = useState('');
  const [newPost, setNewPost] = useState({ title: '', content: '' });
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [showForkDialog, setShowForkDialog] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<WorldRecord | null>(null);
  const [showRecordForm, setShowRecordForm] = useState(false);
  const [editingRecord, setEditingRecord] = useState<WorldRecord | null>(null);
  const [showTimelineForm, setShowTimelineForm] = useState(false);
  const [editingTimelineEntry, setEditingTimelineEntry] = useState<TimelineEntry | null>(null);
  const [expandedCategories, setExpandedCategories] = useState<{ [key: string]: boolean }>({});
  const [forkData, setForkData] = useState({
    title: '',
    description: '',
    reason: '',
    laws: [] as string[],
    roles: [] as { name: string; description: string }[],
    starterQuestions: [] as string[]
  });

  useEffect(() => {
    if (!worldId) return;
    fetchWorldData();
  }, [worldId, user]);

  const fetchWorldData = async () => {
    try {
      // Fetch world
      const { data: worldData, error: worldError } = await supabase
        .from('worlds')
        .select(`
          *,
          creator:users!creator_id(username)
        `)
        .eq('id', worldId)
        .single();

      if (worldError) throw worldError;
      setWorld(worldData);

      // Initialize fork data with original world data
      setForkData(prev => ({
        ...prev,
        title: `${worldData.title} - Fork`,
        description: worldData.description,
        laws: [...worldData.laws]
      }));

      // Fetch roles
      const { data: rolesData, error: rolesError } = await supabase
        .from('roles')
        .select('*, created_at')
        .eq('world_id', worldId);

      if (rolesError) throw rolesError;
      setRoles(rolesData || []);

      // Initialize fork roles
      setForkData(prev => ({
        ...prev,
        roles: (rolesData || []).map(role => ({
          name: role.name,
          description: role.description
        }))
      }));      // Check if user has a role and when they joined
      if (user) {
        const { data: inhabitantData } = await supabase
          .from('inhabitants')
          .select('role_id, joined_at, last_role_check')
          .eq('world_id', worldId)
          .eq('user_id', user.id)
          .single();

        if (inhabitantData) {
          setUserRole(inhabitantData.role_id);
          setUserLastRoleCheck(inhabitantData.last_role_check);

          // Find new roles created after user's last role check (or joined_at if no last_role_check)
          const checkTimestamp = inhabitantData.last_role_check || inhabitantData.joined_at;
          const newRolesForUser = (rolesData || []).filter(role => 
            role.created_at && new Date(role.created_at) > new Date(checkTimestamp)
          );
          setNewRoles(newRolesForUser);
        } else {
          setUserRole(null);
          setUserLastRoleCheck(null);
          setNewRoles([]);
        }
      }

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

      // Fetch only canon scrolls for public view
      const { data: scrollsData, error: scrollsError } = await supabase
        .from('scrolls')
        .select(`
          *,
          author:users!author_id(username)
        `)
        .eq('world_id', worldId)
        .eq('is_canon', true)
        .order('created_at', { ascending: false });

      if (scrollsError) throw scrollsError;
      setScrolls(scrollsData || []);

      // Fetch community posts with comment counts
      const { data: postsData, error: postsError } = await supabase
        .from('community_posts')
        .select(`
          *,
          author:users!author_id(username)
        `)
        .eq('world_id', worldId)
        .order('created_at', { ascending: false });

      if (postsError) throw postsError;

      // Get comment counts for each post
      const postsWithCommentCounts = await Promise.all(
        (postsData || []).map(async (post) => {
          const { count: commentCount, error: countError } = await supabase
            .from('community_comments')
            .select('*', { count: 'exact', head: true })
            .eq('post_id', post.id);

          if (countError) {
            console.error('Error counting comments:', countError);
          }

          return { ...post, comments_count: commentCount || 0 };
        })
      );

      setCommunityPosts(postsWithCommentCounts);

      // Fetch world records
      const { data: recordsData, error: recordsError } = await supabase
        .from('world_records')
        .select('*')
        .eq('world_id', worldId)
        .order('created_at', { ascending: false });

      if (recordsError) throw recordsError;
      setWorldRecords(recordsData || []);

      // Fetch timeline entries
      const { data: timelineData, error: timelineError } = await supabase
        .from('timeline_entries')
        .select('*')
        .eq('world_id', worldId)
        .order('year', { ascending: true });

      if (timelineError) throw timelineError;
      setTimelineEntries(timelineData || []);
    } catch (error) {
      console.error('Error fetching world data:', error);
    } finally {
      setLoading(false);
    }
  };

  // World Records functions
  const createWorldRecord = async (data: any) => {
    if (!user) return;

    const { error } = await supabase
      .from('world_records')
      .insert([{ ...data, author_id: user.id }]);

    if (error) throw error;
    setShowRecordForm(false);
    fetchWorldData();
  };

  const updateWorldRecord = async (id: string, data: Partial<WorldRecord>) => {
    const { error } = await supabase
      .from('world_records')
      .update(data)
      .eq('id', id);

    if (error) throw error;
    fetchWorldData();
  };

  const deleteWorldRecord = async (id: string) => {
    const { error } = await supabase
      .from('world_records')
      .delete()
      .eq('id', id);

    if (error) throw error;
    fetchWorldData();
  };

  // Timeline functions
  const createTimelineEntry = async (data: any) => {
    if (!user) return;

    const { error } = await supabase
      .from('timeline_entries')
      .insert([{ ...data, author_id: user.id }]);

    if (error) throw error;
    setShowTimelineForm(false);
    setEditingTimelineEntry(null);
    fetchWorldData();
  };

  const updateTimelineEntry = async (data: any) => {
    if (!editingTimelineEntry) return;

    const { error } = await supabase
      .from('timeline_entries')
      .update(data)
      .eq('id', editingTimelineEntry.id);

    if (error) throw error;
    setShowTimelineForm(false);
    setEditingTimelineEntry(null);
    fetchWorldData();
  };

  const deleteTimelineEntry = async (id: string) => {
    const { error } = await supabase
      .from('timeline_entries')
      .delete()
      .eq('id', id);

    if (error) throw error;
    fetchWorldData();
  };

  const joinRole = async (roleId: string) => {
    if (!user || !worldId) return;

    try {
      const { error } = await supabase
        .from('inhabitants')
        .insert([
          {
            user_id: user.id,
            world_id: worldId,
            role_id: roleId,
          },
        ]);

      if (error) throw error;
      setUserRole(roleId);
    } catch (error) {
      console.error('Error joining role:', error);
    }
  };  const switchRole = async (newRoleId: string) => {
    if (!user || !worldId || !userRole) return;

    try {
      const { error } = await supabase
        .from('inhabitants')
        .update({ 
          role_id: newRoleId,
          last_role_check: new Date().toISOString()
        })
        .eq('user_id', user.id)
        .eq('world_id', worldId);

      if (error) throw error;
      setUserRole(newRoleId);
      setUserLastRoleCheck(new Date().toISOString());
      // Clear all new roles since user has now seen and interacted with the role system
      setNewRoles([]);
    } catch (error) {
      console.error('Error switching role:', error);
    }
  };

  const markRolesAsSeen = async () => {
    if (!user || !worldId || newRoles.length === 0) return;

    try {
      const { error } = await supabase
        .from('inhabitants')
        .update({ last_role_check: new Date().toISOString() })
        .eq('user_id', user.id)
        .eq('world_id', worldId);

      if (error) throw error;
      setUserLastRoleCheck(new Date().toISOString());
      setNewRoles([]);
    } catch (error) {
      console.error('Error marking roles as seen:', error);
    }
  };

  const submitQuestion = async () => {
    if (!user || !worldId || !newQuestion.trim()) return;

    try {
      const { error } = await supabase
        .from('questions')
        .insert([
          {
            world_id: worldId,
            author_id: user.id,
            question_text: newQuestion.trim(),
          },
        ]);

      if (error) throw error;
      setNewQuestion('');
      fetchWorldData();
    } catch (error) {
      console.error('Error submitting question:', error);
    }
  };

  const submitScroll = async () => {
    if (!user || !worldId || !newScroll.trim()) return;

    try {
      const { error } = await supabase
        .from('scrolls')
        .insert([
          {
            world_id: worldId,
            author_id: user.id,
            scroll_text: newScroll.trim(),
          },
        ]);

      if (error) throw error;
      setNewScroll('');
      alert('Your scroll has been submitted for review by the world creator!');
    } catch (error) {
      console.error('Error submitting scroll:', error);
    }
  };

  const submitCommunityPost = async () => {
    if (!user || !worldId || !newPost.title.trim() || !newPost.content.trim()) return;

    try {
      const { error } = await supabase
        .from('community_posts')
        .insert([
          {
            world_id: worldId,
            author_id: user.id,
            title: newPost.title.trim(),
            content: newPost.content.trim(),
          },
        ]);

      if (error) throw error;
      setNewPost({ title: '', content: '' });
      fetchWorldData();
    } catch (error) {
      console.error('Error submitting community post:', error);
    }
  };

  const handleQuestionVoteChange = (questionId: string, newVoteCount: number) => {
    setQuestions(prevQuestions => 
      prevQuestions.map(question => 
        question.id === questionId 
          ? { ...question, upvotes: newVoteCount }
          : question
      )
    );
  };

  const handlePostVoteChange = (postId: string, newVoteCount: number) => {
    setCommunityPosts(prevPosts => 
      prevPosts.map(post => 
        post.id === postId 
          ? { ...post, upvotes: newVoteCount }
          : post
      )
    );
  };

  // Fork functionality (keeping existing code)
  const updateForkData = (field: string, value: any) => {
    setForkData(prev => ({ ...prev, [field]: value }));
  };

  const updateForkLaw = (index: number, value: string) => {
    const newLaws = [...forkData.laws];
    newLaws[index] = value;
    setForkData(prev => ({ ...prev, laws: newLaws }));
  };

  const addForkLaw = () => {
    setForkData(prev => ({ ...prev, laws: [...prev.laws, ''] }));
  };

  const removeForkLaw = (index: number) => {
    setForkData(prev => ({ ...prev, laws: prev.laws.filter((_, i) => i !== index) }));
  };

  const updateForkRole = (index: number, field: 'name' | 'description', value: string) => {
    const newRoles = [...forkData.roles];
    newRoles[index][field] = value;
    setForkData(prev => ({ ...prev, roles: newRoles }));
  };

  const addForkRole = () => {
    setForkData(prev => ({ ...prev, roles: [...prev.roles, { name: '', description: '' }] }));
  };

  const removeForkRole = (index: number) => {
    setForkData(prev => ({ ...prev, roles: prev.roles.filter((_, i) => i !== index) }));
  };

  const updateStarterQuestion = (index: number, value: string) => {
    const newQuestions = [...forkData.starterQuestions];
    newQuestions[index] = value;
    setForkData(prev => ({ ...prev, starterQuestions: newQuestions }));
  };

  const addStarterQuestion = () => {
    setForkData(prev => ({ ...prev, starterQuestions: [...prev.starterQuestions, ''] }));
  };

  const removeStarterQuestion = (index: number) => {
    setForkData(prev => ({ ...prev, starterQuestions: prev.starterQuestions.filter((_, i) => i !== index) }));
  };

  const forkWorld = async () => {
    if (!user || !world || !forkData.title.trim() || !forkData.description.trim()) return;

    try {
      // Create the new world
      const { data: newWorld, error: worldError } = await supabase
        .from('worlds')
        .insert([
          {
            title: forkData.title.trim(),
            description: forkData.description.trim(),
            creator_id: user.id,
            origin_world_id: world.id,
            laws: forkData.laws.filter(law => law.trim() !== ''),
          },
        ])
        .select()
        .single();

      if (worldError) throw worldError;

      // Create roles for the new world
      if (forkData.roles.length > 0) {
        const validRoles = forkData.roles.filter(role => role.name.trim() !== '');
        if (validRoles.length > 0) {
          const { error: rolesError } = await supabase
            .from('roles')
            .insert(
              validRoles.map(role => ({
                world_id: newWorld.id,
                name: role.name.trim(),
                description: role.description.trim(),
                created_by: user.id,
                is_system_role: false,
              }))
            );

          if (rolesError) throw rolesError;
        }
      }

      // Create starter questions
      if (forkData.starterQuestions.length > 0) {
        const validQuestions = forkData.starterQuestions.filter(q => q.trim() !== '');
        if (validQuestions.length > 0) {
          const { error: questionsError } = await supabase
            .from('questions')
            .insert(
              validQuestions.map(question => ({
                world_id: newWorld.id,
                author_id: user.id,
                question_text: question.trim(),
              }))
            );

          if (questionsError) throw questionsError;
        }
      }

      // Create the fork record
      const { error: forkError } = await supabase
        .from('forks')
        .insert([
          {
            original_world_id: world.id,
            new_world_id: newWorld.id,
            forker_id: user.id,
            fork_reason: forkData.reason.trim(),
          },
        ]);

      if (forkError) throw forkError;

      // Navigate to the new world's dashboard
      navigate(`/world/${newWorld.id}/dashboard`);
    } catch (error) {
      console.error('Error forking world:', error);
    }
  };

  const truncateText = (text: string, maxLength: number = 150) => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength).trim() + '...';
  };

  const toggleCategory = (category: string) => {
    setExpandedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  // Group world records by category
  const recordsByCategory = worldRecords.reduce((acc, record) => {
    if (!acc[record.category]) {
      acc[record.category] = [];
    }
    acc[record.category].push(record);
    return acc;
  }, {} as { [key: string]: WorldRecord[] });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-indigo-500 border-t-transparent"></div>
      </div>
    );
  }

  if (!world) {
    return <div className="text-center text-gray-400 py-12">World not found</div>;
  }

  const isCreator = user?.id === world.creator_id;
  const canonScrolls = scrolls;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* World Header */}
      <div className=" rounded-lg p-6">
        <div className="flex justify-between items-start mb-6">
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-white mb-3">{world.title}</h1>
            <p className="text-gray-300 text-lg leading-relaxed mb-4">{world.description}</p>
            <p className="text-gray-400">
              Created by <span className="text-indigo-400 font-medium">{world.creator.username}</span>
            </p>
          </div>
          <div className="flex space-x-3">
            {isCreator && (
              <Link
                to={`/world/${worldId}/dashboard`}
                className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
              >
                <Settings className="h-4 w-4 mr-2" />
                Dashboard
              </Link>
            )}
            <button 
              onClick={() => setShowForkDialog(true)}
              className="flex items-center px-4 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition-colors font-medium"
            >
              <GitBranch className="h-4 w-4 mr-2" />
              Fork World
            </button>
          </div>
        </div>

        {/* World Laws */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">World Laws</h3>
          <div className="grid md:grid-cols-2 gap-3">
            {world.laws.map((law, index) => (
              <div key={index} className="flex items-start space-x-3 p-4 rounded-lg bg-gray-700">
                <span className="text-indigo-400 font-mono text-sm font-bold mt-0.5">{index + 1}.</span>
                <p className="text-gray-200 text-sm leading-relaxed">{law}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Timeline Section - Below Laws */}
      <div className="bg-gray-800 rounded-lg p-6">
        <TimelineView
          entries={timelineEntries}
          isCreator={isCreator}
          showPrivate={isCreator}
          onEdit={(entry: TimelineEntry) => {
            setEditingTimelineEntry(entry);
            setShowTimelineForm(true);
          }}
          onDelete={deleteTimelineEntry}
          onCreateNew={isCreator ? () => setShowTimelineForm(true) : undefined}
          availableRoles={roles}
        />
      </div>

      {/* New Roles Notification for Existing Inhabitants */}
      {user && userRole && newRoles.length > 0 && (
        <div className="bg-gray-800 rounded-lg p-6 border border-indigo-500">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-white mb-2 flex items-center">
                <Users className="h-5 w-5 mr-2" />
                <span className="inline-flex items-center px-2 py-1 bg-indigo-600 text-xs font-medium text-white rounded-full mr-3">
                  NEW
                </span>
                New Roles Available!
              </h3>
              <p className="text-gray-300 text-sm">
                The world creator has added {newRoles.length} new role{newRoles.length > 1 ? 's' : ''} since you joined. 
                You can switch to any of these roles if they interest you more than your current role.
              </p>
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-4">
            {newRoles.map((role) => {
              const currentRole = roles.find(r => r.id === userRole);
              return (
                <div key={role.id} className="p-4 bg-gray-700 rounded-lg border border-gray-600 hover:border-indigo-500 transition-colors">
                  <div className="flex justify-between items-start mb-3">
                    <h4 className="font-medium text-white">{role.name}</h4>
                    <span className="text-xs text-indigo-400 bg-indigo-900 px-2 py-1 rounded">
                      Added {new Date(role.created_at!).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-gray-300 text-sm mb-4 leading-relaxed">{role.description}</p>
                  
                  {currentRole && (
                    <div className="mb-4 p-3 bg-gray-600 rounded border border-gray-500">
                      <p className="text-xs text-gray-300">
                        Currently: <span className="text-white font-medium">{currentRole.name}</span>
                      </p>
                    </div>
                  )}
                  
                  <button
                    onClick={() => {
                      if (confirm(`Are you sure you want to switch from "${currentRole?.name}" to "${role.name}"? This will change your role in this world.`)) {
                        switchRole(role.id);
                      }
                    }}
                    className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
                  >
                    Switch to {role.name}
                  </button>
                </div>
              );
            })}
          </div>
            <div className="mt-4 pt-4 border-t border-gray-700">
            <div className="flex justify-between items-center">
              <p className="text-gray-400 text-xs">
                💡 Tip: Switching roles will update your permissions and how others see you in this world. You can only have one role at a time.
              </p>
              <button
                onClick={markRolesAsSeen}
                className="px-3 py-1 text-gray-400 hover:text-white text-sm border border-gray-600 hover:border-gray-500 rounded transition-colors"
              >
                Dismiss All
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Role Selection */}
      {user && !userRole && roles.length > 0 && (
        <div className="bg-gray-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-4">
            <Users className="h-5 w-5 inline mr-2" />
            Choose Your Role
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            {roles.map((role) => (
              <div key={role.id} className="p-4 bg-gray-700 rounded-lg border border-gray-600 hover:border-indigo-500 transition-colors">
                <h4 className="font-medium text-white mb-2">{role.name}</h4>
                <p className="text-gray-300 text-sm mb-4 leading-relaxed">{role.description}</p>
                <button
                  onClick={() => joinRole(role.id)}
                  className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
                >
                  Join as {role.name}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="border-b border-gray-700">
        <nav className="flex space-x-8">
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'community', label: 'Community', count: communityPosts.length },
            { id: 'questions', label: 'Questions', count: questions.length },
            { id: 'lore', label: 'Canon Lore', count: canonScrolls.length },
            { id: 'records', label: 'World Records', count: worldRecords.length },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-1 py-3 font-medium text-sm border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-indigo-500 text-indigo-400'
                  : 'border-transparent text-gray-400 hover:text-gray-300'
              }`}
            >
              {tab.label}
              {tab.count !== undefined && (
                <span className="ml-2 px-2 py-0.5 bg-gray-700 text-gray-300 text-xs rounded-full">
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="space-y-6">
        {activeTab === 'overview' && (
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4">
                <MessageCircle className="h-5 w-5 inline mr-2" />
                Community Posts
              </h3>
              <div className="space-y-3">
                {communityPosts.slice(0, 3).map((post) => (
                  <Link
                    key={post.id}
                    to={`/world/${worldId}/community/${post.id}`}
                    className="block p-3 hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    <h4 className="text-white font-medium text-sm mb-1">{post.title}</h4>
                    <p className="text-gray-300 text-xs mb-2 line-clamp-2">{truncateText(post.content, 80)}</p>
                    <div className="flex justify-between items-center text-xs text-gray-400">
                      <span>{post.author.username}</span>
                      <div className="flex items-center space-x-2">
                        <span>{post.comments_count} replies</span>
                        <div className="flex items-center space-x-1">
                          <ArrowUp className="h-3 w-3" />
                          <span>{post.upvotes}</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
                {communityPosts.length === 0 && (
                  <p className="text-gray-400 text-center py-4">No community posts yet</p>
                )}
              </div>
            </div>

            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4">
                <MessageSquare className="h-5 w-5 inline mr-2" />
                Recent Questions
              </h3>
              <div className="space-y-3">
                {questions.slice(0, 3).map((question) => (
                  <div key={question.id} className="p-3">
                    <p className="text-gray-200 text-sm leading-relaxed mb-2">{question.question_text}</p>
                    <div className="flex justify-between items-center text-xs text-gray-400">
                      <span>{question.author.username}</span>
                      <div className="flex items-center space-x-1">
                        <ArrowUp className="h-3 w-3" />
                        <span>{question.upvotes}</span>
                      </div>
                    </div>
                  </div>
                ))}
                {questions.length === 0 && (
                  <p className="text-gray-400 text-center py-4">No questions yet</p>
                )}
              </div>
            </div>

            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4">
                <Scroll className="h-5 w-5 inline mr-2" />
                Canon Lore
              </h3>
              <div className="space-y-3">
                {canonScrolls.slice(0, 3).map((scroll) => (
                  <div key={scroll.id} className="p-3 rounded-lg">
                    <p className="text-gray-200 text-sm leading-relaxed mb-2">
                      {truncateText(scroll.scroll_text, 100)}
                    </p>
                    <div className="flex justify-between items-center text-xs text-gray-400">
                      <span>{scroll.author.username}</span>
                      <span className="text-green-400 font-medium">Canon</span>
                    </div>
                  </div>
                ))}
                {canonScrolls.length === 0 && (
                  <p className="text-gray-400 text-center py-4">No canon lore yet</p>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'community' && (
          <div className="space-y-6">
            {user && (
              <div className="brounded-lg p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Create a Post</h3>
                <div className="space-y-4">
                  <input
                    type="text"
                    value={newPost.title}
                    onChange={(e) => setNewPost(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Post title..."
                    className="w-full px-4 py-3 bg-gray-700  border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                  <textarea
                    value={newPost.content}
                    onChange={(e) => setNewPost(prev => ({ ...prev, content: e.target.value }))}
                    placeholder="What would you like to discuss about this world?"
                    rows={4}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                  />
                  <div className="flex justify-end">
                    <button
                      onClick={submitCommunityPost}
                      disabled={!newPost.title.trim() || !newPost.content.trim()}
                      className="flex items-center px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                    >
                      <Send className="h-4 w-4 mr-2" />
                      Post
                    </button>
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-4">
              {communityPosts.map((post) => (
                <div key={post.id} className=" bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-gray-600 transition-colors">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-medium">
                          {post.author.username[0].toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="text-white font-medium">{post.author.username}</p>
                        <p className="text-gray-400 text-sm">
                          {new Date(post.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <VotingSystem
                      targetType="community_post"
                      targetId={post.id}
                      currentVotes={post.upvotes}
                      onVoteChange={(newVoteCount) => handlePostVoteChange(post.id, newVoteCount)}
                    />
                  </div>
                  
                  <Link to={`/world/${worldId}/community/${post.id}`} className="block">
                    <h3 className="text-xl font-semibold text-white mb-3 hover:text-indigo-400 transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-gray-200 leading-relaxed mb-4">
                      {truncateText(post.content, 200)}
                    </p>
                  </Link>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-700">
                    <Link
                      to={`/world/${worldId}/community/${post.id}`}
                      className="flex items-center space-x-2 text-gray-400 hover:text-indigo-400 transition-colors"
                    >
                      <MessageCircle className="h-4 w-4" />
                      <span className="text-sm">
                        {post.comments_count} {post.comments_count === 1 ? 'comment' : 'comments'}
                      </span>
                    </Link>
                    <span className="text-gray-400 text-sm">
                      {new Date(post.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
              {communityPosts.length === 0 && (
                <div className="text-center py-12">
                  <MessageCircle className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-400">No community posts yet</p>
                  {user && (
                    <p className="text-gray-500 text-sm mt-2">Be the first to start a discussion!</p>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'questions' && (
          <div className="space-y-6">
            {user && userRole && (
              <div className=" rounded-lg p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Ask a Question</h3>
                <div className="flex space-x-3">
                  <input
                    type="text"
                    value={newQuestion}
                    onChange={(e) => setNewQuestion(e.target.value)}
                    placeholder="What paradox would you like to explore?"
                    className="flex-1 px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && newQuestion.trim()) {
                        submitQuestion();
                      }
                    }}
                  />
                  <button
                    onClick={submitQuestion}
                    disabled={!newQuestion.trim()}
                    className="flex items-center px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                  >
                    <Send className="h-4 w-4 mr-2" />
                    Ask
                  </button>
                </div>
              </div>
            )}

            <div className="space-y-4">
              {questions.map((question) => (
                <div key={question.id} className="bg-gray-800 rounded-lg p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center">
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
                    <VotingSystem
                      targetType="question"
                      targetId={question.id}
                      currentVotes={question.upvotes}
                      onVoteChange={(newVoteCount) => handleQuestionVoteChange(question.id, newVoteCount)}
                    />
                  </div>
                  <h4 className="text-white font-medium mb-3 leading-relaxed">{question.question_text}</h4>
                  {question.answer && (
                    <div className="mt-4 p-4 bg-gray-700 rounded-lg border-l-4 border-indigo-500">
                      <p className="text-gray-200 leading-relaxed">{question.answer}</p>
                    </div>
                  )}
                </div>
              ))}
              {questions.length === 0 && (
                <div className="text-center py-12">
                  <MessageSquare className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-400">No questions yet</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'lore' && (
          <div className="space-y-6">
            {user && userRole && (
              <div className=" rounded-lg p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Submit a Scroll</h3>
                <div className="space-y-3">
                  <textarea
                    value={newScroll}
                    onChange={(e) => setNewScroll(e.target.value)}
                    placeholder="Share your contribution to this world's lore..."
                    rows={4}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                  />
                  <div className="flex justify-between items-center">
                    <p className="text-gray-400 text-sm">
                      Your scroll will be reviewed by the world creator before becoming canon.
                    </p>
                    <button
                      onClick={submitScroll}
                      disabled={!newScroll.trim()}
                      className="flex items-center px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                    >
                      <Send className="h-4 w-4 mr-2" />
                      Submit
                    </button>
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-4">
              {canonScrolls.map((scroll) => (
                <div key={scroll.id} className="bg-gray-800 rounded-lg p-6 border-l-4 border-green-500">
                  <div className="flex justify-between items-start mb-4">
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
                    </div>
                    <span className="px-3 py-1 bg-green-600 text-white text-xs rounded-full font-medium">
                      Canon
                    </span>
                  </div>
                  <p className="text-gray-200 leading-relaxed">{scroll.scroll_text}</p>
                </div>
              ))}
              {canonScrolls.length === 0 && (
                <div className="text-center py-12">
                  <Scroll className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-400">No canon lore yet</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'records' && (
          <div className="space-y-6">
            {isCreator && (
              <div className="flex justify-end">
                <button
                  onClick={() => setShowRecordForm(true)}
                  className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create Record
                </button>
              </div>
            )}

            {Object.keys(recordsByCategory).length > 0 ? (
              <div className="space-y-4">
                {Object.entries(recordsByCategory).map(([category, records]) => (
                  <div key={category} className="bg-gray-800 rounded-lg overflow-hidden">
                    <button
                      onClick={() => toggleCategory(category)}
                      className="w-full px-6 py-4 bg-gray-700 hover:bg-gray-600 transition-colors flex items-center justify-between"
                    >
                      <div className="flex items-center space-x-3">
                        <BookOpen className="h-5 w-5 text-indigo-400" />
                        <h4 className="text-white font-semibold">{category}</h4>
                        <span className="bg-gray-600 px-2 py-1 rounded text-xs text-gray-300">
                          {records.length}
                        </span>
                      </div>
                      {expandedCategories[category] ? (
                        <ChevronDown className="h-5 w-5 text-gray-400" />
                      ) : (
                        <ChevronRight className="h-5 w-5 text-gray-400" />
                      )}
                    </button>
                    
                    {expandedCategories[category] && (
                      <div className="p-6 grid md:grid-cols-2 gap-4">
                        {records.map((record) => (
                          <WorldRecordCard
                            key={record.id}
                            record={record}
                            onView={setSelectedRecord}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <BookOpen className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400">No world records yet</p>
                {isCreator && (
                  <p className="text-gray-500 text-sm mt-2">Create detailed records to document your world's lore</p>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modals and Forms */}
      {selectedRecord && (
        <WorldRecordModal
          record={selectedRecord}
          isCreator={isCreator}
          onClose={() => setSelectedRecord(null)}
          onUpdate={updateWorldRecord}
          onDelete={deleteWorldRecord}
        />
      )}

      {showRecordForm && (
        <CreateEditWorldRecordForm
          worldId={worldId!}
          initialData={editingRecord || undefined}
          onSubmit={editingRecord ? 
            (data) => updateWorldRecord(editingRecord.id, data) : 
            createWorldRecord
          }
          onCancel={() => {
            setShowRecordForm(false);
            setEditingRecord(null);
          }}
        />
      )}

      {showTimelineForm && (
        <CreateEditTimelineEntryForm
          worldId={worldId!}
          initialData={editingTimelineEntry || undefined}
          onSubmit={editingTimelineEntry ? updateTimelineEntry : createTimelineEntry}
          onCancel={() => {
            setShowTimelineForm(false);
            setEditingTimelineEntry(null);
          }}
          availableRoles={roles}
        />
      )}

      {/* Enhanced Fork Dialog (keeping existing code) */}
      {showForkDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-white">Fork "{world.title}"</h3>
              <button
                onClick={() => setShowForkDialog(false)}
                className="text-gray-400 hover:text-white"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <div className="space-y-6">
              {/* Basic Info */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    New World Title *
                  </label>
                  <input
                    type="text"
                    value={forkData.title}
                    onChange={(e) => updateForkData('title', e.target.value)}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Fork Reason (Optional)
                  </label>
                  <input
                    type="text"
                    value={forkData.reason}
                    onChange={(e) => updateForkData('reason', e.target.value)}
                    placeholder="Why are you forking this world?"
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Description *
                </label>
                <textarea
                  value={forkData.description}
                  onChange={(e) => updateForkData('description', e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                />
              </div>

              {/* Laws */}
              <div>
                <div className="flex justify-between items-center mb-3">
                  <label className="block text-sm font-medium text-gray-300">
                    World Laws
                  </label>
                  <button
                    type="button"
                    onClick={addForkLaw}
                    className="flex items-center px-3 py-1 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700 transition-colors"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add Law
                  </button>
                </div>
                <div className="space-y-2">
                  {forkData.laws.map((law, index) => (
                    <div key={index} className="flex space-x-2">
                      <input
                        type="text"
                        value={law}
                        onChange={(e) => updateForkLaw(index, e.target.value)}
                        className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      />
                      <button
                        type="button"
                        onClick={() => removeForkLaw(index)}
                        className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Roles */}
              <div>
                <div className="flex justify-between items-center mb-3">
                  <label className="block text-sm font-medium text-gray-300">
                    Roles
                  </label>
                  <button
                    type="button"
                    onClick={addForkRole}
                    className="flex items-center px-3 py-1 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700 transition-colors"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add Role
                  </button>
                </div>
                <div className="space-y-3">
                  {forkData.roles.map((role, index) => (
                    <div key={index} className="p-3 bg-gray-700 rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-gray-400 text-sm">Role {index + 1}</span>
                        <button
                          type="button"
                          onClick={() => removeForkRole(index)}
                          className="text-red-400 hover:text-red-300"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                      <div className="space-y-2">
                        <input
                          type="text"
                          value={role.name}
                          onChange={(e) => updateForkRole(index, 'name', e.target.value)}
                          placeholder="Role name"
                          className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        />
                        <textarea
                          value={role.description}
                          onChange={(e) => updateForkRole(index, 'description', e.target.value)}
                          placeholder="Role description"
                          rows={2}
                          className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Starter Questions */}
              <div>
                <div className="flex justify-between items-center mb-3">
                  <label className="block text-sm font-medium text-gray-300">
                    Starter Questions (Optional)
                  </label>
                  <button
                    type="button"
                    onClick={addStarterQuestion}
                    className="flex items-center px-3 py-1 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700 transition-colors"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add Question
                  </button>
                </div>
                <div className="space-y-2">
                  {forkData.starterQuestions.map((question, index) => (
                    <div key={index} className="flex space-x-2">
                      <input
                        type="text"
                        value={question}
                        onChange={(e) => updateStarterQuestion(index, e.target.value)}
                        placeholder="What question would you like to seed this world with?"
                        className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      />
                      <button
                        type="button"
                        onClick={() => removeStarterQuestion(index)}
                        className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-8">
              <button
                onClick={() => setShowForkDialog(false)}
                className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-500 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={forkWorld}
                disabled={!forkData.title.trim() || !forkData.description.trim()}
                className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
              >
                Fork World
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}