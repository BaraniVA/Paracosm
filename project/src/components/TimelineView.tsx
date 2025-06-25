import { useState } from 'react';
import { ChevronDown, ChevronRight, Plus, Filter } from 'lucide-react';
import { TimelineEntryCard } from './TimelineEntryCard';

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

interface TimelineViewProps {
  entries: TimelineEntry[];
  isCreator: boolean;
  showPrivate?: boolean;
  onEdit: (entry: TimelineEntry) => void;
  onDelete: (id: string) => void;
  onCreateNew?: () => void;
  availableRoles?: Array<{ id: string; name: string }>;
}

export function TimelineView({ 
  entries, 
  isCreator, 
  showPrivate = false, 
  onEdit, 
  onDelete, 
  onCreateNew,
  availableRoles = []
}: TimelineViewProps) {
  const [expandedEras, setExpandedEras] = useState<{ [key: string]: boolean }>({});
  const [filterTag, setFilterTag] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);

  // Filter entries based on privacy settings and selected tag
  const filteredEntries = entries.filter(entry => {
    if (!showPrivate && entry.is_private && !isCreator) return false;
    if (filterTag !== 'all' && entry.tag !== filterTag) return false;
    return true;
  });

  // Group entries by era
  const entriesByEra = filteredEntries.reduce((acc, entry) => {
    if (!acc[entry.era_title]) {
      acc[entry.era_title] = [];
    }
    acc[entry.era_title].push(entry);
    return acc;
  }, {} as { [key: string]: TimelineEntry[] });
  // Sort entries within each era by year first
  Object.keys(entriesByEra).forEach(era => {
    entriesByEra[era].sort((a, b) => {
      const yearA = parseFloat(a.year.replace(/[^\d.-]/g, '')) || 0;
      const yearB = parseFloat(b.year.replace(/[^\d.-]/g, '')) || 0;
      return yearA - yearB;
    });
  });

  // Sort eras chronologically by their earliest year
  const sortedEras = Object.keys(entriesByEra).sort((eraA, eraB) => {
    const earliestYearA = parseFloat(entriesByEra[eraA][0]?.year.replace(/[^\d.-]/g, '') || '0') || 0;
    const earliestYearB = parseFloat(entriesByEra[eraB][0]?.year.replace(/[^\d.-]/g, '') || '0') || 0;
    return earliestYearA - earliestYearB;
  });

  const toggleEra = (era: string) => {
    setExpandedEras(prev => ({
      ...prev,
      [era]: !prev[era]
    }));
  };

  const getUniqueTagsFromEntries = () => {
    const tags = new Set(filteredEntries.map(entry => entry.tag).filter(Boolean));
    return Array.from(tags);
  };

  const getEraStats = (era: string) => {
    const eraEntries = entriesByEra[era];
    const totalEvents = eraEntries.length;
    const privateEvents = eraEntries.filter(entry => entry.is_private).length;
    return { totalEvents, privateEvents };
  };

  const getEraYearRange = (era: string) => {
    const eraEntries = entriesByEra[era];
    if (eraEntries.length === 0) return '';
    
    const years = eraEntries.map(entry => 
      parseFloat(entry.year.replace(/[^\d.-]/g, '')) || 0
    ).filter(year => year !== 0);
    
    if (years.length === 0) return '';
    
    const minYear = Math.min(...years);
    const maxYear = Math.max(...years);
    
    if (minYear === maxYear) return minYear.toString();
    return `${minYear} - ${maxYear}`;
  };

  if (filteredEntries.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 mb-4">
          <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-300 mb-2">No timeline entries yet</h3>
        <p className="text-gray-400 mb-6">Start building your world's history by creating the first timeline entry.</p>
        {onCreateNew && (
          <button
            onClick={onCreateNew}
            className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create First Entry
          </button>
        )}
      </div>
    );
  }

  return (    <div className="space-y-4">
      {/* Header with filters */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
          <h2 className="text-xl font-semibold text-white">Timeline</h2>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center px-3 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition-colors text-sm w-fit"
          >
            <Filter className="h-4 w-4 mr-1" />
            Filters
          </button>
        </div>
        
        {onCreateNew && (
          <button
            onClick={onCreateNew}
            className="flex items-center justify-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium w-full sm:w-auto"
          >
            <Plus className="h-4 w-4 mr-2" />
            <span className="sm:inline">Add Entry</span>
          </button>
        )}
      </div>

      {/* Filter panel */}
      {showFilters && (
        <div className="bg-gray-800 rounded-lg p-4">
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Filter by Tag
              </label>
              <select
                value={filterTag}
                onChange={(e) => setFilterTag(e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
              >
                <option value="all">All Tags</option>               
                 {getUniqueTagsFromEntries().map(tag => (
                  <option key={tag} value={tag}>
                    {tag ? tag.charAt(0).toUpperCase() + tag.slice(1) : 'Unknown'}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}{/* Timeline entries grouped by era */}
      <div className="space-y-2">
        {sortedEras.map(era => {
          const { totalEvents, privateEvents } = getEraStats(era);
          const isExpanded = expandedEras[era] !== false; // Default to expanded
          
          return (
            <div key={era} className="bg-gray-800 rounded-lg overflow-hidden">
              {/* Era header */}
              <button
                onClick={() => toggleEra(era)}
                className="w-full px-4 py-3 bg-gray-750 hover:bg-gray-700 transition-colors flex items-center justify-between"
              >
                <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
                  {isExpanded ? (
                    <ChevronDown className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 flex-shrink-0" />
                  ) : (
                    <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 flex-shrink-0" />
                  )}
                  <div className="min-w-0 flex-1">
                    <h3 className="text-sm sm:text-lg font-semibold text-white break-words text-left">
                      {era}
                      {getEraYearRange(era) && (
                        <span className="block sm:inline text-xs sm:text-sm text-gray-400 font-normal sm:ml-2">
                          ({getEraYearRange(era)})
                        </span>
                      )}
                    </h3>
                  </div>
                  <span className="text-xs sm:text-sm text-gray-400 flex-shrink-0">
                    {totalEvents} event{totalEvents !== 1 ? 's' : ''}
                    {privateEvents > 0 && isCreator && (
                      <span className="block sm:inline sm:ml-2 text-yellow-400">
                        ({privateEvents} private)
                      </span>
                    )}
                  </span>
                </div>
              </button>              {/* Era content */}
              {isExpanded && (
                <div className="p-3 sm:p-4">
                  <div className="space-y-3">
                    {entriesByEra[era].map((entry, index) => (
                      <div key={entry.id} className={index < entriesByEra[era].length - 1 ? '' : 'pb-0'}>
                        <TimelineEntryCard
                          entry={entry}
                          isCreator={isCreator}
                          onEdit={onEdit}
                          onDelete={onDelete}
                          availableRoles={availableRoles}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
