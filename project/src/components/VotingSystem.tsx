import React, { useState, useEffect } from 'react';
import { ArrowUp, ArrowDown } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';

interface VotingSystemProps {
  targetType: 'question' | 'community_post' | 'community_comment';
  targetId: string;
  currentVotes: number;
  onVoteChange: (newVoteCount: number) => void;
  className?: string;
}

export function VotingSystem({ 
  targetType, 
  targetId, 
  currentVotes, 
  onVoteChange,
  className = '' 
}: VotingSystemProps) {
  const { user } = useAuth();
  const [userVote, setUserVote] = useState<'upvote' | 'downvote' | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      checkUserVote();
    }
  }, [user, targetId]);

  const checkUserVote = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('votes')
        .select('vote_type')
        .eq('user_id', user.id)
        .eq('target_type', targetType)
        .eq('target_id', targetId)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error checking user vote:', error);
        return;
      }

      setUserVote(data?.vote_type || null);
    } catch (error) {
      console.error('Error checking user vote:', error);
    }
  };

  const handleVote = async (voteType: 'upvote' | 'downvote') => {
    if (!user || isLoading) return;

    setIsLoading(true);
    try {
      // If user already voted the same way, remove the vote
      if (userVote === voteType) {
        const { error: deleteError } = await supabase
          .from('votes')
          .delete()
          .eq('user_id', user.id)
          .eq('target_type', targetType)
          .eq('target_id', targetId);

        if (deleteError) throw deleteError;

        // Update the target's vote count
        const newVoteCount = voteType === 'upvote' ? currentVotes - 1 : currentVotes + 1;
        await updateTargetVoteCount(newVoteCount);
        
        setUserVote(null);
        onVoteChange(newVoteCount);
      } else {
        // Insert or update vote
        const { error: upsertError } = await supabase
          .from('votes')
          .upsert({
            user_id: user.id,
            target_type: targetType,
            target_id: targetId,
            vote_type: voteType
          });

        if (upsertError) throw upsertError;

        // Calculate new vote count
        let newVoteCount = currentVotes;
        if (userVote === null) {
          // No previous vote
          newVoteCount = voteType === 'upvote' ? currentVotes + 1 : currentVotes - 1;
        } else {
          // Changing vote
          newVoteCount = voteType === 'upvote' ? currentVotes + 2 : currentVotes - 2;
        }

        await updateTargetVoteCount(newVoteCount);
        
        setUserVote(voteType);
        onVoteChange(newVoteCount);
      }
    } catch (error) {
      console.error('Error voting:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateTargetVoteCount = async (newCount: number) => {
    const tableName = targetType === 'question' ? 'questions' : 'community_posts';
    const { error } = await supabase
      .from(tableName)
      .update({ upvotes: newCount })
      .eq('id', targetId);

    if (error) throw error;
  };
  if (!user) {
    return (
      <div className={`flex items-center space-x-1 text-gray-400 ${className}`}>
        <ArrowUp className="h-4 w-4" />
        <span className="font-semibold">{currentVotes}</span>
      </div>
    );
  }

  return (
    <div className={`flex items-center space-x-1 ${className}`}>
      <button
        onClick={() => handleVote('upvote')}
        disabled={isLoading}
        className={`p-1 rounded transition-colors ${
          userVote === 'upvote'
            ? 'text-green-400 bg-green-400/20'
            : 'text-gray-400 hover:text-green-400 hover:bg-green-400/10'
        } disabled:opacity-50`}
      >
        <ArrowUp className="h-4 w-4" />
      </button>
      
      <span className={`font-semibold min-w-[2rem] text-center ${
        userVote === 'upvote' ? 'text-green-400' : 
        userVote === 'downvote' ? 'text-red-400' : 'text-gray-300'
      }`}>
        {currentVotes}
      </span>
      
      <button
        onClick={() => handleVote('downvote')}
        disabled={isLoading}
        className={`p-1 rounded transition-colors ${
          userVote === 'downvote'
            ? 'text-red-400 bg-red-400/20'
            : 'text-gray-400 hover:text-red-400 hover:bg-red-400/10'
        } disabled:opacity-50`}
      >
        <ArrowDown className="h-4 w-4" />
      </button>
    </div>
  );
}