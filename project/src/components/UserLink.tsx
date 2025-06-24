import React from 'react';
import { Link } from 'react-router-dom';

interface UserLinkProps {
  userId: string;
  username: string;
  className?: string;
}

export function UserLink({ userId, username, className = '' }: UserLinkProps) {
  return (
    <Link
      to={`/profile/${userId}`}
      className={`text-indigo-400 font-medium hover:text-indigo-300 transition-colors ${className}`}
    >
      {username}
    </Link>
  );
}
