import React, { useState } from 'react';
import { MessageCircle, CornerDownRight, Trash2, MoreHorizontal } from 'lucide-react';
import { UserLink } from './UserLink';

interface CommunityComment {
  id: string;
  comment_text: string;
  created_at: string;
  parent_comment_id: string | null;
  author: { id: string; username: string };
  replies?: CommunityComment[];
}

interface CommentItemProps {
  comment: CommunityComment;
  postId: string;
  user: any;
  worldCreatorId: string;
  onSubmitComment: (postId: string, commentText: string, parentCommentId?: string) => Promise<void>;
  onDeleteComment: (commentId: string) => Promise<void>;
  depth?: number;
  maxDepth?: number;
}

export function CommentItem({ 
  comment, 
  postId, 
  user, 
  worldCreatorId,
  onSubmitComment, 
  onDeleteComment,
  depth = 0, 
  maxDepth = 5 
}: CommentItemProps) {
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showActions, setShowActions] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleSubmitReply = async () => {
    if (!replyText.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await onSubmitComment(postId, replyText.trim(), comment.id);
      setReplyText('');
      setShowReplyInput(false);
    } catch (error) {
      console.error('Error submitting reply:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteComment = async () => {
    if (!confirm('Are you sure you want to delete this comment? This action cannot be undone.')) {
      return;
    }

    setIsDeleting(true);
    try {
      await onDeleteComment(comment.id);
    } catch (error) {
      console.error('Error deleting comment:', error);
      alert('Failed to delete comment. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmitReply();
    }
  };

  const canReply = user && depth < maxDepth;
  const canDelete = user && (user.id === comment.author.id || user.id === worldCreatorId);
  const indentLevel = Math.min(depth, 3); // Limit visual indentation
  const marginLeft = indentLevel * 24; // 24px per level

  return (
    <div className="relative" style={{ marginLeft: `${marginLeft}px` }}>
      {/* Indent indicator line for nested comments */}
      {depth > 0 && (
        <div 
          className="absolute left-0 top-0 bottom-0 w-0.5 bg-gray-600"
          style={{ left: `-${marginLeft - 12}px` }}
        />
      )}
      
      <div className="bg-gray-700 rounded-lg p-4 mb-3">
        <div className="flex items-start space-x-3">
          <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-white text-sm font-medium">
              {comment.author.username[0].toUpperCase()}
            </span>
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">                <UserLink 
                  userId={comment.author.id} 
                  username={comment.author.username} 
                  className="text-white font-medium text-sm"
                />
                <span className="text-gray-400 text-xs">
                  {new Date(comment.created_at).toLocaleDateString()}
                </span>
                {depth > 0 && (
                  <CornerDownRight className="h-3 w-3 text-gray-500" />
                )}
              </div>
              
              {/* Actions Menu */}
              {canDelete && (
                <div className="relative">
                  <button
                    onClick={() => setShowActions(!showActions)}
                    className="p-1 text-gray-400 hover:text-gray-300 transition-colors"
                    disabled={isDeleting}
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </button>
                  
                  {showActions && (
                    <div className="absolute right-0 top-6 bg-gray-800 border border-gray-600 rounded-lg shadow-lg z-10 min-w-[120px]">
                      <button
                        onClick={() => {
                          setShowActions(false);
                          handleDeleteComment();
                        }}
                        disabled={isDeleting}
                        className="w-full px-3 py-2 text-left text-red-400 hover:bg-gray-700 transition-colors text-sm flex items-center space-x-2 disabled:opacity-50"
                      >
                        <Trash2 className="h-3 w-3" />
                        <span>{isDeleting ? 'Deleting...' : 'Delete'}</span>
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
            
            <p className="text-gray-200 text-sm leading-relaxed mb-3 break-words">
              {comment.comment_text}
            </p>
            
            {canReply && (
              <button
                onClick={() => setShowReplyInput(!showReplyInput)}
                className="flex items-center space-x-1 text-gray-400 hover:text-gray-300 text-xs font-medium transition-colors"
              >
                <MessageCircle className="h-3 w-3" />
                <span>Reply</span>
              </button>
            )}
          </div>
        </div>

        {/* Reply Input */}
        {showReplyInput && user && (
          <div className="mt-3 ml-11 space-y-2">
            <textarea
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={`Reply to ${comment.author.username}...`}
              rows={2}
              className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none text-sm"
              disabled={isSubmitting}
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => {
                  setShowReplyInput(false);
                  setReplyText('');
                }}
                className="px-3 py-1 text-gray-400 hover:text-gray-300 text-xs font-medium transition-colors"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitReply}
                disabled={!replyText.trim() || isSubmitting}
                className="px-3 py-1 bg-indigo-600 text-white rounded text-xs font-medium hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isSubmitting ? 'Replying...' : 'Reply'}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Render nested replies */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="space-y-0">
          {comment.replies.map((reply) => (
            <CommentItem
              key={reply.id}
              comment={reply}
              postId={postId}
              user={user}
              worldCreatorId={worldCreatorId}
              onSubmitComment={onSubmitComment}
              onDeleteComment={onDeleteComment}
              depth={depth + 1}
              maxDepth={maxDepth}
            />
          ))}
        </div>
      )}
    </div>
  );
}