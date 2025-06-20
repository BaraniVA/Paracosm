import React from 'react';
import { BookOpen, ExternalLink } from 'lucide-react';

interface WorldRecord {
  id: string;
  title: string;
  description: string;
  category: string;
  linked_to_type: string | null;
  linked_to_id: string | null;
  created_at: string;
}

interface WorldRecordCardProps {
  record: WorldRecord;
  onView: (record: WorldRecord) => void;
}

export function WorldRecordCard({ record, onView }: WorldRecordCardProps) {
  const truncateText = (text: string, maxLength: number = 150) => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength).trim() + '...';
  };

  return (
    <div 
      className="bg-gray-700 rounded-lg p-4 hover:bg-gray-600 transition-colors cursor-pointer"
      onClick={() => onView(record)}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-2">
          <BookOpen className="h-4 w-4 text-indigo-400 flex-shrink-0" />
          <h4 className="font-medium text-white text-sm">{record.title}</h4>
        </div>
        {record.linked_to_type && (
          <div className="flex items-center space-x-1 text-xs text-gray-400">
            <ExternalLink className="h-3 w-3" />
            <span>Linked</span>
          </div>
        )}
      </div>
      
      <p className="text-gray-300 text-xs leading-relaxed mb-3">
        {truncateText(record.description, 100)}
      </p>
      
      <div className="flex justify-between items-center text-xs text-gray-400">
        <span className="bg-gray-600 px-2 py-1 rounded text-xs">
          {record.category}
        </span>
        <span>{new Date(record.created_at).toLocaleDateString()}</span>
      </div>
    </div>
  );
}