import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../lib/supabase';
import { notifyUserInteraction } from '../lib/notifications';
import { CommentThread } from '../components/CommentThread';
import { VotingSystem } from '../components/VotingSystem';
import { UserLink } from '../components/UserLink';
import { ArrowLeft, MessageCircle, Calendar, User } from 'lucide-react';

interface CommunityPost {
  id: string;
  title: string;
  content: string;
  upvotes: number;
  created_at: string;
  author: { id: string; username: string };
  world: { title: string; creator_id: string };
}

interface CommunityComment {
  id: string;
  comment_text: string;
  created_at: string;
  parent_comment_id: string | null;
  author: { id: string; username: string };
  replies?: CommunityComment[];
}

export function CommunityPostDetail() {
  const { worldId, postId } = useParams<{ worldId: string; postId: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [post, setPost] = useState<CommunityPost | null>(null);
  const [comments, setComments] = useState<CommunityComment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (!worldId || !postId) return;
    fetchPostData();
  }, [worldId, postId]);

  const fetchPostData = async () => {    try {
      // Fetch the specific community post
      const { data: postData, error: postError } = await supabase
        .from('community_posts')
        .select(`
          *,
          author:users!author_id(id, username),
          world:worlds!world_id(title, creator_id)
        `)
        .eq('id', postId)
        .eq('world_id', worldId)
        .single();

      if (postError) throw postError;      setPost(postData);

      // Fetch all comments for this post
      const { data: commentsData, error: commentsError } = await supabase
        .from('community_comments')
        .select(`
          *,
          author:users!author_id(id, username)
        `)
        .eq('post_id', postId)
        .order('created_at', { ascending: true });

      if (commentsError) throw commentsError;
      setComments(commentsData || []);
    } catch (error: any) {
      console.error('Error fetching post data:', error);
      setError(error.message || 'Failed to load post');
    } finally {
      setLoading(false);
    }
  };

  const submitComment = async (postId: string, commentText: string, parentCommentId?: string) => {
    if (!user || !commentText.trim()) return;

    try {
      const { error } = await supabase
        .from('community_comments')
        .insert([
          {
            post_id: postId,
            author_id: user.id,
            comment_text: commentText.trim(),
            parent_comment_id: parentCommentId || null,
          },
        ]);

      if (error) throw error;

      // Notify post author if commenter is not the author
      if (post && post.author.id !== user.id) {
        await notifyUserInteraction({
          targetUserId: post.author.id,
          fromUserId: user.id,
          fromUsername: user.user_metadata?.username || user.email?.split('@')[0] || 'Anonymous',
          action: 'commented_on_post',
          context: `${post.world.title}`,
          actionUrl: `/world/${worldId}/community/${postId}`
        });
      }

      fetchPostData(); // Refresh comments
    } catch (error) {
      console.error('Error submitting comment:', error);
      throw error;
    }
  };

  const deleteComment = async (commentId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('community_comments')
        .delete()
        .eq('id', commentId);

      if (error) throw error;
      fetchPostData(); // Refresh comments
    } catch (error) {
      console.error('Error deleting comment:', error);
      throw error;
    }
  };  const handleVoteChange = (newVoteCount: number) => {
    if (post) {
      setPost({ ...post, upvotes: newVoteCount });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-indigo-500 border-t-transparent"></div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="text-center py-12">
        <div className="text-red-400 mb-4">{error || 'Post not found'}</div>
        <Link
          to={`/world/${worldId}`}
          className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to World
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Navigation */}
      <div className="flex items-center space-x-4">
        <Link
          to={`/world/${worldId}`}
          className="flex items-center text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to {post.world.title}
        </Link>
        <span className="text-gray-600">•</span>
        <span className="text-gray-400">Community Discussion</span>
      </div>

      {/* Post Content */}
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-indigo-600 rounded-full flex items-center justify-center">
              <User className="h-6 w-6 text-white" />
            </div>            <div>
              <UserLink userId={post.author.id} username={post.author.username} className="text-white font-semibold" />
              <div className="flex items-center space-x-2 text-gray-400 text-sm">
                <Calendar className="h-4 w-4" />
                <span>{new Date(post.created_at).toLocaleDateString()}</span>
                <span>•</span>
                <span>{new Date(post.created_at).toLocaleTimeString()}</span>
              </div>
            </div>
          </div>          <VotingSystem
            targetType="community_post"
            targetId={post.id}
            currentVotes={post.upvotes}
            onVoteChange={handleVoteChange}
            targetAuthorId={post.author.id}
            worldName={post.world.title}
          />
        </div>

        <h1 className="text-2xl font-bold text-white mb-4">{post.title}</h1>
        <div className="prose prose-invert max-w-none">
          <p className="text-gray-200 leading-relaxed whitespace-pre-wrap">{post.content}</p>
        </div>

        <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-700">
          <div className="flex items-center space-x-4 text-gray-400 text-sm">
            <div className="flex items-center space-x-1">
              <MessageCircle className="h-4 w-4" />
              <span>{comments.length} {comments.length === 1 ? 'comment' : 'comments'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Comments Section */}
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <h2 className="text-lg font-semibold text-white mb-6">
          Discussion ({comments.length})
        </h2>
        
        <CommentThread
          postId={post.id}
          comments={comments}
          user={user}
          worldCreatorId={post.world.creator_id}
          onSubmitComment={submitComment}
          onDeleteComment={deleteComment}
        />
      </div>
    </div>
  );
}