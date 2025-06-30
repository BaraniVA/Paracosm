import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../lib/supabase';
import { Clipboard, Plus, Edit, Trash2, Pin, Clock, AlertCircle, CheckCircle, X } from 'lucide-react';

interface WorkboardPost {
  id: string;
  world_id: string;
  title: string;
  content: string;
  post_type: string;
  priority: string;
  is_pinned: boolean;
  created_by: string;
  created_at: string;
  updated_at: string;
}

interface WorldWorkboardProps {
  worldId: string;
  isCreator: boolean;
}

export function WorldWorkboard({ worldId, isCreator }: WorldWorkboardProps) {
  const { user } = useAuth();
  const [posts, setPosts] = useState<WorkboardPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingPost, setEditingPost] = useState<WorkboardPost | null>(null);
  const [selectedType, setSelectedType] = useState('all');
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    post_type: 'announcement',
    priority: 'medium',
    is_pinned: false
  });

  const postTypes = [
    { value: 'announcement', label: 'Announcement', icon: '📢', color: 'bg-blue-600' },
    { value: 'update', label: 'Update', icon: '🔄', color: 'bg-green-600' },
    { value: 'notice', label: 'Notice', icon: '📋', color: 'bg-yellow-600' },
    { value: 'reminder', label: 'Reminder', icon: '⏰', color: 'bg-orange-600' },
    { value: 'important', label: 'Important', icon: '❗', color: 'bg-red-600' },
    { value: 'progress', label: 'Progress', icon: '📈', color: 'bg-purple-600' }
  ];

  const priorities = [
    { value: 'low', label: 'Low', color: 'text-gray-400' },
    { value: 'medium', label: 'Medium', color: 'text-yellow-400' },
    { value: 'high', label: 'High', color: 'text-orange-400' },
    { value: 'urgent', label: 'Urgent', color: 'text-red-400' }
  ];

  useEffect(() => {
    fetchPosts();
  }, [worldId]);

  const fetchPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('world_workboard')
        .select('*')
        .eq('world_id', worldId)
        .order('is_pinned', { ascending: false })
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPosts(data || []);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      const postData = {
        ...formData,
        world_id: worldId,
        created_by: user.id,
        updated_at: new Date().toISOString()
      };

      if (editingPost) {
        const { error } = await supabase
          .from('world_workboard')
          .update(postData)
          .eq('id', editingPost.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('world_workboard')
          .insert([postData]);
        if (error) throw error;
      }

      setFormData({
        title: '',
        content: '',
        post_type: 'announcement',
        priority: 'medium',
        is_pinned: false
      });
      setShowForm(false);
      setEditingPost(null);
      fetchPosts();
    } catch (error) {
      console.error('Error saving post:', error);
    }
  };

  const handleEdit = (post: WorkboardPost) => {
    setEditingPost(post);
    setFormData({
      title: post.title,
      content: post.content,
      post_type: post.post_type,
      priority: post.priority,
      is_pinned: post.is_pinned
    });
    setShowForm(true);
  };

  const handleDelete = async (postId: string) => {
    if (!confirm('Are you sure you want to delete this post?')) return;

    try {
      const { error } = await supabase
        .from('world_workboard')
        .delete()
        .eq('id', postId);

      if (error) throw error;
      fetchPosts();
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  const togglePin = async (post: WorkboardPost) => {
    try {
      const { error } = await supabase
        .from('world_workboard')
        .update({ is_pinned: !post.is_pinned })
        .eq('id', post.id);

      if (error) throw error;
      fetchPosts();
    } catch (error) {
      console.error('Error toggling pin:', error);
    }
  };

  const getTypeConfig = (type: string) => {
    return postTypes.find(t => t.value === type) || postTypes[0];
  };

  const getPriorityConfig = (priority: string) => {
    return priorities.find(p => p.value === priority) || priorities[1];
  };

  const filteredPosts = posts.filter(post => 
    selectedType === 'all' || post.post_type === selectedType
  );

  const uniqueTypes = ['all', ...Array.from(new Set(posts.map(post => post.post_type)))];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div className="flex items-center space-x-3">
          <Clipboard className="h-6 w-6 text-indigo-400" />
          <h2 className="text-2xl font-bold text-white">Workboard</h2>
          <span className="text-gray-400 text-sm">
            {isCreator ? 'Manage updates and announcements' : 'Latest updates from the creator'}
          </span>
        </div>
        
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
          {/* Type Filter */}
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm"
          >
            {uniqueTypes.map(type => {
              const typeConfig = type === 'all' ? null : getTypeConfig(type);
              return (
                <option key={type} value={type}>
                  {type === 'all' ? 'All Types' : typeConfig?.label || type}
                </option>
              );
            })}
          </select>

          {isCreator && (
            <button
              onClick={() => {
                setEditingPost(null);
                setFormData({
                  title: '',
                  content: '',
                  post_type: 'announcement',
                  priority: 'medium',
                  is_pinned: false
                });
                setShowForm(true);
              }}
              className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              <Plus className="h-4 w-4 mr-2" />
              New Post
            </button>
          )}
        </div>
      </div>

      {/* Posts List */}
      <div className="space-y-4">
        {filteredPosts.map((post) => {
          const typeConfig = getTypeConfig(post.post_type);
          const priorityConfig = getPriorityConfig(post.priority);
          
          return (
            <div
              key={post.id}
              className={`bg-gray-800 rounded-lg p-6 border border-gray-700 ${
                post.is_pinned ? 'ring-2 ring-yellow-500 ring-opacity-50' : ''
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start space-x-3 flex-1">
                  {/* Type Badge */}
                  <div className={`${typeConfig.color} text-white px-3 py-1 rounded-full text-sm font-medium flex items-center space-x-1 flex-shrink-0`}>
                    <span>{typeConfig.icon}</span>
                    <span>{typeConfig.label}</span>
                  </div>
                  
                  {/* Pin Indicator */}
                  {post.is_pinned && (
                    <Pin className="h-5 w-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                  )}
                  
                  {/* Title and Priority */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className="text-lg font-semibold text-white truncate">{post.title}</h3>
                      <span className={`text-xs font-medium ${priorityConfig.color} uppercase tracking-wide`}>
                        {priorityConfig.label}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2 text-gray-400 text-sm">
                      <Clock className="h-4 w-4" />
                      <span>{new Date(post.created_at).toLocaleDateString()}</span>
                      {post.updated_at !== post.created_at && (
                        <span className="text-gray-500">
                          (Updated {new Date(post.updated_at).toLocaleDateString()})
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                {isCreator && (
                  <div className="flex items-center space-x-2 flex-shrink-0">
                    <button
                      onClick={() => togglePin(post)}
                      className={`p-2 rounded-lg transition-colors ${
                        post.is_pinned 
                          ? 'bg-yellow-600 text-white hover:bg-yellow-700' 
                          : 'bg-gray-700 text-gray-400 hover:bg-gray-600 hover:text-white'
                      }`}
                      title={post.is_pinned ? 'Unpin post' : 'Pin post'}
                    >
                      <Pin className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleEdit(post)}
                      className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(post.id)}
                      className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="prose prose-invert max-w-none">
                <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">{post.content}</p>
              </div>
            </div>
          );
        })}
      </div>

      {filteredPosts.length === 0 && (
        <div className="text-center py-12">
          <Clipboard className="h-16 w-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-400 mb-2">No posts yet</h3>
          <p className="text-gray-500">
            {selectedType === 'all' 
              ? isCreator 
                ? 'Start communicating with your community by creating your first post'
                : 'The creator hasn\'t posted any updates yet'
              : `No ${getTypeConfig(selectedType)?.label.toLowerCase()} posts found`
            }
          </p>
          {isCreator && (
            <button
              onClick={() => setShowForm(true)}
              className="mt-4 inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create First Post
            </button>
          )}
        </div>
      )}

      {/* Post Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-white">
                {editingPost ? 'Edit Post' : 'Create New Post'}
              </h3>
              <button
                onClick={() => {
                  setShowForm(false);
                  setEditingPost(null);
                }}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                  placeholder="Enter post title..."
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Type</label>
                  <select
                    value={formData.post_type}
                    onChange={(e) => setFormData(prev => ({ ...prev, post_type: e.target.value }))}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                  >
                    {postTypes.map(type => (
                      <option key={type.value} value={type.value}>
                        {type.icon} {type.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Priority</label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value }))}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                  >
                    {priorities.map(priority => (
                      <option key={priority.value} value={priority.value}>
                        {priority.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Content</label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                  rows={8}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white resize-none"
                  placeholder="Write your post content..."
                  required
                />
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="is_pinned"
                  checked={formData.is_pinned}
                  onChange={(e) => setFormData(prev => ({ ...prev, is_pinned: e.target.checked }))}
                  className="rounded"
                />
                <label htmlFor="is_pinned" className="text-sm text-gray-300 flex items-center space-x-1">
                  <Pin className="h-4 w-4" />
                  <span>Pin this post to the top</span>
                </label>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingPost(null);
                  }}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-500 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  {editingPost ? 'Update' : 'Create'} Post
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}