import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../lib/supabase';
import { notifyUserInteraction } from '../lib/notifications';
import { Users, MessageSquare, Scroll, GitBranch, Settings, Check, X, Trash2, ArrowUp, Edit, Save, Plus, BookOpen, UserX, Map, Image, Clipboard, Send } from 'lucide-react';
import { CreateEditWorldRecordForm } from '../components/CreateEditWorldRecordForm';
import { TimelineView } from '../components/TimelineView';
import { CreateEditTimelineEntryForm } from '../components/CreateEditTimelineEntryForm';
import { UserLink } from '../components/UserLink';
import { UserAvatar } from '../components/UserAvatar';
import { RichTextEditor } from '../components/RichTextEditor';
import { MarkdownRenderer } from '../components/MarkdownRenderer';
import { ExportWorldButton } from '../components/ExportWorldButton';
import { WorldMap } from './WorldMap';
import { WorldGallery } from './WorldGallery';
import { WorldWorkboard } from './WorldWorkBoard';

interface World {
  id: string;
  title: string;
  description: string;
  laws: string[];
  creator_id: string;
  parent_world?: {
    id: string;
    title: string;
    creator: {
      id: string;
      username: string;
    };
  };
}

interface Role {
  id: string;
  world_id: string;
  name: string;
  description: string;
  created_by: string;
  is_system_role: boolean;
}

interface Question {
  id: string;
  question_text: string;
  upvotes: number;
  answer: string | null;
  created_at: string;
  author: { id: string; username: string; profile_picture_url?: string };
}

interface ScrollItem {
  id: string;
  scroll_text: string;
  is_canon: boolean;
  created_at: string;
  author: { id: string; username: string; profile_picture_url?: string };
}

interface Inhabitant {
  id: string;
  joined_at: string;
  user: { 
    id: string; 
    username: string; 
    email: string; 
    profile_picture_url?: string;
  };
  role: { 
    id: string;
    name: string; 
    is_important: boolean;
  };
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

export function WorldDashboard() {
  const { worldId } = useParams<{ worldId: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [mainTab, setMainTab] = useState('worldview');
  const [activeTab, setActiveTab] = useState('pending');
  const [world, setWorld] = useState<World | null>(null);
  const [roles, setRoles] = useState<Role[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [allScrolls, setAllScrolls] = useState<ScrollItem[]>([]);
  const [inhabitants, setInhabitants] = useState<Inhabitant[]>([]);
  const [worldRecords, setWorldRecords] = useState<WorldRecord[]>([]);
  const [timelineEntries, setTimelineEntries] = useState<TimelineEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [answerInputs, setAnswerInputs] = useState<{ [key: string]: string }>({});
  const [error, setError] = useState<string>('');
  const [editingLaws, setEditingLaws] = useState(false);
  const [editedLaws, setEditedLaws] = useState<string[]>([]);
  const [editingTitle, setEditingTitle] = useState(false);
  const [editedTitle, setEditedTitle] = useState('');
  const [editingDescription, setEditingDescription] = useState(false);
  const [editedDescription, setEditedDescription] = useState('');
  const [editingRoles, setEditingRoles] = useState(false);
  const [editedRoles, setEditedRoles] = useState<{ id?: string; name: string; description: string; isNew?: boolean }[]>([]);
  const [showRecordForm, setShowRecordForm] = useState(false);
  const [editingRecord, setEditingRecord] = useState<WorldRecord | null>(null);
  const [showTimelineForm, setShowTimelineForm] = useState(false);
  const [editingTimelineEntry, setEditingTimelineEntry] = useState<TimelineEntry | null>(null);

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

      // Fetch parent world info if this is a fork
      let parent_world = null;
      if (worldData.origin_world_id) {
        const { data: parentWorldData } = await supabase
          .from('worlds')
          .select(`
            id,
            title,
            creator:users!creator_id(id, username)
          `)
          .eq('id', worldData.origin_world_id)
          .single();
        
        parent_world = parentWorldData;
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

      setWorld({ ...worldData, parent_world });
      setEditedLaws([...worldData.laws]);
      setEditedTitle(worldData.title);
      setEditedDescription(worldData.description);

      // Fetch roles
      const { data: rolesData, error: rolesError } = await supabase
        .from('roles')
        .select('*')
        .eq('world_id', worldId)
        .order('created_by', { ascending: true });

      if (rolesError) throw rolesError;
      setRoles(rolesData || []);
      setEditedRoles((rolesData || []).map(role => ({
        id: role.id,
        name: role.name,
        description: role.description
      })));      // Fetch questions (limited to most recent 50 for performance)
      const { data: questionsData, error: questionsError } = await supabase
        .from('questions')
        .select(`
          *,
          author:users!author_id(id, username, profile_picture_url)
        `)
        .eq('world_id', worldId)
        .order('created_at', { ascending: false })
        .limit(50);

      if (questionsError) throw questionsError;
      setQuestions(questionsData || []);      // Fetch ALL scrolls (both pending and canon) for the dashboard (limited to most recent 100 for performance)
      const { data: scrollsData, error: scrollsError } = await supabase
        .from('scrolls')
        .select(`
          *,
          author:users!author_id(id, username, profile_picture_url)
        `)
        .eq('world_id', worldId)
        .order('created_at', { ascending: false })
        .limit(100);

      if (scrollsError) throw scrollsError;
      setAllScrolls(scrollsData || []);      // Fetch inhabitants
      const { data: inhabitantsData, error: inhabitantsError } = await supabase
        .from('inhabitants')
        .select(`
          *,
          user:users!user_id(id, username, email, profile_picture_url),
          role:roles!role_id(id, name, is_important)
        `)
        .eq('world_id', worldId)
        .order('joined_at', { ascending: false });

      if (inhabitantsError) throw inhabitantsError;
      setInhabitants(inhabitantsData || []);

      // Fetch world records (limited to most recent 50 for performance)
      const { data: recordsData, error: recordsError } = await supabase
        .from('world_records')
        .select('*')
        .eq('world_id', worldId)
        .order('created_at', { ascending: false })
        .limit(50);

      if (recordsError) throw recordsError;
      setWorldRecords(recordsData || []);

      // Fetch timeline entries (limited to most recent 100 for performance)
      const { data: timelineData, error: timelineError } = await supabase
        .from('timeline_entries')
        .select('*')
        .eq('world_id', worldId)
        .order('year', { ascending: true })
        .limit(100);

      if (timelineError) throw timelineError;
      setTimelineEntries(timelineData || []);
    } catch (error: any) {
      console.error('Error fetching world data:', error);
      setError(error.message || 'Failed to load world data');
    } finally {
      setLoading(false);
    }
  };

  // World Records functions
  const kickInhabitant = async (inhabitantId: string) => {
    try {
      const { error } = await supabase
        .from('inhabitants')
        .delete()
        .eq('id', inhabitantId);

      if (error) throw error;
      
      // Refresh the data
      fetchWorldData();
    } catch (error) {
      console.error('Error kicking inhabitant:', error);
      alert('Failed to remove inhabitant. Please try again.');
    }
  };

  const createWorldRecord = async (data: any) => {
    if (!user) return;

    const { error } = await supabase
      .from('world_records')
      .insert([{ ...data, author_id: user.id }]);

    if (error) throw error;
    setShowRecordForm(false);
    setEditingRecord(null);
    fetchWorldData();
  };

  const updateWorldRecord = async (data: any) => {
    if (!editingRecord) return;

    const { error } = await supabase
      .from('world_records')
      .update(data)
      .eq('id', editingRecord.id);

    if (error) throw error;
    setShowRecordForm(false);
    setEditingRecord(null);
    fetchWorldData();
  };

  const deleteWorldRecord = async (id: string) => {
    if (!confirm('Are you sure you want to delete this record? This action cannot be undone.')) {
      return;
    }

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
    if (!confirm('Are you sure you want to delete this timeline entry? This action cannot be undone.')) {
      return;
    }

    const { error } = await supabase
      .from('timeline_entries')
      .delete()
      .eq('id', id);

    if (error) throw error;
    fetchWorldData();
  };

  const updateWorldTitle = async () => {
    if (!user || !world || !editedTitle.trim() || user.id !== world.creator_id) return;

    try {
      const { error } = await supabase
        .from('worlds')
        .update({ title: editedTitle.trim() })
        .eq('id', worldId);

      if (error) throw error;
      setEditingTitle(false);
      fetchWorldData();
    } catch (error) {
      console.error('Error updating world title:', error);
    }
  };

  const updateWorldDescription = async () => {
    if (!user || !world || !editedDescription.trim() || user.id !== world.creator_id) return;

    try {
      const { error } = await supabase
        .from('worlds')
        .update({ description: editedDescription.trim() })
        .eq('id', worldId);

      if (error) throw error;
      setEditingDescription(false);
      fetchWorldData();
    } catch (error) {
      console.error('Error updating world description:', error);
    }
  };

  const updateWorldLaws = async () => {
    if (!user || !world || user.id !== world.creator_id) return;

    const validLaws = editedLaws.filter(law => law.trim() !== '');
    if (validLaws.length < 1) {
      alert('Please provide at least one law for your world');
      return;
    }

    try {
      const { error } = await supabase
        .from('worlds')
        .update({ laws: validLaws })
        .eq('id', worldId);

      if (error) throw error;
      setEditingLaws(false);
      fetchWorldData();
    } catch (error) {
      console.error('Error updating world laws:', error);
    }
  };

  const addLaw = () => {
    setEditedLaws([...editedLaws, '']);
  };

  const removeLaw = (index: number) => {
    if (editedLaws.length > 1) {
      setEditedLaws(editedLaws.filter((_, i) => i !== index));
    }
  };

  const updateLaw = (index: number, value: string) => {
    const newLaws = [...editedLaws];
    newLaws[index] = value;
    setEditedLaws(newLaws);
  };

  const cancelEditLaws = () => {
    setEditedLaws([...world!.laws]);
    setEditingLaws(false);
  };

  const cancelEditTitle = () => {
    setEditedTitle(world!.title);
    setEditingTitle(false);
  };

  const cancelEditDescription = () => {
    setEditedDescription(world!.description);
    setEditingDescription(false);
  };

  // Role management functions
  const addRole = () => {
    setEditedRoles([...editedRoles, { name: '', description: '', isNew: true }]);
  };

  const removeRole = (index: number) => {
    setEditedRoles(editedRoles.filter((_, i) => i !== index));
  };

  const updateRole = (index: number, field: 'name' | 'description', value: string) => {
    const newRoles = [...editedRoles];
    newRoles[index][field] = value;
    setEditedRoles(newRoles);
  };

  const saveRoles = async () => {
    if (!user || !world || user.id !== world.creator_id) return;

    try {
      // Get current roles from database
      const currentRoles = roles;
      const currentRoleIds = currentRoles.map(r => r.id);
      const editedRoleIds = editedRoles.filter(r => r.id).map(r => r.id);

      // Find roles to delete (exist in current but not in edited)
      const rolesToDelete = currentRoles.filter(role => 
        !editedRoles.some(editedRole => editedRole.id === role.id)
      );

      // Find roles to insert (new roles without id)
      const rolesToInsert = editedRoles.filter(role => 
        role.isNew && role.name.trim() !== ''
      );

      // Find roles to update (existing roles with changes)
      const rolesToUpdate = editedRoles.filter(role => {
        if (!role.id || role.isNew) return false;
        const originalRole = currentRoles.find(r => r.id === role.id);
        return originalRole && (
          originalRole.name !== role.name || 
          originalRole.description !== role.description
        );
      });

      // Delete roles
      if (rolesToDelete.length > 0) {
        const { error: deleteError } = await supabase
          .from('roles')
          .delete()
          .in('id', rolesToDelete.map(r => r.id));

        if (deleteError) throw deleteError;
      }

      // Insert new roles
      if (rolesToInsert.length > 0) {
        const { error: insertError } = await supabase
          .from('roles')
          .insert(
            rolesToInsert.map(role => ({
              world_id: worldId,
              name: role.name.trim(),
              description: role.description.trim(),
              created_by: user.id,
              is_system_role: false,
            }))
          );

        if (insertError) throw insertError;
      }

      // Update existing roles
      if (rolesToUpdate.length > 0) {
        for (const role of rolesToUpdate) {
          const { error: updateError } = await supabase
            .from('roles')
            .update({
              name: role.name.trim(),
              description: role.description.trim(),
            })
            .eq('id', role.id);

          if (updateError) throw updateError;
        }
      }

      setEditingRoles(false);
      fetchWorldData();
    } catch (error) {
      console.error('Error saving roles:', error);
      alert('Error saving roles. Please try again.');
    }
  };

  const cancelEditRoles = () => {
    setEditedRoles(roles.map(role => ({
      id: role.id,
      name: role.name,
      description: role.description
    })));
    setEditingRoles(false);
  };

  const answerQuestion = async (questionId: string, answer: string) => {
    try {
      // First get the question details to find the author
      const question = questions.find(q => q.id === questionId);
      
      const { error } = await supabase
        .from('questions')
        .update({
          answer,
          answered_by: user?.id,
        })
        .eq('id', questionId);

      if (error) throw error;
      
      // Notify the question author
      if (question && user && question.author.id !== user.id) {
        // Get the username from the question author data
        const authorData = await supabase
          .from('users')
          .select('username')
          .eq('id', user.id)
          .single();
          
        await notifyUserInteraction({
          targetUserId: question.author.id,
          fromUserId: user.id,
          fromUsername: authorData.data?.username || 'Someone',
          action: 'answered_question',
          context: world?.title || 'your world',
          actionUrl: `/world/${worldId}/dashboard`
        });
      }
      
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
      // First get the scroll details to find the author
      const scroll = allScrolls.find(s => s.id === scrollId);
      
      const { error } = await supabase
        .from('scrolls')
        .update({
          is_canon: true,
          approved_by: user?.id,
        })
        .eq('id', scrollId);

      if (error) throw error;
      
      // Notify the scroll author
      if (scroll && user && scroll.author.id !== user.id) {
        // Get the username from the current user
        const authorData = await supabase
          .from('users')
          .select('username')
          .eq('id', user.id)
          .single();
          
        await notifyUserInteraction({
          targetUserId: scroll.author.id,
          fromUserId: user.id,
          fromUsername: authorData.data?.username || 'Someone',
          action: 'approved_lore',
          context: world?.title || 'your world',
          actionUrl: `/world/${worldId}/dashboard`
        });
      }
      
      fetchWorldData();
    } catch (error) {
      console.error('Error approving scroll:', error);
    }
  };

  const rejectScroll = async (scrollId: string) => {
    if (!confirm('Are you sure you want to reject this scroll? This action cannot be undone.')) {
      return;
    }

    try {
      // First get the scroll details to find the author
      const scroll = allScrolls.find(s => s.id === scrollId);
      
      // Notify the scroll author before deletion
      if (scroll && user && scroll.author.id !== user.id) {
        // Get the username from the current user
        const authorData = await supabase
          .from('users')
          .select('username')
          .eq('id', user.id)
          .single();
          
        await notifyUserInteraction({
          targetUserId: scroll.author.id,
          fromUserId: user.id,
          fromUsername: authorData.data?.username || 'Someone',
          action: 'rejected_lore',
          context: world?.title || 'your world',
          actionUrl: `/world/${worldId}/dashboard`
        });
      }

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
    <div className="max-w-6xl mx-auto space-y-6 px-4">
      {/* Main Navigation Tabs */}
      <div className="border-b border-gray-700 overflow-x-auto">
        <nav className="flex space-x-4 sm:space-x-8 min-w-max px-4 sm:px-0">
          {[
            { id: 'worldview', label: 'World View' },
            { id: 'map', label: 'World Map', icon: Map },
            { id: 'gallery', label: 'Gallery', icon: Image },
            { id: 'workboard', label: 'Updates', icon: Clipboard },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setMainTab(tab.id)}
              className={`flex items-center px-1 py-3 font-medium text-sm border-b-2 transition-colors whitespace-nowrap ${
                mainTab === tab.id
                  ? 'border-indigo-500 text-indigo-400'
                  : 'border-transparent text-gray-400 hover:text-gray-300'
              }`}
            >
              {tab.icon && <tab.icon className="h-4 w-4 mr-2" />}
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Main Tab Content */}
      {mainTab === 'worldview' && (
        <div className="space-y-6">
          {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="flex-1 min-w-0">
          {/* Parent World Reference */}
          {world.parent_world && (
            <div className="mb-3 p-2 bg-gray-800/50 rounded-lg border-l-4 border-indigo-500">
              <p className="text-sm text-gray-400 mb-1">Forked from:</p>
              <Link
                to={`/world/${world.parent_world.id}`}
                className="text-indigo-400 hover:text-indigo-300 font-medium text-sm transition-colors"
              >
                {world.parent_world.title}
              </Link>
              <span className="text-gray-500 text-sm ml-2">
                by <UserLink userId={world.parent_world.creator.id} username={world.parent_world.creator.username} />
              </span>
            </div>
          )}
          {/* Editable Title */}
          {editingTitle ? (
            <div className="space-y-2 mb-2">
              <input
                type="text"
                value={editedTitle}
                onChange={(e) => setEditedTitle(e.target.value)}
                className="w-full text-xl sm:text-2xl font-bold bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') updateWorldTitle();
                  if (e.key === 'Escape') cancelEditTitle();
                }}
                autoFocus
              />
              <div className="flex gap-2">
                <button
                  onClick={updateWorldTitle}
                  className="p-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <Save className="h-4 w-4" />
                </button>
                <button
                  onClick={cancelEditTitle}
                  className="p-2 bg-gray-600 text-white rounded-lg hover:bg-gray-500 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-xl sm:text-2xl font-bold text-white flex-1 break-words">{world.title}</h1>
              <button
                onClick={() => setEditingTitle(true)}
                className="p-1 text-gray-400 hover:text-white transition-colors flex-shrink-0"
              >
                <Edit className="h-4 w-4" />              </button>
            </div>
          )}

          {/* Editable Description */}
          {editingDescription ? (
            <div className="space-y-2 mb-2 w-full">
              <RichTextEditor
                value={editedDescription}
                onChange={setEditedDescription}
                placeholder="Enter world description..."
                rows={4}
              />
              <div className="flex gap-2">
                <button
                  onClick={updateWorldDescription}
                  className="flex items-center px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                >
                  <Save className="h-4 w-4 mr-1" />
                  Save
                </button>
                <button
                  onClick={cancelEditDescription}
                  className="flex items-center px-3 py-1 bg-gray-600 text-white rounded-lg hover:bg-gray-500 transition-colors text-sm"
                >
                  <X className="h-4 w-4 mr-1" />
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-start gap-3 mb-2">
              <div className="text-gray-400 text-sm flex-1 break-words">
                <MarkdownRenderer content={world.description || 'No description provided'} />
              </div>
              <button
                onClick={() => setEditingDescription(true)}
                className="p-1 text-gray-400 hover:text-white transition-colors flex-shrink-0"
              >
                <Edit className="h-4 w-4" />
              </button>
            </div>
          )}

          <p className="text-gray-400 text-sm">Creator Dashboard</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <ExportWorldButton 
            worldId={worldId!} 
            worldTitle={world.title} 
            isCreator={true} 
          />
          <button
            onClick={() => navigate(`/world/${worldId}`)}
            className="w-full sm:w-auto px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium"
          >
            View Public World
          </button>
        </div>
      </div>

      {/* World Laws Management */}
      <div className="bg-gray-800 rounded-lg p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-4">
          <h3 className="text-lg font-semibold text-white">World Laws</h3>
          <div className="flex flex-wrap gap-2">
            {editingLaws ? (
              <>
                <button
                  onClick={addLaw}
                  className="flex items-center px-3 py-1 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add Law
                </button>
                <button
                  onClick={updateWorldLaws}
                  className="flex items-center px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                >
                  <Save className="h-4 w-4 mr-1" />
                  Save
                </button>
                <button
                  onClick={cancelEditLaws}
                  className="flex items-center px-3 py-1 bg-gray-600 text-white rounded-lg hover:bg-gray-500 transition-colors text-sm"
                >
                  <X className="h-4 w-4 mr-1" />
                  Cancel
                </button>
              </>
            ) : (
              <button
                onClick={() => setEditingLaws(true)}
                className="flex items-center px-3 py-1 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition-colors text-sm"
              >
                <Edit className="h-4 w-4 mr-1" />
                Edit Laws
              </button>
            )}
          </div>
        </div>

        {editingLaws ? (
          <div className="space-y-3">
            {editedLaws.map((law, index) => (
              <div key={index} className="flex items-start gap-3">
                <span className="text-indigo-400 font-mono text-sm font-bold w-8 flex-shrink-0 mt-2">{index + 1}.</span>
                <div className="flex-1">
                  <RichTextEditor
                    value={law}
                    onChange={(value) => updateLaw(index, value)}
                    placeholder="Enter world law..."
                    rows={2}
                  />
                </div>
                {editedLaws.length > 1 && (
                  <button
                    onClick={() => removeLaw(index)}
                    className="p-2 text-red-400 hover:text-red-300 transition-colors flex-shrink-0"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            {world.laws.map((law, index) => (
              <div key={index} className="flex items-start space-x-3 p-4 bg-gray-700 rounded-lg">
                <span className="text-indigo-400 font-mono text-sm font-bold mt-0.5 flex-shrink-0">{index + 1}.</span>
                <div className="text-gray-200 text-sm leading-relaxed break-words min-w-0">
                  <MarkdownRenderer content={law} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* World Roles Management */}
      <div className="bg-gray-800 rounded-lg p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-4">
          <h3 className="text-lg font-semibold text-white">World Roles</h3>
          <div className="flex flex-wrap gap-2">
            {editingRoles ? (
              <>
                <button
                  onClick={addRole}
                  className="flex items-center px-3 py-1 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add Role
                </button>
                <button
                  onClick={saveRoles}
                  className="flex items-center px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                >
                  <Save className="h-4 w-4 mr-1" />
                  Save
                </button>
                <button
                  onClick={cancelEditRoles}
                  className="flex items-center px-3 py-1 bg-gray-600 text-white rounded-lg hover:bg-gray-500 transition-colors text-sm"
                >
                  <X className="h-4 w-4 mr-1" />
                  Cancel
                </button>
              </>
            ) : (
              <button
                onClick={() => setEditingRoles(true)}
                className="flex items-center px-3 py-1 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition-colors text-sm"
              >
                <Edit className="h-4 w-4 mr-1" />
                Edit Roles
              </button>
            )}
          </div>
        </div>

        {editingRoles ? (
          <div className="space-y-4">
            {editedRoles.map((role, index) => (
              <div key={index} className="bg-gray-700 rounded-lg p-4">
                <div className="flex justify-between items-start mb-3">
                  <span className="text-gray-400 text-sm">
                    {role.isNew ? 'New Role' : `Role ${index + 1}`}
                  </span>
                  <button
                    onClick={() => removeRole(index)}
                    className="p-1 text-red-400 hover:text-red-300 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Role Name
                    </label>
                    <input
                      type="text"
                      value={role.name}
                      onChange={(e) => updateRole(index, 'name', e.target.value)}
                      className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      placeholder="Role name (e.g., Scholar, Guardian, Seeker)"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Role Description
                    </label>
                    <RichTextEditor
                      value={role.description}
                      onChange={(value) => updateRole(index, 'description', value)}
                      placeholder="Role description and responsibilities..."
                      rows={2}
                    />
                  </div>
                </div>
              </div>
            ))}
            {editedRoles.length === 0 && (
              <div className="text-center py-8">
                <Users className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400 mb-4">No roles defined yet</p>
                <button
                  onClick={addRole}
                  className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors mx-auto"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add First Role
                </button>
              </div>
            )}
          </div>
        ) : (
          <div>
            {roles.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {roles.map((role) => (
                  <div key={role.id} className="p-4 bg-gray-700 rounded-lg">
                    <h4 className="font-medium text-white mb-2 break-words">{role.name}</h4>
                    <div className="text-gray-300 text-sm leading-relaxed break-words">
                      <MarkdownRenderer content={role.description || 'No description provided'} />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Users className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400 mb-4">No roles defined yet</p>
                <button
                  onClick={() => setEditingRoles(true)}
                  className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors mx-auto"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add First Role
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* World Records Management */}
      <div className="bg-gray-800 rounded-lg p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
          <h3 className="text-lg font-semibold text-white flex items-center">
            <BookOpen className="h-5 w-5 mr-2" />
            Manage World Records
          </h3>
          <button
            onClick={() => setShowRecordForm(true)}
            className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Record
          </button>
        </div>

        {worldRecords.length > 0 ? (
          <div className="space-y-3">
            {worldRecords.map((record) => (
              <div key={record.id} className="bg-gray-700 rounded-lg p-4">
                <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-4 mb-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-2">
                      <h4 className="font-medium text-white break-words">{record.title}</h4>
                      <span className="bg-gray-600 px-2 py-1 rounded text-xs text-gray-300 self-start">
                        {record.category}
                      </span>
                    </div>
                    <p className="text-gray-300 text-sm leading-relaxed line-clamp-2 break-words">
                      {record.description.length > 150 
                        ? record.description.slice(0, 150) + '...' 
                        : record.description}
                    </p>
                  </div>
                  <div className="flex gap-2 self-start lg:ml-4">
                    <button
                      onClick={() => {
                        setEditingRecord(record);
                        setShowRecordForm(true);
                      }}
                      className="p-2 text-gray-400 hover:text-indigo-400 transition-colors"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => deleteWorldRecord(record.id)}
                      className="p-2 text-gray-400 hover:text-red-400 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <div className="text-xs text-gray-400">
                  Created {new Date(record.created_at).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <BookOpen className="h-12 w-12 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 mb-4">No world records yet</p>
            <p className="text-gray-500 text-sm">Create detailed records to document your world's lore</p>
          </div>
        )}
      </div>

      {/* Timeline Management */}
      <div className="bg-gray-800 rounded-lg p-3 sm:p-6">
        <TimelineView
          entries={timelineEntries}
          isCreator={true}
          showPrivate={true}
          onEdit={(entry: TimelineEntry) => {
            setEditingTimelineEntry(entry);
            setShowTimelineForm(true);
          }}
          onDelete={deleteTimelineEntry}
          onCreateNew={() => setShowTimelineForm(true)}
          availableRoles={roles}
        />
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="bg-gray-800 rounded-lg p-4 text-center">
          <div className="text-xl sm:text-2xl font-bold text-white">{inhabitants.length}</div>
          <div className="text-gray-400 text-xs sm:text-sm">Inhabitants</div>
        </div>
        <div className="bg-gray-800 rounded-lg p-4 text-center">
          <div className="text-xl sm:text-2xl font-bold text-orange-400">{pendingScrolls.length}</div>
          <div className="text-gray-400 text-xs sm:text-sm">Pending Scrolls</div>
        </div>
        <div className="bg-gray-800 rounded-lg p-4 text-center">
          <div className="text-xl sm:text-2xl font-bold text-green-400">{canonScrolls.length}</div>
          <div className="text-gray-400 text-xs sm:text-sm">Canon Lore</div>
        </div>
        <div className="bg-gray-800 rounded-lg p-4 text-center">
          <div className="text-xl sm:text-2xl font-bold text-blue-400">{unansweredQuestions.length}</div>
          <div className="text-gray-400 text-xs sm:text-sm">Unanswered</div>
        </div>
        <div className="bg-gray-800 rounded-lg p-4 text-center">
          <div className="text-xl sm:text-2xl font-bold text-purple-400">{worldRecords.length}</div>
          <div className="text-gray-400 text-xs sm:text-sm">Records</div>
        </div>
        <div className="bg-gray-800 rounded-lg p-4 text-center">
          <div className="text-xl sm:text-2xl font-bold text-indigo-400">{timelineEntries.length}</div>
          <div className="text-gray-400 text-xs sm:text-sm">Timeline</div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-gray-700 overflow-x-auto">
        <nav className="flex space-x-4 sm:space-x-8 min-w-max px-0">
          {[
            { id: 'pending', label: 'Pending Review', count: pendingScrolls.length, color: 'orange' },
            { id: 'canon', label: 'Canon Lore', count: canonScrolls.length, color: 'green' },
            { id: 'questions', label: 'Questions', count: unansweredQuestions.length, color: 'blue' },
            { id: 'inhabitants', label: 'Inhabitants', count: inhabitants.length, color: 'gray' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center px-1 py-3 font-medium text-sm border-b-2 transition-colors whitespace-nowrap ${
                activeTab === tab.id
                  ? 'border-indigo-500 text-indigo-400'
                  : 'border-transparent text-gray-400 hover:text-gray-300'
              }`}
            >
              {tab.icon && <tab.icon className="h-4 w-4 mr-2" />}
              {tab.label}
              {tab.count !== undefined && tab.count > 0 && (
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
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-3">
                      <div className="flex items-center space-x-3 min-w-0 flex-1">                        <UserAvatar 
                          username={scroll.author.username}
                          profilePictureUrl={scroll.author.profile_picture_url}
                          size="md"
                          className="ring-2 ring-orange-600"
                        />
                        <div className="min-w-0">
                          <UserLink userId={scroll.author.id} username={scroll.author.username} />
                          <p className="text-gray-400 text-sm">
                            {new Date(scroll.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-col sm:flex-row gap-2 self-start">
                        <button
                          onClick={() => approveScroll(scroll.id)}
                          className="flex items-center justify-center px-3 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                        >
                          <Check className="h-4 w-4 mr-1" />
                          Approve
                        </button>
                        <button
                          onClick={() => rejectScroll(scroll.id)}
                          className="flex items-center justify-center px-3 py-1.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
                        >
                          <X className="h-4 w-4 mr-1" />
                          Reject
                        </button>
                      </div>
                    </div>
                    <MarkdownRenderer content={scroll.scroll_text} className="text-gray-200 leading-relaxed break-words" />
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
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-3">
                      <div className="flex items-center space-x-3 min-w-0 flex-1">                        <UserAvatar 
                          username={scroll.author.username}
                          profilePictureUrl={scroll.author.profile_picture_url}
                          size="md"
                          className="ring-2 ring-green-600"
                        />
                        <div className="min-w-0 flex-1">
                          <UserLink userId={scroll.author.id} username={scroll.author.username} />
                          <p className="text-gray-400 text-sm">
                            {new Date(scroll.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <span className="px-2 py-1 bg-green-600 text-white text-xs rounded-full font-medium flex-shrink-0">
                          Canon
                        </span>
                      </div>
                      <div className="flex flex-col sm:flex-row gap-2 self-start">
                        <button
                          onClick={() => removeFromCanon(scroll.id)}
                          className="flex items-center justify-center px-3 py-1.5 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors text-sm font-medium"
                        >
                          <X className="h-4 w-4 mr-1" />
                          Remove
                        </button>
                        <button
                          onClick={() => deleteScroll(scroll.id)}
                          className="flex items-center justify-center px-3 py-1.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Delete
                        </button>
                      </div>
                    </div>
                    <MarkdownRenderer content={scroll.scroll_text} className="text-gray-200 leading-relaxed break-words" />
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
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-3">
                      <div className="flex items-center space-x-3 min-w-0 flex-1">                        <UserAvatar 
                          username={question.author.username}
                          profilePictureUrl={question.author.profile_picture_url}
                          size="md"
                          className="ring-2 ring-blue-600"
                        />
                        <div className="min-w-0">
                          <UserLink userId={question.author.id} username={question.author.username} />
                          <p className="text-gray-400 text-sm">
                            {new Date(question.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 text-gray-400 flex-shrink-0">
                        <ArrowUp className="h-4 w-4" />
                        <span className="text-sm">{question.upvotes}</span>
                      </div>
                    </div>
                    <MarkdownRenderer content={question.question_text} className="text-gray-200 mb-4 leading-relaxed break-words" />
                    <div className="space-y-3">
                      <RichTextEditor
                        value={answerInputs[question.id] || ''}
                        onChange={(value) => handleAnswerInputChange(question.id, value)}
                        placeholder="Write your detailed answer using formatting..."
                        rows={3}
                        className="w-full"
                        maxLength={5000}
                      />
                      <div className="flex justify-end">
                        <button
                          onClick={() => {
                            if (answerInputs[question.id]?.trim()) {
                              answerQuestion(question.id, answerInputs[question.id].trim());
                            }
                          }}
                          disabled={!answerInputs[question.id]?.trim()}
                          className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                        >
                          <Send className="h-4 w-4 mr-2" />
                          Answer Question
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}        {activeTab === 'inhabitants' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
              <h3 className="text-lg font-medium text-white">World Inhabitants</h3>
              <span className="text-gray-400 text-sm">{inhabitants.length} members</span>
            </div>
            
            <div className="bg-gray-800 rounded-lg overflow-hidden">
              {/* Table view for all screen sizes */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-700">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        User
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Role
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Joined
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-600">
                    {inhabitants.length > 0 ? (
                      inhabitants.map((inhabitant) => (
                        <tr key={inhabitant.id} className="hover:bg-gray-700 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <UserAvatar 
                                username={inhabitant.user.username}
                                profilePictureUrl={inhabitant.user.profile_picture_url}
                                size="md"
                                className="mr-3"
                              />
                              <div>
                                <UserLink 
                                  userId={inhabitant.user.id} 
                                  username={inhabitant.user.username}
                                  className="text-white font-medium"
                                />
                              </div> 
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              inhabitant.role.is_important 
                                ? 'bg-purple-600 text-purple-100' 
                                : 'bg-gray-600 text-gray-200'
                            }`}>
                              {inhabitant.role.name}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-gray-400 text-sm">
                            {new Date(inhabitant.joined_at).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {user?.id !== inhabitant.user.id && (                              <button
                                onClick={() => {
                                  if (window.confirm(`Are you sure you want to remove ${inhabitant.user.username} from this world?`)) {
                                    kickInhabitant(inhabitant.id);
                                  }
                                }}
                                className="text-red-400 hover:text-red-300 transition-colors"
                                title="Remove from world"
                              >
                                <UserX className="h-4 w-4" />
                              </button>
                            )}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={4} className="px-6 py-12 text-center text-gray-400">
                          No inhabitants yet
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
        </div>
      )}

      {/* Other Main Tabs */}
      {mainTab === 'map' && (
        <div>
          <WorldMap worldId={worldId!} isCreator={true} />
        </div>
      )}

      {mainTab === 'gallery' && (
        <div>
          <WorldGallery worldId={worldId!} isCreator={true} />
        </div>
      )}

      {mainTab === 'workboard' && (
        <div>
          <WorldWorkboard worldId={worldId!} isCreator={true} />
        </div>
      )}

      {/* Forms */}
      {showRecordForm && (
        <CreateEditWorldRecordForm
          worldId={worldId!}
          initialData={editingRecord || undefined}
          onSubmit={editingRecord ? updateWorldRecord : createWorldRecord}
          onCancel={() => {
            setShowRecordForm(false);
            setEditingRecord(null);
          }}
        />
      )}      {showTimelineForm && (
        <CreateEditTimelineEntryForm
          worldId={worldId!}
          initialData={editingTimelineEntry || undefined}
          onSubmit={editingTimelineEntry ? updateTimelineEntry : createTimelineEntry}
          onCancel={() => {
            setShowTimelineForm(false);
            setEditingTimelineEntry(null);
          }}
          availableRoles={roles}
          existingEras={timelineEntries.map(entry => entry.era_title)}
        />
      )}
    </div>
  );
}