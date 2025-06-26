import { useState } from 'react';
import { useNotifications } from '../hooks/useNotifications';
import { Scroll, User, MapPin, MessageSquare, ThumbsUp, CheckCircle, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

function getNotificationIcon(type: string) {
  switch (type) {
    case 'world_community_post':
      return <MessageSquare className="h-5 w-5 text-blue-400" />;
    case 'world_question':
      return <MessageSquare className="h-5 w-5 text-yellow-400" />;
    case 'world_lore_submission':
      return <Sparkles className="h-5 w-5 text-purple-400" />;
    case 'comment_upvote':
      return <ThumbsUp className="h-5 w-5 text-green-400" />;
    case 'question_answered':
      return <CheckCircle className="h-5 w-5 text-emerald-400" />;
    case 'lore_approved':
      return <CheckCircle className="h-5 w-5 text-indigo-400" />;
    case 'lore_rejected':
      return <CheckCircle className="h-5 w-5 text-red-400" />;
    case 'post_comment':
      return <MessageSquare className="h-5 w-5 text-blue-400" />;
    default:
      return <Scroll className="h-5 w-5 text-gray-400" />;
  }
}

function formatTimeAgo(dateString: string) {
  const now = new Date();
  
  // Parse the date string more reliably
  let date: Date;
  
  // If the date string has timezone info, use it directly
  if (dateString.includes('Z') || /[+-]\d{2}:\d{2}$/.test(dateString)) {
    date = new Date(dateString);
  } else {
    // For PostgreSQL timestamps without timezone, they are typically stored in UTC
    // but returned without the 'Z' suffix. Add it to ensure proper parsing.
    if (dateString.includes('T')) {
      date = new Date(dateString + 'Z');
    } else {
      // Handle space-separated format
      date = new Date(dateString.replace(' ', 'T') + 'Z');
    }
  }
  
  // Fallback if date is invalid
  if (isNaN(date.getTime())) {
    date = new Date(dateString);
  }
  
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  // Handle negative times (future dates) by showing "just now"
  if (diffInSeconds <= 0) return 'just now';
  
  if (diffInSeconds < 60) return 'just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`; // 7 days
  
  // For older notifications, show the actual date and time
  return date.toLocaleDateString(undefined, { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

export function Chronicle() {
  const [error, setError] = useState<string | null>(null);

  // Use the shared notification context
  let notifications: Array<{
    id: string;
    is_read: boolean;
    type: string;
    title: string;
    message: string;
    created_at: string;
    user_id: string;
    from_user_id?: string;
    related_world_id?: string;
    related_post_id?: string;
    related_comment_id?: string;
    action_url?: string;
    from_user?: {
      username: string;
    };
    world?: {
      name: string;
    };
  }> = [];
  let unreadCount = 0;
  let isLoading = false;
  let markAsRead = async (id: string) => { console.log('markAsRead not initialized', id); };
  let markAllAsRead = async () => { console.log('markAllAsRead not initialized'); };

  try {
    const notificationContext = useNotifications();
    notifications = notificationContext.notifications;
    unreadCount = notificationContext.unreadCount;
    isLoading = notificationContext.isLoading;
    markAsRead = notificationContext.markAsRead;
    markAllAsRead = notificationContext.markAllAsRead;
  } catch {
    setError('Notifications system not available. Please ensure the database is properly set up.');
  }

  // Show setup guide if there's an error with the notification system
  if (error) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-gray-800 rounded-lg p-6">
          <div className="flex items-center space-x-3 mb-6">
            <Scroll className="h-6 w-6 text-indigo-400" />
            <h1 className="text-2xl font-bold text-white">World Chronicle</h1>
          </div>
          
          <div className="text-center py-12">
            <Scroll className="h-12 w-12 text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-yellow-400 mb-2">Chronicle System Setup Required</h3>
            <p className="text-gray-400 mb-4">
              The notification system needs to be set up in your database.
            </p>
            <div className="bg-gray-700 rounded-lg p-4 text-left">
              <p className="text-sm text-gray-300 mb-2">
                <strong>To set up notifications:</strong>
              </p>
              <ol className="text-sm text-gray-400 space-y-1 list-decimal list-inside">
                <li>Go to your Supabase dashboard</li>
                <li>Open the SQL Editor</li>
                <li>Run the migration file: <code className="bg-gray-600 px-1 rounded">20250626000000_create_notifications_table.sql</code></li>
                <li>Refresh this page</li>
              </ol>
            </div>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Refresh Page
            </button>
          </div>
        </div>
      </div>
    );
  }

  const handleNotificationClick = async (notification: { id: string; is_read: boolean }) => {
    if (!notification.is_read) {
      await markAsRead(notification.id);
    }
  };

  const handleMarkAllRead = async () => {
    await markAllAsRead();
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-gray-800 rounded-lg p-6">
          <div className="animate-pulse">
            <div className="h-6 bg-gray-700 rounded w-1/4 mb-4"></div>
            <div className="space-y-3">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-16 bg-gray-700 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-gray-800 rounded-lg p-6 mb-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <Scroll className="h-6 w-6 text-indigo-400" />
            <h1 className="text-2xl font-bold text-white">World Chronicle</h1>
            {unreadCount > 0 && (
              <span className="bg-indigo-600 text-white text-xs px-2 py-1 rounded-full">
                {unreadCount} new
              </span>
            )}
          </div>
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllRead}
              className="text-sm text-indigo-400 hover:text-indigo-300 transition-colors"
            >
              Mark all as read
            </button>
          )}
        </div>

        {notifications.length === 0 ? (
          <div className="text-center py-12">
            <Scroll className="h-12 w-12 text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-400 mb-2">No chronicles yet</h3>
            <p className="text-gray-500">
              When others interact with your worlds or you participate in communities, you'll see updates here.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-4 rounded-lg border transition-all hover:bg-gray-750 cursor-pointer ${
                  notification.is_read
                    ? 'bg-gray-800 border-gray-700'
                    : 'bg-gray-750 border-indigo-500/30 shadow-lg'
                }`}
                onClick={() => handleNotificationClick(notification)}
              >
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 mt-1">
                    {getNotificationIcon(notification.type)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className={`text-sm font-medium ${
                        notification.is_read ? 'text-gray-300' : 'text-white'
                      }`}>
                        {notification.title}
                      </h4>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs text-gray-500">
                          {formatTimeAgo(notification.created_at)}
                        </span>
                        {!notification.is_read && (
                          <div className="h-2 w-2 bg-indigo-500 rounded-full"></div>
                        )}
                      </div>
                    </div>
                    
                    <p className={`text-sm mt-1 ${
                      notification.is_read ? 'text-gray-400' : 'text-gray-300'
                    }`}>
                      {notification.message}
                    </p>
                    
                    <div className="flex items-center space-x-4 mt-2">
                      {notification.from_user && (
                        <div className="flex items-center space-x-2">
                          <User className="h-3 w-3 text-gray-500" />
                          <span className="text-xs text-gray-500">
                            by {notification.from_user.username}
                          </span>
                        </div>
                      )}
                      
                      {notification.world && (
                        <div className="flex items-center space-x-2">
                          <MapPin className="h-3 w-3 text-gray-500" />
                          <span className="text-xs text-gray-500">
                            in {notification.world.name}
                          </span>
                        </div>
                      )}
                    </div>
                    
                    {notification.action_url && (
                      <Link
                        to={notification.action_url}
                        className="inline-flex items-center text-xs text-indigo-400 hover:text-indigo-300 mt-2 transition-colors"
                        onClick={(e) => e.stopPropagation()}
                      >
                        View details →
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
