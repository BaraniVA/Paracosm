import React, { useState, useEffect } from 'react';
import { Users, Crown, UserX, AlertTriangle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { UserLink } from './UserLink';
import { UserAvatar } from './UserAvatar';

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

interface InhabitantManagementProps {
  worldId: string;
  isCreator: boolean;
  onInhabitantKicked: () => void;
}

export function InhabitantManagement({ worldId, isCreator, onInhabitantKicked }: InhabitantManagementProps) {
  const [inhabitants, setInhabitants] = useState<Inhabitant[]>([]);
  const [loading, setLoading] = useState(true);
  const [kickingUserId, setKickingUserId] = useState<string | null>(null);

  useEffect(() => {
    fetchInhabitants();
  }, [worldId]);

  const fetchInhabitants = async () => {
    try {
      const { data, error } = await supabase
        .from('inhabitants')
        .select(`
          *,
          user:users!user_id(id, username, email, profile_picture_url),
          role:roles!role_id(id, name, is_important)
        `)
        .eq('world_id', worldId)
        .order('joined_at', { ascending: false });

      if (error) throw error;
      setInhabitants(data || []);
    } catch (error) {
      console.error('Error fetching inhabitants:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleKickInhabitant = async (inhabitantId: string, userId: string, username: string) => {
    if (!confirm(`Are you sure you want to kick ${username} from this world? This action cannot be undone.`)) {
      return;
    }

    setKickingUserId(userId);
    try {
      const currentUser = await supabase.auth.getUser();
      
      // Record the kick
      const { error: kickError } = await supabase
        .from('world_kicks')
        .insert({
          world_id: worldId,
          kicked_user_id: userId,
          kicked_by: currentUser.data.user?.id,
          reason: 'Kicked by world creator'
        });

      if (kickError) throw kickError;

      // Remove from inhabitants
      const { error: removeError } = await supabase
        .from('inhabitants')
        .delete()
        .eq('id', inhabitantId);

      if (removeError) throw removeError;

      // Refresh the list
      await fetchInhabitants();
      onInhabitantKicked();
    } catch (error) {
      console.error('Error kicking inhabitant:', error);
      alert('Failed to kick inhabitant. Please try again.');
    } finally {
      setKickingUserId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-32">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white flex items-center">
          <Users className="h-5 w-5 mr-2" />
          Inhabitants ({inhabitants.length})
        </h3>
      </div>

      {inhabitants.length === 0 ? (
        <div className="text-center py-8">
          <Users className="h-12 w-12 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400">No inhabitants have joined this world yet</p>
        </div>
      ) : (
        <div className="space-y-3">
          {inhabitants.map((inhabitant) => (
            <div
              key={inhabitant.id}
              className="bg-gray-700 rounded-lg p-4 flex items-center justify-between"
            >
              <div className="flex items-center space-x-4">
                <UserAvatar 
                  username={inhabitant.user.username}
                  profilePictureUrl={inhabitant.user.profile_picture_url}
                  size="lg"
                />
                
                <div>                  <div className="flex items-center space-x-2">
                    <UserLink userId={inhabitant.user.id} username={inhabitant.user.username} className="text-white font-medium" />
                    {inhabitant.role.is_important && (
                      <Crown className="h-4 w-4 text-yellow-400" />
                    )}
                  </div>
                  <div className="text-gray-400 text-sm">
                    Role: {inhabitant.role.name}
                  </div>
                  <div className="text-gray-500 text-xs">
                    Joined {new Date(inhabitant.joined_at).toLocaleDateString()}
                  </div>
                </div>
              </div>              {isCreator && (
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleKickInhabitant(
                      inhabitant.id, 
                      inhabitant.user.id, 
                      inhabitant.user.username
                    )}
                    disabled={kickingUserId === inhabitant.user.id}
                    className="p-2 text-gray-400 hover:text-red-400 transition-colors disabled:opacity-50"
                    title="Kick from world"
                  >
                    {kickingUserId === inhabitant.user.id ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-400"></div>
                    ) : (
                      <UserX className="h-4 w-4" />
                    )}
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {isCreator && inhabitants.length > 0 && (
        <div className="bg-yellow-900/20 border border-yellow-600/30 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="h-5 w-5 text-yellow-400 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-yellow-400 font-medium mb-1">Inhabitant Management</h4>
              <p className="text-yellow-200 text-sm">
                As the world creator, you can kick inhabitants from your world. 
                Kicked users will lose access to the world and their contributions will remain but be marked as from a former inhabitant.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}