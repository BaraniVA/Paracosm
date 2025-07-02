import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './useAuth';

export interface Notification {
  id: string;
  user_id: string;
  type: string;
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
  related_world_id?: string;
  related_post_id?: string;
  related_comment_id?: string;
  from_user_id?: string;
  action_url?: string;
  from_user?: {
    username: string;
  };
  world?: {
    name: string;
  };
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
  markAsRead: (notificationId: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  fetchNotifications: () => Promise<void>;
  createNotification: (notification: Omit<Notification, 'id' | 'created_at' | 'is_read'>) => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
}

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchNotifications = useCallback(async () => {
    if (!user) {
      setNotifications([]);
      return;
    }
    
    setIsLoading(true);
    try {
      // Use a single query with joins to get all data at once instead of multiple queries
      const { data, error } = await supabase
        .from('notifications')
        .select(`
          *,
          from_user:users!from_user_id(username),
          world:worlds!related_world_id(title)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(15); // Limit to 15 most recent notifications to reduce data transfer

      if (error) {
        if (error.code === 'PGRST200' || error.message?.includes('Could not find')) {
          console.warn('Notifications table not found. Please create the notifications table in Supabase.');
          setNotifications([]);
          return;
        }
        throw error;
      }
      
      // Transform the data to match expected structure
      const enhancedNotifications = (data || []).map(notification => ({
        ...notification,
        from_user: notification.from_user,
        world: notification.world ? { name: notification.world.title } : null
      }));
      
      setNotifications(enhancedNotifications);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      setNotifications([]);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  const markAsRead = useCallback(async (notificationId: string) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', notificationId);

      if (error) throw error;

      setNotifications(prev => 
        prev.map(n => n.id === notificationId ? { ...n, is_read: true } : n)
      );
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  }, []);

  const markAllAsRead = useCallback(async () => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('user_id', user.id)
        .eq('is_read', false);

      if (error) throw error;

      setNotifications(prev => 
        prev.map(n => ({ ...n, is_read: true }))
      );
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  }, [user]);

  const createNotification = useCallback(async (notificationData: Omit<Notification, 'id' | 'created_at' | 'is_read'>) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .insert({
          ...notificationData,
          is_read: false
        });

      if (error) throw error;
    } catch (error) {
      console.error('Error creating notification:', error);
    }
  }, []);

  // Set up real-time subscription with throttling
  useEffect(() => {
    if (!user) return;

    let timeoutId: NodeJS.Timeout | null = null;

    const handleNotificationChange = (payload: any) => {
      // Debounce refetch calls to prevent excessive API calls
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      
      timeoutId = setTimeout(() => {
        fetchNotifications();
      }, 1000); // Wait 1 second before refetching
    };

    const channel = supabase
      .channel('notifications')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${user.id}`
        },
        handleNotificationChange
      )
      .subscribe();

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      supabase.removeChannel(channel);
    };
  }, [user, fetchNotifications]);

  // Initial fetch
  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const unreadCount = notifications.filter(n => !n.is_read).length;

  const value: NotificationContextType = {
    notifications,
    unreadCount,
    isLoading,
    markAsRead,
    markAllAsRead,
    fetchNotifications,
    createNotification
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}

// Keep the old hook for backward compatibility, but make it use the context
export function useNotificationState() {
  return useNotifications();
}
