import { useState } from 'react';
import { Clock, Edit, Trash2, MapPin, Users, Tag, ChevronDown, ChevronRight, Eye, EyeOff } from 'lucide-react';

interface TimelineEntry {
  id: string;
  era_title: string;
  year: string;
  event_title?: string;
  description: string;
  tag?: string;
  location?: string;
  roles_involved?: string[];
  is_private?: boolean;
  subnotes?: string[];
  created_at: string;
}

interface TimelineEntryCardProps {
  entry: TimelineEntry;
  isCreator: boolean;
  onEdit: (entry: TimelineEntry) => void;
  onDelete: (id: string) => void;
  availableRoles?: Array<{ id: string; name: string }>;
}

const tagColors = {
  general: 'bg-gray-600',
  war: 'bg-red-600',
  magic: 'bg-purple-600',
  ruler: 'bg-yellow-600',
  religion: 'bg-blue-600',
  politics: 'bg-indigo-600',
  discovery: 'bg-green-600',
  disaster: 'bg-orange-600',
  culture: 'bg-pink-600',
  trade: 'bg-emerald-600'
};

export function TimelineEntryCard({ entry, isCreator, onEdit, onDelete, availableRoles = [] }: TimelineEntryCardProps) {
  const [showDetails, setShowDetails] = useState(false);

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this timeline entry?')) {
      onDelete(entry.id);
    }
  };

  const getTagColor = (tag: string) => {
    return tagColors[tag as keyof typeof tagColors] || tagColors.general;
  };

  const getRoleNames = (roleIds: string[]) => {
    if (!roleIds || roleIds.length === 0) return [];
    return roleIds.map(roleId => {
      const role = availableRoles.find(r => r.id === roleId || r.name === roleId);
      return role ? role.name : roleId;
    });
  };  return (
    <div className="relative">
      {/* Timeline connector line */}
      <div className="absolute left-4 sm:left-6 top-10 sm:top-12 bottom-0 w-0.5 bg-gray-600"></div>
      
      <div className="flex items-start space-x-3 sm:space-x-4 pb-6 sm:pb-8">
        {/* Timeline dot */}
        <div className="w-8 h-8 sm:w-12 sm:h-12 bg-indigo-600 rounded-full flex items-center justify-center flex-shrink-0 relative z-10">
          <Clock className="h-4 w-4 sm:h-6 sm:w-6 text-white" />
        </div>
        
        {/* Content */}
        <div className="flex-1 bg-gray-700 rounded-lg p-3 sm:p-4 min-w-0">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 sm:gap-0 mb-3">
            <div className="flex-1 min-w-0">
              <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2 mb-1">
                <div className="flex items-center space-x-2 mb-1 sm:mb-0">
                  <span className="text-indigo-400 font-mono text-xs sm:text-sm font-bold">{entry.year}</span>
                  <span className="text-gray-400 hidden sm:inline">•</span>
                </div>
                <h4 className="text-white font-semibold text-sm sm:text-base break-words">{entry.era_title}</h4>
                {entry.is_private && (
                  <div className="flex items-center text-yellow-400 text-xs mt-1 sm:mt-0">
                    <EyeOff className="h-3 w-3 mr-1" />
                    Private
                  </div>
                )}
              </div>
              
              {entry.event_title && (
                <h5 className="text-gray-200 font-medium mb-2 text-sm sm:text-base break-words">{entry.event_title}</h5>
              )}
              
              <div className="flex flex-wrap gap-1 sm:gap-2 mb-2">
                {entry.tag && (
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium text-white ${getTagColor(entry.tag)}`}>
                    <Tag className="h-3 w-3 mr-1" />
                    {entry.tag}
                  </span>
                )}
                
                {entry.location && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium text-gray-200 bg-gray-600">
                    <MapPin className="h-3 w-3 mr-1" />
                    <span className="break-all">{entry.location}</span>
                  </span>
                )}
                
                {entry.roles_involved && entry.roles_involved.length > 0 && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium text-gray-200 bg-gray-600">
                    <Users className="h-3 w-3 mr-1" />
                    <span className="break-all">{getRoleNames(entry.roles_involved).join(', ')}</span>
                  </span>
                )}
              </div>
            </div>
            
            {isCreator && (
              <div className="flex space-x-2 flex-shrink-0 self-start">
                <button
                  onClick={() => onEdit(entry)}
                  className="p-1 text-gray-400 hover:text-indigo-400 transition-colors"
                >
                  <Edit className="h-4 w-4" />
                </button>
                <button
                  onClick={handleDelete}
                  className="p-1 text-gray-400 hover:text-red-400 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
          
          <p className="text-gray-200 text-sm leading-relaxed mb-3 break-words">{entry.description}</p>
          
          {entry.subnotes && entry.subnotes.length > 0 && (
            <div className="mb-3">
              <button
                onClick={() => setShowDetails(!showDetails)}
                className="flex items-center text-sm text-indigo-400 hover:text-indigo-300 transition-colors mb-2"
              >
                {showDetails ? <ChevronDown className="h-4 w-4 mr-1" /> : <ChevronRight className="h-4 w-4 mr-1" />}
                Additional Details ({entry.subnotes.length})
              </button>
              
              {showDetails && (
                <ul className="space-y-1 pl-4">
                  {entry.subnotes.map((note, index) => (
                    <li key={index} className="text-gray-300 text-sm flex items-start">
                      <span className="text-indigo-400 mr-2 flex-shrink-0">•</span>
                      <span className="break-words">{note}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
          
          <div className="text-xs text-gray-400">
            Added {new Date(entry.created_at).toLocaleDateString()}
          </div>
        </div>
      </div>
    </div>
  );
}