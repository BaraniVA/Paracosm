import React from 'react';
import { Clock, Edit, Trash2 } from 'lucide-react';

interface TimelineEntry {
  id: string;
  era_title: string;
  year: string;
  description: string;
  created_at: string;
}

interface TimelineEntryCardProps {
  entry: TimelineEntry;
  isCreator: boolean;
  onEdit: (entry: TimelineEntry) => void;
  onDelete: (id: string) => void;
}

export function TimelineEntryCard({ entry, isCreator, onEdit, onDelete }: TimelineEntryCardProps) {
  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this timeline entry?')) {
      onDelete(entry.id);
    }
  };

  return (
    <div className="relative">
      {/* Timeline connector line */}
      <div className="absolute left-6 top-12 bottom-0 w-0.5 bg-gray-600"></div>
      
      <div className="flex items-start space-x-4 pb-8">
        {/* Timeline dot */}
        <div className="w-12 h-12 bg-indigo-600 rounded-full flex items-center justify-center flex-shrink-0 relative z-10">
          <Clock className="h-6 w-6 text-white" />
        </div>
        
        {/* Content */}
        <div className="flex-1 bg-gray-700 rounded-lg p-4">
          <div className="flex justify-between items-start mb-3">
            <div>
              <div className="flex items-center space-x-2 mb-1">
                <span className="text-indigo-400 font-mono text-sm font-bold">{entry.year}</span>
                <span className="text-gray-400">•</span>
                <h4 className="text-white font-semibold">{entry.era_title}</h4>
              </div>
            </div>
            
            {isCreator && (
              <div className="flex space-x-2">
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
          
          <p className="text-gray-200 text-sm leading-relaxed">{entry.description}</p>
          
          <div className="mt-3 text-xs text-gray-400">
            Added {new Date(entry.created_at).toLocaleDateString()}
          </div>
        </div>
      </div>
    </div>
  );
}