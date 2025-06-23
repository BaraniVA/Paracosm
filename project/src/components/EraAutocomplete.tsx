import { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

interface EraAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  existingEras: string[];
  placeholder?: string;
  required?: boolean;
  className?: string;
}

export function EraAutocomplete({ 
  value, 
  onChange, 
  existingEras, 
  placeholder = "Enter era title",
  required = false,
  className = ""
}: EraAutocompleteProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [filteredEras, setFilteredEras] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Get unique eras and sort by frequency of use
  const uniqueEras = Array.from(new Set(existingEras)).filter(era => era.trim() !== '');
  const sortedEras = uniqueEras.sort((a, b) => {
    const countA = existingEras.filter(era => era === a).length;
    const countB = existingEras.filter(era => era === b).length;
    return countB - countA; // Most used first
  });

  useEffect(() => {
    if (value.trim() === '') {
      setFilteredEras(sortedEras.slice(0, 10)); // Show top 10 most used eras
    } else {
      const filtered = sortedEras.filter(era =>
        era.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredEras(filtered.slice(0, 10)); // Limit to 10 results
    }
  }, [value, sortedEras]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onChange(newValue);
    setIsOpen(true);
  };

  const handleInputFocus = () => {
    setIsOpen(true);
  };

  const handleEraSelect = (era: string) => {
    onChange(era);
    setIsOpen(false);
    inputRef.current?.blur();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsOpen(false);
      inputRef.current?.blur();
    } else if (e.key === 'ArrowDown' && !isOpen) {
      setIsOpen(true);
    }
  };

  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onKeyDown={handleKeyDown}
          className="w-full px-3 py-2 pr-8 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder={placeholder}
          required={required}
        />
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
        >
          <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {isOpen && (
        <div
          ref={dropdownRef}
          className="absolute z-50 w-full mt-1 bg-gray-700 border border-gray-600 rounded-lg shadow-lg max-h-60 overflow-y-auto"
        >
          {filteredEras.length > 0 ? (
            <>
              {filteredEras.map((era, index) => {
                const isExactMatch = era.toLowerCase() === value.toLowerCase();
                const count = existingEras.filter(e => e === era).length;
                
                return (
                  <button
                    key={index}
                    type="button"
                    onClick={() => handleEraSelect(era)}
                    className="w-full text-left px-3 py-2 hover:bg-gray-600 text-white flex items-center justify-between group transition-colors"
                  >
                    <span className={isExactMatch ? 'font-semibold text-indigo-400' : ''}>
                      {era}
                    </span>
                    <span className="text-xs text-gray-400 group-hover:text-gray-300">
                      {count} {count === 1 ? 'entry' : 'entries'}
                    </span>
                  </button>
                );
              })}
              {value.trim() !== '' && !filteredEras.some(era => era.toLowerCase() === value.toLowerCase()) && (
                <div className="px-3 py-2 border-t border-gray-600">
                  <button
                    type="button"
                    onClick={() => handleEraSelect(value)}
                    className="w-full text-left text-indigo-400 hover:text-indigo-300 transition-colors"
                  >
                    Create "{value}"
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="px-3 py-2 text-gray-400 text-sm">
              {value.trim() === '' ? 'Start typing to search eras...' : 'No matching eras found'}
              {value.trim() !== '' && (
                <button
                  type="button"
                  onClick={() => handleEraSelect(value)}
                  className="block w-full text-left text-indigo-400 hover:text-indigo-300 mt-1 transition-colors"
                >
                  Create "{value}"
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
