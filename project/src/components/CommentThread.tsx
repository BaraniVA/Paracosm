import React, { useState } from 'react';
import { CommentItem } from './CommentItem';
import { Send } from 'lucide-react';

interface CommunityComment {
  id: string;
  comment_text: string;
  created_at: string;
  parent_comment_id: string | null;
  author: { username: string };
  replies?: CommunityComment[];
}

interface CommentThreadProps {
  postId: string;
  comments: CommunityComment[];
  user: any;
  worldCreatorId: string;
  onSubmitComment: (postId: string, commentText: string, parentCommentId?: string) => Promise<void>;
  onDeleteComment: (commentId: string) => Promise<void>;
}

export function CommentThread({ 
  postId, 
  comments, 
  user, 
  worldCreatorId,
  onSubmitComment, 
  onDeleteComment 
}: CommentThreadProps) {
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Build comment tree from flat array
  const buildCommentTree = (comments: CommunityComment[]): CommunityComment[] => {
    const commentMap = new Map<string, CommunityComment>();
    const rootComments: CommunityComment[] = [];

    // First pass: create map of all comments
    comments.forEach(comment => {
      commentMap.set(comment.id, { ...comment, replies: [] });
    });

    // Second pass: build tree structure
    comments.forEach(comment => {
      const commentWithReplies = commentMap.get(comment.id)!;
      
      if (comment.parent_comment_id) {
        // This is a reply, add it to parent's replies
        const parent = commentMap.get(comment.parent_comment_id);
        if (parent) {
          parent.replies = parent.replies || [];
          parent.replies.push(commentWithReplies);
        }
      } else {
        // This is a root comment
        rootComments.push(commentWithReplies);
      }
    });

    // Sort root comments by creation date (newest first)
    rootComments.sort((a, b) => 
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );

    // Sort replies within each comment thread (oldest first for better conversation flow)
    const sortReplies = (comment: CommunityComment) => {
      if (comment.replies && comment.replies.length > 0) {
        comment.replies.sort((a, b) => 
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        );
        comment.replies.forEach(sortReplies);
      }
    };

    rootComments.forEach(sortReplies);
    return rootComments;
  };

  const handleSubmitTopLevelComment = async () => {
    if (!newComment.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await onSubmitComment(postId, newComment.trim());
      setNewComment('');
    } catch (error) {
      console.error('Error submitting comment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmitTopLevelComment();
    }
  };

  const threadedComments = buildCommentTree(comments);

  return (
    <div className="border-t border-gray-700 pt-4">
      {/* Comments Display */}
      <div className="space-y-0 mb-4">
        {threadedComments.length > 0 ? (
          threadedComments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              postId={postId}
              user={user}
              worldCreatorId={worldCreatorId}
              onSubmitComment={onSubmitComment}
              onDeleteComment={onDeleteComment}
              depth={0}
              maxDepth={5}
            />
          ))
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-400 text-sm">No comments yet</p>
            {user && (
              <p className="text-gray-500 text-xs mt-1">Be the first to comment!</p>
            )}
          </div>
        )}
      </div>

      {/* New Comment Input */}
      {user && (
        <div className="space-y-3">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Add a comment..."
            rows={3}
            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
            disabled={isSubmitting}
          />
          <div className="flex justify-end">
            <button
              onClick={handleSubmitTopLevelComment}
              disabled={!newComment.trim() || isSubmitting}
              className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
            >
              <Send className="h-4 w-4 mr-2" />
              {isSubmitting ? 'Posting...' : 'Comment'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}