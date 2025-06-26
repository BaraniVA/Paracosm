import { supabase } from '../lib/supabase';

export interface CreateNotificationParams {
  userId: string;
  type: string;
  title: string;
  message: string;
  relatedWorldId?: string;
  relatedPostId?: string;
  relatedCommentId?: string;
  fromUserId?: string;
  actionUrl?: string;
}

export async function createNotification(params: CreateNotificationParams) {
  try {
    const { error } = await supabase
      .from('notifications')
      .insert({
        user_id: params.userId,
        type: params.type,
        title: params.title,
        message: params.message,
        related_world_id: params.relatedWorldId || null,
        related_post_id: params.relatedPostId || null,
        related_comment_id: params.relatedCommentId || null,
        from_user_id: params.fromUserId || null,
        action_url: params.actionUrl || null,
        is_read: false
      });

    if (error) throw error;
  } catch (error) {
    console.error('Error creating notification:', error);
  }
}

// Helper functions for common notification types
export async function notifyWorldOwner({
  worldId,
  worldOwnerId,
  fromUserId,
  fromUsername,
  worldName,
  action,
  actionUrl
}: {
  worldId: string;
  worldOwnerId: string;
  fromUserId: string;
  fromUsername: string;
  worldName: string;
  action: 'posted' | 'asked' | 'submitted_lore';
  actionUrl?: string;
}) {
  const actionMap = {
    posted: {
      type: 'world_community_post',
      title: 'New Community Post',
      message: `${fromUsername} created a new post in ${worldName}`
    },
    asked: {
      type: 'world_question',
      title: 'New Question',
      message: `${fromUsername} asked a question in ${worldName}`
    },
    submitted_lore: {
      type: 'world_lore_submission',
      title: 'New Lore Submission',
      message: `${fromUsername} submitted lore for ${worldName}`
    }
  };

  const config = actionMap[action];
  
  await createNotification({
    userId: worldOwnerId,
    type: config.type,
    title: config.title,
    message: config.message,
    relatedWorldId: worldId,
    fromUserId,
    actionUrl
  });
}

export async function notifyUserInteraction({
  targetUserId,
  fromUserId,
  fromUsername,
  action,
  context,
  actionUrl
}: {
  targetUserId: string;
  fromUserId: string;
  fromUsername: string;
  action: 'upvoted_comment' | 'answered_question' | 'approved_lore' | 'rejected_lore' | 'commented_on_post';
  context: string;
  actionUrl?: string;
}) {
  const actionMap = {
    upvoted_comment: {
      type: 'comment_upvote',
      title: 'Comment Upvoted',
      message: `${fromUsername} upvoted your comment on ${context}`
    },
    answered_question: {
      type: 'question_answered',
      title: 'Question Answered',
      message: `${fromUsername} answered your question in ${context}`
    },
    approved_lore: {
      type: 'lore_approved',
      title: 'Lore Approved',
      message: `Your lore submission for ${context} was approved`
    },
    rejected_lore: {
      type: 'lore_rejected',
      title: 'Lore Feedback',
      message: `Your lore submission for ${context} needs revision`
    },
    commented_on_post: {
      type: 'post_comment',
      title: 'New Comment',
      message: `${fromUsername} commented on your post in ${context}`
    }
  };

  const config = actionMap[action];
  
  await createNotification({
    userId: targetUserId,
    type: config.type,
    title: config.title,
    message: config.message,
    fromUserId,
    actionUrl
  });
}
