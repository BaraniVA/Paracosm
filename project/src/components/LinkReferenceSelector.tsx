import React, { useState, useEffect } from 'react';
import { ChevronDown, Search, ExternalLink } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface LinkOption {
  id: string;
  name: string;
  description?: string;
}

interface LinkReferenceSelectorProps {
  worldId: string;
  linkedToType: string;
  selectedId: string;
  onSelect: (id: string, name: string) => void;
}

export function LinkReferenceSelector({ worldId, linkedToType, selectedId, onSelect }: LinkReferenceSelectorProps) {
  const [options, setOptions] = useState<LinkOption[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedOption, setSelectedOption] = useState<LinkOption | null>(null);

  useEffect(() => {
    if (linkedToType) {
      fetchOptions();
    } else {
      setOptions([]);
      setSelectedOption(null);
    }
  }, [linkedToType, worldId]);

  useEffect(() => {
    if (selectedId && options.length > 0) {
      const option = options.find(opt => opt.id === selectedId);
      setSelectedOption(option || null);
    }
  }, [selectedId, options]);

  const fetchOptions = async () => {
    if (!linkedToType || !worldId) return;

    setLoading(true);
    try {
      let data: any[] = [];

      switch (linkedToType) {
        case 'law':
          const { data: worldData } = await supabase
            .from('worlds')
            .select('laws')
            .eq('id', worldId)
            .single();
          
          if (worldData?.laws) {
            data = worldData.laws.map((law: string, index: number) => ({
              id: `law-${index}`,
              name: `Law ${index + 1}`,
              description: law
            }));
          }
          break;

        case 'role':
          const { data: rolesData } = await supabase
            .from('roles')
            .select('id, name, description')
            .eq('world_id', worldId);
          
          data = (rolesData || []).map(role => ({
            id: role.id,
            name: role.name,
            description: role.description
          }));
          break;

        case 'timeline':
          const { data: timelineData } = await supabase
            .from('timeline_entries')
            .select('id, era_title, year, description')
            .eq('world_id', worldId)
            .order('year');
          
          data = (timelineData || []).map(entry => ({
            id: entry.id,
            name: `${entry.year} - ${entry.era_title}`,
            description: entry.description
          }));
          break;
      }

      setOptions(data);
    } catch (error) {
      console.error('Error fetching link options:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredOptions = options.filter(option =>
    option.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (option.description && option.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleSelect = (option: LinkOption) => {
    setSelectedOption(option);
    onSelect(option.id, option.name);
    setIsOpen(false);
    setSearchTerm('');
  };

  const handleClear = () => {
    setSelectedOption(null);
    onSelect('', '');
  };

  if (!linkedToType) {
    return (
      <div className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded-lg text-gray-400 text-sm">
        Select a link type first
      </div>
    );
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 flex items-center justify-between"
      >
        <span className="truncate">
          {selectedOption ? selectedOption.name : `Select ${linkedToType}...`}
        </span>
        <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-gray-700 border border-gray-600 rounded-lg shadow-lg z-50 max-h-64 overflow-hidden">
          {/* Search Input */}
          <div className="p-3 border-b border-gray-600">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={`Search ${linkedToType}s...`}
                className="w-full pl-10 pr-3 py-2 bg-gray-600 border border-gray-500 rounded text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
              />
            </div>
          </div>

          {/* Options List */}
          <div className="max-h-48 overflow-y-auto">
            {loading ? (
              <div className="p-3 text-center text-gray-400 text-sm">Loading...</div>
            ) : filteredOptions.length === 0 ? (
              <div className="p-3 text-center text-gray-400 text-sm">
                {searchTerm ? 'No matches found' : `No ${linkedToType}s available`}
              </div>
            ) : (
              <>
                {selectedOption && (
                  <button
                    type="button"
                    onClick={handleClear}
                    className="w-full px-3 py-2 text-left hover:bg-gray-600 transition-colors text-red-400 text-sm border-b border-gray-600"
                  >
                    Clear selection
                  </button>
                )}
                {filteredOptions.map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => handleSelect(option)}
                    className={`w-full px-3 py-2 text-left hover:bg-gray-600 transition-colors ${
                      selectedOption?.id === option.id ? 'bg-indigo-600' : ''
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2">
                          <span className="text-white text-sm font-medium truncate">
                            {option.name}
                          </span>
                          <ExternalLink className="h-3 w-3 text-gray-400 flex-shrink-0" />
                        </div>
                        {option.description && (
                          <p className="text-gray-300 text-xs mt-1 line-clamp-2">
                            {option.description.length > 80 
                              ? `${option.description.slice(0, 80)}...` 
                              : option.description
                            }
                          </p>
                        )}
                      </div>
                    </div>
                  </button>
                ))}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}