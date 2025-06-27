

interface UserAvatarProps {
  username: string;
  profilePictureUrl?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const sizeClasses = {
  sm: 'w-6 h-6 text-xs',
  md: 'w-8 h-8 text-sm',
  lg: 'w-10 h-10 text-base',
  xl: 'w-12 h-12 text-lg'
};

export function UserAvatar({ 
  username, 
  profilePictureUrl, 
  size = 'md', 
  className = '' 
}: UserAvatarProps) {
  const sizeClass = sizeClasses[size];
  
  if (profilePictureUrl) {
    return (
      <div className={`${sizeClass} rounded-full overflow-hidden flex-shrink-0 ${className}`}>
        <img
          src={profilePictureUrl}
          alt={`${username}'s profile`}
          className="w-full h-full object-cover"
        />
      </div>
    );
  }

  // Fallback to letter circle
  return (
    <div className={`${sizeClass} bg-indigo-600 rounded-full flex items-center justify-center flex-shrink-0 ${className}`}>
      <span className="text-white font-medium">
        {username[0]?.toUpperCase() || 'U'}
      </span>
    </div>
  );
}
